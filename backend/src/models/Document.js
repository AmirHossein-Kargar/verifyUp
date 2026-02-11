const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: { type: String, required: true, index: true }, // passport_front, selfie, ...
    fileUrl: { type: String, required: true },
    // Internal storage details (not exposed as-is to clients)
    fileName: { type: String },
    storagePath: { type: String },

    status: {
      type: String,
      enum: ["uploaded", "accepted", "resubmit"],
      default: "uploaded",
      index: true,
    },
    adminNote: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", DocumentSchema);
