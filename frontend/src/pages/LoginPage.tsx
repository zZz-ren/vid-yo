import { SubmitHandler, useForm } from "react-hook-form";
import { LoginRequest, Verify2FaRequest } from "../utils/types";
import { useLoginMutation, useValidateOtpMutation } from "../utils/api";
import { useState } from "react";

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
    <div>
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
              message: "Invalid email format",
            },
          })}
        />
        {errors.email && (
          <span className="error-message">{errors.email.message}</span>
        )}
        <input
          {...register("password", {
            required: "password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
        />
        {errors.password && (
          <span className="error-message">{errors.password.message}</span>
        )}
        <button type="submit">Login</button>
      </form>
      {(errors.root || serverError) && (
        <span className="error-message">
          {errors.root?.message || serverError}
        </span>
      )}
      {isOTPFormOn && (
        <OTPForm
          serverError={serverError}
          handleSubmit={handleOtpSubmit}
          user={user}
        />
      )}
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
      <h1>OTP Form for {user.name}</h1>
      {/* OTP input fields */}
      <input value={otp} onChange={(e) => setOtp(e.target.value)} />
      <button onClick={() => handleSubmit({ userId: user.id, otp })}>
        Submit OTP
      </button>
      {serverError && (
        <span className="error-message">
          { serverError}
        </span>
      )}
    </div>
  );
};

export default LoginPage;
