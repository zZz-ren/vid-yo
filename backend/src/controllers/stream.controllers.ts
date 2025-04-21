import { Request, Response } from "express";
import { dbWorker } from "../lib/app";

import QRcode from "qrcode";
class AuthControllers {
  streamer = async (req: Request, res: Response): Promise<void> => {
    try {
      res.status(200).json({ success: true, message: "streamer successful" });
    } catch (error: any) {
      console.error("Error in streamer:", error.message || error);
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  };
}
