const ApiResponse = require("../utils/response");

function requireRole(...roles) {
  if (!roles.length) {
    throw new Error("requireRole must be called with at least one role");
  }

  return function roleGuard(req, res, next) {
    const userRole = req.user?.role;

    if (!userRole) {
      return ApiResponse.unauthorized(res, {
        message: "احراز هویت الزامی است",
      });
    }

    if (!roles.includes(userRole)) {
      return ApiResponse.forbidden(res, {
        message: "شما مجوز دسترسی به این بخش را ندارید",
      });
    }

    return next();
  };
}

module.exports = { requireRole };
