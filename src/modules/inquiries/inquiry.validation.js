const Joi = require("joi");

const logWhatsAppClickSchema = {
  body: Joi.object({
    parent_vehicle_id: Joi.string().required(),
    driver_selected: Joi.boolean().default(false),
    page_type: Joi.string().trim().allow(null, ""),
    utm_source: Joi.string().trim().allow(null, ""),
    utm_medium: Joi.string().trim().allow(null, ""),
    utm_campaign: Joi.string().trim().allow(null, ""),
  }),
};

// Public booking form submission — all fields from BookingModal
const submitBookingInquirySchema = {
  body: Joi.object({
    parent_vehicle_id: Joi.string().required(),

    // Customer info
    customer_name: Joi.string().trim().required(),
    customer_email: Joi.string().email().trim().lowercase().required(),
    customer_phone: Joi.string().trim().required(),

    // Service selection
    drive_mode: Joi.string().valid("self", "chauffeur").required(),

    // Chauffeur options (required when drive_mode = 'chauffeur')
    chauffeur_type: Joi.when("drive_mode", {
      is: "chauffeur",
      then: Joi.string().valid("standard", "senior", "executive").required(),
      otherwise: Joi.string().allow(null, "").optional(),
    }),
    service_type: Joi.when("drive_mode", {
      is: "chauffeur",
      then: Joi.string()
        .valid("point-to-point", "hourly", "full-day")
        .required(),
      otherwise: Joi.string().allow(null, "").optional(),
    }),
    language_preference: Joi.string().trim().allow(null, "").optional(),

    // Rental details
    pickup_location: Joi.string().trim().allow(null, "").optional(),
    pickup_date: Joi.string().trim().allow(null, "").optional(),
    pickup_time: Joi.string().trim().allow(null, "").optional(),
    return_date: Joi.string().trim().allow(null, "").optional(),
    return_time: Joi.string().trim().allow(null, "").optional(),
    special_instructions: Joi.string().trim().allow(null, "").optional(),

    // Pricing snapshot
    base_daily_price: Joi.number().min(0).optional(),
    chauffeur_fee: Joi.number().min(0).default(0),
    total_daily_price: Joi.number().min(0).optional(),

    // Analytics
    page_type: Joi.string().trim().allow(null, "").optional(),
    utm_source: Joi.string().trim().allow(null, "").optional(),
    utm_medium: Joi.string().trim().allow(null, "").optional(),
    utm_campaign: Joi.string().trim().allow(null, "").optional(),
  }),
};

const updateInquirySchema = {
  params: Joi.object({ id: Joi.string().required() }),
  body: Joi.object({
    status: Joi.string().valid(
      "new",
      "contacted",
      "confirmed",
      "completed",
      "cancelled",
    ),
    admin_notes: Joi.string().trim().allow(null, ""),
  }),
};

const inquiriesQuerySchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    parent_vehicle_id: Joi.string(),
    status: Joi.string().valid(
      "new",
      "contacted",
      "confirmed",
      "completed",
      "cancelled",
    ),
    search: Joi.string().trim(),
  }),
};

module.exports = {
  logWhatsAppClickSchema,
  submitBookingInquirySchema,
  updateInquirySchema,
  inquiriesQuerySchema,
};
