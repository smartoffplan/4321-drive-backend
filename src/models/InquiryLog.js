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
      default: "whatsapp_click",
      trim: true,
    },
    driver_selected: {
      type: Boolean,
      default: false,
    },
    page_type: {
      type: String,
      trim: true,
      default: null, // listing, detail, featured, etc.s
    },
    utm_source: {
      type: String,
      trim: true,
      default: null,
    },
    utm_medium: {
      type: String,
      trim: true,
      default: null,
    },
    utm_campaign: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  },
);

// Indexes
inquiryLogSchema.index({ parent_vehicle_id: 1, created_at: -1 });

// Strip __v from JSON
inquiryLogSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("InquiryLog", inquiryLogSchema);
