const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const ctrl = require("../controllers/auth.controller");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Strict rate limiter for auth endpoints (per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window per IP
  message: "تلاش‌های زیاد برای احراز هویت، لطفاً بعداً دوباره تلاش کنید",
  standardHeaders: true,
  legacyHeaders: false,
});

// Tighter limiter for refresh to reduce abuse of long-lived refresh tokens
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "تلاش‌های زیاد برای تازه‌سازی توکن، لطفاً بعداً دوباره تلاش کنید",
  standardHeaders: true,
  legacyHeaders: false,
});

// Small limiter for logout to avoid abuse while still being user-friendly
const logoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message:
    "تلاش‌های زیاد برای خروج انجام شده است، لطفاً بعداً دوباره تلاش کنید",
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authLimiter, ctrl.register);
router.post("/login", authLimiter, ctrl.login);
router.post("/refresh", refreshLimiter, ctrl.refresh);
router.post("/logout", logoutLimiter, auth, ctrl.logout);
router.get("/me", auth, ctrl.me);

// Admin-only MFA endpoints (require normal authentication + admin role)
router.post("/setup-mfa", auth, admin, ctrl.setupMfa);
router.post("/verify-mfa", auth, admin, ctrl.verifyMfa);

// CSRF token endpoint (read-only, used by frontend to prime CSRF cookie/header)
router.get("/csrf", (req, res) => {
  return res.json({
    success: true,
    token: req.csrfToken || null,
  });
});

module.exports = router;
