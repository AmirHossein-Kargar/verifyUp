/**
 * Sanitize MongoDB queries to prevent NoSQL injection
 */
function sanitizeQuery(obj) {
  if (typeof obj !== "object" || obj === null) return obj;

  const sanitized = {};
  for (const key in obj) {
    if (key.startsWith("$")) continue; // Remove MongoDB operators
    sanitized[key] =
      typeof obj[key] === "object" ? sanitizeQuery(obj[key]) : obj[key];
  }
  return sanitized;
}

/**
 * Remove sensitive fields from user object
 */
function sanitizeUser(user) {
  const { passwordHash, __v, mfaSecret, mfaBackupCodes, ...safe } =
    user.toObject ? user.toObject() : user;
  return safe;
}

module.exports = { sanitizeQuery, sanitizeUser };
