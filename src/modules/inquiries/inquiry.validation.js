const Joi = require('joi');

const logWhatsAppClickSchema = {
  body: Joi.object({
    parent_vehicle_id: Joi.string().required(),
    driver_selected: Joi.boolean().default(false),
    page_type: Joi.string().trim().allow(null, ''),
    utm_source: Joi.string().trim().allow(null, ''),
    utm_medium: Joi.string().trim().allow(null, ''),
    utm_campaign: Joi.string().trim().allow(null, ''),
  }),
};

const inquiriesQuerySchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    parent_vehicle_id: Joi.string(),
  }),
};

module.exports = { logWhatsAppClickSchema, inquiriesQuerySchema };
