const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const ctrl = require("../controllers/auth.controller");
const auth = require("../middleware/auth");

// Strict rate limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: "تلاش‌های زیاد برای احراز هویت، لطفاً بعداً دوباره تلاش کنید",
  standardHeaders: true,
  legacyHeaders: false,
});

// Slightly stricter limiter for refresh to reduce abuse
const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: "تلاش‌های زیاد برای تازه‌سازی توکن، لطفاً بعداً دوباره تلاش کنید",
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/register", authLimiter, ctrl.register);
router.post("/login", authLimiter, ctrl.login);
router.post("/refresh", refreshLimiter, ctrl.refresh);
router.post("/logout", auth, ctrl.logout);
router.get("/me", auth, ctrl.me);

// CSRF token endpoint (read-only, used by frontend to prime CSRF cookie/header)
router.get("/csrf", (req, res) => {
  return res.json({
    success: true,
    token: req.csrfToken || null,
  });
});

module.exports = router;
