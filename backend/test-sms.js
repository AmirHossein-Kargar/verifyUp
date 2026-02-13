/**
 * Test script for SMS.ir integration
 * Usage: node test-sms.js
 */

require("dotenv").config();
const {
  sendVerificationCode,
  formatMobileNumber,
} = require("./src/utils/sms.helper");
const smsService = require("./src/services/sms.service");

async function testSMS() {
  console.log("🧪 Testing SMS.ir Integration\n");

  // Check configuration
  console.log("📋 Configuration:");
  console.log(`   Environment: ${smsService.getEnvironment()}`);
  console.log(`   Configured: ${smsService.isConfigured() ? "✅" : "❌"}`);
  console.log(`   Sandbox Mode: ${smsService.isSandbox() ? "✅" : "❌"}\n`);

  if (!smsService.isConfigured()) {
    console.error("❌ SMS service is not configured!");
    console.log("Please set SMS_API_KEY in your .env file\n");
    return;
  }

  // Test phone number formatting
  console.log("📱 Testing phone number formatting:");
  const testNumbers = ["09123456789", "9123456789", "989123456789"];
  testNumbers.forEach((num) => {
    console.log(`   ${num} → ${formatMobileNumber(num)}`);
  });
  console.log("");

  // Test SMS sending
  console.log("📤 Testing SMS send:");
  const testPhone = process.argv[2] || "09123456789";
  const testCode = Math.floor(100000 + Math.random() * 900000).toString();
  const templateId = process.env.SMS_TEMPLATE_ID
    ? parseInt(process.env.SMS_TEMPLATE_ID)
    : 123456;

  console.log(`   Phone: ${testPhone}`);
  console.log(`   Code: ${testCode}`);
  console.log(`   Template ID: ${templateId}\n`);

  try {
    const result = await sendVerificationCode(
      formatMobileNumber(testPhone),
      testCode,
      templateId,
    );

    console.log("✅ SMS sent successfully!");
    console.log(`   Message ID: ${result.messageId}`);
    console.log(`   Cost: ${result.cost}\n`);

    if (smsService.isSandbox()) {
      console.log("⚠️  Note: This was sent in SANDBOX mode (no real SMS)");
    }
  } catch (error) {
    console.error("❌ Failed to send SMS:");
    console.error(`   ${error.message}\n`);
  }
}

// Run test
testSMS().catch(console.error);
