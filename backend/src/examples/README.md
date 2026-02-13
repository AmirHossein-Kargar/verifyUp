# SMS Examples

This directory contains practical examples for using the SMS.ir integration.

## Available Examples

Run any example with: `npm run examples:sms [number]`

### Example 1: Simple Verification Code

```bash
npm run examples:sms 1
```

Basic verification code sending - the most common use case.

### Example 2: Order Confirmation

```bash
npm run examples:sms 2
```

Send order confirmation with multiple parameters (order number, amount, etc.).

### Example 3: Password Reset

```bash
npm run examples:sms 3
```

Send password reset code with expiry time.

### Example 4: Welcome Message

```bash
npm run examples:sms 4
```

Send welcome message to new users.

### Example 5: Batch Send

```bash
npm run examples:sms 5
```

Send SMS to multiple users with rate limiting.

### Example 6: Direct Service Usage

```bash
npm run examples:sms 6
```

Use the SMS service directly with custom parameters.

### Example 7: With Retry Logic

```bash
npm run examples:sms 7
```

Implement retry logic with exponential backoff.

### Example 8: Check Service Status

```bash
npm run examples:sms 8
```

Check if SMS service is properly configured before sending.

## Quick Start

1. Configure your `.env` file:

   ```env
   SMS_API_KEY=your_api_key
   SMS_ENVIRONMENT=sandbox
   SMS_TEMPLATE_ID=123456
   ```

2. Run an example:
   ```bash
   npm run examples:sms 1
   ```

## Using in Your Code

Import the helpers:

```javascript
const {
  sendVerificationCode,
  generateVerificationCode,
} = require("../utils/sms.helper");

// Generate and send code
const code = generateVerificationCode(6);
await sendVerificationCode("09123456789", code, 123456);
```

## Documentation

- [Complete Guide (English)](../../SMS_INTEGRATION.md)
- [Complete Guide (Persian)](../../راهنمای-SMS.md)
- [Quick Start](../../SMS_QUICK_START.md)
