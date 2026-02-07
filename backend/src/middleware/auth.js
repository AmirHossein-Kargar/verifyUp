const { verifyAccessToken } = require("../utils/jwt");
const ApiResponse = require("../utils/response");

function auth(req, res, next) {
  const token = req.cookies.accessToken;

  if (!token) {
    return ApiResponse.unauthorized(res, {
      message: "احراز هویت الزامی است",
    });
  }

  const decoded = verifyAccessToken(token);

  if (!decoded) {
    return ApiResponse.unauthorized(res, {
      message: "توکن نامعتبر یا منقضی شده است",
    });
  }

  req.user = decoded;
  next();
}

module.exports = auth;
