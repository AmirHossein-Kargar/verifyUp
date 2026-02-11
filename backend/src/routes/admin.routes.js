const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const ctrl = require("../controllers/admin.controller");

// All admin routes require authentication and admin role
router.use(auth, admin);

// Additional limiter for sensitive admin mutations
const adminWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message:
    "تعداد درخواست‌های مدیریتی بیش از حد مجاز است، لطفاً بعداً دوباره تلاش کنید",
  standardHeaders: true,
  legacyHeaders: false,
});

// Statistics
router.get("/stats", ctrl.getStats);

// Orders management
router.get("/orders", ctrl.listOrders);
router.get("/orders/:orderId", ctrl.getOrderDetails);
router.get("/orders/:orderId/documents", ctrl.orderDocs);
router.patch(
  "/orders/:orderId/status",
  adminWriteLimiter,
  ctrl.updateOrderStatus
);

// Document review
router.patch("/documents/:docId/review", adminWriteLimiter, ctrl.reviewDoc);

module.exports = router;
