# VerifyUp API Documentation

## Overview

Production-ready REST API for VerifyUp verification platform with JWT authentication via HttpOnly cookies.

## Base URL

```
http://localhost:4000/api
```

## Authentication

All authentication tokens are stored in **HttpOnly cookies** for security:

- `accessToken`: Short-lived (15 minutes)
- `refreshToken`: Long-lived (7 days)

**Never send tokens in request bodies or Authorization headers.**

## Standard Response Format

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
  "message": "Human-readable error message",
  "data": null,
  "errors": ["error1", "error2"] // Optional array of errors
}
```

## HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---

## Authentication Endpoints

### 1. Register

**POST** `/api/auth/register`

Create a new user account.

**Request Body:**

```json
{
  "email": "user@example.com", // Optional (email OR phone required)
  "phone": "1234567890", // Optional (email OR phone required)
  "password": "password123" // Min 6 characters
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "phone": "1234567890",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "errors": null
}
```

**Cookies Set:**

- `accessToken` (15 min)
- `refreshToken` (7 days)

**Rate Limit:** 5 requests per 15 minutes

---

### 2. Login

**POST** `/api/auth/login`

Authenticate existing user.

**Request Body:**

```json
{
  "email": "user@example.com", // Optional (email OR phone required)
  "phone": "1234567890", // Optional (email OR phone required)
  "password": "password123"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "role": "user"
    }
  },
  "errors": null
}
```

**Cookies Set:**

- `accessToken` (15 min)
- `refreshToken` (7 days)

**Rate Limit:** 5 requests per 15 minutes

---

### 3. Refresh Token

**POST** `/api/auth/refresh`

Get a new access token using refresh token.

**Request:** No body required (uses `refreshToken` cookie)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": null,
  "errors": null
}
```

**Cookies Updated:**

- `accessToken` (new 15 min token)

---

### 4. Logout

**POST** `/api/auth/logout`

Clear authentication cookies.

**Headers:** Requires authentication (accessToken cookie)

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logout successful",
  "data": null,
  "errors": null
}
```

**Cookies Cleared:**

- `accessToken`
- `refreshToken`

---

### 5. Get Current User

**GET** `/api/auth/me`

Get authenticated user information.

**Headers:** Requires authentication

**Success Response (200):**

```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "phone": "1234567890",
      "role": "user",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "errors": null
}
```

---

## Order Endpoints (User)

All order endpoints require authentication.

### 1. Create Order

**POST** `/api/orders`

Create a new verification order.

**Request Body:**

```json
{
  "service": "upwork_verification",
  "priceToman": 500000,
  "requiredDocs": ["passport_front", "passport_back", "selfie"]
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439012",
      "service": "upwork_verification",
      "status": "pending_docs",
      "priceToman": 500000,
      "currency": "IRR_TOMAN",
      "requiredDocs": ["passport_front", "passport_back", "selfie"],
      "docsSummary": {
        "uploaded": 0,
        "accepted": 0,
        "resubmit": 0
      },
      "adminNote": "",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  },
  "errors": null
}
```

---

### 2. Get My Orders

**GET** `/api/orders/me`

Get all orders for authenticated user.

**Success Response (200):**

```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": {
    "orders": [...],
    "count": 5
  },
  "errors": null
}
```

---

### 3. Get Order by ID

**GET** `/api/orders/:orderId`

Get specific order details with documents.

**Success Response (200):**

```json
{
  "success": true,
  "message": "Order retrieved successfully",
  "data": {
    "order": { ... },
    "documents": [...]
  },
  "errors": null
}
```

---

### 4. Upload Document

**POST** `/api/orders/:orderId/documents`

Upload a document for an order.

**Request Body:**

```json
{
  "type": "passport_front",
  "fileUrl": "https://storage.example.com/doc123.jpg"
}
```

**Success Response (201):**

```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "document": {
      "_id": "507f1f77bcf86cd799439013",
      "orderId": "507f1f77bcf86cd799439011",
      "userId": "507f1f77bcf86cd799439012",
      "type": "passport_front",
      "fileUrl": "https://storage.example.com/doc123.jpg",
      "status": "uploaded",
      "adminNote": "",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "orderSummary": {
      "uploaded": 1,
      "accepted": 0,
      "resubmit": 0,
      "status": "pending_docs"
    }
  },
  "errors": null
}
```

---

## Admin Endpoints

All admin endpoints require authentication + admin role.

### 1. Get Statistics

**GET** `/api/admin/stats`

Get platform statistics.

**Success Response (200):**

```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "totalOrders": 150,
    "totalUsers": 75,
    "ordersByStatus": {
      "pending_docs": 20,
      "in_review": 15,
      "approved": 100,
      "completed": 10,
      "needs_resubmit": 5
    },
    "recentOrders": [...]
  },
  "errors": null
}
```

---

### 2. List All Orders

**GET** `/api/admin/orders`

Get all orders with pagination and filtering.

**Query Parameters:**

- `status` (optional): Filter by status
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 20): Items per page

**Example:** `/api/admin/orders?status=in_review&page=1&limit=10`

**Success Response (200):**

```json
{
  "success": true,
  "message": "Orders retrieved successfully",
  "data": {
    "orders": [...],
    "pagination": {
      "total": 150,
      "page": 1,
      "limit": 20,
      "pages": 8
    }
  },
  "errors": null
}
```

---

### 3. Get Order Details

**GET** `/api/admin/orders/:orderId`

Get specific order with user info and documents.

**Success Response (200):**

```json
{
  "success": true,
  "message": "Order details retrieved successfully",
  "data": {
    "order": {
      "_id": "...",
      "userId": {
        "_id": "...",
        "email": "user@example.com",
        "phone": "1234567890",
        "role": "user"
      },
      "service": "upwork_verification",
      "status": "in_review",
      ...
    },
    "documents": [...]
  },
  "errors": null
}
```

---

### 4. Get Order Documents

**GET** `/api/admin/orders/:orderId/documents`

Get all documents for an order.

**Success Response (200):**

```json
{
  "success": true,
  "message": "Documents retrieved successfully",
  "data": {
    "documents": [...],
    "count": 3
  },
  "errors": null
}
```

---

### 5. Review Document

**PATCH** `/api/admin/documents/:docId/review`

Accept or request resubmission of a document.

**Request Body:**

```json
{
  "status": "accepted", // "accepted" or "resubmit"
  "adminNote": "Document is clear and valid"
}
```

**Success Response (200):**

```json
{
  "success": true,
  "message": "Document accepted",
  "data": {
    "document": { ... },
    "orderSummary": {
      "uploaded": 3,
      "accepted": 3,
      "resubmit": 0,
      "status": "approved"
    }
  },
  "errors": null
}
```

---

### 6. Update Order Status

**PATCH** `/api/admin/orders/:orderId/status`

Manually update order status.

**Request Body:**

```json
{
  "status": "completed",
  "adminNote": "Verification completed successfully"
}
```

**Valid Statuses:**

- `pending_docs`
- `in_review`
- `needs_resubmit`
- `approved`
- `rejected`
- `completed`

**Success Response (200):**

```json
{
  "success": true,
  "message": "Order status updated successfully",
  "data": {
    "order": { ... }
  },
  "errors": null
}
```

---

## Order Status Flow

```
pending_docs → in_review → approved → completed
                    ↓
              needs_resubmit → (back to in_review)
                    ↓
                rejected
```

**Status Logic:**

1. **pending_docs**: Initial state, waiting for user to upload documents
2. **in_review**: All required documents uploaded, admin reviewing
3. **needs_resubmit**: One or more documents rejected, user must reupload
4. **approved**: All documents accepted
5. **rejected**: Order rejected by admin
6. **completed**: Verification process completed

---

## Security Features

### 1. HttpOnly Cookies

- Tokens stored in HttpOnly cookies (not accessible via JavaScript)
- Prevents XSS attacks

### 2. CORS

- Restricted to frontend origin only
- Credentials enabled for cookie sharing

### 3. Rate Limiting

- Global: 100 requests per 15 minutes
- Auth endpoints: 5 requests per 15 minutes

### 4. Input Validation

- All inputs validated using Zod schemas
- NoSQL injection prevention

### 5. Password Security

- Bcrypt hashing with salt rounds: 12
- Passwords never returned in responses

### 6. Helmet

- Security headers automatically set

### 7. Request Size Limits

- JSON body limit: 2MB

---

## Error Examples

### Validation Error (400)

```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "errors": [
    "Password must be at least 6 characters",
    "Either email or phone is required"
  ]
}
```

### Unauthorized (401)

```json
{
  "success": false,
  "message": "Authentication required",
  "data": null,
  "errors": null
}
```

### Forbidden (403)

```json
{
  "success": false,
  "message": "Admin access required",
  "data": null,
  "errors": null
}
```

### Not Found (404)

```json
{
  "success": false,
  "message": "Order not found",
  "data": null,
  "errors": null
}
```

### Conflict (409)

```json
{
  "success": false,
  "message": "User already exists with this email or phone",
  "data": null,
  "errors": null
}
```

### Rate Limit (429)

```json
{
  "success": false,
  "message": "Too many authentication attempts, please try again later",
  "data": null,
  "errors": null
}
```

---

## Environment Variables

```env
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/VerifyUp
JWT_SECRET=your_access_token_secret_here
JWT_REFRESH_SECRET=your_refresh_token_secret_here
FRONTEND_URL=http://localhost:3000
```

**Production Notes:**

- Set `NODE_ENV=production`
- Use strong random secrets (min 32 characters)
- Use HTTPS for secure cookies
- Configure proper CORS origin

---

## Testing with cURL

### Register

```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt
```

### Login

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt
```

### Get My Orders (with cookies)

```bash
curl -X GET http://localhost:4000/api/orders/me \
  -b cookies.txt
```

### Refresh Token

```bash
curl -X POST http://localhost:4000/api/auth/refresh \
  -b cookies.txt \
  -c cookies.txt
```

### Logout

```bash
curl -X POST http://localhost:4000/api/auth/logout \
  -b cookies.txt
```

---

## Frontend Integration

### Axios Example

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
  withCredentials: true, // Important: enables cookies
});

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

// Handle 401 errors (token expired)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      try {
        await api.post("/auth/refresh");
        // Retry original request
        return api.request(error.config);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
```

### Fetch Example

```javascript
// Login
const login = async (email, password) => {
  const response = await fetch("http://localhost:4000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Important: enables cookies
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};
```

---

## Development

### Start Server

```bash
cd backend
npm run dev
```

### Production

```bash
npm start
```

---

## Support

For issues or questions, contact the development team.
