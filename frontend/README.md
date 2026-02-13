# VerifyUp Frontend

Next.js 14 frontend application for VerifyUp platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Start development server
npm run dev
```

Visit http://localhost:3000

## 🔧 Development Features

### OTP Code Display (Development Only)

When testing registration and OTP verification in development mode:

1. **Toast Notification**: OTP code appears in a toast message

   ```
   🔑 کد تایید شما: 123456
   ```

2. **Helper Box**: Visual helper on verification page with:
   - Current OTP code
   - Copy button for quick copying

3. **Auto-Display**: Code automatically shown after registration

See [DEVELOPMENT_FEATURES.md](./DEVELOPMENT_FEATURES.md) for complete guide.

### How to Test

1. Go to `/signup`
2. Fill and submit registration form
3. **Look for toast with OTP code** 🔑
4. Click "تأیید با پیامک"
5. See helper box with code
6. Click copy or manually enter
7. Submit verification

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js 14 App Router
│   │   ├── signup/       # Registration with OTP display
│   │   ├── login/        # Login page
│   │   ├── dashboard/    # User dashboard
│   │   └── admin/        # Admin panel
│   ├── components/       # Reusable components
│   ├── contexts/         # React contexts (Auth, Cart)
│   ├── hooks/            # Custom hooks
│   └── lib/              # Utilities and API client
├── public/               # Static assets
└── package.json
```

## 🎯 Features

- ✅ Next.js 14 with App Router
- ✅ Tailwind CSS styling
- ✅ Authentication with JWT cookies
- ✅ OTP verification with development helpers
- ✅ User dashboard
- ✅ Admin panel
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Toast notifications
- ✅ Form validation

## 🔐 Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 📚 Documentation

- [Development Features](./DEVELOPMENT_FEATURES.md) - Development mode helpers
- [Auth Enhancement Summary](./AUTH_ENHANCEMENT_SUMMARY.md) - Authentication features

## 🛠️ Tech Stack

- Next.js 14
- React 18
- Tailwind CSS
- Framer Motion
- React Hook Form
- Axios

## 📦 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 🧪 Testing

### Development Mode

- OTP codes displayed in UI
- Helper boxes for easy testing
- Toast notifications with codes

### Production Mode

- No OTP codes in UI
- Real SMS delivery
- Standard verification flow

## 🔒 Security

- HttpOnly cookies for tokens
- CSRF protection
- Input validation
- XSS prevention
- Secure authentication flow

## 📞 Support

For issues or questions, check:

- [Development Features Guide](./DEVELOPMENT_FEATURES.md)
- [Backend Documentation](../backend/README.md)
- [SMS Integration Guide](../backend/SMS_INDEX.md)

---

**Quick Links:**

- [Backend API](../backend/README.md)
- [SMS Integration](../backend/SMS_INDEX.md)
- [Development Features](./DEVELOPMENT_FEATURES.md)
