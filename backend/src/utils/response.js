/**
 * Standardized API response helpers
 */

class ApiResponse {
  static success(res, { statusCode = 200, message, data = null }) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      errors: null,
    });
  }

  static error(res, { statusCode = 500, message, errors = null }) {
    return res.status(statusCode).json({
      success: false,
      message,
      data: null,
      errors,
    });
  }

  static created(res, { message, data = null }) {
    return this.success(res, { statusCode: 201, message, data });
  }

  static badRequest(res, { message = "Bad request", errors = null }) {
    return this.error(res, { statusCode: 400, message, errors });
  }

  static unauthorized(res, { message = "Unauthorized access" }) {
    return this.error(res, { statusCode: 401, message });
  }

  static forbidden(res, { message = "Forbidden" }) {
    return this.error(res, { statusCode: 403, message });
  }

  static notFound(res, { message = "Resource not found" }) {
    return this.error(res, { statusCode: 404, message });
  }

  static conflict(res, { message = "Resource already exists" }) {
    return this.error(res, { statusCode: 409, message });
  }

  static tooManyRequests(res, { message = "Too many requests" }) {
    return this.error(res, { statusCode: 429, message });
  }

  static serverError(res, { message = "Internal server error" }) {
    return this.error(res, { statusCode: 500, message });
  }
}

module.exports = ApiResponse;
