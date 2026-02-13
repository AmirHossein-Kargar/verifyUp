/**
 * SMS Helper Functions
 * Common SMS operations and utilities
 */

const smsService = require("../services/sms.service");

/**
 * Generate a random verification code
 * @param {number} length - Length of the code (default: 6)
 * @returns {string}
 */
const generateVerificationCode = (length = 6) => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
};

/**
 * Send verification code to mobile number
 * @param {string} mobile - Mobile number (format: 919xxxx904)
 * @param {string} code - Verification code
 * @param {number} templateId - Template ID from sms.ir panel
 * @returns {Promise<{messageId: number, cost: number}>}
 */
const sendVerificationCode = async (mobile, code, templateId) => {
  if (!smsService.isConfigured()) {
    console.warn("⚠️  SMS service is not configured. Skipping SMS send.");
    // In development, you might want to just log the code
    if (process.env.NODE_ENV === "development") {
      console.log(`📱 [DEV MODE] Verification code for ${mobile}: ${code}`);
      return { messageId: 0, cost: 0 };
    }
    throw new Error("SMS service is not configured");
  }

  return await smsService.sendVerificationCode(mobile, templateId, code);
};

/**
 * Send custom SMS with multiple parameters
 * @param {string} mobile - Mobile number
 * @param {number} templateId - Template ID
 * @param {Object} params - Key-value pairs for template parameters
 * @returns {Promise<{messageId: number, cost: number}>}
 */
const sendCustomSMS = async (mobile, templateId, params) => {
  if (!smsService.isConfigured()) {
    console.warn("⚠️  SMS service is not configured. Skipping SMS send.");
    if (process.env.NODE_ENV === "development") {
      console.log(`📱 [DEV MODE] SMS to ${mobile}:`, params);
      return { messageId: 0, cost: 0 };
    }
    throw new Error("SMS service is not configured");
  }

  const parameters = Object.entries(params).map(([name, value]) => ({
    name,
    value: String(value),
  }));

  return await smsService.sendVerify(mobile, templateId, parameters);
};

/**
 * Format mobile number for sms.ir (remove leading zero if exists)
 * @param {string} mobile - Mobile number
 * @returns {string}
 */
const formatMobileNumber = (mobile) => {
  // Remove any spaces or dashes
  mobile = mobile.replace(/[\s-]/g, "");

  // If starts with 0, remove it (Iranian format)
  if (mobile.startsWith("0")) {
    mobile = "98" + mobile.substring(1);
  }

  // If doesn't start with country code, add it
  if (!mobile.startsWith("98")) {
    mobile = "98" + mobile;
  }

  return mobile;
};

module.exports = {
  generateVerificationCode,
  sendVerificationCode,
  sendCustomSMS,
  formatMobileNumber,
};
