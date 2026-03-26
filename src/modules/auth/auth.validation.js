const Joi = require("joi");

const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Please provide a valid email",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters",
      "any.required": "Password is required",
    }),
  }),
};

const refreshSchema = {
  body: Joi.object({
    refresh_token: Joi.string().required().messages({
      "any.required": "Refresh token is required",
    }),
  }),
};

const registerSchema = {
  body: Joi.object({
    full_name: Joi.string().trim().max(100).required().messages({
      'any.required': 'Full name is required',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email',
      'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password is required',
    }),
    phone: Joi.string().trim().allow(null, ''),
  }),
};

module.exports = { loginSchema, refreshSchema, registerSchema };
