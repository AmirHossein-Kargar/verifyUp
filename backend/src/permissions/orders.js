const Order = require("../models/Order");
const Document = require("../models/Document");
const ApiResponse = require("../utils/response");

/**
 * Ensure that the current authenticated user owns the given order.
 * If the order does not exist or is not owned by the user, sends the
 * appropriate API error response and returns null.
 */
async function ensureUserOwnsOrder(orderId, userId, res) {
  const order = await Order.findOne({ _id: orderId, userId });

  if (!order) {
    ApiResponse.notFound(res, {
      message: "سفارش یافت نشد یا دسترسی به آن ندارید",
    });
    return null;
  }

  return order;
}

/**
 * Ensure that the current authenticated user owns the given document via its
 * orderId + userId pairing. This is primarily useful for any future document
 * endpoints that are not already scoped through orders.
 */
async function ensureUserOwnsDocument(docId, userId, res) {
  const doc = await Document.findOne({ _id: docId, userId });

  if (!doc) {
    ApiResponse.notFound(res, {
      message: "مدرک یافت نشد یا دسترسی به آن ندارید",
    });
    return null;
  }

  return doc;
}

module.exports = {
  ensureUserOwnsOrder,
  ensureUserOwnsDocument,
};
