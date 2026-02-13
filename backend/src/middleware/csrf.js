const crypto = require("crypto");

const CSRF_COOKIE_NAME = "__Host-csrfToken";
const CSRF_HEADER_NAME = "x-csrf-token";
const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

function csrfProtection(options = {}) {
  const ignorePaths = options.ignorePaths || [];
  const disable = process.env.DISABLE_CSRF === "true";

  return function csrfMiddleware(req, res, next) {
    if (disable) return next();

    const path = req.path || req.url || "";

    if (ignorePaths.some((p) => path.startsWith(p))) {
      return next();
    }

    let token = req.cookies?.[CSRF_COOKIE_NAME];
    if (!token) {
      token = generateToken();
      // __Host- cookie requires secure + path=/ + no domain
      res.cookie(CSRF_COOKIE_NAME, token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 2 * 60 * 60 * 1000,
      });
    }

    req.csrfToken = token;

    if (SAFE_METHODS.includes(req.method)) {
      return next();
    }

    const headerToken = req.get(CSRF_HEADER_NAME);

    if (!headerToken || headerToken !== token) {
      return res.status(403).json({
        success: false,
        message: "درخواست نامعتبر است (CSRF)",
      });
    }

    return next();
  };
}

module.exports = csrfProtection;
