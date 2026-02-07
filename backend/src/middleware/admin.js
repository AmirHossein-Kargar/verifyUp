const ApiResponse = require("../utils/response");

function admin(req, res, next) {
  if (req.user?.role !== "admin") {
    return ApiResponse.forbidden(res, {
      message: "دسترسی ادمین الزامی است",
    });
  }
  next();
}

module.exports = admin;
