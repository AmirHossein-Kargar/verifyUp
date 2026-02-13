const Order = require("../models/Order");
const {
  createOrderSchema,
  orderIdParamsSchema,
} = require("../validators/order.validation");
const ApiResponse = require("../utils/response");
const { ensureUserOwnsOrder } = require("../permissions/orders");

exports.createOrder = async (req, res, next) => {
  try {
    const data = createOrderSchema.parse(req.body);

    const order = await Order.create({
      userId: req.user.userId,
      service: data.service,
      status: "pending_docs",
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
// Admin will manage order status directly
exports.createPaidOrder = async (req, res, next) => {
  try {
    const data = createOrderSchema.parse(req.body);

    const order = await Order.create({
      userId: req.user.userId,
      service: data.service,
      status: "pending_docs",
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

exports.myOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .select("-__v");

    return ApiResponse.success(res, {
      message: "سفارشات با موفقیت دریافت شد",
      data: { orders, count: orders.length },
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

    return ApiResponse.success(res, {
      message: "جزئیات سفارش با موفقیت دریافت شد",
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
