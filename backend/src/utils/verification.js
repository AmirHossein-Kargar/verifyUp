const crypto = require("crypto");
const { sendVerificationCode, formatMobileNumber } = require("./sms.helper");

/**
 * Generate a 6-digit OTP
 */
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generate a random token for email verification
 */
function generateEmailToken() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Send OTP via SMS using sms.ir service
 */
async function sendOtp(phone, otp) {
  // In development mode, always log the OTP for easy testing
  if (process.env.NODE_ENV === "development") {
    console.log("\n" + "=".repeat(60));
    console.log(`📱 OTP CODE FOR ${phone}: ${otp}`);
    console.log("=".repeat(60) + "\n");
  }

  try {
    // Format phone number for sms.ir
    const formattedPhone = formatMobileNumber(phone);

    // Get template ID from environment or use default sandbox template
    const templateId = process.env.SMS_TEMPLATE_ID
      ? parseInt(process.env.SMS_TEMPLATE_ID)
      : 123456; // Default sandbox template

    // Send SMS using sms.ir
    const result = await sendVerificationCode(formattedPhone, otp, templateId);

    console.log(`✅ OTP sent to ${phone} (MessageID: ${result.messageId})`);

    return true;
  } catch (error) {
    console.error(`❌ Failed to send OTP to ${phone}:`, error.message);

    // In development, still return true since we logged the OTP
    if (process.env.NODE_ENV === "development") {
      console.log(
        `⚠️  SMS service failed, but OTP is logged above for testing`,
      );
      return true; // Don't fail registration in development
    }

    // In production, you might want to handle this differently
    return false;
  }
}

/**
 * Send verification email (mock implementation)
 * در محیط واقعی باید از سرویس Email استفاده شود
 */
async function sendVerificationEmail(email, token) {
  const verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/verify-email?token=${token}`;

  if (process.env.NODE_ENV !== "production") {
    console.log(`📧 Email verification for ${email}:`);
    console.log(`   URL: ${verificationUrl}`);
  }

  // TODO: Integrate with Email service (e.g., SendGrid, Mailgun, NodeMailer)
  // Example:
  // await emailService.send({
  //   to: email,
  //   subject: "تأیید ایمیل - VerifyUp",
  //   html: `<p>برای تأیید ایمیل خود روی لینک زیر کلیک کنید:</p>
  //          <a href="${verificationUrl}">تأیید ایمیل</a>`,
  // });

  return true;
}

module.exports = {
  generateOtp,
  generateEmailToken,
  sendOtp,
  sendVerificationEmail,
};
