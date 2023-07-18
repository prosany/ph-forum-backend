import Joi from "joi";

export const signupValidation = Joi.object({
  name: Joi.string().min(4).max(50).required().messages({
    "string.empty": "Name can't be empty",
    "string.min": "Name should be atleast 4 characters",
    "string.max": "Name should be atmost 50 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string()
    .regex(/^[\w.+\-]+@gmail\.com$/)
    .lowercase()
    .required()
    .messages({
      "string.empty": "Email can't be empty",
      "string.pattern.base": "Only Gmail is allowed for email address",
      "any.required": "Email address is required",
    }),
  password: Joi.string()
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .required()
    .messages({
      "string.empty": "Password can't be empty",
      "string.pattern.base":
        "Password should be at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character",
      "any.required": "Password is required",
    }),
  confirm_password: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Password and confirm password should be same",
  }),
  phone: Joi.string().required().messages({
    "string.empty": "Phone number can't be empty",
    "any.required": "Phone number is required",
  }),
  role: Joi.string()
    .valid("student", "moderator", "admin", "superadmin")
    .messages({
      "string.empty": "Role can't be empty",
      "any.required": "Role is required",
      "valid.only": "Role should be one of student, moderator, admin",
    }),
  batch: Joi.string().required().messages({
    "string.empty": "Batch can't be empty",
    "any.required": "Batch is required",
  }),
});

export const signinValidation = Joi.object({
  email: Joi.string()
    .regex(/^[\w.+\-]+@gmail\.com$/)
    .lowercase()
    .required()
    .messages({
      "string.empty": "Email can't be empty",
      "string.pattern.base": "Only Gmail is allowed for email address",
      "any.required": "Email address is required",
    }),
  password: Joi.string()
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
    .required()
    .messages({
      "string.empty": "Password can't be empty",
      "string.pattern.base":
        "Password should be at least 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character",
      "any.required": "Password is required",
    }),
});
