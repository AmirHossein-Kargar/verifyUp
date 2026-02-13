const router = require("express").Router();
const { rateLimit, ipKeyGenerator } = require("express-rate-limit");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const ctrl = require("../controllers/admin.controller");
const ApiResponse = require("../utils/response");

// Edge limiter for /api/admin/* (cheap shield)
const adminEdgeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) =>
    ApiResponse.tooManyRequests(res, {
      message:
        "تعداد درخواست‌ها بیش از حد مجاز است، لطفاً کمی بعد دوباره تلاش کنید",
    }),
});

// All admin routes
router.use(adminEdgeLimiter);
router.use(auth, admin);

// Read limiter (per admin + ip)
const adminReadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    const ip = ipKeyGenerator(req, res);
    return `${req.user.userId}:${ip}`;
  },
  handler: (req, res) =>
    ApiResponse.tooManyRequests(res, {
      message:
        "تعداد درخواست‌های مشاهده پنل مدیریت بیش از حد مجاز است، لطفاً کمی بعد دوباره تلاش کنید",
    }),
});

// Write limiter (stricter)
const adminWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    const ip = ipKeyGenerator(req, res);
    return `${req.user.userId}:${ip}`;
  },
  handler: (req, res) =>
    ApiResponse.tooManyRequests(res, {
      message:
        "تعداد درخواست‌های مدیریتی بیش از حد مجاز است، لطفاً بعداً دوباره تلاش کنید",
    }),
});

// Statistics
router.get("/stats", adminReadLimiter, ctrl.getStats);

// Orders management
router.get("/orders", adminReadLimiter, ctrl.listOrders);
router.get("/orders/:orderId", adminReadLimiter, ctrl.getOrderDetails);

// Mutations (CSRF strongly recommended if cookie-based auth)
// router.patch("/orders/:orderId/status", csrfProtection(), adminWriteLimiter, ctrl.updateOrderStatus);
router.patch(
  "/orders/:orderId/status",
  adminWriteLimiter,
  ctrl.updateOrderStatus,
);

module.exports = router;
