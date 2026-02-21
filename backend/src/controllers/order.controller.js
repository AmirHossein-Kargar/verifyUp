const Order = require("../models/Order");
const {
  createOrderSchema,
  orderIdParamsSchema,
} = require("../validators/order.validation");
const ApiResponse = require("../utils/response");
const { ensureUserOwnsOrder } = require("../permissions/orders");
const { subscribe: subscribeOrderEvents } = require("../services/orderEvents");

exports.createOrder = async (req, res, next) => {
  try {
    const data = createOrderSchema.parse(req.body);
    const now = new Date();

    const order = await Order.create({
      userId: req.user.userId,
      service: data.service,
      status: "placed",
      statusHistory: [{ status: "placed", timestamp: now }],
      priceToman: data.priceToman,
      currency: "IRR_TOMAN",
      requiredDocs: data.requiredDocs,
    });

    return ApiResponse.created(res, {
      message: "سفارش با موفقیت ایجاد شد",
      data: { order },
    });
  } catch (err) {
    if (err?.issues) {
      return ApiResponse.badRequest(res, {
        message: "اطلاعات وارد شده نامعتبر است",
        errors: err.issues.map((i) => i.message),
      });
    }
    next(err);
  }
};

// Create an order after successful payment
exports.createPaidOrder = async (req, res, next) => {
  try {
    const data = createOrderSchema.parse(req.body);
    const now = new Date();

    const order = await Order.create({
      userId: req.user.userId,
      service: data.service,
      status: "placed",
      statusHistory: [{ status: "placed", timestamp: now }],
      priceToman: data.priceToman,
      currency: "IRR_TOMAN",
      requiredDocs: data.requiredDocs,
    });

    return ApiResponse.created(res, {
      message:
        "سفارش پرداخت‌شده ایجاد شد. ادمین وضعیت سفارش را بررسی خواهد کرد.",
      data: { order },
    });
  } catch (err) {
    if (err?.issues) {
      return ApiResponse.badRequest(res, {
        message: "اطلاعات وارد شده نامعتبر است",
        errors: err.issues.map((i) => i.message),
      });
    }
    next(err);
  }
};

// Document upload functions removed - admin manages documents directly

// Normalize order for tracking: ensure statusHistory exists (backfill for legacy orders)
function normalizeOrderForTracking(order) {
  const doc = order.toObject ? order.toObject() : order;
  if (!doc.statusHistory || doc.statusHistory.length === 0) {
    const legacyMap = Order.LEGACY_TO_TRACKING;
    const trackingStatus = legacyMap[doc.status] || doc.status;
    doc.statusHistory = [
      { status: trackingStatus, timestamp: doc.createdAt || new Date() },
    ];
  }
  return doc;
}

exports.myOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .select("-__v")
      .lean();

    const normalized = orders.map(normalizeOrderForTracking);

    return ApiResponse.success(res, {
      message: "سفارشات با موفقیت دریافت شد",
      data: { orders: normalized, count: normalized.length },
    });
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const { orderId } = orderIdParamsSchema.parse(req.params);
    const order = await ensureUserOwnsOrder(orderId, req.user.userId, res);
    if (!order) return;

    const doc = order.toObject ? order.toObject() : order;
    const normalized = normalizeOrderForTracking(doc);

    return ApiResponse.success(res, {
      message: "جزئیات سفارش با موفقیت دریافت شد",
      data: { order: normalized },
    });
  } catch (err) {
    if (err?.issues) {
      return ApiResponse.badRequest(res, {
        message: "اطلاعات وارد شده نامعتبر است",
        errors: err.issues.map((i) => i.message),
      });
    }
    next(err);
  }
};

/**
 * Server-Sent Events: stream order updates for the authenticated user.
 * When admin updates an order belonging to this user, an event is pushed.
 */
exports.orderEvents = (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  const userId = req.user.userId;
  subscribeOrderEvents(userId, res);

  // Send initial comment so client knows connection is open
  res.write(": connected\n\n");

  // Keep-alive ping every 25s so proxy/client don't close the connection
  const pingInterval = setInterval(() => {
    try {
      res.write(": ping\n\n");
    } catch (e) {
      clearInterval(pingInterval);
    }
  }, 25000);

  req.on("close", () => {
    clearInterval(pingInterval);
  });
};
