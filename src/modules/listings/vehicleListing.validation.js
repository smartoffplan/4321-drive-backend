const Joi = require('joi');
const { LISTING_STATUS, SOURCE_TYPE, PRICING_UNIT } = require('../../config/constants');

const createListingSchema = {
  body: Joi.object({
    parent_vehicle_id: Joi.string().required(),
    vendor_id: Joi.string().required(),
    listing_title_override: Joi.string().trim().allow(null, ''),
    own_fleet_priority: Joi.boolean().default(false),
    pricing: Joi.object({
      vendor_base_price_per_day: Joi.number().min(0).allow(null),
      website_selling_price_per_day: Joi.number().min(0).allow(null),
      display_price_candidate_per_day: Joi.number().min(0).allow(null),
      weekly_price: Joi.number().min(0).allow(null),
      monthly_price: Joi.number().min(0).allow(null),
      future_price_fields: Joi.object({
        per_hour: Joi.number().min(0).allow(null),
        per_week: Joi.number().min(0).allow(null),
        per_month: Joi.number().min(0).allow(null),
      }),
    }),
    pricing_unit_default: Joi.string()
      .valid(...Object.values(PRICING_UNIT))
      .default(PRICING_UNIT.DAY),
    chauffeur: Joi.object({
      driver_available: Joi.boolean().default(false),
      driver_price_per_day: Joi.number().min(0).allow(null),
      driver_notes: Joi.string().allow(null, ''),
    }),
    availability_status: Joi.string()
      .valid(...Object.values(LISTING_STATUS))
      .default(LISTING_STATUS.DRAFT),
    source: Joi.object({
      source_type: Joi.string()
        .valid(...Object.values(SOURCE_TYPE))
        .default(SOURCE_TYPE.MANUAL),
      source_reference: Joi.string().allow(null, ''),
    }),
    internal_notes: Joi.string().trim().allow(null, ''),
  }),
};

const updateListingSchema = {
  params: Joi.object({ id: Joi.string().required() }),
  body: Joi.object({
    listing_title_override: Joi.string().trim().allow(null, ''),
    own_fleet_priority: Joi.boolean(),
    pricing: Joi.object({
      vendor_base_price_per_day: Joi.number().min(0).allow(null),
      website_selling_price_per_day: Joi.number().min(0).allow(null),
      display_price_candidate_per_day: Joi.number().min(0).allow(null),
      weekly_price: Joi.number().min(0).allow(null),
      monthly_price: Joi.number().min(0).allow(null),
      future_price_fields: Joi.object({
        per_hour: Joi.number().min(0).allow(null),
        per_week: Joi.number().min(0).allow(null),
        per_month: Joi.number().min(0).allow(null),
      }),
    }),
    pricing_unit_default: Joi.string().valid(...Object.values(PRICING_UNIT)),
    chauffeur: Joi.object({
      driver_available: Joi.boolean(),
      driver_price_per_day: Joi.number().min(0).allow(null),
      driver_notes: Joi.string().allow(null, ''),
    }),
    source: Joi.object({
      source_type: Joi.string().valid(...Object.values(SOURCE_TYPE)),
      source_reference: Joi.string().allow(null, ''),
    }),
    internal_notes: Joi.string().trim().allow(null, ''),
  }).min(1),
};

const updateListingStatusSchema = {
  params: Joi.object({ id: Joi.string().required() }),
  body: Joi.object({
    availability_status: Joi.string()
      .valid(...Object.values(LISTING_STATUS))
      .required(),
  }),
};

const approveRejectSchema = {
  params: Joi.object({ id: Joi.string().required() }),
  body: Joi.object({
    approval_notes: Joi.string().trim().allow(null, ''),
  }),
};

const listingsQuerySchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    parent_vehicle_id: Joi.string(),
    vendor_id: Joi.string(),
    availability_status: Joi.string().valid(...Object.values(LISTING_STATUS)),
    search: Joi.string().trim(),
  }),
};

const idParamSchema = {
  params: Joi.object({ id: Joi.string().required() }),
};

module.exports = {
  createListingSchema,
  updateListingSchema,
  updateListingStatusSchema,
  approveRejectSchema,
  listingsQuerySchema,
  idParamSchema,
};
