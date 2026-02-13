# Development Mode Features

## 🔧 Development-Only Features

When `NODE_ENV=development`, the application includes special features to make testing easier.

### 📱 OTP Code in API Response

In development mode, OTP codes are included in the API response so you can easily test without checking server logs.

#### Register Response

```json
{
  "success": true,
  "message": "ثبت‌نام با موفقیت انجام شد. لطفاً ایمیل یا شماره موبایل خود را تأیید کنید.",
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "phone": "09123456789",
    "requiresVerification": true,
    "otp": "123456", // ⚠️ Only in development!
    "emailToken": "abc123..." // ⚠️ Only in development!
  }
}
```

#### Resend OTP Response

```json
{
  "success": true,
  "message": "کد تأیید مجدداً ارسال شد",
  "otp": "654321" // ⚠️ Only in development!
}
```

### 📧 Email Verification Token

Email verification tokens are also logged to console in development:

```
📧 Email verification for user@example.com:
   URL: http://localhost:3000/verify-email?token=abc123...
```

### 📱 SMS Logging

SMS codes are logged to console with clear formatting:

```
============================================================
📱 OTP CODE FOR 09123456789: 123456
============================================================
```

### ⚠️ Security Warning

**IMPORTANT:** These features are ONLY active when `NODE_ENV=development`.

In production (`NODE_ENV=production`):

- ✅ OTP codes are NOT included in responses
- ✅ Tokens are NOT logged to console
- ✅ Only proper SMS/Email delivery occurs

## 🧪 Testing Workflow

### 1. Register a New User

**Request:**

```bash
POST http://localhost:4000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "09123456789",
  "password": "password123"
}
```

**Response (Development):**

```json
{
  "success": true,
  "message": "ثبت‌نام با موفقیت انجام شد...",
  "data": {
    "userId": "...",
    "email": "test@example.com",
    "phone": "09123456789",
    "requiresVerification": true,
    "otp": "123456", // 👈 Use this code!
    "emailToken": "..."
  }
}
```

### 2. Verify Phone with OTP

**Request:**

```bash
POST http://localhost:4000/api/auth/verify-otp
Content-Type: application/json

{
  "phone": "09123456789",
  "otp": "123456"  // 👈 From register response
}
```

### 3. Resend OTP (if needed)

**Request:**

```bash
POST http://localhost:4000/api/auth/resend-otp
Content-Type: application/json

{
  "phone": "09123456789"
}
```

**Response (Development):**

```json
{
  "success": true,
  "message": "کد تأیید مجدداً ارسال شد",
  "otp": "654321" // 👈 New code!
}
```

## 🎯 Frontend Integration

### Display OTP in Development

```javascript
// In your frontend code
const handleRegister = async (data) => {
  try {
    const response = await api.register(data);

    // In development, show the OTP to user
    if (response.data.otp) {
      toast.success(`کد تایید: ${response.data.otp}`);
      // Or auto-fill the OTP input
      setOtpValue(response.data.otp);
    }

    // Navigate to verification page
    router.push("/verify-otp");
  } catch (error) {
    toast.error(error.message);
  }
};
```

### Auto-fill OTP

```javascript
// Automatically fill OTP in development
useEffect(() => {
  if (process.env.NODE_ENV === "development" && registrationData?.otp) {
    setOtpInput(registrationData.otp);
  }
}, [registrationData]);
```

## 🔄 Environment Switching

### Development (.env)

```env
NODE_ENV=development
SMS_ENVIRONMENT=sandbox
```

### Production (.env)

```env
NODE_ENV=production
SMS_ENVIRONMENT=production
```

## 📊 Comparison

| Feature           | Development | Production |
| ----------------- | ----------- | ---------- |
| OTP in Response   | ✅ Yes      | ❌ No      |
| Token in Response | ✅ Yes      | ❌ No      |
| Console Logging   | ✅ Verbose  | ⚠️ Minimal |
| SMS Delivery      | 📱 Sandbox  | 📱 Real    |
| Email Delivery    | 📧 Logged   | 📧 Real    |

## 🛡️ Security Notes

1. **Never deploy with `NODE_ENV=development`**
2. **Always use `NODE_ENV=production` in production**
3. **OTP codes should NEVER be in responses in production**
4. **Tokens should NEVER be logged in production**

## 🧪 Testing Checklist

Before deploying to production:

- [ ] Set `NODE_ENV=production`
- [ ] Set `SMS_ENVIRONMENT=production`
- [ ] Verify OTP is NOT in API responses
- [ ] Verify tokens are NOT logged
- [ ] Test real SMS delivery
- [ ] Test real email delivery
- [ ] Check error handling
- [ ] Review security logs

## 📝 Related Documentation

- [SMS Integration Guide](./SMS_INTEGRATION.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Security Guide](./SECURITY.md)

---

**Remember:** Development features are for convenience during testing. Always ensure they're disabled in production!
