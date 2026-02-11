// ===============================
// * API Client Configuration
// ===============================

// * Base URL for all API requests
// * Uses environment variable in production
// * Falls back to localhost in development
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// ===============================
// * ApiClient
// * Centralized wrapper around fetch
// * Handles base URL, cookies, and errors
// ===============================
class ApiClient {
  constructor() {
    // * Store API base URL
    this.baseURL = API_BASE_URL;
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
    const config = {
      ...options,
      headers: {
        // * Send and receive JSON
        "Content-Type": "application/json",
        ...options.headers,
      },
      // * Required for HttpOnly cookie-based auth
      credentials: "include",
    };

    try {
      // * Send request to API
      const response = await fetch(url, config);

      // * Parse JSON response
      const data = await response.json();

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

  // * Refresh access token using refresh token
  async refreshToken() {
    return this.request("/auth/refresh", {
      method: "POST",
    });
  }
}

// * Export a single shared API client instance
export const api = new ApiClient();
