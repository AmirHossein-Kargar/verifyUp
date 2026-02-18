const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { rateLimit, ipKeyGenerator } = require("express-rate-limit");

const errorHandler = require("./middleware/error");
const csrfProtection = require("./middleware/csrf");
const ApiResponse = require("./utils/response");

const authRoutes = require("./routes/auth.routes");
const orderRoutes = require("./routes/order.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

// ✅ اگر پشت reverse proxy هستی (تقریباً همیشه در prod)
// این برای req.ip، rate-limit، secure cookies و ... حیاتی است
app.set("trust proxy", 1);

// Security middleware
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const allowedOrigins = [FRONTEND_URL].filter(Boolean);

app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === "production"
        ? {
            directives: {
              defaultSrc: ["'self'"],
              // برای Next ممکنه nonce لازم باشه؛ اگر مشکل داشتی اینجا باید اصلاح شه
              scriptSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              imgSrc: ["'self'", "data:"],
              connectSrc: ["'self'", FRONTEND_URL],
              fontSrc: ["'self'"],
              objectSrc: ["'none'"],
              frameAncestors: ["'none'"],
              baseUri: ["'self'"],
            },
          }
        : false,
  }),
);

// HSTS (only meaningful over HTTPS)
if (process.env.NODE_ENV === "production") {
  app.use(
    helmet.hsts({
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: false, // اگر آماده preload هستی true کن
    }),
  );
}

app.use(helmet.referrerPolicy({ policy: "no-referrer" }));

// Lock down powerful browser APIs by default
app.use((_, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()",
  );
  next();
});

// CORS: strict allowlist
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      // CORS denial should not throw 500
      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-CSRF-Token"],
    credentials: true,
  }),
);

// If CORS blocked, respond cleanly (optional but nice)
app.use((req, res, next) => {
  const origin = req.get("origin");
  if (origin && !allowedOrigins.includes(origin)) {
    return ApiResponse.forbidden(res, { message: "Origin غیرمجاز است" });
  }
  next();
});

// Body + cookies
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());

// Logger
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Global rate limiter (user-aware)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req, res) => {
    const ip = ipKeyGenerator(req, res);
    return `${req.user?.userId || "anon"}:${ip}`;
  },
  handler: (req, res) =>
    ApiResponse.tooManyRequests(res, {
      message: "درخواست‌ های زیاد، لطفاً بعداً دوباره تلاش کنید",
    }),
});

// Allow disabling rate limiting for E2E/local testing to avoid 429s.
// Keep it enabled by default for safety.
const disableRateLimit =
  process.env.DISABLE_RATE_LIMIT === "true" || process.env.NODE_ENV === "test";

if (!disableRateLimit) {
  app.use(globalLimiter);
}

// CSRF protection (must come after cookieParser)
// بهتره ignorePaths فقط endpoint های لازم باشد
app.use(
  csrfProtection({
    ignorePaths: ["/", "/api/auth/csrf"],
  }),
);

// Health check
app.get("/", (req, res) => {
  ApiResponse.success(res, {
    message: "API VerifyUp در حال اجراست",
    data: { version: "1.0.0", status: "healthy" },
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler
app.use((req, res) => {
  ApiResponse.notFound(res, { message: "مسیر یافت نشد" });
});

// Error handler
app.use(errorHandler);

module.exports = app;
