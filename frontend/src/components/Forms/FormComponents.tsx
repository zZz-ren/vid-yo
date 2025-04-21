import { FC } from "react";
import { validatedInputProps } from "../../utils/types";

export const ValidatedInput: FC<validatedInputProps> = ({
  label,
  name,
  errors,
  register,
  rules,
  type,
}) => {
  return (
    <div className="flex flex-col my-2">
      {label && (
        <label className="dark:text-purple-200" htmlFor={name}>
          {label}
        </label>
      )}
      <input
        className="py-3 px-2 my-2 focus:outline-none border-2 border-purple-500/30 rounded-3xl"
        placeholder={"Enter " + name}
        type={type}
        {...register(name, rules)}
      />
      {errors[name] && (
        <span className="text-red-400">
          {errors[name]?.message?.toString()}
        </span>
      )}
    </div>
  );
};
export const Input = ({
  label,
  name,
  type,
  value,
  setValue,
  placeholder,
}: {
  value: any;
  setValue: any;
  label?: string;
  name: string;
  type: string;
  placeholder: string;
}) => {
  return (
    <div className="flex flex-col my-2">
      {label && (
        <label className="dark:text-purple-200" htmlFor={name}>
          {label}
        </label>
      )}
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="py-3 px-2 my-2 focus:outline-none border-2 border-purple-500/30 rounded-3xl"
        placeholder={placeholder}
        type={type}
      />
    </div>
  );
};

export const SubmitButton = ({ label }: { label: string }) => {
  return (
    <div className="mt-5 ">
      <button
        className="cursor-pointer disabled:cursor-not-allowed rounded-2xl bg-purple-600 p-3 w-full"
        type="submit"
      >
        {label}
      </button>
    </div>
  );
};

export const CustomButton = ({
  onClick,
  placeholder,
  isDisable,
  style,
}: {
  onClick: () => Promise<void>;
  placeholder: string;
  isDisable?: boolean;
  style?: string;
}) => {
  return (
    <div className="mt-5 ">
      <button
        disabled={isDisable}
        className={`cursor-pointer disabled:cursor-not-allowed ${
          style ? style : "rounded-2xl bg-purple-600 p-3 "
        }`}
        onClick={onClick}
        type="submit"
      >
        {placeholder}
      </button>
    </div>
  );
};
