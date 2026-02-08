# User Name Implementation

## Overview

Added support for storing and displaying user names throughout the application.

## Backend Changes

### 1. User Model (`backend/src/models/User.js`)

- Added `name` field to User schema
- Field is optional and trimmed

```javascript
name: { type: String, trim: true }
```

### 2. Validation Schema (`backend/src/validators/auth.validation.js`)

- Added name validation to registerSchema
- Minimum 3 characters required
- Field is optional

```javascript
name: z.string().min(3, "نام باید حداقل ۳ کاراکتر باشد").optional();
```

### 3. Auth Controller (`backend/src/controllers/auth.controller.js`)

- Updated register function to save user name
- Name is stored when user signs up

```javascript
const user = await User.create({
  name: data.name,
  email: data.email?.toLowerCase(),
  phone: data.phone,
  passwordHash,
  role: "user",
});
```

## Frontend Changes

### 1. Signup Page (`src/app/signup/page.jsx`)

- Updated to send name to backend during registration
- Name field already existed in form, now properly sent to API

```javascript
const response = await api.register({
  name: data.name,
  email: data.email,
  password: data.password,
});
```

### 2. Dashboard Page (`src/app/dashboard/page.jsx`)

- Welcome message shows user name (fallback to email/phone)
- User info card displays name as heading
- Avatar shows first letter of name (fallback to email)

```javascript
// Welcome
خوش آمدید، {user?.name || user?.email || user?.phone}

// Avatar
{user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}

// User info heading
{user?.name || 'کاربر'}
```

### 3. Dashboard Navbar (`src/app/components/DashboardNavbar.jsx`)

- Dropdown shows user name (fallback to email/phone)
- Avatar shows first letter of name (fallback to email)

```javascript
// Dropdown
{
  user?.name || user?.email || user?.phone || "کاربر";
}

// Avatar
{
  user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U";
}
```

## Display Priority

Throughout the application, user information is displayed with the following priority:

1. **Name** (if available)
2. **Email** (if name not available)
3. **Phone** (if neither name nor email available)
4. **'کاربر'** or **'U'** (default fallback)

## User Experience

### New Users (After This Update)

- Sign up with name, email, and password
- Name is stored in database
- Name appears throughout dashboard

### Existing Users (Before This Update)

- No name stored in database
- Email or phone displayed instead
- Can update profile later to add name (future feature)

## Testing

To test the implementation:

1. **New User Registration:**

   ```
   - Go to /signup
   - Enter name: "Test User"
   - Enter email: "test@example.com"
   - Enter password: "test123"
   - Submit form
   - Check dashboard shows "خوش آمدید، Test User"
   ```

2. **Existing User:**
   ```
   - Login with existing account (no name)
   - Dashboard shows email instead of name
   - Avatar shows first letter of email
   ```

## Database Migration

**Note:** Existing users in the database don't have a name field. The application handles this gracefully by falling back to email/phone. No database migration is required.

## Future Enhancements

Potential improvements:

- Add profile edit page to allow users to update their name
- Make name field required during signup
- Add name validation (no special characters, etc.)
- Add display name vs full name distinction
- Allow users to set preferred display name
