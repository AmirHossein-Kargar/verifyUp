// controllers/admin.controller.js

const Order = require("../models/Order");
const User = require("../models/User");
const ApiResponse = require("../utils/response");
const { sanitizeQuery } = require("../utils/sanitize");
const {
  adminListOrdersQuerySchema,
  adminOrderParamsSchema,
  updateOrderStatusBodySchema,
} = require("../validators/admin.validation");

/**
 * Escape user-controlled input before using in Mongo $regex to prevent regex injection / ReDoS patterns.
 */
function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseValidDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d;
}

async function audit(req, action, meta = {}) {
  // High-signal fields only — DO NOT log secrets/tokens.
  const entry = {
    action,
    adminId: req.user?.userId?.toString?.() || String(req.user?.userId || ""),
    ip: req.ip,
    userAgent: req.get("user-agent"),
    path: req.originalUrl,
    method: req.method,
    meta,
    at: new Date(),
  };

  // If you have AuditLog model:
  // await AuditLog.create(entry);

  // Otherwise at least log it (for prod better to use logger like pino/winston/Sentry)
  if (process.env.NODE_ENV !== "production") {
    console.info("AUDIT:", entry);
  } else {
    console.info(JSON.stringify(entry));
  }
}

exports.listOrders = async (req, res, next) => {
  try {
    const {
      status,
      page,
      limit,
      from,
      to,
      userQuery,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = adminListOrdersQuerySchema.parse(req.query);

    const query = {};

    if (status) query.status = status;

    // Date range (validated)
    const fromDate = parseValidDate(from);
    const toDate = parseValidDate(to);

    if ((from && !fromDate) || (to && !toDate)) {
      return ApiResponse.badRequest(res, {
        message: "پارامتر تاریخ نامعتبر است",
      });
    }

    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = fromDate;
      if (toDate) query.createdAt.$lte = toDate;
    }

    // Optional filter by user (email / phone contains)
    if (userQuery) {
      const q = String(userQuery).trim();

      // Prevent very heavy/general queries
      // (you can change threshold if needed)
      if (q.length < 3) {
        return ApiResponse.badRequest(res, {
          message: "عبارت جستجو باید حداقل ۳ کاراکتر باشد",
        });
      }
      if (q.length > 64) {
        return ApiResponse.badRequest(res, {
          message: "عبارت جستجو بیش از حد طولانی است",
        });
      }

      const safeQ = escapeRegex(q);

      const userFilter = {
        $or: [
          { email: { $regex: safeQ, $options: "i" } },
          { phone: { $regex: safeQ, $options: "i" } },
        ],
      };

      const users = await User.find(userFilter).select("_id").limit(2000);
      const userIds = users.map((u) => u._id);

      if (userIds.length === 0) {
        return ApiResponse.success(res, {
          message: "سفارشات با موفقیت دریافت شد",
          data: {
            orders: [],
            pagination: { total: 0, page, limit, pages: 0 },
          },
        });
      }

      query.userId = { $in: userIds };
    }

    const sanitizedQuery = sanitizeQuery(query);
    const skip = (page - 1) * limit;

    // Sort config
    const direction = sortOrder === "asc" ? 1 : -1;
    let sort = { createdAt: -1 };

    if (sortBy === "createdAt") sort = { createdAt: direction };
    else if (sortBy === "amount")
      sort = { priceToman: direction, createdAt: -1 };
    else if (sortBy === "status") sort = { status: direction, createdAt: -1 };

    // Least-privilege select: only necessary fields for list
    const ORDER_LIST_FIELDS =
      "userId status priceToman createdAt updatedAt adminNote summary";

    const [orders, total] = await Promise.all([
      Order.find(sanitizedQuery)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("userId", "name email phone role")
        .select(`${ORDER_LIST_FIELDS} -__v`)
        .lean(),
      Order.countDocuments(sanitizedQuery),
    ]);

    return ApiResponse.success(res, {
      message: "سفارشات با موفقیت دریافت شد",
      data: {
        orders,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (err) {
    if (err?.issues) {
      return ApiResponse.badRequest(res, {
        message: "پارامترهای جستجو نامعتبر هستند",
        errors: err.issues.map((i) => i.message),
      });
    }
    next(err);
  }
};

exports.getOrderDetails = async (req, res, next) => {
  try {
    const { orderId } = adminOrderParamsSchema.parse(req.params);

    const order = await Order.findById(orderId)
      .populate("userId", "email phone role name")
      .select("-__v")
      .lean();

    if (!order) {
      return ApiResponse.notFound(res, { message: "سفارش یافت نشد" });
    }

    return ApiResponse.success(res, {
      message: "جزئیات سفارش با موفقیت دریافت شد",
      data: { order },
    });
  } catch (err) {
    next(err);
  }
};

// Document-related endpoints removed - admin manages order status directly

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId } = adminOrderParamsSchema.parse(req.params);
    const { status, adminNote } = updateOrderStatusBodySchema.parse(req.body);

    // For audit: read previous status
    const before = await Order.findById(orderId).select("status").lean();
    if (!before) {
      return ApiResponse.notFound(res, { message: "سفارش یافت نشد" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: { status, adminNote: adminNote || "" },
        $currentDate: { updatedAt: true },
      },
      { new: true },
    )
      .populate("userId", "email phone role name")
      .select("-__v")
      .lean();

    await audit(req, "ADMIN_UPDATE_ORDER_STATUS", {
      orderId,
      fromStatus: before.status,
      toStatus: status,
    });

    return ApiResponse.success(res, {
      message: "وضعیت سفارش با موفقیت به‌روزرسانی شد",
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

exports.getStats = async (req, res, next) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const revenueMatch = {
      status: { $in: ["approved", "completed"] },
    };

    const [
      totalOrders,
      totalUsers,
      ordersByStatus,
      revenueAgg,
      revenueByDayAgg,
      revenueByMonthAgg,
      newUsersToday,
      recentOrders,
    ] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: "user" }),
      Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),

      // Total revenue in Rial (derived from stored priceToman)
      Order.aggregate([
        { $match: revenueMatch },
        {
          $group: {
            _id: null,
            revenueRial: { $sum: { $multiply: ["$priceToman", 10] } },
          },
        },
      ]),

      // Revenue trend per day (last 14 days)
      Order.aggregate([
        {
          $match: {
            ...revenueMatch,
            createdAt: {
              $gte: new Date(startOfToday.getTime() - 14 * 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            revenueRial: { $sum: { $multiply: ["$priceToman", 10] } },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      ]),

      // Revenue per month (last 6 months)  ✅ FIXED createdAt
      Order.aggregate([
        {
          $match: {
            ...revenueMatch,
            createdAt: {
              $gte: new Date(
                startOfToday.getFullYear(),
                startOfToday.getMonth() - 5,
                1,
              ),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }, // ✅ FIX
            },
            revenueRial: { $sum: { $multiply: ["$priceToman", 10] } },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),

      User.countDocuments({ role: "user", createdAt: { $gte: startOfToday } }),

      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("userId", "email phone")
        .select("userId status priceToman createdAt -__v")
        .lean(),
    ]);

    const statusMap = {};
    ordersByStatus.forEach((item) => {
      statusMap[item._id] = item.count;
    });

    const totalRevenueRial =
      revenueAgg && revenueAgg.length > 0 ? revenueAgg[0].revenueRial : 0;
    const revenueToman = Math.round(totalRevenueRial / 10);

    const revenueByDay = revenueByDayAgg.map((item) => {
      const { year, month, day } = item._id;
      const date = new Date(year, month - 1, day);
      return {
        date: date.toISOString(),
        revenueToman: Math.round(item.revenueRial / 10),
      };
    });

    const revenueByMonth = revenueByMonthAgg.map((item) => {
      const { year, month } = item._id;
      return { year, month, revenueToman: Math.round(item.revenueRial / 10) };
    });

    const pendingOrInReview =
      (statusMap.pending_docs || 0) +
      (statusMap.in_review || 0) +
      (statusMap.needs_resubmit || 0);

    const completed = (statusMap.approved || 0) + (statusMap.completed || 0);

    const conversionRate =
      totalOrders > 0 ? (completed / totalOrders) * 100 : 0;

    return ApiResponse.success(res, {
      message: "آمار با موفقیت دریافت شد",
      data: {
        totalOrders,
        totalUsers,
        ordersByStatus: statusMap,
        recentOrders,
        pendingOrInReview,
        completed,
        revenueRial: totalRevenueRial,
        revenueToman,
        revenueByDay,
        revenueByMonth,
        newUsersToday,
        conversionRate,
      },
    });
  } catch (err) {
    next(err);
  }
};
