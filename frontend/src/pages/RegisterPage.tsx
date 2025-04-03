import { SubmitHandler, useForm } from "react-hook-form";
import { RegisterRequest } from "../utils/types";
import { useRegisterMutation } from "../utils/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RegisterRequest>();
  const [registerFn] = useRegisterMutation();
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<RegisterRequest> = async (data) => {
    try {
      console.log("qwerty");
      
      const response = await registerFn(data).unwrap();
      if (response.success) {
        toast.success("Registration successful");
        navigate("/login");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    }
  };
  return (
    <div>
      Register Form
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("name", { required: "Name is Required" })}
          type="text"
          placeholder="Username"
        />
        {errors.name && <span>{errors.name.message}</span>}
        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
              message: "Invalid email format",
            },
          })}
          type="email"
          placeholder="Email"
        />
        {errors.email && <span>{errors.email.message}</span>}
        <input
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: `Password must be at least 8 letters`,
            },
          })}
          type="password"
          placeholder="Password"
        />
        {errors.password && <span>{errors.password.message}</span>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
