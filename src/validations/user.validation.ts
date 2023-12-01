import Joi from "joi";
import { usernameValidator } from "./custom.validation";

export const registerUser = {
  body: Joi.object().keys({ username: Joi.string().custom(usernameValidator).required() }),
};
