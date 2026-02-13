/**
 * Standardized API response helpers
 */
class ApiResponse {
  static success(res, { statusCode = 200, message = null, data = null, meta = null } = {}) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      errors: null,
      meta,
    });
  }

  static error(res, { statusCode = 500, message, errors = null, meta = null } = {}) {
    return res.status(statusCode).json({
      success: false,
      message,
      data: null,
      errors,
      meta,
    });
  }

  static created(res, { message, data = null, meta = null } = {}) {
    return this.success(res, { statusCode: 201, message, data, meta });
  }

  static badRequest(res, { message = "Bad request", errors = null, meta = null } = {}) {
    return this.error(res, { statusCode: 400, message, errors, meta });
  }

  static unauthorized(res, { message = "Unauthorized access", meta = null } = {}) {
    return this.error(res, { statusCode: 401, message, meta });
  }

  static forbidden(res, { message = "Forbidden", meta = null } = {}) {
    return this.error(res, { statusCode: 403, message, meta });
  }

  static notFound(res, { message = "Resource not found", meta = null } = {}) {
    return this.error(res, { statusCode: 404, message, meta });
  }

  static conflict(res, { message = "Resource already exists", meta = null } = {}) {
    return this.error(res, { statusCode: 409, message, meta });
  }

  static tooManyRequests(res, { message = "Too many requests", meta = null } = {}) {
    return this.error(res, { statusCode: 429, message, meta });
  }

  static serverError(res, { message = "Internal server error", meta = null } = {}) {
    return this.error(res, { statusCode: 500, message, meta });
  }

  // Optional: 204
  static noContent(res) {
    return res.status(204).send();
  }
}

module.exports = ApiResponse;
