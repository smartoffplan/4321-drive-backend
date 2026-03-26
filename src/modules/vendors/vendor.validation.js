const Joi = require('joi');
const { VENDOR_TYPE, VENDOR_STATUS } = require('../../config/constants');

const createVendorSchema = {
  body: Joi.object({
    vendor_type: Joi.string()
      .valid(...Object.values(VENDOR_TYPE))
      .required(),
    company_name: Joi.string().trim().max(200).required(),
    garage_name: Joi.string().trim().allow(null, ''),
    contact_person_name: Joi.string().trim().allow(null, ''),
    contact_person_email: Joi.string().email().allow(null, ''),
    contact_person_phone: Joi.string().trim().allow(null, ''),
    whatsapp_number: Joi.string().trim().allow(null, ''),
    company_phone: Joi.string().trim().allow(null, ''),
    alternate_phone: Joi.string().trim().allow(null, ''),
    address_line_1: Joi.string().trim().allow(null, ''),
    address_line_2: Joi.string().trim().allow(null, ''),
    city: Joi.string().trim().allow(null, ''),
    country: Joi.string().trim().default('UAE'),
    logo_image: Joi.string().allow(null, ''),
    profile_image: Joi.string().allow(null, ''),
    trade_license_number: Joi.string().trim().allow(null, ''),
    tax_number: Joi.string().trim().allow(null, ''),
    notes: Joi.string().trim().allow(null, ''),
    status: Joi.string()
      .valid(...Object.values(VENDOR_STATUS))
      .default(VENDOR_STATUS.ACTIVE),
    priority_rank: Joi.number().integer().min(0).default(0),
    is_priority_vendor: Joi.boolean().default(false),
  }),
};

const updateVendorSchema = {
  params: Joi.object({ id: Joi.string().required() }),
  body: Joi.object({
    vendor_type: Joi.string().valid(...Object.values(VENDOR_TYPE)),
    company_name: Joi.string().trim().max(200),
    garage_name: Joi.string().trim().allow(null, ''),
    contact_person_name: Joi.string().trim().allow(null, ''),
    contact_person_email: Joi.string().email().allow(null, ''),
    contact_person_phone: Joi.string().trim().allow(null, ''),
    whatsapp_number: Joi.string().trim().allow(null, ''),
    company_phone: Joi.string().trim().allow(null, ''),
    alternate_phone: Joi.string().trim().allow(null, ''),
    address_line_1: Joi.string().trim().allow(null, ''),
    address_line_2: Joi.string().trim().allow(null, ''),
    city: Joi.string().trim().allow(null, ''),
    country: Joi.string().trim(),
    logo_image: Joi.string().allow(null, ''),
    profile_image: Joi.string().allow(null, ''),
    trade_license_number: Joi.string().trim().allow(null, ''),
    tax_number: Joi.string().trim().allow(null, ''),
    notes: Joi.string().trim().allow(null, ''),
    status: Joi.string().valid(...Object.values(VENDOR_STATUS)),
    priority_rank: Joi.number().integer().min(0),
    is_priority_vendor: Joi.boolean(),
  }).min(1),
};

const updateVendorStatusSchema = {
  params: Joi.object({ id: Joi.string().required() }),
  body: Joi.object({
    status: Joi.string()
      .valid(...Object.values(VENDOR_STATUS))
      .required(),
  }),
};

const vendorsQuerySchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    status: Joi.string().valid(...Object.values(VENDOR_STATUS)),
    vendor_type: Joi.string().valid(...Object.values(VENDOR_TYPE)),
    search: Joi.string().trim(),
  }),
};

const idParamSchema = {
  params: Joi.object({ id: Joi.string().required() }),
};

module.exports = {
  createVendorSchema,
  updateVendorSchema,
  updateVendorStatusSchema,
  vendorsQuerySchema,
  idParamSchema,
};
