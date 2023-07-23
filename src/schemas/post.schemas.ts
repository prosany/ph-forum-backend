import Joi from "joi";

export const createPostValidation = Joi.object({
  body: Joi.string().min(10).required().messages({
    "string.empty": "Post body can't be empty",
    "string.min": "Post body should be atleast 10 characters long.",
    "any.required": "Post body is required",
  }),
  category: Joi.string().required().messages({
    "string.empty": "Category can't be empty",
    "any.required": "Category is required",
  }),
  status: Joi.string().required().messages({
    "string.empty": "Status can't be empty",
    "any.required": "Status is required",
  }),
});
