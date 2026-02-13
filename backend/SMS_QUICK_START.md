# راهنمای سریع شروع کار با SMS.ir

## مراحل راه‌اندازی

### 1️⃣ دریافت API Key

**برای محیط تست (Sandbox):**

```
1. به پنل sms.ir بروید: https://sms.ir/panel/developers
2. از بخش "لیست کلیدهای API" کلیک کنید
3. "ایجاد کلید جدید" را انتخاب کنید
4. نوع کلید را "Sandbox" انتخاب کنید
5. کلید ایجاد شده را کپی کنید
```

**برای محیط واقعی (Production):**

```
1. همان مراحل بالا اما نوع کلید را "Production" انتخاب کنید
2. اطمینان حاصل کنید که حساب شما اعتبار کافی دارد
```

### 2️⃣ تنظیم متغیرهای محیطی

فایل `.env` را ویرایش کنید:

```env
# برای تست
SMS_API_KEY=your_sandbox_api_key_here
SMS_ENVIRONMENT=sandbox
SMS_TEMPLATE_ID=123456

# برای محیط واقعی
SMS_API_KEY=your_production_api_key_here
SMS_ENVIRONMENT=production
SMS_TEMPLATE_ID=your_template_id
```

### 3️⃣ ایجاد قالب پیامک (فقط برای Production)

در محیط Sandbox، قالب پیش‌فرض با شناسه `123456` وجود دارد.

برای Production:

```
1. به پنل sms.ir بروید
2. بخش "ارسال سریع" → "قالب‌های من"
3. "ایجاد قالب جدید"
4. متن قالب: کد تایید شما: #Code#
5. شناسه قالب را در SMS_TEMPLATE_ID قرار دهید
```

### 4️⃣ تست سرویس

```bash
# تست با شماره پیش‌فرض
node test-sms.js

# تست با شماره دلخواه
node test-sms.js 09123456789
```

## استفاده در کد

سرویس SMS به صورت خودکار در فرآیند ثبت‌نام و تایید شماره موبایل استفاده می‌شود:

```javascript
// در auth.controller.js
// هنگام ثبت‌نام، OTP به صورت خودکار ارسال می‌شود
await sendOtp(data.phone, otp);

// هنگام درخواست مجدد OTP
await sendOtp(data.phone, otp);
```

## بررسی وضعیت

```javascript
const smsService = require("./src/services/sms.service");

console.log("Environment:", smsService.getEnvironment());
console.log("Is Sandbox:", smsService.isSandbox());
console.log("Is Configured:", smsService.isConfigured());
```

## نکات مهم

✅ در محیط Sandbox پیامک واقعی ارسال نمی‌شود
✅ در محیط Sandbox اعتبار کسر نمی‌شود
✅ قالب پیش‌فرض Sandbox: شناسه `123456`
✅ فرمت شماره موبایل به صورت خودکار تبدیل می‌شود

⚠️ قبل از تغییر به Production، حتماً تست کنید
⚠️ کلید API را در git commit نکنید
⚠️ در Production اعتبار کافی داشته باشید

## خطاهای رایج

### خطا: "SMS API Key is not configured"

```
راه حل: SMS_API_KEY را در فایل .env تنظیم کنید
```

### خطا: "Authentication failed"

```
راه حل: کلید API را بررسی کنید، ممکن است نامعتبر باشد
```

### خطا: "Rate limit exceeded"

```
راه حل: تعداد درخواست‌ها زیاد است، کمی صبر کنید
```

## لینک‌های مفید

- پنل sms.ir: https://sms.ir/panel
- مستندات کامل: [SMS_INTEGRATION.md](./SMS_INTEGRATION.md)
- بخش برنامه‌نویسان: https://sms.ir/panel/developers
