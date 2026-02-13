# راهنمای کامل سرویس پیامک SMS.ir

## 📋 فهرست مطالب

1. [معرفی](#معرفی)
2. [نصب و راه‌اندازی](#نصب-و-راه‌اندازی)
3. [پیکربندی](#پیکربندی)
4. [استفاده](#استفاده)
5. [مثال‌های کاربردی](#مثال‌های-کاربردی)
6. [خطاها و رفع مشکل](#خطاها-و-رفع-مشکل)

## معرفی

این سرویس امکان ارسال پیامک از طریق API سرویس sms.ir را فراهم می‌کند. ویژگی‌های اصلی:

✅ پشتیبانی از محیط Sandbox (تست) و Production (واقعی)
✅ ارسال کد تایید با قالب‌های از پیش تعریف شده
✅ ارسال پیامک‌های سفارشی با پارامترهای متغیر
✅ مدیریت خودکار فرمت شماره موبایل
✅ مدیریت خطاها و لاگ‌گذاری

## نصب و راه‌اندازی

### مرحله 1: دریافت کلید API

#### برای تست (Sandbox):

1. وارد پنل sms.ir شوید: https://sms.ir/panel
2. به بخش "برنامه‌نویسان" بروید
3. از منوی "لیست کلیدهای API" گزینه "ایجاد کلید جدید" را انتخاب کنید
4. نوع کلید را **Sandbox** انتخاب کنید
5. کلید ایجاد شده را کپی کنید

#### برای محیط واقعی (Production):

1. همان مراحل بالا را انجام دهید
2. نوع کلید را **Production** انتخاب کنید
3. اطمینان حاصل کنید حساب شما اعتبار کافی دارد

### مرحله 2: تنظیم متغیرهای محیطی

فایل `.env` را ویرایش کنید:

```env
# تنظیمات SMS
SMS_API_KEY=کلید_API_شما
SMS_ENVIRONMENT=sandbox
SMS_TEMPLATE_ID=123456
```

**نکته**: در محیط Sandbox، قالب پیش‌فرض با شناسه `123456` وجود دارد.

### مرحله 3: ایجاد قالب پیامک (فقط برای Production)

1. در پنل sms.ir به بخش "ارسال سریع" بروید
2. "قالب‌های من" را انتخاب کنید
3. "ایجاد قالب جدید" را کلیک کنید
4. متن قالب را وارد کنید، مثال:
   ```
   کد تایید شما: #Code#
   اعتبار: 10 دقیقه
   ```
5. شناسه قالب را در `SMS_TEMPLATE_ID` قرار دهید

## پیکربندی

### متغیرهای محیطی

| متغیر             | توضیحات                              | مقدار پیش‌فرض |
| ----------------- | ------------------------------------ | ------------- |
| `SMS_API_KEY`     | کلید API از پنل sms.ir               | -             |
| `SMS_ENVIRONMENT` | محیط اجرا: `sandbox` یا `production` | `sandbox`     |
| `SMS_TEMPLATE_ID` | شناسه قالب پیامک                     | `123456`      |

### تفاوت محیط‌ها

| ویژگی             | Sandbox     | Production |
| ----------------- | ----------- | ---------- |
| ارسال واقعی پیامک | ❌          | ✅         |
| مصرف اعتبار       | ❌          | ✅         |
| ثبت گزارش در پنل  | ❌          | ✅         |
| قالب پیش‌فرض      | ✅ (123456) | ❌         |
| نیاز به اعتبار    | ❌          | ✅         |

## استفاده

### ارسال ساده کد تایید

```javascript
const {
  sendVerificationCode,
  generateVerificationCode,
} = require("./utils/sms.helper");

// تولید کد 6 رقمی
const code = generateVerificationCode(6);

// ارسال پیامک
const result = await sendVerificationCode(
  "09123456789", // شماره موبایل
  code, // کد تایید
  123456, // شناسه قالب
);

console.log("شناسه پیام:", result.messageId);
console.log("هزینه:", result.cost);
```

### ارسال پیامک سفارشی

```javascript
const { sendCustomSMS } = require("./utils/sms.helper");

const result = await sendCustomSMS(
  "09123456789",
  100001, // شناسه قالب
  {
    Name: "علی احمدی",
    OrderNumber: "12345",
    Amount: "250000",
  },
);
```

### استفاده مستقیم از سرویس

```javascript
const smsService = require("./services/sms.service");

const result = await smsService.sendVerify(
  "989123456789", // فرمت بین‌المللی
  123456, // شناسه قالب
  [
    { name: "Code", value: "123456" },
    { name: "Name", value: "کاربر" },
  ],
);
```

### فرمت کردن شماره موبایل

```javascript
const { formatMobileNumber } = require("./utils/sms.helper");

formatMobileNumber("09123456789"); // → 989123456789
formatMobileNumber("9123456789"); // → 989123456789
formatMobileNumber("989123456789"); // → 989123456789
```

## مثال‌های کاربردی

### 1. ثبت‌نام کاربر

```javascript
const {
  generateVerificationCode,
  sendVerificationCode,
} = require("./utils/sms.helper");

async function registerUser(mobile, name) {
  // تولید کد تایید
  const code = generateVerificationCode(6);

  // ذخیره در دیتابیس
  const user = await User.create({
    mobile,
    name,
    verificationCode: code,
    verificationExpiry: Date.now() + 10 * 60 * 1000,
  });

  // ارسال پیامک
  await sendVerificationCode(mobile, code, 123456);

  return { success: true, userId: user._id };
}
```

### 2. بازیابی رمز عبور

```javascript
async function resetPassword(mobile) {
  const resetCode = generateVerificationCode(6);

  // ذخیره کد در دیتابیس
  await User.updateOne(
    { mobile },
    {
      resetCode,
      resetCodeExpiry: Date.now() + 10 * 60 * 1000,
    },
  );

  // ارسال پیامک
  await sendCustomSMS(mobile, 100002, {
    Code: resetCode,
    ValidMinutes: "10",
  });
}
```

### 3. تایید سفارش

```javascript
async function confirmOrder(orderId) {
  const order = await Order.findById(orderId).populate("user");

  await sendCustomSMS(order.user.mobile, 100003, {
    OrderNumber: order.orderNumber,
    Amount: order.totalAmount.toLocaleString("fa-IR"),
    Status: "تایید شده",
  });
}
```

### 4. ارسال دسته‌ای

```javascript
async function sendBulkSMS(users) {
  const results = [];

  for (const user of users) {
    try {
      const result = await sendVerificationCode(user.mobile, user.code, 123456);
      results.push({ mobile: user.mobile, success: true });

      // تاخیر برای جلوگیری از Rate Limit
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      results.push({
        mobile: user.mobile,
        success: false,
        error: error.message,
      });
    }
  }

  return results;
}
```

## خطاها و رفع مشکل

### خطاهای رایج

#### 1. "SMS API Key is not configured"

**علت**: کلید API تنظیم نشده است
**راه حل**:

```env
SMS_API_KEY=your_api_key_here
```

#### 2. "Authentication failed"

**علت**: کلید API نامعتبر است
**راه حل**:

- کلید API را از پنل دوباره کپی کنید
- مطمئن شوید فضای خالی اضافی ندارد
- نوع کلید (Sandbox/Production) را بررسی کنید

#### 3. "Rate limit exceeded"

**علت**: تعداد درخواست‌ها زیاد است
**راه حل**:

- بین درخواست‌ها تاخیر ایجاد کنید
- از ارسال دسته‌ای با فاصله زمانی استفاده کنید

#### 4. "Bad Request"

**علت**: پارامترهای ورودی اشتباه است
**راه حل**:

- فرمت شماره موبایل را بررسی کنید
- شناسه قالب را بررسی کنید
- نام پارامترها باید دقیقاً مطابق قالب باشد

### مدیریت خطا در کد

```javascript
try {
  await sendVerificationCode(mobile, code, templateId);
} catch (error) {
  if (error.message.includes("Authentication")) {
    // کلید API نامعتبر
    console.error("کلید API را بررسی کنید");
  } else if (error.message.includes("Rate limit")) {
    // تعداد درخواست زیاد
    console.error("لطفاً کمی صبر کنید");
  } else if (error.message.includes("Bad Request")) {
    // پارامترهای اشتباه
    console.error("پارامترها را بررسی کنید");
  } else {
    // خطای دیگر
    console.error("خطای ناشناخته:", error.message);
  }
}
```

## تست سرویس

### تست ساده

```bash
node test-sms.js
```

### تست با شماره دلخواه

```bash
node test-sms.js 09123456789
```

### اجرای مثال‌ها

```bash
# مثال 1: ارسال ساده
node src/examples/sms-examples.js 1

# مثال 5: ارسال دسته‌ای
node src/examples/sms-examples.js 5

# مثال 8: بررسی وضعیت
node src/examples/sms-examples.js 8
```

## بررسی وضعیت سرویس

```javascript
const smsService = require("./services/sms.service");

// بررسی پیکربندی
if (smsService.isConfigured()) {
  console.log("✅ سرویس پیکربندی شده");
} else {
  console.log("❌ سرویس پیکربندی نشده");
}

// بررسی محیط
console.log("محیط:", smsService.getEnvironment());

// بررسی Sandbox
if (smsService.isSandbox()) {
  console.log("⚠️ در حال اجرا در محیط تست");
}
```

## نکات امنیتی

⚠️ **هرگز کلید API را در کد commit نکنید**
⚠️ **از فایل `.env` برای ذخیره کلیدها استفاده کنید**
⚠️ **در Production از HTTPS استفاده کنید**
⚠️ **Rate Limiting را پیاده‌سازی کنید**
⚠️ **لاگ‌های حساس را ذخیره نکنید**

## منابع و لینک‌ها

- 📚 [مستندات کامل انگلیسی](./SMS_INTEGRATION.md)
- 🚀 [راهنمای سریع](./SMS_QUICK_START.md)
- 🌐 [پنل sms.ir](https://sms.ir/panel)
- 📖 [مستندات API](https://sms.ir/api)
- 👨‍💻 [بخش برنامه‌نویسان](https://sms.ir/panel/developers)

## پشتیبانی

در صورت بروز مشکل:

1. ابتدا این مستندات را مطالعه کنید
2. فایل‌های مثال را اجرا کنید
3. لاگ‌های خطا را بررسی کنید
4. به پشتیبانی sms.ir مراجعه کنید
