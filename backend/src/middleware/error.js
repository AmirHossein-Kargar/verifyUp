const ApiResponse = require("../utils/response");
const crypto = require("crypto");

module.exports = function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  const requestId = req.id || crypto.randomUUID();

  if (process.env.NODE_ENV !== "production") {
    console.error("❌ خطا:", err?.stack || err);
  } else {
    console.error(
      JSON.stringify({
        requestId,
        message: err?.message,
        name: err?.name,
        code: err?.code,
        path: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userId: req.user?.userId,
        stack: err?.stack, // بهتره بره تو logger/Sentry
      }),
    );
  }

  // Zod errors (generic)
  if (err?.issues && Array.isArray(err.issues)) {
    return ApiResponse.badRequest(res, {
      message: "اطلاعات وارد شده نامعتبر است",
      errors: err.issues.map((i) => i.message),
      requestId,
    });
  }

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return ApiResponse.badRequest(res, {
      message: "اعتبارسنجی ناموفق بود",
      errors,
      requestId,
    });
  }

  if (err.code === 11000) {
    const field =
      (err.keyPattern && Object.keys(err.keyPattern)[0]) ||
      (err.keyValue && Object.keys(err.keyValue)[0]) ||
      "field";

    const fieldNames = { email: "ایمیل", phone: "شماره تلفن" };

    return ApiResponse.conflict(res, {
      message: `${fieldNames[field] || field} قبلاً استفاده شده است`,
      requestId,
    });
  }

  if (err.name === "CastError") {
    return ApiResponse.badRequest(res, {
      message: "فرمت شناسه نامعتبر است",
      requestId,
    });
  }

  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return ApiResponse.unauthorized(res, {
      message: err.name === "TokenExpiredError" ? "توکن منقضی شده است" : "توکن نامعتبر است",
      requestId,
    });
  }

  return ApiResponse.serverError(res, {
    message: process.env.NODE_ENV === "production" ? "خطای سرور" : err.message,
    requestId,
  });
};
