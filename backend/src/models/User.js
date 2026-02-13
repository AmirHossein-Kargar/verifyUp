const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
      index: true,
    },

    phone: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      index: true,
    },

    passwordHash: { type: String, required: true, select: false },

    role: { type: String, enum: ["user", "admin"], default: "user" },

    // Email verification
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, default: null, select: false },
    emailVerificationExpires: { type: Date, default: null, select: false },

    // Phone verification (OTP)
    phoneVerified: { type: Boolean, default: false },
    phoneOtp: { type: String, default: null, select: false },
    phoneOtpExpires: { type: Date, default: null, select: false },

    // Account control
    suspended: { type: Boolean, default: false, index: true },

    // Token/session control
    tokenVersion: { type: Number, default: 0, select: false },
    passwordChangedAt: { type: Date, default: null, select: false },

    // Optional telemetry
    lastLoginAt: { type: Date, default: null, select: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
