import { SubmitHandler, useForm } from "react-hook-form";
import { RegisterRequest } from "../utils/types";
import { useRegisterMutation } from "../utils/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  SubmitButton,
  ValidatedInput,
} from "../components/Forms/FormComponents";

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
    <div className="bg-[url(/bg-3.jpg)] h-screen w-screen grid grid-cols-12 dark:text-white dark:bg-gray-800">
      <div className="col-span-12 md:col-span-9 flex flex-col items-center justify-center">
        <div className="w-sm md:w-2/5 h-[550px] relative flex flex-col justify-center p-10 m-10 rounded-tl-4xl rounded-br-4xl bg-black/50 ">
          <h3 className="text-3xl text-purple-500 absolute top-15">
            Register Form
          </h3>

          <form onSubmit={handleSubmit(onSubmit)}>
            <ValidatedInput
              errors={errors}
              name="name"
              label="Name"
              register={register}
              rules={{ required: "Name is Required" }}
              type="text"
            />
            <ValidatedInput
              register={register}
              type="email"
              errors={errors}
              name="email"
              label="Email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  message: "Invalid email format",
                },
              }}
            />
            <ValidatedInput
              rules={{
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: `Password must be at least 8 letters`,
                },
              }}
              type="password"
              label="Password"
              errors={errors}
              name="password"
              register={register}
            />
            <SubmitButton label="Register now" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
