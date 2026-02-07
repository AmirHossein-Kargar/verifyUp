# VerifyUp Backend - Project Structure

## 📁 Directory Structure

```
backend/
├── 📄 .env                          # Environment variables (DO NOT COMMIT)
├── 📄 .env.example                  # Environment template
├── 📄 package.json                  # Dependencies and scripts
├── 📄 package-lock.json             # Locked dependencies
│
├── 📚 Documentation/
│   ├── 📄 README.md                 # Project overview
│   ├── 📄 API_DOCUMENTATION.md      # Complete API reference
│   ├── 📄 SECURITY.md               # Security implementation guide
│   ├── 📄 QUICK_START.md            # Quick start guide
│   ├── 📄 DEPLOYMENT.md             # Production deployment guide
│   ├── 📄 CHANGELOG.md              # Detailed changelog
│   ├── 📄 REFACTOR_SUMMARY.md       # Refactor summary
│   └── 📄 PROJECT_STRUCTURE.md      # This file
│
└── 📁 src/
    ├── 📄 server.js                 # Server entry point
    ├── 📄 app.js                    # Express app configuration
    │
    ├── 📁 config/
    │   └── 📄 db.js                 # MongoDB connection
    │
    ├── 📁 models/                   # Mongoose schemas
    │   ├── 📄 User.js               # User model
    │   ├── 📄 Order.js              # Order model
    │   └── 📄 Document.js           # Document model
    │
    ├── 📁 controllers/              # Request handlers
    │   ├── 📄 auth.controller.js    # Authentication logic
    │   ├── 📄 order.controller.js   # Order management logic
    │   └── 📄 admin.controller.js   # Admin operations logic
    │
    ├── 📁 middleware/               # Custom middleware
    │   ├── 📄 auth.js               # JWT authentication
    │   ├── 📄 admin.js              # Admin role verification
    │   └── 📄 error.js              # Error handling
    │
    ├── 📁 routes/                   # API routes
    │   ├── 📄 auth.routes.js        # /api/auth/*
    │   ├── 📄 order.routes.js       # /api/orders/*
    │   └── 📄 admin.routes.js       # /api/admin/*
    │
    ├── 📁 services/                 # Business logic
    │   └── 📄 order.service.js      # Order status computation
    │
    ├── 📁 validators/               # Input validation
    │   ├── 📄 auth.validation.js    # Auth input schemas
    │   └── 📄 order.validation.js   # Order input schemas
    │
    └── 📁 utils/                    # Helper utilities
        ├── 📄 response.js           # Standardized API responses
        ├── 📄 jwt.js                # JWT token utilities
        └── 📄 sanitize.js           # Data sanitization
```

## 🔍 File Responsibilities

### Entry Points

#### `server.js`

- Loads environment variables
- Connects to MongoDB
- Starts Express server
- Entry point for the application

#### `app.js`

- Configures Express app
- Sets up middleware (helmet, cors, rate limiting)
- Defines routes
- Error handling

### Configuration

#### `config/db.js`

- MongoDB connection logic
- Connection error handling
- Mongoose configuration

### Models (Data Layer)

#### `models/User.js`

```javascript
{
  email: String (unique, optional),
  phone: String (unique, optional),
  passwordHash: String (required),
  role: String (enum: ["user", "admin"])
}
```

#### `models/Order.js`

```javascript
{
  userId: ObjectId (ref: User),
  service: String,
  status: String (enum: ["pending_docs", "in_review", ...]),
  priceToman: Number,
  requiredDocs: [String],
  docsSummary: { uploaded, accepted, resubmit },
  adminNote: String
}
```

#### `models/Document.js`

```javascript
{
  orderId: ObjectId (ref: Order),
  userId: ObjectId (ref: User),
  type: String,
  fileUrl: String,
  status: String (enum: ["uploaded", "accepted", "resubmit"]),
  adminNote: String
}
```

### Controllers (Business Logic)

#### `controllers/auth.controller.js`

- `register()` - User registration
- `login()` - User authentication
- `refresh()` - Token refresh
- `logout()` - Clear cookies
- `me()` - Get current user

#### `controllers/order.controller.js`

- `createOrder()` - Create new order
- `addDocument()` - Upload document
- `myOrders()` - Get user's orders
- `getOrderById()` - Get single order

#### `controllers/admin.controller.js`

- `listOrders()` - List all orders (paginated)
- `getOrderDetails()` - Get order with user info
- `orderDocs()` - Get order documents
- `reviewDoc()` - Accept/reject document
- `updateOrderStatus()` - Manual status update
- `getStats()` - Platform statistics

### Middleware

#### `middleware/auth.js`

- Verifies JWT access token from cookies
- Attaches user info to `req.user`
- Returns 401 if invalid/expired

#### `middleware/admin.js`

- Checks if `req.user.role === "admin"`
- Returns 403 if not admin

#### `middleware/error.js`

- Centralized error handling
- Handles Mongoose errors
- Handles JWT errors
- Environment-based error details

### Routes (API Endpoints)

#### `routes/auth.routes.js`

```
POST   /api/auth/register    - Register user
POST   /api/auth/login       - Login user
POST   /api/auth/refresh     - Refresh token
POST   /api/auth/logout      - Logout user
GET    /api/auth/me          - Get current user
```

#### `routes/order.routes.js`

```
GET    /api/orders/me              - Get my orders
GET    /api/orders/:orderId        - Get order by ID
POST   /api/orders                 - Create order
POST   /api/orders/:orderId/docs   - Upload document
```

#### `routes/admin.routes.js`

```
GET    /api/admin/stats                      - Statistics
GET    /api/admin/orders                     - List orders
GET    /api/admin/orders/:orderId            - Order details
GET    /api/admin/orders/:orderId/documents  - Order documents
PATCH  /api/admin/orders/:orderId/status     - Update status
PATCH  /api/admin/documents/:docId/review    - Review document
```

### Services (Business Logic)

#### `services/order.service.js`

- `recomputeOrderSummary()` - Calculate order status based on documents
  - Counts uploaded, accepted, resubmit documents
  - Updates order status automatically
  - Implements business rules

### Validators (Input Validation)

#### `validators/auth.validation.js`

- `registerSchema` - Validates registration input
- `loginSchema` - Validates login input
- Uses Zod for schema validation

#### `validators/order.validation.js`

- `createOrderSchema` - Validates order creation
- `addDocSchema` - Validates document upload
- Uses Zod for schema validation

### Utilities (Helpers)

#### `utils/response.js`

Standardized API response helpers:

- `ApiResponse.success()` - 200 success
- `ApiResponse.created()` - 201 created
- `ApiResponse.badRequest()` - 400 bad request
- `ApiResponse.unauthorized()` - 401 unauthorized
- `ApiResponse.forbidden()` - 403 forbidden
- `ApiResponse.notFound()` - 404 not found
- `ApiResponse.conflict()` - 409 conflict
- `ApiResponse.tooManyRequests()` - 429 rate limit
- `ApiResponse.serverError()` - 500 server error

#### `utils/jwt.js`

JWT token utilities:

- `generateAccessToken()` - Create 15min token
- `generateRefreshToken()` - Create 7d token
- `verifyAccessToken()` - Verify access token
- `verifyRefreshToken()` - Verify refresh token
- `setAuthCookies()` - Set both cookies
- `clearAuthCookies()` - Clear both cookies

#### `utils/sanitize.js`

Data sanitization:

- `sanitizeQuery()` - Remove MongoDB operators
- `sanitizeUser()` - Remove sensitive fields

## 🔄 Request Flow

### Authentication Flow

```
1. Client → POST /api/auth/login
2. Route → auth.routes.js
3. Controller → auth.controller.js → login()
4. Validator → loginSchema.parse()
5. Model → User.findOne()
6. Service → bcrypt.compare()
7. Utility → generateAccessToken(), generateRefreshToken()
8. Utility → setAuthCookies()
9. Response → ApiResponse.success()
10. Client ← { success, message, data: { user } }
```

### Authenticated Request Flow

```
1. Client → GET /api/orders/me (with cookies)
2. Route → order.routes.js
3. Middleware → auth.js → verifyAccessToken()
4. Controller → order.controller.js → myOrders()
5. Model → Order.find({ userId })
6. Response → ApiResponse.success()
7. Client ← { success, message, data: { orders } }
```

### Admin Request Flow

```
1. Client → GET /api/admin/orders (with cookies)
2. Route → admin.routes.js
3. Middleware → auth.js → verifyAccessToken()
4. Middleware → admin.js → check role
5. Controller → admin.controller.js → listOrders()
6. Model → Order.find().populate()
7. Response → ApiResponse.success()
8. Client ← { success, message, data: { orders } }
```

### Error Flow

```
1. Error occurs in controller
2. next(error) called
3. Middleware → error.js
4. Error type detected (Mongoose, JWT, etc.)
5. Response → ApiResponse.error()
6. Client ← { success: false, message, errors }
```

## 🔐 Security Layers

```
┌─────────────────────────────────────────┐
│         Client Request                   │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Layer 1: Rate Limiting                  │
│  - Global: 100 req/15min                 │
│  - Auth: 5 req/15min                     │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Layer 2: CORS                           │
│  - Origin check                          │
│  - Credentials validation                │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Layer 3: Helmet                         │
│  - Security headers                      │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Layer 4: Body Parser                    │
│  - Size limit: 2MB                       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Layer 5: Authentication                 │
│  - JWT verification                      │
│  - Cookie validation                     │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Layer 6: Authorization                  │
│  - Role check (admin)                    │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Layer 7: Input Validation               │
│  - Zod schema validation                 │
│  - NoSQL injection prevention            │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Layer 8: Business Logic                 │
│  - Controllers & Services                │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Layer 9: Data Sanitization              │
│  - Remove sensitive fields               │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│  Layer 10: Error Handling                │
│  - Centralized error handler             │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Standardized Response            │
└─────────────────────────────────────────┘
```

## 📊 Data Flow

### Order Status Automation

```
Document Upload
      ↓
recomputeOrderSummary()
      ↓
Count: uploaded, accepted, resubmit
      ↓
Business Rules:
  - If resubmit > 0 → needs_resubmit
  - If uploaded >= required → in_review
  - If accepted >= required → approved
      ↓
Update Order Status
```

## 🎯 Key Design Patterns

### 1. MVC Pattern

- **Models**: Data structure (Mongoose schemas)
- **Views**: JSON responses (standardized format)
- **Controllers**: Business logic

### 2. Middleware Chain

- Request → Middleware 1 → Middleware 2 → Controller → Response

### 3. Service Layer

- Controllers call services for complex business logic
- Services are reusable across controllers

### 4. Utility Functions

- DRY principle
- Reusable helpers for common tasks

### 5. Centralized Error Handling

- All errors flow through single error handler
- Consistent error responses

## 📝 Naming Conventions

### Files

- Controllers: `*.controller.js`
- Routes: `*.routes.js`
- Models: PascalCase (e.g., `User.js`)
- Validators: `*.validation.js`
- Utilities: lowercase (e.g., `response.js`)

### Functions

- Controllers: camelCase (e.g., `createOrder`)
- Middleware: camelCase (e.g., `auth`)
- Utilities: camelCase (e.g., `sanitizeUser`)

### Variables

- Constants: UPPER_SNAKE_CASE
- Regular: camelCase
- Private: \_prefixed (if needed)

## 🔧 Configuration

### Environment Variables

```env
PORT=4000                    # Server port
NODE_ENV=development         # Environment mode
MONGO_URI=mongodb://...      # Database connection
JWT_SECRET=...               # Access token secret
JWT_REFRESH_SECRET=...       # Refresh token secret
FRONTEND_URL=...             # CORS origin
```

### Token Configuration

```javascript
ACCESS_TOKEN_EXPIRY = "15m";
REFRESH_TOKEN_EXPIRY = "7d";
```

### Cookie Configuration

```javascript
{
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: "strict",
  path: "/"
}
```

## 📈 Scalability Considerations

### Stateless Design

- JWT tokens (no server-side sessions)
- Horizontal scaling ready

### Database Indexes

- User: email, phone
- Order: userId, status, service
- Document: orderId, userId, status

### Caching Opportunities

- User data (after login)
- Order statistics
- Frequently accessed orders

### Load Balancing Ready

- No server-side state
- PM2 cluster mode compatible
- Nginx load balancer compatible

---

**This structure ensures maintainability, scalability, and security for production deployment.**
