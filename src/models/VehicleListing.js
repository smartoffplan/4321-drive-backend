const mongoose = require('mongoose');
const { LISTING_STATUS, APPROVAL_STATUS, SOURCE_TYPE, PRICING_UNIT } = require('../config/constants');

const vehicleListingSchema = new mongoose.Schema(
  {
    parent_vehicle_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ParentVehicle',
      required: [true, 'Parent vehicle reference is required'],
    },
    vendor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vendor',
      required: [true, 'Vendor reference is required'],
    },
    vendor_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null, // Phase 2-ready
    },
    listing_title_override: {
      type: String,
      trim: true,
      default: null,
    },
    own_fleet_priority: {
      type: Boolean,
      default: false,
    },

    // Pricing
    pricing: {
      vendor_base_price_per_day: { type: Number, default: null },
      website_selling_price_per_day: { type: Number, default: null },
      weekly_price: { type: Number, default: null },
      monthly_price: { type: Number, default: null },
      future_price_fields: {
        per_hour: { type: Number, default: null },
        per_week: { type: Number, default: null },
        per_month: { type: Number, default: null },
      },
    },

    pricing_unit_default: {
      type: String,
      enum: Object.values(PRICING_UNIT),
      default: PRICING_UNIT.DAY,
    },

    // Chauffeur
    chauffeur: {
      driver_available: { type: Boolean, default: false },
      driver_price_per_day: { type: Number, default: null },
      driver_notes: { type: String, default: null },
    },

    // Status
    availability_status: {
      type: String,
      enum: Object.values(LISTING_STATUS),
      default: LISTING_STATUS.DRAFT,
    },

    // Verification / Approval
    verification: {
      is_verified: { type: Boolean, default: false },
      verified_by_user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
      verified_at: { type: Date, default: null },
      approval_status: {
        type: String,
        enum: Object.values(APPROVAL_STATUS),
        default: APPROVAL_STATUS.PENDING,
      },
      approval_notes: { type: String, default: null },
    },

    // Source
    source: {
      source_type: {
        type: String,
        enum: Object.values(SOURCE_TYPE),
        default: SOURCE_TYPE.MANUAL,
      },
      source_reference: { type: String, default: null },
    },

    internal_notes: {
      type: String,
      trim: true,
      default: null,
    },

    // Audit
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Indexes
vehicleListingSchema.index({ parent_vehicle_id: 1 });
vehicleListingSchema.index({ vendor_id: 1 });
vehicleListingSchema.index({ availability_status: 1 });
vehicleListingSchema.index({ parent_vehicle_id: 1, vendor_id: 1, deleted_at: 1 });

// Strip __v from JSON
vehicleListingSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('VehicleListing', vehicleListingSchema);
