const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    service: { type: String, required: true, index: true }, // upwork_verification
    status: {
      type: String,
      enum: ["pending_docs", "in_review", "needs_resubmit", "approved", "rejected", "completed"],
      default: "pending_docs",
      index: true
    },
    priceToman: { type: Number, required: true },
    currency: { type: String, default: "IRR_TOMAN" },

    requiredDocs: { type: [String], default: [] },
    docsSummary: {
      uploaded: { type: Number, default: 0 },
      accepted: { type: Number, default: 0 },
      resubmit: { type: Number, default: 0 }
    },

    adminNote: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
