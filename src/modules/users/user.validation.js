const Joi = require("joi");
const { ROLES, USER_STATUS } = require("../../config/constants");

const createAdminSchema = {
  body: Joi.object({
    full_name: Joi.string().trim().max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().trim().allow(null, ""),
    password: Joi.string().min(6).required(),
    status: Joi.string()
      .valid(...Object.values(USER_STATUS))
      .default(USER_STATUS.ACTIVE),
  }),
};

const updateAdminSchema = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
  body: Joi.object({
    full_name: Joi.string().trim().max(100),
    email: Joi.string().email(),
    phone: Joi.string().trim().allow(null, ""),
    password: Joi.string().min(6),
    status: Joi.string().valid(...Object.values(USER_STATUS)),
  }).min(1),
};

const getUsersQuerySchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    status: Joi.string().valid(...Object.values(USER_STATUS)),
    role: Joi.string().valid(...Object.values(ROLES)),
    search: Joi.string().trim(),
  }),
};

const idParamSchema = {
  params: Joi.object({
    id: Joi.string().required(),
  }),
};

module.exports = {
  createAdminSchema,
  updateAdminSchema,
  getUsersQuerySchema,
  idParamSchema,
};
