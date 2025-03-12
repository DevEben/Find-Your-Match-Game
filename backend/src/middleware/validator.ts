import Joi, { ObjectSchema, ValidationResult } from "@hapi/joi";
import mongoose from "mongoose";

interface UserData {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface ResetPasswordData {
  email?: string;
  password: string;
  confirmPassword: string;
}


const validateU = (data: UserData): ValidationResult => {
  const userValidationSchema: ObjectSchema<UserData> = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string()
      .min(6)
      .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{}|;:',.<>?/])/))
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base":
          "Password must contain lowercase, uppercase, numbers, and special characters",
        "any.required": "Password field can't be left empty",
      }),
    confirmPassword: Joi.string()
      .min(6)
      .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{}|;:',.<>?/])/))
      .messages({
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base":
          "Password must contain lowercase, uppercase, numbers, and special characters",
        "any.required": "Confirm Password field can't be left empty",
      }),
  });

  return userValidationSchema.validate(data, { abortEarly: false });
};

const validateUser = (data: UserData): ValidationResult => {
  const userValidationSchema: ObjectSchema<UserData> = Joi.object({
    firstName: Joi.string().min(3).pattern(/^[A-Za-z]+$/).messages({
    "string.min": "First Name must be at least 3 characters long",
    "string.pattern.base": "First Name must contain only letters",
  }),
    lastName: Joi.string().min(3).pattern(/^[A-Za-z]+$/).messages({
      "string.min": "lastName must be at least 3 characters long",
      "string.pattern.base": "Last Name must contain only letters",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
    phoneNumber: Joi.string()
      .allow(null, ""),
    temporaryUserId: Joi.string().min(3).optional(),
    password: Joi.string()
      .min(6)
      .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{}|;:',.<>?/])/))
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters long",
        "string.max": "Password must not exceed 20 characters",
        "string.pattern.base":
          "Password must contain lowercase, uppercase, numbers, and special characters",
        "any.required": "Password field can't be left empty",
      }),
      confirmPassword: Joi.string()
      .min(6)
      .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{}|;:',.<>?/])/))
      .messages({
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base":
          "Password must contain lowercase, uppercase, numbers, and special characters",
        "any.required": "Confirm Password field can't be left empty",
      }),
  });

  return userValidationSchema.validate(data, { abortEarly: false });
};

const validateEmail = (data: { email: string }): ValidationResult => {
  const validateSchema: ObjectSchema<{ email: string }> = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
  });

  return validateSchema.validate(data, { abortEarly: false });
};

const validateResetPassword = (data: ResetPasswordData): ValidationResult => {
  const validateSchema: ObjectSchema<ResetPasswordData> = Joi.object({
    email: Joi.string().email().messages({
      "string.email": "Please provide a valid email address",
    }),
    password: Joi.string()
      .min(8)
      .max(20)
      .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{}|;:',.<>?/])/))
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters long",
        "string.max": "Password must not exceed 20 characters",
        "string.pattern.base":
          "Password must contain lowercase, uppercase, numbers, and special characters",
        "any.required": "Password field can't be left empty",
      }),
    confirmPassword: Joi.string()
      .min(8)
      .max(20)
      .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{}|;:',.<>?/])/))
      .required()
      .messages({
        "string.min": "Confirm Password must be at least 8 characters long",
        "string.max": "Confirm Password must not exceed 20 characters",
        "string.pattern.base":
          "Confirm Password must contain lowercase, uppercase, numbers, and special characters",
        "any.required": "Confirm Password field can't be left empty",
      }),
  }).custom((data, helpers) => {
    if (data.password !== data.confirmPassword) {
      return helpers.message({
        custom: "Password and Confirm Password must match",
      });
    }
    return data;
  });

  return validateSchema.validate(data, { abortEarly: false });
};

const validateUpdatedUser = (data: UserData): ValidationResult => {
  const userValidationSchema: ObjectSchema<UserData> = Joi.object({
    firstName: Joi.string().min(3).pattern(/^[A-Za-z]+$/).messages({
      "string.min": "First name must be at least 3 characters long",
      "any.required": "First name is required",
      "string.pattern.base": "First Name must contain only letters",
    }),
    lastName: Joi.string().min(3).pattern(/^[A-Za-z]+$/).messages({
      "string.min": "Last name must be at least 3 characters long",
      "any.required": "Last name is required",
      "string.pattern.base": "Last Name must contain only letters",
    }),
    email: Joi.string().email().messages({
      "string.email": "Please provide a valid email address",
      "any.required": "Email is required",
    }),
    phoneNumber: Joi.string()
      .pattern(/^(?:0|\+?234)(7[0-9]|8[0-9]|9[0-9])[0-9]{7,8}$/)
      .allow(null, "")
      .messages({
        "string.pattern.base":
          "Phone number must be a valid Nigerian phone number",
      }),
    status: Joi.string().optional(),
    password: Joi.string().min(6).optional().messages({
      "string.min": "Password must be at least 6 characters long",
    }),
  });

  return userValidationSchema.validate(data, { abortEarly: false });
};



export {
  validateUser,
  validateU,
  validateEmail,
  validateResetPassword,
  validateUpdatedUser,
};
