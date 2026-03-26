const Joi = require('joi');
const { PARENT_VEHICLE_STATUS, PRICING_MODE } = require('../../config/constants');

const createParentVehicleSchema = {
  body: Joi.object({
    display_name: Joi.string().trim().max(200).required(),
    brand: Joi.string().trim().required(),
    model: Joi.string().trim().required(),
    variant: Joi.string().trim().allow(null, ''),
    model_year: Joi.number().integer().min(1900).max(2100).allow(null),
    category: Joi.string().trim().allow(null, ''),
    tags: Joi.array().items(Joi.string().trim()).default([]),
    location_default: Joi.string().trim().allow(null, ''),
    main_image: Joi.string().allow(null, ''),
    gallery_images: Joi.array().items(Joi.string()).default([]),
    thumbnail: Joi.string().allow(null, ''),
    description: Joi.string().trim().allow(null, ''),
    long_description: Joi.string().trim().allow(null, ''),
    features: Joi.array().items(Joi.string().trim()).default([]),
    highlights: Joi.array().items(Joi.string().trim()).default([]),
    why_choose: Joi.array().items(Joi.string().trim()).default([]),
    specs: Joi.object({
      passengers: Joi.number().allow(null),
      luggage: Joi.number().allow(null),
      transmission: Joi.string().allow(null, ''),
      doors: Joi.number().allow(null),
      engine: Joi.string().allow(null, ''),
      fuel_type: Joi.string().allow(null, ''),
      horsepower: Joi.string().allow(null, ''),
      acceleration: Joi.string().allow(null, ''),
      top_speed: Joi.string().allow(null, ''),
      drive_type: Joi.string().allow(null, ''),
      seats: Joi.number().allow(null),
    }),
    has_chauffeur: Joi.boolean().default(false),
    chauffeur_price_per_day: Joi.number().min(0).allow(null),
    chauffeur_note: Joi.string().trim().allow(null, ''),
    available_vendors: Joi.array().items(Joi.string().trim()).default([]),
    display_settings: Joi.object({
      is_featured: Joi.boolean().default(false),
      sort_priority: Joi.number().integer().default(0),
      show_on_frontend: Joi.boolean().default(true),
    }),
    public_status: Joi.string()
      .valid(...Object.values(PARENT_VEHICLE_STATUS))
      .default(PARENT_VEHICLE_STATUS.DRAFT),
    seo: Joi.object({
      meta_title: Joi.string().allow(null, ''),
      meta_description: Joi.string().allow(null, ''),
      canonical_url: Joi.string().allow(null, ''),
    }),
  }),
};

const updateParentVehicleSchema = {
  params: Joi.object({ id: Joi.string().required() }),
  body: Joi.object({
    display_name: Joi.string().trim().max(200),
    brand: Joi.string().trim(),
    model: Joi.string().trim(),
    variant: Joi.string().trim().allow(null, ''),
    model_year: Joi.number().integer().min(1900).max(2100).allow(null),
    category: Joi.string().trim().allow(null, ''),
    tags: Joi.array().items(Joi.string().trim()),
    location_default: Joi.string().trim().allow(null, ''),
    main_image: Joi.string().allow(null, ''),
    gallery_images: Joi.array().items(Joi.string()),
    thumbnail: Joi.string().allow(null, ''),
    description: Joi.string().trim().allow(null, ''),
    long_description: Joi.string().trim().allow(null, ''),
    features: Joi.array().items(Joi.string().trim()),
    highlights: Joi.array().items(Joi.string().trim()),
    why_choose: Joi.array().items(Joi.string().trim()),
    specs: Joi.object({
      passengers: Joi.number().allow(null),
      luggage: Joi.number().allow(null),
      transmission: Joi.string().allow(null, ''),
      doors: Joi.number().allow(null),
      engine: Joi.string().allow(null, ''),
      fuel_type: Joi.string().allow(null, ''),
      horsepower: Joi.string().allow(null, ''),
      acceleration: Joi.string().allow(null, ''),
      top_speed: Joi.string().allow(null, ''),
      drive_type: Joi.string().allow(null, ''),
      seats: Joi.number().allow(null),
    }),
    has_chauffeur: Joi.boolean(),
    chauffeur_price_per_day: Joi.number().min(0).allow(null),
    chauffeur_note: Joi.string().trim().allow(null, ''),
    available_vendors: Joi.array().items(Joi.string().trim()),
    display_settings: Joi.object({
      is_featured: Joi.boolean(),
      sort_priority: Joi.number().integer(),
      show_on_frontend: Joi.boolean(),
    }),
    public_status: Joi.string().valid(...Object.values(PARENT_VEHICLE_STATUS)),
    seo: Joi.object({
      meta_title: Joi.string().allow(null, ''),
      meta_description: Joi.string().allow(null, ''),
      canonical_url: Joi.string().allow(null, ''),
    }),
  }).min(1),
};

const updateStatusSchema = {
  params: Joi.object({ id: Joi.string().required() }),
  body: Joi.object({
    public_status: Joi.string()
      .valid(...Object.values(PARENT_VEHICLE_STATUS))
      .required(),
  }),
};

const updateDisplayPriceSchema = {
  params: Joi.object({ id: Joi.string().required() }),
  body: Joi.object({
    display_price_mode: Joi.string()
      .valid(...Object.values(PRICING_MODE))
      .required(),
    display_price_override: Joi.number().min(0).allow(null),
    weekly_price_public: Joi.number().min(0).allow(null),
    monthly_price_public: Joi.number().min(0).allow(null),
  }),
};

const vehiclesQuerySchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    public_status: Joi.string().valid(...Object.values(PARENT_VEHICLE_STATUS)),
    brand: Joi.string().trim().allow('', null),
    category: Joi.string().trim().allow('', null),
    is_featured: Joi.boolean(),
    search: Joi.string().trim().allow('', null),
    sort_by: Joi.string().valid('created_at', 'display_name', 'sort_priority', 'public_starting_price').default('created_at'),
    sort_order: Joi.string().valid('asc', 'desc').default('desc'),
  }),
};

const idParamSchema = {
  params: Joi.object({ id: Joi.string().required() }),
};

module.exports = {
  createParentVehicleSchema,
  updateParentVehicleSchema,
  updateStatusSchema,
  updateDisplayPriceSchema,
  vehiclesQuerySchema,
  idParamSchema,
};
