# VerifyUp Platform

A complete verification platform with SMS integration, built with Node.js, Express, MongoDB, and Next.js.

## 📁 Project Structure

```
VerifyUp/
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── services/     # SMS service & business logic
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Database models
│   │   ├── routes/       # API routes
│   │   └── utils/        # Helper functions
│   └── ...
└── frontend/         # Next.js application
    └── ...
```

## 🚀 Quick Start

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with your configuration
npm run dev
```

## 📱 SMS Integration (NEW!)

The backend now includes complete SMS.ir integration for sending verification codes and notifications.

### Quick SMS Setup (5 minutes)

1. **Get API Key**
   - Visit: https://sms.ir/panel/developers
   - Create "Sandbox" API key for testing

2. **Configure**

   ```env
   # Add to backend/.env
   SMS_API_KEY=your_api_key_here
   SMS_ENVIRONMENT=sandbox
   SMS_TEMPLATE_ID=123456
   ```

3. **Test**
   ```bash
   cd backend
   npm run test:sms
   ```

### SMS Documentation

Complete SMS integration documentation is available in the backend directory:

- **[📱 SMS Index](./backend/SMS_INDEX.md)** - Complete documentation index
- **[Quick Start](./backend/SMS_QUICK_START.md)** - 5-minute setup guide
- **[Complete Guide (English)](./backend/SMS_INTEGRATION.md)** - Full documentation
- **[راهنمای کامل (فارسی)](./backend/راهنمای-SMS.md)** - مستندات فارسی
- **[Troubleshooting](./backend/SMS_TROUBLESHOOTING.md)** - Common issues & solutions
- **[Setup Checklist](./backend/SMS_CHECKLIST.md)** - Verification checklist

### SMS Features

✅ Sandbox mode for testing (no real SMS, no credit consumption)
✅ Production mode for real SMS delivery
✅ Automatic phone number formatting
✅ Integrated with authentication flow
✅ 8 usage examples included
✅ Comprehensive error handling
✅ Full English & Persian documentation

### SMS Commands

```bash
cd backend

# Test SMS service
npm run test:sms

# Run examples
npm run examples:sms 1    # Simple verification
npm run examples:sms 5    # Batch send
npm run examples:sms 8    # Status check
```

## 📚 Documentation

### Backend

- [Backend README](./backend/README.md)
- [API Documentation](./backend/API_DOCUMENTATION.md)
- [Security Guide](./backend/SECURITY.md)
- [Quick Start](./backend/QUICK_START.md)

### SMS Integration

- [SMS Index](./backend/SMS_INDEX.md) - Start here for SMS docs
- [SMS Summary](./backend/SMS_SUMMARY.md) - Executive summary

### Frontend

- [Frontend README](./frontend/README.md)

## 🔧 Environment Variables

### Backend (.env)

```env
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/VerifyUp
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
FRONTEND_URL=http://localhost:3000

# SMS Configuration
SMS_API_KEY=your_sms_api_key
SMS_ENVIRONMENT=sandbox
SMS_TEMPLATE_ID=123456
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 🎯 Features

### Backend

- ✅ JWT Authentication with HttpOnly cookies
- ✅ Role-based access control (User/Admin)
- ✅ Phone & Email verification
- ✅ SMS integration with sms.ir
- ✅ Rate limiting & security headers
- ✅ MongoDB with Mongoose
- ✅ Input validation with Zod
- ✅ Comprehensive error handling

### Frontend

- ✅ Next.js 14 with App Router
- ✅ Tailwind CSS styling
- ✅ User dashboard
- ✅ Admin panel
- ✅ Authentication flow
- ✅ Responsive design

## 🚀 Development

### Start Backend

```bash
cd backend
npm run dev
# Server runs on http://localhost:4000
```

### Start Frontend

```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

## 📦 Tech Stack

### Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- SMS.ir API
- Zod Validation
- Helmet + CORS

### Frontend

- Next.js 14
- React 18
- Tailwind CSS
- Axios

## 🔒 Security

- HttpOnly cookies for tokens
- CORS protection
- Rate limiting
- Input validation
- NoSQL injection prevention
- Secure password hashing (bcrypt)
- Environment-based configuration

## 📞 Support

### SMS Integration Help

- Check [SMS Index](./backend/SMS_INDEX.md) for all SMS documentation
- Run `cd backend && npm run test:sms` to test your setup
- See [Troubleshooting Guide](./backend/SMS_TROUBLESHOOTING.md) for common issues

### General Help

- Backend: See [backend/README.md](./backend/README.md)
- Frontend: See [frontend/README.md](./frontend/README.md)

## 📄 License

ISC

---

**Quick Links:**

- [Backend Documentation](./backend/README.md)
- [SMS Integration Guide](./backend/SMS_INDEX.md)
- [API Documentation](./backend/API_DOCUMENTATION.md)
- [Frontend Documentation](./frontend/README.md)
