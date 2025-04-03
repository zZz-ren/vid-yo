import toast from "react-hot-toast";
import { customUseSelector } from "../store/store";
import {
  useCheckAuthStateMutation,
  useEnableOtpMutation,
  useVerifyOtpMutation,
} from "../utils/api";
import { useState } from "react";
import { EnableOtpResponse } from "../utils/types";

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
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div>
      Enable OTP Page
      <div>Hello, {user?.name}</div>
      <div>
        Mobile App Authentication,(2FA) <br />
        Secure your account with TOTP two-factor authentication {user?.email}
      </div>
      {user?.otp_enabled ? (
        <button onClick={() => {}}>Disable Otp</button>
      ) : (
        <button onClick={handleEnableOtp}>Enable Otp</button>
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
    <div>
      <img src={response?.qrCode} alt="qrCode" />
      <label>OTP Auth Url</label>
      <span>{response?.otpAuthUrl}</span>
      <label>OTP Secret</label>
      <span>{response?.otp_secret}</span>
      <input value={otp} onChange={(e) => setOtp(e.target.value)} />
      <button onClick={() => handleSubmit({ otp })}>Submit OTP</button>
    </div>
  );
};

export default EnableOtpPage;
