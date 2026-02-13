const ApiResponse = require("../utils/response");
const { verifyAccessToken } = require("../utils/jwt");
const User = require("../models/User");

async function auth(req, res, next) {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      return ApiResponse.unauthorized(res, { message: "احراز هویت الزامی است" });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded?.userId) {
      return ApiResponse.unauthorized(res, { message: "توکن نامعتبر یا منقضی شده است" });
    }

    const user = await User.findById(decoded.userId).select("_id role tokenVersion suspended");
    if (!user) {
      return ApiResponse.unauthorized(res, { message: "کاربر یافت نشد" });
    }

    if (user.tokenVersion !== decoded.tokenVersion) {
      return ApiResponse.unauthorized(res, { message: "این نشست دیگر معتبر نیست" });
    }

    if (user.suspended) {
      return ApiResponse.forbidden(res, { message: "حساب شما مسدود شده است" });
    }

    req.user = {
      userId: user._id.toString(),
      role: user.role,
      tokenVersion: user.tokenVersion,
    };

    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = auth;
