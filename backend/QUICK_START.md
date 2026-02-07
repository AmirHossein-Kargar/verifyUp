# Quick Start Guide

## Prerequisites

- Node.js 16+ installed
- MongoDB running locally or connection string ready
- Terminal/Command prompt

## Installation

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Create or update `.env` file:

```env
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/VerifyUp
JWT_SECRET=your_super_secret_access_token_key_min_32_chars
JWT_REFRESH_SECRET=your_super_secret_refresh_token_key_min_32_chars
FRONTEND_URL=http://localhost:3000
```

**Generate secure secrets:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Start MongoDB

Make sure MongoDB is running:

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
```

### 4. Start Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server will start at `http://localhost:4000`

## Testing the API

### 1. Health Check

```bash
curl http://localhost:4000/
```

Expected response:

```json
{
  "success": true,
  "message": "VerifyUp API is running",
  "data": {
    "version": "1.0.0",
    "status": "healthy"
  },
  "errors": null
}
```

### 2. Register a User

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt -v
```

Check response headers for `Set-Cookie` with `accessToken` and `refreshToken`.

### 3. Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt
```

### 4. Get Current User (Authenticated)

```bash
curl -X GET http://localhost:4000/api/auth/me \
  -b cookies.txt
```

### 5. Create an Order

```bash
curl -X POST http://localhost:4000/api/orders \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "service": "upwork_verification",
    "priceToman": 500000,
    "requiredDocs": ["passport_front", "passport_back", "selfie"]
  }'
```

### 6. Get My Orders

```bash
curl -X GET http://localhost:4000/api/orders/me \
  -b cookies.txt
```

### 7. Logout

```bash
curl -X POST http://localhost:4000/api/auth/logout \
  -b cookies.txt
```

## Create Admin User

To test admin endpoints, you need to manually create an admin user in MongoDB:

### Option 1: MongoDB Shell

```javascript
use VerifyUp

// Find your user
db.users.findOne({ email: "test@example.com" })

// Update role to admin
db.users.updateOne(
  { email: "test@example.com" },
  { $set: { role: "admin" } }
)
```

### Option 2: MongoDB Compass

1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Select `VerifyUp` database
4. Select `users` collection
5. Find your user and edit the `role` field to `"admin"`

### Test Admin Access

```bash
# Login as admin
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}' \
  -c admin-cookies.txt

# Get statistics
curl -X GET http://localhost:4000/api/admin/stats \
  -b admin-cookies.txt

# List all orders
curl -X GET http://localhost:4000/api/admin/orders \
  -b admin-cookies.txt
```

## Frontend Integration

### React/Next.js Example with Axios

```javascript
// api/client.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true, // IMPORTANT: Enable cookies
});

// Interceptor for automatic token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
```

```javascript
// Usage in components
import api from "./api/client";

// Register
const register = async (email, password) => {
  const response = await api.post("/auth/register", { email, password });
  return response.data;
};

// Login
const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

// Get orders
const getMyOrders = async () => {
  const response = await api.get("/orders/me");
  return response.data;
};

// Logout
const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};
```

### Important Frontend Notes

1. **Always use `withCredentials: true`** or `credentials: 'include'`
2. **Never store tokens in localStorage** - they're in cookies
3. **Handle 401 errors** by calling `/auth/refresh`
4. **CORS must be configured** with your frontend URL

## Common Issues

### Issue: "CORS error"

**Solution:** Make sure `FRONTEND_URL` in `.env` matches your frontend URL exactly.

### Issue: "Cookies not being set"

**Solution:**

- Check `withCredentials: true` in frontend
- Verify CORS configuration
- In production, ensure HTTPS is enabled

### Issue: "MongoDB connection failed"

**Solution:**

- Verify MongoDB is running
- Check `MONGO_URI` in `.env`
- Ensure database user has proper permissions

### Issue: "Token expired" immediately

**Solution:**

- Check system time is correct
- Verify JWT secrets are set
- Check token expiry settings in `utils/jwt.js`

### Issue: "Rate limit exceeded"

**Solution:**

- Wait 15 minutes
- Or restart server (rate limits reset)
- Adjust rate limits in `app.js` for development

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── controllers/
│   │   ├── auth.controller.js # Auth logic
│   │   ├── order.controller.js # Order logic
│   │   └── admin.controller.js # Admin logic
│   ├── middleware/
│   │   ├── auth.js            # JWT verification
│   │   ├── admin.js           # Admin role check
│   │   └── error.js           # Error handler
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Order.js           # Order schema
│   │   └── Document.js        # Document schema
│   ├── routes/
│   │   ├── auth.routes.js     # Auth endpoints
│   │   ├── order.routes.js    # Order endpoints
│   │   └── admin.routes.js    # Admin endpoints
│   ├── services/
│   │   └── order.service.js   # Business logic
│   ├── utils/
│   │   ├── response.js        # Standardized responses
│   │   ├── jwt.js             # Token utilities
│   │   └── sanitize.js        # Data sanitization
│   ├── validators/
│   │   ├── auth.validation.js # Auth validation
│   │   └── order.validation.js # Order validation
│   ├── app.js                 # Express app setup
│   └── server.js              # Server entry point
├── .env                       # Environment variables
├── package.json
├── API_DOCUMENTATION.md       # Full API docs
├── SECURITY.md                # Security guide
└── QUICK_START.md            # This file
```

## Next Steps

1. ✅ Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference
2. ✅ Read [SECURITY.md](./SECURITY.md) for security best practices
3. ✅ Implement file upload for documents
4. ✅ Add email notifications
5. ✅ Set up production deployment
6. ✅ Configure monitoring and logging
7. ✅ Add automated tests

## Support

For detailed API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

For security information, see [SECURITY.md](./SECURITY.md)
