/**
 * Same as auth but does not return 401 when no cookie. Sets req.user when valid, otherwise leaves unset.
 * Use for routes that can also accept token (e.g. GET profile image with ?token=).
 */
const ApiResponse = require("../utils/response");
const { verifyAccessToken } = require("../utils/jwt");
const User = require("../models/User");

async function optionalAuth(req, res, next) {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      return next();
    }

    const decoded = verifyAccessToken(token);
    if (!decoded?.userId) {
      return next();
    }

    const user = await User.findById(decoded.userId).select("_id role tokenVersion suspended");
    if (!user || user.tokenVersion !== decoded.tokenVersion || user.suspended) {
      return next();
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

module.exports = optionalAuth;
