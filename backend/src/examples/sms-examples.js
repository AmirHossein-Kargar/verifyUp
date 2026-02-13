/**
 * SMS Usage Examples
 * Different scenarios for using SMS.ir service
 */

const {
  sendVerificationCode,
  sendCustomSMS,
  generateVerificationCode,
  formatMobileNumber,
} = require("../utils/sms.helper");
const smsService = require("../services/sms.service");

/**
 * Example 1: Send simple verification code
 */
async function example1_SimpleVerification() {
  console.log("📱 Example 1: Simple Verification Code\n");

  const mobile = "09123456789";
  const code = generateVerificationCode(6);
  const templateId = 123456; // Sandbox default template

  try {
    const result = await sendVerificationCode(mobile, code, templateId);
    console.log("✅ Success:", result);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

/**
 * Example 2: Send order confirmation
 */
async function example2_OrderConfirmation() {
  console.log("📱 Example 2: Order Confirmation\n");

  const mobile = "09123456789";
  const templateId = 100001; // Your custom template ID

  try {
    const result = await sendCustomSMS(mobile, templateId, {
      Name: "علی احمدی",
      OrderNumber: "12345",
      Amount: "250000",
    });
    console.log("✅ Success:", result);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

/**
 * Example 3: Send password reset code
 */
async function example3_PasswordReset() {
  console.log("📱 Example 3: Password Reset\n");

  const mobile = "09123456789";
  const resetCode = generateVerificationCode(6);
  const templateId = 100002; // Your password reset template

  try {
    const result = await sendCustomSMS(mobile, templateId, {
      Code: resetCode,
      ValidMinutes: "10",
    });
    console.log("✅ Success:", result);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

/**
 * Example 4: Send welcome message
 */
async function example4_WelcomeMessage() {
  console.log("📱 Example 4: Welcome Message\n");

  const mobile = "09123456789";
  const templateId = 100003; // Your welcome template

  try {
    const result = await sendCustomSMS(mobile, templateId, {
      Name: "کاربر عزیز",
      Website: "example.com",
    });
    console.log("✅ Success:", result);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

/**
 * Example 5: Batch send to multiple users
 */
async function example5_BatchSend() {
  console.log("📱 Example 5: Batch Send\n");

  const users = [
    { mobile: "09123456789", code: "123456" },
    { mobile: "09987654321", code: "654321" },
    { mobile: "09111111111", code: "111111" },
  ];

  const templateId = 123456;
  const results = [];

  for (const user of users) {
    try {
      const result = await sendVerificationCode(
        user.mobile,
        user.code,
        templateId,
      );
      results.push({ mobile: user.mobile, success: true, result });
      console.log(`✅ Sent to ${user.mobile}`);
    } catch (error) {
      results.push({
        mobile: user.mobile,
        success: false,
        error: error.message,
      });
      console.error(`❌ Failed for ${user.mobile}: ${error.message}`);
    }

    // Add delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("\n📊 Summary:", results);
}

/**
 * Example 6: Using direct service with custom parameters
 */
async function example6_DirectService() {
  console.log("📱 Example 6: Direct Service Usage\n");

  const mobile = formatMobileNumber("09123456789");
  const templateId = 123456;

  try {
    const result = await smsService.sendVerify(mobile, templateId, [
      { name: "Code", value: "123456" },
      { name: "ExpireTime", value: "10 دقیقه" },
    ]);
    console.log("✅ Success:", result);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

/**
 * Example 7: Error handling and retry logic
 */
async function example7_WithRetry() {
  console.log("📱 Example 7: With Retry Logic\n");

  const mobile = "09123456789";
  const code = generateVerificationCode(6);
  const templateId = 123456;
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries}...`);
      const result = await sendVerificationCode(mobile, code, templateId);
      console.log("✅ Success:", result);
      return result;
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error.message);

      if (attempt === maxRetries) {
        console.error("All retries failed");
        throw error;
      }

      // Wait before retry (exponential backoff)
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Waiting ${delay}ms before retry...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

/**
 * Example 8: Check service status before sending
 */
async function example8_CheckStatus() {
  console.log("📱 Example 8: Check Service Status\n");

  console.log("Service Status:");
  console.log(`  Configured: ${smsService.isConfigured()}`);
  console.log(`  Environment: ${smsService.getEnvironment()}`);
  console.log(`  Is Sandbox: ${smsService.isSandbox()}`);

  if (!smsService.isConfigured()) {
    console.log("\n⚠️  SMS service is not configured!");
    return;
  }

  if (smsService.isSandbox()) {
    console.log("\n⚠️  Running in SANDBOX mode - no real SMS will be sent");
  }

  // Proceed with sending
  const mobile = "09123456789";
  const code = generateVerificationCode(6);

  try {
    const result = await sendVerificationCode(mobile, code, 123456);
    console.log("\n✅ SMS sent:", result);
  } catch (error) {
    console.error("\n❌ Error:", error.message);
  }
}

// Export examples
module.exports = {
  example1_SimpleVerification,
  example2_OrderConfirmation,
  example3_PasswordReset,
  example4_WelcomeMessage,
  example5_BatchSend,
  example6_DirectService,
  example7_WithRetry,
  example8_CheckStatus,
};

// Run examples if called directly
if (require.main === module) {
  require("dotenv").config();

  const exampleNumber = process.argv[2] || "1";
  const examples = {
    1: example1_SimpleVerification,
    2: example2_OrderConfirmation,
    3: example3_PasswordReset,
    4: example4_WelcomeMessage,
    5: example5_BatchSend,
    6: example6_DirectService,
    7: example7_WithRetry,
    8: example8_CheckStatus,
  };

  const example = examples[exampleNumber];
  if (example) {
    example().catch(console.error);
  } else {
    console.log("Usage: node sms-examples.js [1-8]");
    console.log("Available examples:");
    Object.keys(examples).forEach((key) => {
      console.log(`  ${key}: ${examples[key].name}`);
    });
  }
}
