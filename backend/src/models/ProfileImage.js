const mongoose = require("mongoose");

const ProfileImageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    encryptedData: { type: Buffer, required: true },
    iv: { type: Buffer, required: true },
    authTag: { type: Buffer, required: true },
    mimeType: { type: String, required: true, enum: ["image/jpeg", "image/png", "image/webp"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProfileImage", ProfileImageSchema);
