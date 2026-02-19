// ===============================
// * API Client Configuration
// ===============================

// * Base URL for all API requests
// * Uses environment variable in production
// * Falls back to localhost in development
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// * Base URL for the API server (no /api suffix) – used for profile images etc.
const API_SERVER_BASE = API_BASE_URL.replace(/\/api\/?$/, "") || "http://localhost:4000";

/** Build profile image URL (same-origin proxy when token present). Delegates to shared logic. */
function buildProfileImageUrl(path, token) {
  if (!path || typeof path !== "string") return null;
  const trimmed = path.trim();
  if (!trimmed) return null;
  let pathPart = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  const match = pathPart.match(/\/api\/users\/profile-image\/([a-f0-9]{24})$/i);
  if (match && token && typeof token === "string") {
    return `/api/user/profile-image/${match[1]}?token=${encodeURIComponent(token)}`;
  }
  const url = `${API_SERVER_BASE}${pathPart}`;
  if (token && typeof token === "string") return `${url}?token=${encodeURIComponent(token)}`;
  return url;
}

// HTTP methods considered safe from a CSRF perspective
const SAFE_METHODS = ["GET", "HEAD", "OPTIONS", "TRACE"];

// ===============================
// * ApiClient
// * Centralized wrapper around fetch
// * Handles base URL, cookies, CSRF, and errors
// ===============================
class ApiClient {
  constructor() {
    // * Store API base URL
    this.baseURL = API_BASE_URL;
    this.csrfToken = null;
    this.csrfLoading = null;
  }

  /**
   * Clear cached CSRF token (e.g. after logout so next login gets a fresh token).
   */
  clearCsrfToken() {
    this.csrfToken = null;
    this.csrfLoading = null;
  }

  /**
   * Lazily fetch CSRF token from backend and cache it.
   * Runs only in the browser; on the server we skip CSRF headers.
   */
  async ensureCsrfToken() {
    if (typeof window === "undefined") {
      return;
    }

    if (this.csrfToken) {
      return;
    }

    if (this.csrfLoading) {
      await this.csrfLoading;
      return;
    }

    this.csrfLoading = (async () => {
      try {
        const res = await fetch(`${this.baseURL}/auth/csrf`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        // Backend returns { success, message, data: { token } }
        // Keep fallback for any older shape that may return { token } directly.
        const token = data?.data?.token ?? data?.token;
        if (token) this.csrfToken = token;
      } catch {
        // Fail silently; requests will still be sent but may be rejected by server
      } finally {
        this.csrfLoading = null;
      }
    })();

    await this.csrfLoading;
  }

  // ===============================
  // * Generic request handler
  // * endpoint: API route (e.g. /auth/login)
  // * options: fetch configuration
  // ===============================
  async request(endpoint, options = {}) {
    // * Build full request URL
    const url = `${this.baseURL}${endpoint}`;

    // * Default fetch configuration
    const isFormData = options.body instanceof FormData;

    const method = (options.method || "GET").toUpperCase();

    // For state-changing requests, ensure CSRF token and attach header
    if (!SAFE_METHODS.includes(method)) {
      await this.ensureCsrfToken();
    }

    const baseHeaders = isFormData
      ? options.headers || {}
      : {
          // * Send and receive JSON
          "Content-Type": "application/json",
          ...options.headers,
        };

    const headersWithCsrf =
      !SAFE_METHODS.includes(method) && this.csrfToken
        ? {
            ...baseHeaders,
            "X-CSRF-Token": this.csrfToken,
          }
        : baseHeaders;

    const config = {
      ...options,
      headers: headersWithCsrf,
      // * Required for HttpOnly cookie-based auth
      credentials: "include",
    };

    if (process.env.NODE_ENV !== "production") {
      console.debug("[API]", method, endpoint, "csrf:", !!this.csrfToken);
    }

    try {
      // * Send request to API
      const response = await fetch(url, config);

      // * Parse JSON response
      const data = await response.json();

      if (process.env.NODE_ENV !== "production" && !response.ok && !(endpoint === "/auth/me" && response.status === 401)) {
        console.warn("[API]", endpoint, response.status, data?.message);
      }

      // * Handle non-success responses from backend
      if (!response.ok) {
        const apiError = {
          status: response.status,
          message: data?.message || "خطایی رخ داده است",
          errors: data?.errors || null,
        };

        // * Log details in development to help debugging
        if (process.env.NODE_ENV !== "production") {
          // Don't spam console with expected 401 on /auth/me when user is not logged in
          if (endpoint === "/auth/me" && response.status === 401) {
            console.info("Auth check: user is not authenticated yet.");
          } else {
            console.warn("API error:", {
              endpoint,
              status: apiError.status,
              message: apiError.message,
              errors: apiError.errors,
            });
          }
        }

        throw apiError;
      }

      // * Return successful response data
      return data;
    } catch (error) {
      // * Re-throw known API errors
      if (error.status) {
        throw error;
      }

      // * Network or unexpected error
      if (process.env.NODE_ENV !== "production") {
        console.warn("Network / unexpected API error:", {
          endpoint,
          error,
        });
      }

      throw {
        status: 500,
        message: "خطا در برقراری ارتباط با سرور",
        errors: null,
      };
    }
  }

  // ===============================
  // * Authentication Endpoints
  // ===============================

  // * Register a new user
  async register(data) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // * Verify phone with OTP
  async verifyOtp(data) {
    return this.request("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // * Verify email with token
  async verifyEmail(data) {
    return this.request("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // * Resend OTP to phone
  async resendOtp(data) {
    return this.request("/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // * Login user with credentials
  async login(data) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // * Logout current user
  // * Clears authentication cookies
  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    });
  }

  // * Get current authenticated user
  async getMe() {
    return this.request("/auth/me");
  }

  /** Profile image URL – delegates to module-level function so it is never stripped. */
  getProfileImageUrl(path, token) {
    return buildProfileImageUrl(path, token);
  }

  // * Refresh access token using refresh token
  async refreshToken() {
    return this.request("/auth/refresh", {
      method: "POST",
    });
  }

  // ===============================
  // * Order Endpoints
  // ===============================

  // * Create a new order for the authenticated user
  async createOrder(data) {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // * Create an order after successful payment
  // * Admin will manage order status directly
  async createPaidOrder(data) {
    return this.request("/orders/complete", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // * Get all orders for the current authenticated user
  async getMyOrders() {
    return this.request("/orders/me");
  }

  // Document upload removed - admin manages order status directly

  // ===============================
  // * Admin Endpoints
  // * All of these require admin role on backend
  // ===============================

  async getAdminStats() {
    return this.request("/admin/stats");
  }

  async getAdminOrders(params = {}) {
    const searchParams = new URLSearchParams(params).toString();
    const qs = searchParams ? `?${searchParams}` : "";
    return this.request(`/admin/orders${qs}`);
  }

  async updateOrderStatus(orderId, data) {
    return this.request(`/admin/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }
}

// * Export a single shared API client instance
const api = new ApiClient();

/**
 * Upload profile image. Use this function directly (do not use api.uploadProfileImage)
 * to avoid Turbopack/bundler stripping. Returns { success, data: { profileImage } }.
 */
async function uploadProfileImage(file) {
  if (!file || !(file instanceof File)) {
    throw { status: 400, message: "No image file provided" };
  }
  const formData = new FormData();
  formData.append("image", file);
  return api.request("/users/profile-image", { method: "PATCH", body: formData });
}

api.uploadProfileImage = uploadProfileImage;

/** Exported alias so callers can use getProfileImageUrl() directly and avoid api.getProfileImageUrl. */
const getProfileImageUrl = buildProfileImageUrl;

export { api, uploadProfileImage, getProfileImageUrl };
