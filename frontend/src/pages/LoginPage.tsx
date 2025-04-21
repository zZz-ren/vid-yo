import { SubmitHandler, useForm } from "react-hook-form";
import { LoginRequest, Verify2FaRequest } from "../utils/types";
import { useLoginMutation, useValidateOtpMutation } from "../utils/api";
import { useState } from "react";
import {
  CustomButton,
  Input,
  SubmitButton,
  ValidatedInput,
} from "../components/Forms/FormComponents";

const LoginPage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<LoginRequest>();
  const [handleLogin, {}] = useLoginMutation();
  const [handleOtpValidate, {}] = useValidateOtpMutation();
  const [isOTPFormOn, setIsOTPFormOn] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [user, setuser] = useState<{ name: string; id: string }>({
    name: "",
    id: "",
  });
  const onSubmit: SubmitHandler<LoginRequest> = async (data) => {
    try {
      const response = await handleLogin(data).unwrap();
      if (response.success && response.user.otp_enabled) {
        setIsOTPFormOn(true);
        setuser({ name: response.user.name, id: response.user.id });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setServerError(error.data?.message || "Something went wrong. Try again.");
    }
  };

  const handleOtpSubmit = async (data: Verify2FaRequest) => {
    try {
      const response = await handleOtpValidate(data).unwrap();
      if (response.success && response.user.otp_enabled) {
        setuser({ name: response.user.name, id: response.user.id });
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setServerError(error.data?.message || "Something went wrong. Try again.");
    }
  };
  return (
    <div className="bg-[url(/bg-3.jpg)] h-screen w-screen grid grid-cols-12 dark:text-white dark:bg-gray-800">
      <div className="col-span-12 md:col-span-9 flex flex-col items-center justify-center">
        <div className="w-sm md:w-2/5 h-[550px] relative flex flex-col justify-center p-10 m-10 rounded-tl-4xl rounded-br-4xl bg-black/50 ">
          <h3 className="text-3xl text-purple-500 absolute top-15">
            {isOTPFormOn ? "Enter OTP" : "Login"}{" "}
          </h3>

          {!isOTPFormOn ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <ValidatedInput
                errors={errors}
                name="email"
                register={register}
                type="email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                    message: "Invalid email format",
                  },
                }}
                label="Email"
              />
              <ValidatedInput
                errors={errors}
                name="password"
                register={register}
                type="password"
                rules={{
                  required: "password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                }}
                label="Password"
              />

              <SubmitButton label="Login" />
            </form>
          ) : (
            <OTPForm
              serverError={serverError}
              handleSubmit={handleOtpSubmit}
              user={user}
            />
          )}
          {(errors.root || serverError) && (
            <span className="error-message">
              {errors.root?.message || serverError}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const OTPForm = ({
  user,
  handleSubmit,
  serverError,
}: {
  user: { name: string; id: string };
  handleSubmit: (data: Verify2FaRequest) => Promise<void>;
  serverError: string | null;
}) => {
  const [otp, setOtp] = useState("");
  return (
    <div>
      <h1>Hello,{user.name}</h1>
      {/* OTP input fields */}
      <Input
        placeholder="Enter your TOTP"
        name="Otp"
        type="text"
        value={otp}
        setValue={setOtp}
      />
      <CustomButton
        placeholder="Verify OTP"
        onClick={() => handleSubmit({ userId: user.id, otp })}
      />
      {serverError && <span className="error-message">{serverError}</span>}
    </div>
  );
};

export default LoginPage;
