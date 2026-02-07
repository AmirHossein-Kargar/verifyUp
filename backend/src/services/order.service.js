const Order = require("../models/Order");
const Document = require("../models/Document");

async function recomputeOrderSummary(orderId) {
  const docs = await Document.find({ orderId });

  const uploaded = docs.filter(d => d.status === "uploaded").length;
  const accepted = docs.filter(d => d.status === "accepted").length;
  const resubmit = docs.filter(d => d.status === "resubmit").length;

  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  let nextStatus = order.status;

  // If any document needs resubmit => needs_resubmit
  if (resubmit > 0) nextStatus = "needs_resubmit";
  else {
    // If all required docs are uploaded => in_review
    const requiredCount = order.requiredDocs?.length || 0;
    if (requiredCount > 0 && uploaded >= requiredCount) nextStatus = "in_review";

    // If all docs are accepted => approved
    // (Here we assume only required documents matter)
    if (requiredCount > 0 && accepted >= requiredCount) nextStatus = "approved";
  }

  await Order.updateOne(
    { _id: orderId },
    {
      $set: {
        docsSummary: { uploaded, accepted, resubmit },
        status: nextStatus
      },
      $currentDate: { updatedAt: true }
    }
  );

  return { uploaded, accepted, resubmit, status: nextStatus };
}

module.exports = { recomputeOrderSummary };
