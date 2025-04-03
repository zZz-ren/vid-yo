import Joi from "joi";

export const loginBody = Joi.object({
  otp: Joi.string().length(6),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
export const registerBody = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(30).required(),
});
