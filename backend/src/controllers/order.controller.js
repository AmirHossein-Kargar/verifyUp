const fs = require("fs");
const Order = require("../models/Order");
const Document = require("../models/Document");
const {
  createOrderSchema,
  addDocSchema,
  orderIdParamsSchema,
} = require("../validators/order.validation");
const { recomputeOrderSummary } = require("../services/order.service");
const ApiResponse = require("../utils/response");
const { ensureUserOwnsOrder } = require("../permissions/orders");
const { scanFileForMalware } = require("../services/virusScan.service");

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
// NOTE: The order still needs documents & review, so we start from `pending_docs`
exports.createPaidOrder = async (req, res, next) => {
  try {
    const data = createOrderSchema.parse(req.body);

    const order = await Order.create({
      userId: req.user.userId,
      service: data.service,
      // Payment is done, but documents and admin review are still required.
      // We intentionally start from `pending_docs` so the user can upload docs
      // and the admin workflow (in_review -> approved/completed) can run.
      status: "pending_docs",
      priceToman: data.priceToman,
      currency: "IRR_TOMAN",
      requiredDocs: data.requiredDocs,
    });

    return ApiResponse.created(res, {
      message: "سفارش پرداخت‌شده ایجاد شد. لطفاً مدارک موردنیاز را آپلود کنید.",
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

exports.uploadDocument = async (req, res, next) => {
  try {
    const { orderId } = orderIdParamsSchema.parse(req.params);

    if (!req.file) {
      return ApiResponse.badRequest(res, {
        message: "فایلی برای آپلود ارسال نشده است",
      });
    }

    // Verify order belongs to user using centralized permission helper
    const order = await ensureUserOwnsOrder(orderId, req.user.userId, res);
    if (!order) return;

    // Security: run uploaded file through malware scanner hook
    const scanResult = await scanFileForMalware(req.file.path);
    if (!scanResult.isClean) {
      // Best-effort cleanup of suspicious file
      try {
        await fs.promises.unlink(req.file.path);
      } catch {
        // ignore cleanup errors
      }

      return ApiResponse.badRequest(res, {
        message: "فایل شما به دلایل امنیتی پذیرفته نشد",
      });
    }

    // Document type can be optionally sent by client, otherwise generic
    const type = req.body.type || "user_upload";

    // Create document record with private storage details
    const doc = new Document({
      orderId,
      userId: req.user.userId,
      type,
      // URL will point to the controlled download endpoint
      fileUrl: "", // set below after id is available
      status: "uploaded",
      fileName: req.file.filename,
      storagePath: req.file.path,
    });

    // File will be served only through an authenticated download endpoint
    doc.fileUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/files/${doc._id.toString()}`;
    await doc.save();

    // Recompute order summary and status
    const summary = await recomputeOrderSummary(orderId);

    return ApiResponse.created(res, {
      message: "فایل شما با موفقیت آپلود شد",
      data: {
        document: doc,
        orderSummary: summary,
      },
    });
  } catch (err) {
    // Multer errors surface as regular errors
    if (err instanceof Error && err.message?.includes("فای")) {
      return ApiResponse.badRequest(res, {
        message: err.message,
      });
    }
    next(err);
  }
};

exports.addDocument = async (req, res, next) => {
  try {
    const data = addDocSchema.parse(req.body);
    const { orderId } = orderIdParamsSchema.parse(req.params);

    // Verify order belongs to user using centralized permission helper
    const order = await ensureUserOwnsOrder(orderId, req.user.userId, res);
    if (!order) return;

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
    const { orderId } = orderIdParamsSchema.parse(req.params);
    const order = await ensureUserOwnsOrder(orderId, req.user.userId, res);
    if (!order) return;

    // Get documents for this order
    const documents = await Document.find({ orderId }).select("-__v");

    return ApiResponse.success(res, {
      message: "جزئیات سفارش با موفقیت دریافت شد",
      data: { order, documents },
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
