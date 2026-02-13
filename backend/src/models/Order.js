const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    service: { type: String, required: true, trim: true, index: true },

    status: {
      type: String,
      enum: ["pending_docs", "in_review", "needs_resubmit", "approved", "rejected", "completed"],
      default: "pending_docs",
      index: true,
    },

    // 🔒 prevent negative / accidental edits
    priceToman: { type: Number, required: true, min: 0, immutable: true },

    currency: { type: String, default: "IRR_TOMAN", trim: true },

    // بهتر: allowlist در validation
    requiredDocs: { type: [String], default: [], maxlength: 50 },

    docsSummary: {
      uploaded: { type: Number, default: 0, min: 0 },
      accepted: { type: Number, default: 0, min: 0 },
      resubmit: { type: Number, default: 0, min: 0 },
    },

    adminNote: { type: String, default: "", trim: true, maxlength: 2000 },

    // اختیاری ولی خیلی مفید:
    // orderNumber: { type: String, unique: true, index: true },
  },
  { timestamps: true }
);

// ✅ useful compound indexes for admin listing & user history
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Order", OrderSchema);
