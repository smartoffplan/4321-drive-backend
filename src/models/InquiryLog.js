const mongoose = require("mongoose");

const inquiryLogSchema = new mongoose.Schema(
  {
    parent_vehicle_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ParentVehicle",
      required: [true, "Parent vehicle reference is required"],
    },
    source_action: {
      type: String,
      default: "booking_form",
      trim: true,
      enum: ["whatsapp_click", "booking_form"],
    },

    // Customer information
    customer_name: { type: String, trim: true, default: null },
    customer_email: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },
    customer_phone: { type: String, trim: true, default: null },

    // Service selection
    drive_mode: {
      type: String,
      enum: ["self", "chauffeur"],
      default: "self",
    },

    // Chauffeur-specific fields (only when drive_mode === 'chauffeur')
    chauffeur_type: {
      type: String,
      enum: ["standard", "senior", "executive", null],
      default: null,
    },
    service_type: {
      type: String,
      enum: ["point-to-point", "hourly", "full-day", null],
      default: null,
    },
    language_preference: { type: String, trim: true, default: null },

    // Rental details
    pickup_location: { type: String, trim: true, default: null },
    pickup_date: { type: String, trim: true, default: null },
    pickup_time: { type: String, trim: true, default: null },
    return_date: { type: String, trim: true, default: null },
    return_time: { type: String, trim: true, default: null },
    special_instructions: { type: String, trim: true, default: null },

    // Pricing snapshot
    base_daily_price: { type: Number, default: null },
    chauffeur_fee: { type: Number, default: 0 },
    total_daily_price: { type: Number, default: null },

    // Admin fields
    status: {
      type: String,
      enum: ["new", "contacted", "confirmed", "completed", "cancelled"],
      default: "new",
    },
    admin_notes: { type: String, trim: true, default: null },

    // Legacy / analytics fields
    driver_selected: { type: Boolean, default: false },
    page_type: { type: String, trim: true, default: null },
    utm_source: { type: String, trim: true, default: null },
    utm_medium: { type: String, trim: true, default: null },
    utm_campaign: { type: String, trim: true, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

// Indexes
inquiryLogSchema.index({ parent_vehicle_id: 1, created_at: -1 });
inquiryLogSchema.index({ status: 1, created_at: -1 });
inquiryLogSchema.index({ customer_email: 1 });

// Strip __v from JSON
inquiryLogSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("InquiryLog", inquiryLogSchema);
