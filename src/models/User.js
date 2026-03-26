const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { ROLES, USER_STATUS } = require("../config/constants");

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      required: [true, "Role is required"],
    },
    password_hash: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.ACTIVE,
    },
    last_login_at: {
      type: Date,
      default: null,
    },
    refresh_token: {
      type: String,
      default: null,
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

// Index
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1, status: 1 });

// Hash password before save
userSchema.pre("save", async function () {
  if (!this.isModified("password_hash")) return;
  const salt = await bcrypt.genSalt(12);
  this.password_hash = await bcrypt.hash(this.password_hash, salt);
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password_hash);
};

// Strip sensitive fields from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password_hash;
  delete obj.refresh_token;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("User", userSchema);
