const ApiResponse = require("../utils/response");

module.exports = function errorHandler(err, req, res, next) {
  // Log error details in development
  if (process.env.NODE_ENV !== "production") {
    console.error("❌ خطا:", err);
  } else {
    // In production, log only essential info
    console.error(`[${new Date().toISOString()}] خطا: ${err.message}`);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return ApiResponse.badRequest(res, {
      message: "اعتبارسنجی ناموفق بود",
      errors,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const fieldNames = {
      email: "ایمیل",
      phone: "شماره تلفن",
    };
    return ApiResponse.conflict(res, {
      message: `${fieldNames[field] || field} قبلاً استفاده شده است`,
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === "CastError") {
    return ApiResponse.badRequest(res, {
      message: "فرمت شناسه نامعتبر است",
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return ApiResponse.unauthorized(res, {
      message: "توکن نامعتبر است",
    });
  }

  if (err.name === "TokenExpiredError") {
    return ApiResponse.unauthorized(res, {
      message: "توکن منقضی شده است",
    });
  }

  // Default server error
  return ApiResponse.serverError(res, {
    message: process.env.NODE_ENV === "production" ? "خطای سرور" : err.message,
  });
};
