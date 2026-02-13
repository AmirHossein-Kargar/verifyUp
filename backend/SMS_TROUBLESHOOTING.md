# SMS.ir Troubleshooting Guide

Common issues and their solutions when working with SMS.ir integration.

## 🔍 Quick Diagnostics

Run this command first to check your setup:

```bash
npm run test:sms
```

## ❌ Common Errors

### 1. "SMS API Key is not configured"

**Symptoms:**

- Warning message in console
- SMS not sending
- Test script shows "Configured: ❌"

**Causes:**

- `SMS_API_KEY` not set in `.env`
- `.env` file not loaded
- Typo in environment variable name

**Solutions:**

```bash
# Check if .env exists
ls -la .env

# Verify SMS_API_KEY is set
cat .env | grep SMS_API_KEY

# Add if missing
echo "SMS_API_KEY=your_key_here" >> .env

# Restart application
npm run dev
```

---

### 2. "Authentication failed"

**Symptoms:**

- HTTP 401 error
- "Check your API key" message
- SMS not sending

**Causes:**

- Invalid API key
- Expired API key
- Wrong key type (Sandbox key in Production mode)
- Extra spaces in `.env` file

**Solutions:**

```bash
# 1. Get new API key from panel
# Visit: https://sms.ir/panel/developers

# 2. Update .env (no spaces!)
SMS_API_KEY=your_new_key_here

# 3. Verify no extra spaces
cat .env | grep SMS_API_KEY | od -c

# 4. Restart application
npm run dev
```

**Verify key type matches environment:**

```env
# For testing
SMS_ENVIRONMENT=sandbox
SMS_API_KEY=sandbox_key_here

# For production
SMS_ENVIRONMENT=production
SMS_API_KEY=production_key_here
```

---

### 3. "Rate limit exceeded"

**Symptoms:**

- HTTP 429 error
- "Too many requests" message
- Some SMS send, others fail

**Causes:**

- Sending too many SMS too quickly
- Exceeded sms.ir rate limits
- No delay between batch sends

**Solutions:**

**Add delays in batch operations:**

```javascript
for (const user of users) {
  await sendVerificationCode(user.mobile, user.code, templateId);

  // Add 1 second delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
```

**Implement retry with backoff:**

```javascript
async function sendWithRetry(mobile, code, templateId, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await sendVerificationCode(mobile, code, templateId);
    } catch (error) {
      if (error.message.includes("Rate limit") && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}
```

---

### 4. "Bad Request" (HTTP 400)

**Symptoms:**

- HTTP 400 error
- SMS not sending
- "Invalid parameters" message

**Causes:**

- Invalid phone number format
- Wrong template ID
- Missing template parameters
- Parameter name mismatch

**Solutions:**

**Check phone number format:**

```javascript
const { formatMobileNumber } = require("./utils/sms.helper");

// Wrong
await sendVerificationCode("0912345678", code, templateId); // Too short

// Correct
await sendVerificationCode("09123456789", code, templateId);
// or
await sendVerificationCode(formatMobileNumber("09123456789"), code, templateId);
```

**Verify template ID:**

```bash
# Sandbox default
SMS_TEMPLATE_ID=123456

# Production - check your panel
SMS_TEMPLATE_ID=your_actual_template_id
```

**Check parameter names match template:**

```javascript
// If template is: کد تایید شما: #Code#
// Parameter name must be "Code" (case-sensitive)

// Wrong
await sendCustomSMS(mobile, templateId, { code: "123456" }); // lowercase

// Correct
await sendCustomSMS(mobile, templateId, { Code: "123456" }); // matches template
```

---

### 5. "Server Error" (HTTP 500)

**Symptoms:**

- HTTP 500 error
- Intermittent failures
- "Try again later" message

**Causes:**

- sms.ir server issues
- Network problems
- Temporary outage

**Solutions:**

**Implement retry logic:**

```javascript
const { sendVerificationCode } = require("./utils/sms.helper");

async function sendWithRetry(mobile, code, templateId) {
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await sendVerificationCode(mobile, code, templateId);
    } catch (error) {
      if (attempt === maxRetries) throw error;

      console.log(`Attempt ${attempt} failed, retrying...`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}
```

**Check sms.ir status:**

- Visit: https://sms.ir
- Check for maintenance notices
- Contact sms.ir support if persistent

---

### 6. SMS Not Received (Production)

**Symptoms:**

- No error in logs
- "SMS sent successfully" message
- But SMS not received on phone

**Causes:**

- Insufficient account credit
- Phone number blocked
- Network operator issues
- Wrong phone number

**Solutions:**

**Check account credit:**

1. Login to https://sms.ir/panel
2. Check balance in dashboard
3. Add credit if needed

**Verify phone number:**

```javascript
const { formatMobileNumber } = require("./utils/sms.helper");

const formatted = formatMobileNumber("09123456789");
console.log("Sending to:", formatted); // Should be: 989123456789
```

**Check delivery report:**

1. Login to sms.ir panel
2. Go to "گزارش ارسال"
3. Check message status
4. Look for delivery errors

---

### 7. Environment Not Loading

**Symptoms:**

- `process.env.SMS_API_KEY` is undefined
- Environment variables not working
- Works in test but not in app

**Causes:**

- `dotenv` not configured
- `.env` file in wrong location
- Not calling `dotenv.config()`

**Solutions:**

**Check dotenv is loaded:**

```javascript
// In your main file (server.js or app.js)
require("dotenv").config();

// Verify it's loaded
console.log("SMS_API_KEY loaded:", !!process.env.SMS_API_KEY);
```

**Check .env location:**

```bash
# Should be in backend root
backend/
├── .env          ← Here
├── src/
└── package.json
```

**Load from custom path:**

```javascript
require("dotenv").config({ path: "./path/to/.env" });
```

---

### 8. Works in Sandbox but Not Production

**Symptoms:**

- Sandbox works perfectly
- Production gives errors
- Different behavior between environments

**Causes:**

- Using sandbox template ID in production
- Wrong API key type
- Insufficient credit
- Template not approved

**Solutions:**

**Create production template:**

1. Go to https://sms.ir/panel
2. Navigate to "ارسال سریع" → "قالب‌های من"
3. Create and get approval for template
4. Use the approved template ID

**Update environment:**

```env
# Change from
SMS_ENVIRONMENT=sandbox
SMS_TEMPLATE_ID=123456

# To
SMS_ENVIRONMENT=production
SMS_TEMPLATE_ID=your_approved_template_id
```

**Verify API key type:**

- Sandbox key won't work in production
- Get production key from panel
- Update `SMS_API_KEY` in `.env`

---

## 🔧 Debugging Tools

### Enable Detailed Logging

```javascript
// In sms.service.js, add more logging
console.log("Request URL:", url);
console.log("Request Headers:", headers);
console.log("Request Body:", JSON.stringify(payload, null, 2));
console.log("Response Status:", response.status);
console.log("Response Body:", JSON.stringify(result, null, 2));
```

### Test Individual Components

```bash
# Test phone formatting
node -e "const {formatMobileNumber} = require('./src/utils/sms.helper'); console.log(formatMobileNumber('09123456789'));"

# Test code generation
node -e "const {generateVerificationCode} = require('./src/utils/sms.helper'); console.log(generateVerificationCode(6));"

# Test service status
node -e "const sms = require('./src/services/sms.service'); console.log('Configured:', sms.isConfigured(), 'Env:', sms.getEnvironment());"
```

### Check Network Connectivity

```bash
# Test connection to sms.ir API
curl -I https://api.sms.ir/v1/send/verify

# Should return HTTP 401 (expected without auth)
```

---

## 📊 Monitoring

### Log Analysis

**Look for these patterns:**

**Success:**

```
✅ SMS sent successfully (sandbox): { messageId: 89545112, cost: 1.0 }
```

**Configuration issue:**

```
⚠️  SMS_API_KEY is not set in environment variables
```

**API error:**

```
❌ SMS Service Error: SMS API Authentication failed
```

### Set Up Alerts

```javascript
// In your error handler
if (error.message.includes("SMS")) {
  // Send alert to monitoring system
  console.error("SMS ERROR:", {
    message: error.message,
    timestamp: new Date(),
    environment: process.env.SMS_ENVIRONMENT,
  });
}
```

---

## 🆘 Getting Help

### Before Contacting Support

1. Run diagnostics: `npm run test:sms`
2. Check this troubleshooting guide
3. Review error logs
4. Test with examples: `npm run examples:sms 8`
5. Verify environment variables

### Information to Provide

When asking for help, include:

- Error message (full text)
- Environment (sandbox/production)
- Steps to reproduce
- Relevant code snippet
- Output of `npm run test:sms`

### Support Resources

- **sms.ir Support:** https://sms.ir/support
- **API Documentation:** https://sms.ir/api
- **Panel:** https://sms.ir/panel
- **Project Documentation:** [SMS_INTEGRATION.md](./SMS_INTEGRATION.md)

---

## ✅ Prevention Checklist

Avoid issues by following these practices:

- [ ] Always use `formatMobileNumber()` for phone numbers
- [ ] Add delays between batch SMS sends
- [ ] Implement retry logic for critical SMS
- [ ] Monitor account credit regularly
- [ ] Test in Sandbox before Production
- [ ] Keep API keys secure
- [ ] Log SMS operations for debugging
- [ ] Set up monitoring and alerts
- [ ] Document template IDs and parameters
- [ ] Have fallback plan for SMS failures

---

**Still having issues?** Check the [complete documentation](./SMS_INTEGRATION.md) or run the examples to see working code.
