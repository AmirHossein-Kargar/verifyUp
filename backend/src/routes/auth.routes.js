const router = require("express").Router();
const { rateLimit, ipKeyGenerator } = require("express-rate-limit");
const ctrl = require("../controllers/auth.controller");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const ApiResponse = require("../utils/response");

// CSRF protection is already applied globally in app.js
// No need to apply it again here

const tooMany = (message) => (req, res) =>
  ApiResponse.tooManyRequests(res, { message });

// Strict rate limiter for auth endpoints (prefer Redis store in prod)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    const id = (req.body?.email || req.body?.phone || "").toLowerCase().trim();
    const ip = ipKeyGenerator(req, res);
    return `${id || "noid"}:${ip}`;
  },
  handler: tooMany(
    "تلاش‌های زیاد برای احراز هویت، لطفاً بعداً دوباره تلاش کنید",
  ),
});

const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: tooMany(
    "تلاش‌های زیاد برای تازه‌سازی توکن، لطفاً بعداً دوباره تلاش کنید",
  ),
});

const logoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    const ip = ipKeyGenerator(req, res);
    return `${req.user?.userId || "anon"}:${ip}`;
  },
  handler: tooMany(
    "تلاش‌های زیاد برای خروج انجام شده است، لطفاً بعداً دوباره تلاش کنید",
  ),
});

router.post("/register", authLimiter, ctrl.register);
router.post("/login", authLimiter, ctrl.login);
router.post("/verify-otp", authLimiter, ctrl.verifyOtp);
router.post("/verify-email", authLimiter, ctrl.verifyEmail);
router.post("/resend-otp", authLimiter, ctrl.resendOtp);

// CSRF now enforced here automatically by router.use(csrfProtection)
// (unsafe methods require X-CSRF-Token header)
router.post("/refresh", refreshLimiter, ctrl.refresh);
router.post("/logout", logoutLimiter, auth, ctrl.logout);
router.get("/me", auth, ctrl.me);

// CSRF token endpoint
router.get("/csrf", (req, res) => {
  return ApiResponse.success(res, {
    message: "توکن CSRF با موفقیت دریافت شد",
    data: { token: req.csrfToken || null },
  });
});

module.exports = router;
