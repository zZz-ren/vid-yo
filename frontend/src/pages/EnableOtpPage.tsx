import toast from "react-hot-toast";
import { customUseSelector } from "../store/store";
import {
  useCheckAuthStateMutation,
  useEnableOtpMutation,
  useVerifyOtpMutation,
} from "../utils/api";
import { useState } from "react";
import { EnableOtpResponse } from "../utils/types";
import { CustomButton, Input } from "../components/Forms/FormComponents";

const EnableOtpPage = () => {
  const { user } = customUseSelector((state) => state.auth);

  const [EnableOtp, { data }] = useEnableOtpMutation();
  const [checkAuth] = useCheckAuthStateMutation();
  const [verifyOtpFn] = useVerifyOtpMutation();
  const [qrModal, setQrModal] = useState(false);

  const handleEnableOtp = async () => {
    try {
      if (user) {
        const response = await EnableOtp({ user_id: user?.id }).unwrap();
        if (response.success) {
          toast.success("Scan the QRCode to Enable OTP ");
          setQrModal(true);
        } else {
          toast.error("Failed to generate QRcode");
        }
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleVerifyOTP = async ({ otp }: { otp: string }) => {
    try {
      if (user) {
        const response = await verifyOtpFn({ userId: user?.id, otp }).unwrap();
        if (response.success) {
          toast.success("OTP Verified Successfully ");
          setQrModal(false);
          await checkAuth().unwrap();
        } else {
          toast.error("Failed to Verify OTP");
        }
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDisable2Fa = async () => {};

  return (
    <div className="bg-[url(/bg-3.jpg)] h-screen w-screen py-10 px-6 dark:text-white dark:bg-gray-800">
      <h3 className="text-3xl top-15">
        Hello,<span className=" text-purple-500 text-4xl">{user?.name}</span>
      </h3>
      <div className="mt-8">
        <h3 className="text-xl">Mobile App Authentication,(2FA)</h3>
        Secure your account with TOTP two-factor authentication
        <span className="text-purple-400 ms-2 font-bold">{user?.email}</span>
      </div>
      {user?.otp_enabled ? (
        <CustomButton placeholder="Disable TOTP" onClick={handleDisable2Fa} />
      ) : (
        <CustomButton placeholder="Enable TOTP" onClick={handleEnableOtp} />
      )}
      {qrModal && <QRModal handleSubmit={handleVerifyOTP} response={data} />}
    </div>
  );
};

const QRModal = ({
  response,
  handleSubmit,
}: {
  response: EnableOtpResponse | undefined;
  handleSubmit: (data: { otp: string }) => Promise<void>;
}) => {
  const [otp, setOtp] = useState("");
  return (
    <div className="mt-5">
      <h3 className="text-xl">Scan the below QR code from authenticator app</h3>
      <div className="p-2 my-2 mx-4">
        Secure your account with TOTP two-factor authentication
        <img src={response?.qrCode} alt="qrCode" />
        <br />
        <label>
          OTP Auth Url
          <span className="text-purple-300 ms-2">{response?.otpAuthUrl}</span>
        </label>
        <label>
          OTP Secret
          <span className="text-purple-300 ms-2">{response?.otp_secret}</span>
        </label>
        <Input
          name="otp"
          placeholder="Enter OTP"
          setValue={setOtp}
          type="text"
          label="TOTP"
          value={otp}
        />
        <CustomButton
          placeholder="Submit OTP"
          onClick={() => handleSubmit({ otp })}
        />
      </div>
    </div>
  );
};

export default EnableOtpPage;
