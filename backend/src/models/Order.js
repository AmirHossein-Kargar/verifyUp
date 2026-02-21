const mongoose = require("mongoose");

// Step order for tracking UI: only 4 steps (in_progress & delivered removed)
const TRACKING_STATUSES = ["placed", "confirmed", "processing", "completed"];
const LEGACY_STATUSES = ["pending_docs", "in_review", "needs_resubmit", "approved", "rejected", "in_progress", "delivered"];
const ALL_STATUSES = [...new Set([...TRACKING_STATUSES, ...LEGACY_STATUSES])];

const statusHistoryEntrySchema = new mongoose.Schema(
  {
    status: { type: String, required: true, trim: true },
    timestamp: { type: Date, default: () => new Date() },
  },
  { _id: false }
);

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
      enum: ALL_STATUSES,
      default: "placed",
      index: true,
    },

    // Step-by-step status history for tracking (each step + timestamp)
    statusHistory: {
      type: [statusHistoryEntrySchema],
      default: function () {
        return [{ status: "placed", timestamp: new Date() }];
      },
    },

    // 🔒 prevent negative / accidental edits
    priceToman: { type: Number, required: true, min: 0, immutable: true },

    currency: { type: String, default: "IRR_TOMAN", trim: true },

    requiredDocs: { type: [String], default: [], maxlength: 50 },

    docsSummary: {
      uploaded: { type: Number, default: 0, min: 0 },
      accepted: { type: Number, default: 0, min: 0 },
      resubmit: { type: Number, default: 0, min: 0 },
    },

    adminNote: { type: String, default: "", trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

// For backward compatibility: map legacy status to tracking step (4 steps only)
OrderSchema.statics.TRACKING_STEPS = [
  { key: "placed", labelKey: "order_placed" },
  { key: "confirmed", labelKey: "order_confirmed" },
  { key: "processing", labelKey: "processing" },
  { key: "completed", labelKey: "completed" },
];

OrderSchema.statics.LEGACY_TO_TRACKING = {
  pending_docs: "placed",
  in_review: "processing",
  needs_resubmit: "processing",
  approved: "completed",
  completed: "completed",
  in_progress: "completed",
  delivered: "completed",
  rejected: "rejected",
};

// ✅ useful compound indexes for admin listing & user history
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Order", OrderSchema);
