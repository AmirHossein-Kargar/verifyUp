const Order = require("../models/Order");
const Document = require("../models/Document");
const {
  createOrderSchema,
  addDocSchema,
} = require("../validators/order.validation");
const { recomputeOrderSummary } = require("../services/order.service");
const ApiResponse = require("../utils/response");

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

exports.addDocument = async (req, res, next) => {
  try {
    const data = addDocSchema.parse(req.body);
    const { orderId } = req.params;

    // Verify order belongs to user
    const order = await Order.findOne({
      _id: orderId,
      userId: req.user.userId,
    });

    if (!order) {
      return ApiResponse.notFound(res, {
        message: "سفارش یافت نشد یا دسترسی به آن ندارید",
      });
    }

    // Create document
    const doc = await Document.create({
      orderId,
      userId: req.user.userId,
      type: data.type,
      fileUrl: data.fileUrl,
      status: "uploaded",
    });

    // Recompute order summary and status
    const summary = await recomputeOrderSummary(orderId);

    return ApiResponse.created(res, {
      message: "مدرک با موفقیت آپلود شد",
      data: {
        document: doc,
        orderSummary: summary,
      },
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
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      userId: req.user.userId,
    }).select("-__v");

    if (!order) {
      return ApiResponse.notFound(res, {
        message: "سفارش یافت نشد",
      });
    }

    // Get documents for this order
    const documents = await Document.find({ orderId }).select("-__v");

    return ApiResponse.success(res, {
      message: "جزئیات سفارش با موفقیت دریافت شد",
      data: { order, documents },
    });
  } catch (err) {
    next(err);
  }
};
