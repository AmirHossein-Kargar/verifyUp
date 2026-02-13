# Frontend Development Features

## 🔧 Development Mode Helpers

The frontend includes special features when running in development mode to make testing easier.

### 📱 OTP Code Display

When you register or request a new OTP code, the code is automatically displayed in two ways:

#### 1. Toast Notification

A toast message appears showing the OTP code:

```
🔑 کد تایید شما: 123456
```

- Duration: 15 seconds
- Type: Info (blue)
- Appears 1 second after registration success

#### 2. Visual Helper Box

On the OTP verification page, a yellow helper box shows:

- The current OTP code
- A copy button to quickly copy the code
- Only visible when OTP is available from the API

### 🎯 How It Works

#### Registration Flow

1. User submits registration form
2. Backend returns OTP in response (development only)
3. Success toast appears
4. OTP toast appears after 1 second
5. User navigates to verification page
6. OTP helper box is visible

#### Resend OTP Flow

1. User clicks "Resend OTP"
2. Backend returns new OTP in response
3. Success toast appears
4. New OTP toast appears after 1 second
5. Helper box updates with new code

### 📋 Features

#### Toast Display

- **Icon**: 🔑 (key emoji)
- **Duration**: 15 seconds (long enough to read and copy)
- **Type**: Info (blue color)
- **Message**: `کد تایید شما: [CODE]`

#### Helper Box

- **Location**: Above OTP input field
- **Style**: Yellow dashed border
- **Content**:
  - Label: "کد تایید (حالت توسعه)"
  - Code: Large, monospace font
  - Copy button: Copies code to clipboard

#### Copy Button

- **Action**: Copies OTP to clipboard
- **Feedback**: Shows success toast "کد کپی شد!"
- **Duration**: 2 seconds

### 🔒 Security

**IMPORTANT**: These features only work when the backend is in development mode.

In production:

- ✅ Backend does NOT return OTP in response
- ✅ No toast with OTP code
- ✅ No helper box visible
- ✅ User must check their phone for SMS

### 🧪 Testing Workflow

#### Quick Test (Development)

1. Go to `/signup`
2. Fill registration form
3. Submit
4. **Look for toast with OTP code** 🔑
5. Click "تأیید با پیامک"
6. **See helper box with code**
7. Click copy button or manually enter
8. Submit verification

#### Production Test

1. Same steps as above
2. No OTP toast appears
3. No helper box visible
4. Check phone for real SMS
5. Enter code from SMS

### 💡 Tips

#### Auto-Copy on Page Load

You can enhance the UX by auto-copying the code:

```javascript
useEffect(() => {
  if (registeredData?.otp && step === "verify-otp") {
    // Auto-copy to clipboard
    navigator.clipboard.writeText(registeredData.otp);
    showToast("کد به کلیپ‌بورد کپی شد", "info", 2000);
  }
}, [step]);
```

#### Auto-Fill Input

You can auto-fill the OTP input:

```javascript
useEffect(() => {
  if (registeredData?.otp && step === "verify-otp") {
    // Auto-fill the input
    setValue("otp", registeredData.otp);
  }
}, [step, registeredData?.otp]);
```

### 🎨 Customization

#### Change Toast Duration

```javascript
// In signup/page.jsx
showToast(`🔑 کد تایید شما: ${response.data.otp}`, "info", 20000); // 20 seconds
```

#### Change Helper Box Style

```javascript
// Modify the className
<div className="mb-4 rounded-lg border-2 border-dashed border-blue-400 bg-blue-50 ...">
```

#### Add Auto-Fill

```javascript
// In the verify-otp step
useEffect(() => {
  if (registeredData?.otp) {
    setValue("otp", registeredData.otp); // Auto-fill
  }
}, [registeredData?.otp]);
```

### 📊 User Experience

#### Before (Without Helper)

1. Register ✅
2. Check server console for OTP ❌
3. Copy from console ❌
4. Paste in form ❌
5. Submit ✅

#### After (With Helper)

1. Register ✅
2. See OTP in toast ✅
3. Click copy button ✅
4. Paste in form ✅
5. Submit ✅

### 🔄 Environment Detection

The features automatically work based on backend response:

```javascript
// If backend returns OTP (development)
if (response.data.otp) {
  // Show toast and helper
}

// If backend doesn't return OTP (production)
// Nothing special happens
```

### ⚠️ Important Notes

1. **Never deploy frontend with hardcoded OTP display**
2. **Always rely on backend response**
3. **Backend controls what's returned**
4. **Frontend just displays what it receives**

### 🧪 Testing Checklist

Before deploying:

- [ ] Backend is in production mode
- [ ] Backend doesn't return OTP in response
- [ ] No OTP toast appears
- [ ] No helper box visible
- [ ] Real SMS is sent
- [ ] User can verify with real SMS code

### 📝 Related Files

- `frontend/src/app/signup/page.jsx` - Registration and OTP verification
- `backend/src/controllers/auth.controller.js` - Returns OTP in development
- `backend/DEVELOPMENT_MODE.md` - Backend development features

---

**Remember**: These are development helpers. Always test in production mode before deploying!
