# راهنمای یکپارچه‌سازی سرویس SMS.ir

این راهنما نحوه استفاده از سرویس پیامک sms.ir در پروژه را شرح می‌دهد.

## پیکربندی اولیه

### 1. تنظیم متغیرهای محیطی

فایل `.env` خود را ویرایش کنید:

```env
# SMS Configuration
SMS_API_KEY=your_api_key_here
SMS_ENVIRONMENT=sandbox  # یا production
```

### 2. دریافت API Key

- برای محیط **Sandbox** (تست):
  - به پنل sms.ir بروید: https://sms.ir/panel/developers
  - از بخش "لیست کلیدهای API" یک کلید جدید با نوع **Sandbox** ایجاد کنید
  - این کلید برای تست است و پیامک واقعی ارسال نمی‌کند

- برای محیط **Production** (واقعی):
  - یک کلید API با نوع **Production** ایجاد کنید
  - این کلید پیامک واقعی ارسال می‌کند و اعتبار مصرف می‌کند

### 3. ایجاد قالب پیامک

در پنل sms.ir:

1. به بخش "ارسال سریع" بروید
2. یک قالب جدید ایجاد کنید
3. مثال قالب برای کد تایید:
   ```
   کد تایید شما: #Code#
   ```
4. شناسه قالب (Template ID) را یادداشت کنید

**نکته**: در محیط Sandbox، قالب پیش‌فرض با شناسه `123456` وجود دارد.

## نحوه استفاده

### استفاده ساده - ارسال کد تایید

```javascript
const {
  sendVerificationCode,
  generateVerificationCode,
} = require("./utils/sms.helper");

// تولید کد تایید
const code = generateVerificationCode(6); // کد 6 رقمی

// ارسال پیامک
try {
  const result = await sendVerificationCode(
    "09123456789", // شماره موبایل
    code, // کد تایید
    123456, // شناسه قالب
  );

  console.log("پیامک ارسال شد:", result);
  // { messageId: 89545112, cost: 1.0 }
} catch (error) {
  console.error("خطا در ارسال پیامک:", error.message);
}
```

### استفاده پیشرفته - ارسال با پارامترهای سفارشی

```javascript
const { sendCustomSMS } = require("./utils/sms.helper");

try {
  const result = await sendCustomSMS(
    "09123456789",
    100000, // شناسه قالب
    {
      Name: "علی",
      Code: "123456",
      Amount: "50000",
    },
  );

  console.log("پیامک ارسال شد:", result);
} catch (error) {
  console.error("خطا:", error.message);
}
```

### استفاده مستقیم از سرویس

```javascript
const smsService = require("./services/sms.service");

try {
  const result = await smsService.sendVerify(
    "919xxxx904", // فرمت بین‌المللی
    123456,
    [
      { name: "Code", value: "12345" },
      { name: "Name", value: "کاربر" },
    ],
  );

  console.log(result);
} catch (error) {
  console.error(error.message);
}
```

## فرمت شماره موبایل

سرویس از فرمت‌های زیر پشتیبانی می‌کند:

```javascript
const { formatMobileNumber } = require("./utils/sms.helper");

formatMobileNumber("09123456789"); // → 989123456789
formatMobileNumber("9123456789"); // → 989123456789
formatMobileNumber("989123456789"); // → 989123456789
```

## مدیریت خطاها

```javascript
try {
  await sendVerificationCode(mobile, code, templateId);
} catch (error) {
  if (error.message.includes("Authentication failed")) {
    // کلید API نامعتبر است
  } else if (error.message.includes("Rate limit")) {
    // تعداد درخواست‌ها زیاد است
  } else if (error.message.includes("Bad Request")) {
    // پارامترهای ورودی اشتباه است
  } else {
    // خطای دیگر
  }
}
```

## تفاوت محیط Sandbox و Production

| ویژگی        | Sandbox          | Production |
| ------------ | ---------------- | ---------- |
| ارسال واقعی  | ❌ خیر           | ✅ بله     |
| مصرف اعتبار  | ❌ خیر           | ✅ بله     |
| ثبت گزارش    | ❌ خیر           | ✅ بله     |
| قالب پیش‌فرض | ✅ دارد (123456) | ❌ ندارد   |
| مناسب برای   | تست و توسعه      | محیط واقعی |

## مثال کامل - ثبت‌نام کاربر

```javascript
const {
  generateVerificationCode,
  sendVerificationCode,
} = require("./utils/sms.helper");
const User = require("./models/User");

async function registerUser(mobile, name) {
  try {
    // تولید کد تایید
    const verificationCode = generateVerificationCode(6);

    // ذخیره کد در دیتابیس
    const user = await User.create({
      mobile,
      name,
      verificationCode,
      verificationCodeExpiry: Date.now() + 10 * 60 * 1000, // 10 دقیقه
    });

    // ارسال پیامک
    const smsResult = await sendVerificationCode(
      mobile,
      verificationCode,
      123456, // شناسه قالب
    );

    console.log("کد تایید ارسال شد:", smsResult);

    return {
      success: true,
      message: "کد تایید به شماره موبایل شما ارسال شد",
      messageId: smsResult.messageId,
    };
  } catch (error) {
    console.error("خطا در ثبت‌نام:", error);
    throw error;
  }
}
```

## بررسی وضعیت سرویس

```javascript
const smsService = require("./services/sms.service");

// بررسی پیکربندی
if (smsService.isConfigured()) {
  console.log("✅ سرویس SMS پیکربندی شده است");
} else {
  console.log("❌ سرویس SMS پیکربندی نشده است");
}

// بررسی محیط
console.log("محیط فعلی:", smsService.getEnvironment());

// بررسی Sandbox
if (smsService.isSandbox()) {
  console.log("⚠️  در حال اجرا در محیط Sandbox");
}
```

## نکات مهم

1. **امنیت**: هرگز کلید API را در کد commit نکنید
2. **محیط Sandbox**: برای تست و توسعه از Sandbox استفاده کنید
3. **مدیریت خطا**: همیشه خطاهای احتمالی را مدیریت کنید
4. **Rate Limiting**: تعداد درخواست‌ها را کنترل کنید
5. **فرمت شماره**: از تابع `formatMobileNumber` برای فرمت صحیح استفاده کنید

## لینک‌های مفید

- پنل sms.ir: https://sms.ir/panel
- مستندات API: https://sms.ir/api
- بخش برنامه‌نویسان: https://sms.ir/panel/developers
