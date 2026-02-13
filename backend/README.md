# VerifyUp Backend API

Production-ready REST API for VerifyUp verification platform built with Node.js, Express, MongoDB, and JWT authentication via HttpOnly cookies.

## 🚀 Features

### Security

- ✅ **HttpOnly Cookies** - Tokens stored securely, not accessible via JavaScript
- ✅ **JWT Authentication** - Access (15min) + Refresh (7d) token strategy
- ✅ **Rate Limiting** - Global and endpoint-specific limits
- ✅ **CORS Protection** - Restricted to frontend origin only
- ✅ **Input Validation** - Zod schemas for all inputs
- ✅ **NoSQL Injection Prevention** - Query sanitization
- ✅ **Password Security** - Bcrypt with 12 salt rounds
- ✅ **Helmet** - Security headers automatically set
- ✅ **Request Size Limits** - 2MB max payload

### API Features

- ✅ **Standardized Responses** - Consistent format across all endpoints
- ✅ **Role-Based Access Control** - User and Admin roles
- ✅ **Error Handling** - Centralized error handler with proper status codes
- ✅ **Pagination** - Built-in pagination for list endpoints
- ✅ **Order Status Flow** - Automated status transitions
- ✅ **Document Management** - Upload and review system

### Code Quality

- ✅ **Clean Architecture** - Organized folder structure
- ✅ **Reusable Utilities** - DRY principles
- ✅ **Environment-Based Config** - Development and production modes
- ✅ **Comprehensive Logging** - Morgan with environment-specific formats
- ✅ **No Sensitive Data Leaks** - Sanitized responses

## 📋 Prerequisites

- Node.js 16+
- MongoDB 4.4+
- npm or yarn

## 🛠️ Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

## 📚 Documentation

- **[Quick Start Guide](./QUICK_START.md)** - Get up and running in 5 minutes
- **[API Documentation](./API_DOCUMENTATION.md)** - Complete API reference
- **[Security Guide](./SECURITY.md)** - Security implementation details

### SMS Integration

- **[📱 SMS Index](./SMS_INDEX.md)** - Complete SMS documentation index
- **[SMS Quick Start](./SMS_QUICK_START.md)** - Get SMS working in 5 minutes
- **[SMS Integration Guide](./SMS_INTEGRATION.md)** - Complete guide (English)
- **[راهنمای SMS](./راهنمای-SMS.md)** - راهنمای کامل (فارسی)

## 🔧 Configuration

### Environment Variables

```env
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/VerifyUp
JWT_SECRET=your_access_token_secret_min_32_chars
JWT_REFRESH_SECRET=your_refresh_token_secret_min_32_chars
FRONTEND_URL=http://localhost:3000

# SMS Configuration (sms.ir)
SMS_API_KEY=your_sms_ir_api_key
SMS_ENVIRONMENT=sandbox  # or production
SMS_TEMPLATE_ID=123456
```

### Generate Secure Secrets

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 🏗️ Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic (SMS, etc.)
│   ├── utils/           # Helper functions
│   ├── validators/      # Input validation schemas
│   ├── examples/        # Usage examples
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── .env                 # Environment variables
├── test-sms.js          # SMS testing script
├── package.json
└── README.md
```

## 🔐 Authentication Flow

### Registration/Login

1. User submits credentials
2. Server validates input
3. Server generates access + refresh tokens
4. Tokens stored in HttpOnly cookies
5. User data returned (no tokens in response)

### Authenticated Requests

1. Browser automatically sends cookies
2. Server verifies access token
3. Request processed if valid
4. 401 returned if expired/invalid

### Token Refresh

1. Access token expires (15 min)
2. Frontend receives 401
3. Frontend calls `/api/auth/refresh`
4. Server validates refresh token
5. New access token issued
6. Original request retried

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Orders (User)

- `GET /api/orders/me` - Get my orders
- `GET /api/orders/:orderId` - Get order details
- `POST /api/orders` - Create new order
- `POST /api/orders/:orderId/documents` - Upload document

### Admin

- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/orders` - List all orders (paginated)
- `GET /api/admin/orders/:orderId` - Get order details
- `GET /api/admin/orders/:orderId/documents` - Get order documents
- `PATCH /api/admin/orders/:orderId/status` - Update order status
- `PATCH /api/admin/documents/:docId/review` - Review document

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "message": "Human-readable message",
  "data": { ... },
  "errors": null
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "data": null,
  "errors": ["error1", "error2"]
}
```

## 🔄 Order Status Flow

```
pending_docs → in_review → approved → completed
                    ↓
              needs_resubmit
                    ↓
                rejected
```

## 🧪 Testing

### Manual Testing with cURL

```bash
# Register
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Get orders
curl -X GET http://localhost:4000/api/orders/me \
  -b cookies.txt
```

### Frontend Integration (Axios)

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true, // IMPORTANT!
});

// Auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      await api.post("/auth/refresh");
      return api(error.config);
    }
    return Promise.reject(error);
  },
);
```

## 🚀 Deployment

### Production Checklist

#### Environment

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Configure `FRONTEND_URL` to actual domain
- [ ] Enable HTTPS
- [ ] Set `secure: true` for cookies

#### Database

- [ ] Enable MongoDB authentication
- [ ] Use SSL/TLS connection
- [ ] Set up regular backups
- [ ] Restrict database user permissions

#### Server

- [ ] Use process manager (PM2)
- [ ] Set up monitoring
- [ ] Configure firewall
- [ ] Keep dependencies updated
- [ ] Run `npm audit` regularly

#### Network

- [ ] Use reverse proxy (nginx)
- [ ] Configure SSL certificates
- [ ] Set up DDoS protection
- [ ] Configure CDN if needed

### PM2 Deployment

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start src/server.js --name verifyup-api

# Save process list
pm2 save

# Set up auto-restart on reboot
pm2 startup
```

## 🔒 Security Features

| Feature           | Implementation                        |
| ----------------- | ------------------------------------- |
| XSS Protection    | HttpOnly cookies, input validation    |
| CSRF Protection   | SameSite cookies, CORS restrictions   |
| NoSQL Injection   | Input validation, query sanitization  |
| Brute Force       | Rate limiting (5 req/15min on auth)   |
| Session Hijacking | Short-lived tokens, secure cookies    |
| DoS               | Rate limiting, request size limits    |
| Data Exposure     | Response sanitization, error handling |

## 📈 Performance

- **Rate Limits**: 100 req/15min global, 5 req/15min auth
- **Request Size**: 2MB max
- **Token Expiry**: 15min access, 7d refresh
- **Database Indexes**: On userId, orderId, status, email, phone

## 🐛 Troubleshooting

### CORS Errors

- Verify `FRONTEND_URL` matches exactly
- Check `withCredentials: true` in frontend
- Ensure CORS middleware is configured

### Cookies Not Set

- Check browser allows cookies
- Verify `secure: false` in development
- Use HTTPS in production

### MongoDB Connection Failed

- Verify MongoDB is running
- Check connection string
- Ensure network access

### Token Expired Immediately

- Check system time
- Verify JWT secrets are set
- Review token expiry settings

## 📝 Scripts

```bash
# Development with auto-reload
npm run dev

# Production
npm start

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## 🤝 Contributing

1. Follow existing code structure
2. Use Zod for validation
3. Return standardized responses
4. Add error handling
5. Update documentation

## 📄 License

ISC

## 👥 Support

For issues or questions:

- Check [API Documentation](./API_DOCUMENTATION.md)
- Review [Security Guide](./SECURITY.md)
- Read [Quick Start Guide](./QUICK_START.md)

---

**Built with ❤️ for secure, production-ready applications**
