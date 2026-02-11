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
    },
    phone: { type: String, trim: true, unique: true, sparse: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    // Session / security fields
    // Simple token version to support refresh token rotation & revocation
    tokenVersion: { type: Number, default: 0 },

    // MFA fields will be used for admin accounts
    mfaEnabled: { type: Boolean, default: false },
    mfaSecret: { type: String, default: null },
    mfaBackupCodes: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
