const mongoose = require("mongoose");
const Order = require("../models/Order");
const ApiResponse = require("../utils/response");

async function ensureUserOwnsOrder(orderId, userId, res) {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    ApiResponse.badRequest(res, { message: "شناسه سفارش نامعتبر است" });
    return null;
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    ApiResponse.unauthorized(res, { message: "احراز هویت الزامی است" });
    return null;
  }

  const order = await Order.findOne({ _id: orderId, userId })
    .select("_id userId status service priceToman currency requiredDocs createdAt updatedAt")
    .lean();

  if (!order) {
    ApiResponse.notFound(res, {
      message: "سفارش یافت نشد یا دسترسی به آن ندارید",
    });
    return null;
  }

  return order;
}

module.exports = { ensureUserOwnsOrder };
