/**
 * SMS Service for sms.ir API
 * Supports both Production and Sandbox environments
 */

class SMSService {
  constructor() {
    this.apiKey = process.env.SMS_API_KEY;
    this.baseUrl = "https://api.sms.ir/v1";
    this.environment = process.env.SMS_ENVIRONMENT || "sandbox"; // 'production' or 'sandbox'

    if (!this.apiKey) {
      console.warn("⚠️  SMS_API_KEY is not set in environment variables");
    }

    console.log(
      `📱 SMS Service initialized in ${this.environment.toUpperCase()} mode`,
    );
  }

  /**
   * Send verification code using template
   * @param {string} mobile - Mobile number (e.g., "919xxxx904")
   * @param {number} templateId - Template ID from sms.ir panel
   * @param {Array<{name: string, value: string}>} parameters - Template parameters
   * @returns {Promise<{messageId: number, cost: number}>}
   */
  async sendVerify(mobile, templateId, parameters) {
    try {
      if (!this.apiKey) {
        throw new Error("SMS API Key is not configured");
      }

      const url = `${this.baseUrl}/send/verify`;

      const payload = {
        mobile,
        templateId,
        parameters,
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-api-key": this.apiKey,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      // Handle different HTTP status codes
      if (response.status === 200) {
        console.log(
          `✅ SMS sent successfully (${this.environment}):`,
          result.data,
        );
        return result.data;
      } else if (response.status === 400) {
        throw new Error(`SMS API Error: ${result.message || "Bad Request"}`);
      } else if (response.status === 401) {
        throw new Error("SMS API Authentication failed. Check your API key.");
      } else if (response.status === 429) {
        throw new Error("SMS API Rate limit exceeded. Too many requests.");
      } else if (response.status === 500) {
        throw new Error("SMS API Server error. Please try again later.");
      } else {
        throw new Error(`SMS API Error: ${result.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("❌ SMS Service Error:", error.message);
      throw error;
    }
  }

  /**
   * Send verification code with single parameter (common use case)
   * @param {string} mobile - Mobile number
   * @param {number} templateId - Template ID
   * @param {string} code - Verification code
   * @returns {Promise<{messageId: number, cost: number}>}
   */
  async sendVerificationCode(mobile, templateId, code) {
    return this.sendVerify(mobile, templateId, [{ name: "Code", value: code }]);
  }

  /**
   * Check if SMS service is properly configured
   * @returns {boolean}
   */
  isConfigured() {
    return !!this.apiKey;
  }

  /**
   * Get current environment
   * @returns {string}
   */
  getEnvironment() {
    return this.environment;
  }

  /**
   * Check if running in sandbox mode
   * @returns {boolean}
   */
  isSandbox() {
    return this.environment === "sandbox";
  }
}

// Export singleton instance
module.exports = new SMSService();
