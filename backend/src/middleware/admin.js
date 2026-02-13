const ApiResponse = require("../utils/response");

/**
 * Middleware to ensure the authenticated user has admin role.
 */
function requireAdmin(req, res, next) {
  if (!req.user) {
    return ApiResponse.unauthorized(res, {
      message: "احراز هویت لازم است",
    });
  }

  if (req.user.role !== "admin") {
    return ApiResponse.forbidden(res, {
      message: "دسترسی محدود به ادمین‌ها",
    });
  }

  next();
}

module.exports = requireAdmin;
