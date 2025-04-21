import { Request, Response } from "express";
import { loginBody, registerBody } from "../lib/joiObjects";
import { dbWorker } from "../lib/app";
import bcrypt from "bcrypt";
import * as OTPauth from "otpauth";
import QRcode from "qrcode";
class AuthControllers {
  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { error } = await loginBody.validateAsync(req.body);
      if (error) throw new Error(error);

      const data = req.body;
      const user = await dbWorker.user.findUnique({
        where: { email: data.email },
      });
      if (!user) throw new Error("user doesn't exists");
      const passCompare = await bcrypt.compare(data.password, user.password);

      if (!user.otp_enabled) {
        req.session.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          isAuthenticated: true,
          otp_enabled: user.otp_enabled,
          otp_verified: user.otp_verified,
        };
      }
      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          otp_enabled: user.otp_enabled,
          otp_verified: user.otp_verified,
        },
        message: "login successful",
      });
    } catch (error: any) {
      console.error("Error in login:", error.message || error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };
  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      req.session.user = undefined;
      res.status(200).json({
        success: true,
        message: "logout successful",
      });
    } catch (error: any) {
      console.error("Error in login:", error.message || error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const x = await registerBody.validateAsync(req.body);
      const data = req.body as {
        name: string;
        password: string;
        email: string;
      };
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = await dbWorker.user.create({
        data: {
          email: data.email,
          name: data.name,
          password: hashedPassword,
          otp_enabled: false,
          otp_verified: false,
        },
      });
      res.status(200).json({ success: true, message: "register successful" });
    } catch (error: any) {
      console.error("Error in register:", error.message || error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  validate2Fa = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, otp } = req.body;
      const user = await dbWorker.user.findUnique({ where: { id: userId } });

      if (!user || !user.otp_secret)
        throw new Error("No user exists or TOTP not Enabled");

      let totp = new OTPauth.TOTP({
        issuer: "Netnexus.com",
        label: user.name,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: user.otp_secret,
      });

      let delta = totp.validate({ token: otp });

      if (delta === null) throw new Error("Invalid OTP");

      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        isAuthenticated: true,
        otp_enabled: user.otp_enabled,
        otp_verified: user.otp_verified,
      };
      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          otp_enabled: user.otp_enabled,
          otp_verified: user.otp_verified,
        },
        message: "verify2Fa successful",
      });
    } catch (error: any) {
      console.error("Error in verify2Fa:", error.message || error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };
  verify2Fa = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, otp } = req.body;
      const user = await dbWorker.user.findUnique({ where: { id: userId } });

      if (!user || !user.otp_secret) throw new Error("No user exists");

      let totp = new OTPauth.TOTP({
        issuer: "Netnexus.com",
        label: user.name,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: user.otp_secret,
      });

      let delta = totp.validate({ token: otp });

      if (delta === null) throw new Error("Invalid OTP");

      const updatedUser = await dbWorker.user.update({
        where: { id: userId },
        data: {
          otp_enabled: true,
          otp_verified: true,
        },
      });
      req.session.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        isAuthenticated: true,
        otp_enabled: updatedUser.otp_enabled,
        otp_verified: updatedUser.otp_verified,
      };
      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          otp_enabled: user.otp_enabled,
          otp_verified: user.otp_verified,
        },
        message: "verify 2Fa successful",
      });
    } catch (error: any) {
      console.error("Error in verify2Fa:", error.message || error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  reset2Fa = async (req: Request, res: Response): Promise<void> => {
    try {
      //generate otp does the same work

      res.status(200).json({ success: true, message: "reset2Fa successful" });
    } catch (error: any) {
      console.error("Error in reset2Fa:", error.message || error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  enable2Fa = async (req: Request, res: Response): Promise<void> => {
    try {
      const { user_id } = req.body;

      const user = await dbWorker.user.findUnique({ where: { id: user_id } });

      if (!user) throw new Error("No user exists");

      const secret = new OTPauth.Secret({ size: 32 });

      let totp = new OTPauth.TOTP({
        issuer: "Netnexus.com",
        label: user.name,
        algorithm: "SHA1",
        digits: 6,
        period: 30,
        secret: secret.base32,
      });

      let token = totp.generate();
      let otpAuthUrl = totp.toString();
      let qrCode = await QRcode.toDataURL(otpAuthUrl);

      await dbWorker.user.update({
        where: { id: user.id },
        data: {
          otp_secret: secret.base32,
          otp_enabled: false,
          otp_verified: false,
        },
      });

      res.status(200).json({
        success: true,
        otp_secret: secret.base32,
        token,
        otpAuthUrl,
        qrCode,
        message: "enable2Fa successful",
      });
    } catch (error: any) {
      console.error("Error in enable2Fa:", error.message || error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };

  checkStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      res.status(200).json({
        success: true,
        user: req.session.user,
        message: "checkStatus successful",
      });
    } catch (error: any) {
      console.error("Error in checkStatus:", error.message || error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };
}

export default new AuthControllers();
