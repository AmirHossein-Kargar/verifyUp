const crypto = require("crypto");

const CSRF_COOKIE_NAME = "csrfToken";
const CSRF_HEADER_NAME = "x-csrf-token";

const SAFE_METHODS = ["GET", "HEAD", "OPTIONS", "TRACE"];

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Lightweight double-submit CSRF protection.
 *
 * - Issues a random token and stores it in a SameSite=Strict cookie.
 * - For unsafe methods (POST/PUT/PATCH/DELETE), requires the same token
 *   to be sent back in the `X-CSRF-Token` header.
 *
 * NOTE: The CSRF cookie is intentionally NOT httpOnly so the frontend can
 * read and send it when using fetch/XHR.
 */
function csrfProtection(options = {}) {
  const ignorePaths = options.ignorePaths || [];

  return function csrfMiddleware(req, res, next) {
    const path = req.path || req.url;

    // Allow explicitly ignored paths (e.g. health, csrf token endpoint)
    if (ignorePaths.some((p) => path === p)) {
      return next();
    }

    // Ensure a CSRF token cookie exists
    let token = req.cookies[CSRF_COOKIE_NAME];
    if (!token) {
      token = generateToken();
      res.cookie(CSRF_COOKIE_NAME, token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
    }

    // Expose token to handlers that want to return it (e.g. /api/auth/csrf)
    req.csrfToken = token;

    // Only enforce CSRF on state-changing methods
    if (SAFE_METHODS.includes(req.method)) {
      return next();
    }

    const headerToken =
      req.headers[CSRF_HEADER_NAME] ||
      req.headers[CSRF_HEADER_NAME.toUpperCase()];

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
