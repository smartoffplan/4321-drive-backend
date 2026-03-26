const mongoose = require("mongoose");
const { VENDOR_TYPE, VENDOR_STATUS } = require("../config/constants");

const vendorSchema = new mongoose.Schema(
  {
    vendor_code: {
      type: String,
      unique: true,
      trim: true,
    },
    vendor_type: {
      type: String,
      enum: Object.values(VENDOR_TYPE),
      required: [true, "Vendor type is required"],
    },
    company_name: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: 200,
    },
    garage_name: {
      type: String,
      trim: true,
      default: null,
    },
    contact_person_name: {
      type: String,
      trim: true,
      default: null,
    },
    contact_person_email: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
    },
    contact_person_phone: {
      type: String,
      trim: true,
      default: null,
    },
    whatsapp_number: {
      type: String,
      trim: true,
      default: null,
    },
    company_phone: {
      type: String,
      trim: true,
      default: null,
    },
    alternate_phone: {
      type: String,
      trim: true,
      default: null,
    },
    address_line_1: {
      type: String,
      trim: true,
      default: null,
    },
    address_line_2: {
      type: String,
      trim: true,
      default: null,
    },
    city: {
      type: String,
      trim: true,
      default: null,
    },
    country: {
      type: String,
      trim: true,
      default: "UAE",
    },
    logo_image: {
      type: String,
      default: null,
    },
    profile_image: {
      type: String,
      default: null,
    },
    trade_license_number: {
      type: String,
      trim: true,
      default: null,
    },
    tax_number: {
      type: String,
      trim: true,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(VENDOR_STATUS),
      default: VENDOR_STATUS.ACTIVE,
    },
    priority_rank: {
      type: Number,
      default: 0,
    },
    is_priority_vendor: {
      type: Boolean,
      default: false,
    },
    linked_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // Phase 2 — linked vendor login
    },
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
vendorSchema.index({ company_name: 1 });
vendorSchema.index({ status: 1 });
vendorSchema.index({ vendor_type: 1 });
vendorSchema.index({ vendor_code: 1 }, { unique: true, sparse: true });

// Auto-generate vendor code before save
vendorSchema.pre("save", async function () {
  if (!this.vendor_code) {
    const prefix = this.vendor_type === VENDOR_TYPE.OWN_FLEET ? "OWN" : "EXT";
    const count = await mongoose.model("Vendor").countDocuments();
    this.vendor_code = `${prefix}-${String(count + 1).padStart(4, "0")}`;
  }
});

// Strip __v from JSON
vendorSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("Vendor", vendorSchema);
