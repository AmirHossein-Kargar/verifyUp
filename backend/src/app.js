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

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
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

// Static files for uploaded documents
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

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

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
