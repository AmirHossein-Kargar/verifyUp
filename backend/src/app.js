const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const path = require("path");

const errorHandler = require("./middleware/error");
const csrfProtection = require("./middleware/csrf");
const ApiResponse = require("./utils/response");

const authRoutes = require("./routes/auth.routes");
const orderRoutes = require("./routes/order.routes");
const adminRoutes = require("./routes/admin.routes");
const fileRoutes = require("./routes/files.routes");

const app = express();

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
  })
);

// Additional security headers via helmet helpers
app.use(
  helmet.hsts({
    maxAge: 15552000, // 180 days in seconds
    includeSubDomains: true,
    preload: false,
  })
);

app.use(
  helmet.referrerPolicy({
    policy: "no-referrer",
  })
);

// Lock down powerful browser APIs by default
app.use((_, res, next) => {
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );
  next();
});

// CORS: strict origin/method/header allowlist
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow same-origin / non-browser requests with no origin
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-CSRF-Token"],
    credentials: true,
  })
);

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: "درخواست‌های زیاد از این IP، لطفاً بعداً دوباره تلاش کنید",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// CSRF protection (must come after cookieParser)
app.use(
  csrfProtection({
    ignorePaths: ["/", "/api/auth/csrf"],
  })
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
app.use("/api/files", fileRoutes);

// 404 handler
app.use((req, res) => {
  ApiResponse.notFound(res, { message: "مسیر یافت نشد" });
});

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
