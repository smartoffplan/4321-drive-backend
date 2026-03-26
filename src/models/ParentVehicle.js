const mongoose = require("mongoose");
const { PARENT_VEHICLE_STATUS, PRICING_MODE } = require("../config/constants");

const parentVehicleSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      required: [true, "Slug is required"],
      lowercase: true,
      trim: true,
    },
    display_name: {
      type: String,
      required: [true, "Display name is required"],
      trim: true,
      maxlength: 200,
    },
    brand: {
      type: String,
      required: [true, "Brand is required"],
      trim: true,
    },
    model: {
      type: String,
      required: [true, "Model is required"],
      trim: true,
    },
    variant: {
      type: String,
      trim: true,
      default: null,
    },
    model_year: {
      type: Number,
      default: null,
    },
    category: {
      type: String,
      trim: true,
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    location_default: {
      type: String,
      trim: true,
      default: null,
    },

    // Images
    main_image: {
      type: String,
      default: null,
    },
    gallery_images: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: String,
      default: null,
    },

    // Descriptions
    description: {
      type: String,
      trim: true,
      default: null,
    },
    long_description: {
      type: String,
      trim: true,
      default: null,
    },
    features: {
      type: [String],
      default: [],
    },
    highlights: {
      type: [String],
      default: [],
    },
    why_choose: {
      type: [String],
      default: [],
    },

    // Specs
    specs: {
      passengers: { type: Number, default: null },
      luggage: { type: Number, default: null },
      transmission: { type: String, default: null },
      doors: { type: Number, default: null },
      engine: { type: String, default: null },
      fuel_type: { type: String, default: null },
      horsepower: { type: String, default: null },
      acceleration: { type: String, default: null },
      top_speed: { type: String, default: null },
      drive_type: { type: String, default: null },
      seats: { type: Number, default: null },
    },

    // Chauffeur (Optional at Parent level as default)
    has_chauffeur: { type: Boolean, default: false },
    chauffeur_price_per_day: { type: Number, default: null },
    chauffeur_note: { type: String, default: null },

    // Vendors (Placeholder for now)
    available_vendors: { type: [String], default: [] },

    // Pricing Summary
    pricing_summary: {
      display_price_mode: {
        type: String,
        enum: Object.values(PRICING_MODE),
        default: PRICING_MODE.AUTO_MIN_CHILD_PRICE,
      },
      display_price_override: { type: Number, default: null },
      calculated_min_daily_price: { type: Number, default: null },
      public_starting_price: { type: Number, default: null },
      weekly_price_public: { type: Number, default: null },
      monthly_price_public: { type: Number, default: null },
      price_source_child_listing_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "VehicleListing",
        default: null,
      },
    },

    // Display Settings
    display_settings: {
      is_featured: { type: Boolean, default: false },
      sort_priority: { type: Number, default: 0 },
      show_on_frontend: { type: Boolean, default: true },
    },

    // Status
    public_status: {
      type: String,
      enum: Object.values(PARENT_VEHICLE_STATUS),
      default: PARENT_VEHICLE_STATUS.DRAFT,
    },

    // SEO
    seo: {
      meta_title: { type: String, default: null },
      meta_description: { type: String, default: null },
      canonical_url: { type: String, default: null },
    },

    // Audit
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

// Indexes
parentVehicleSchema.index({ brand: 1, model: 1, category: 1 });
parentVehicleSchema.index({ public_status: 1 });
parentVehicleSchema.index({ "display_settings.is_featured": 1 });
parentVehicleSchema.index({ "display_settings.sort_priority": -1 });

// Strip __v from JSON
parentVehicleSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("ParentVehicle", parentVehicleSchema);
