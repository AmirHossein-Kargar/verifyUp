const router = require("express").Router();
const { rateLimit, ipKeyGenerator } = require("express-rate-limit");
const auth = require("../middleware/auth");
const { requireRole } = require("../middleware/roles");
const ctrl = require("../controllers/order.controller");
const ApiResponse = require("../utils/response");

// All order routes require authentication and must belong to regular users.
router.use(auth, requireRole("user"));

// CSRF protection is already applied globally in app.js

// Limiter for creating orders
const orderCreateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    const ip = ipKeyGenerator(req, res);
    return `${req.user.userId}:${ip}`;
  },
  handler: (req, res) =>
    ApiResponse.tooManyRequests(res, {
      message:
        "تعداد درخواست‌ های ایجاد سفارش بیش از حد مجاز است، لطفاً کمی بعد دوباره تلاش کنید",
    }),
});

// Stricter limiter for payment-confirmation endpoint
const paidOrderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    const ip = ipKeyGenerator(req, res);
    return `${req.user.userId}:${ip}`;
  },
  handler: (req, res) =>
    ApiResponse.tooManyRequests(res, {
      message: "تعداد تلاش‌ها برای ثبت سفارش پرداخت‌شده بیش از حد مجاز است",
    }),
});

router.get("/me", ctrl.myOrders);
router.get("/:orderId", ctrl.getOrderById);

router.post("/", orderCreateLimiter, ctrl.createOrder);
router.post("/complete", paidOrderLimiter, ctrl.createPaidOrder);

module.exports = router;
