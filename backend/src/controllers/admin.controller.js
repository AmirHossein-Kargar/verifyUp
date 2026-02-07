const Order = require("../models/Order");
const Document = require("../models/Document");
const User = require("../models/User");
const { recomputeOrderSummary } = require("../services/order.service");
const ApiResponse = require("../utils/response");

exports.listOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate("userId", "email phone role")
        .select("-__v"),
      Order.countDocuments(query),
    ]);

    return ApiResponse.success(res, {
      message: "سفارشات با موفقیت دریافت شد",
      data: {
        orders,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getOrderDetails = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
      .populate("userId", "email phone role")
      .select("-__v");

    if (!order) {
      return ApiResponse.notFound(res, {
        message: "سفارش یافت نشد",
      });
    }

    const documents = await Document.find({ orderId }).select("-__v");

    return ApiResponse.success(res, {
      message: "جزئیات سفارش با موفقیت دریافت شد",
      data: { order, documents },
    });
  } catch (err) {
    next(err);
  }
};

exports.orderDocs = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return ApiResponse.notFound(res, {
        message: "سفارش یافت نشد",
      });
    }

    const docs = await Document.find({ orderId }).select("-__v");

    return ApiResponse.success(res, {
      message: "مدارک با موفقیت دریافت شد",
      data: { documents: docs, count: docs.length },
    });
  } catch (err) {
    next(err);
  }
};

exports.reviewDoc = async (req, res, next) => {
  try {
    const { docId } = req.params;
    const { status, adminNote } = req.body;

    // Validate status
    if (!["accepted", "resubmit"].includes(status)) {
      return ApiResponse.badRequest(res, {
        message: "وضعیت نامعتبر است. باید 'accepted' یا 'resubmit' باشد",
      });
    }

    // Find and update document
    const doc = await Document.findByIdAndUpdate(
      docId,
      {
        $set: { status, adminNote: adminNote || "" },
        $currentDate: { updatedAt: true },
      },
      { new: true },
    );

    if (!doc) {
      return ApiResponse.notFound(res, {
        message: "مدرک یافت نشد",
      });
    }

    // Recompute order summary and status
    const summary = await recomputeOrderSummary(doc.orderId);

    return ApiResponse.success(res, {
      message:
        status === "accepted"
          ? "مدرک تایید شد"
          : "مدرک برای ارسال مجدد علامت‌گذاری شد",
      data: {
        document: doc,
        orderSummary: summary,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { status, adminNote } = req.body;

    const validStatuses = [
      "pending_docs",
      "in_review",
      "needs_resubmit",
      "approved",
      "rejected",
      "completed",
    ];

    if (!validStatuses.includes(status)) {
      return ApiResponse.badRequest(res, {
        message: `وضعیت نامعتبر است. باید یکی از موارد زیر باشد: ${validStatuses.join("، ")}`,
      });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: { status, adminNote: adminNote || "" },
        $currentDate: { updatedAt: true },
      },
      { new: true },
    ).populate("userId", "email phone role");

    if (!order) {
      return ApiResponse.notFound(res, {
        message: "سفارش یافت نشد",
      });
    }

    return ApiResponse.success(res, {
      message: "وضعیت سفارش با موفقیت به‌روزرسانی شد",
      data: { order },
    });
  } catch (err) {
    next(err);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const [totalOrders, totalUsers, ordersByStatus, recentOrders] =
      await Promise.all([
        Order.countDocuments(),
        User.countDocuments({ role: "user" }),
        Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
        Order.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .populate("userId", "email phone")
          .select("-__v"),
      ]);

    const statusMap = {};
    ordersByStatus.forEach((item) => {
      statusMap[item._id] = item.count;
    });

    return ApiResponse.success(res, {
      message: "آمار با موفقیت دریافت شد",
      data: {
        totalOrders,
        totalUsers,
        ordersByStatus: statusMap,
        recentOrders,
      },
    });
  } catch (err) {
    next(err);
  }
};
