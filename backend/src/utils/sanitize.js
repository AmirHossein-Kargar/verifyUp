/**
 * Sanitize MongoDB queries to reduce NoSQL injection risks.
 * Allows only a safe subset of Mongo operators.
 */
const ALLOWED_OPERATORS = new Set([
  "$and",
  "$or",
  "$in",
  "$nin",
  "$eq",
  "$ne",
  "$gt",
  "$gte",
  "$lt",
  "$lte",
  "$regex",
  "$options",
  "$exists",
]);

function sanitizeQuery(obj) {
  if (obj === null || typeof obj !== "object") return obj;

  // Arrays: sanitize each item
  if (Array.isArray(obj)) return obj.map(sanitizeQuery);

  const sanitized = {};
  for (const key of Object.keys(obj)) {
    if (key.startsWith("$")) {
      // allow only safe operators
      if (!ALLOWED_OPERATORS.has(key)) continue;
    }

    const val = obj[key];
    sanitized[key] = sanitizeQuery(val);
  }

  return sanitized;
}

/**
 * Remove sensitive fields from user object
 */
function sanitizeUser(user) {
  const u = user?.toObject ? user.toObject() : user;

  // حذف کامل فیلدهای حساس (بهتر: select:false در schema)
  const {
    passwordHash,
    __v,
    tokenVersion,
    passwordChangedAt,
    lastLoginAt,
    ...safe
  } = u || {};

  return safe;
}

module.exports = { sanitizeQuery, sanitizeUser };
