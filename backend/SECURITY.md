# Security Implementation Guide

## Overview

This document outlines the security measures implemented in the VerifyUp backend.

## 1. Authentication & Authorization

### JWT Strategy

- **Access Token**: 15-minute expiry, stored in HttpOnly cookie
- **Refresh Token**: 7-day expiry, stored in HttpOnly cookie
- **Separate Secrets**: Different secrets for access and refresh tokens

### Cookie Security

```javascript
{
  httpOnly: true,        // Prevents JavaScript access (XSS protection)
  secure: true,          // HTTPS only in production
  sameSite: "strict",    // CSRF protection
  path: "/"
}
```

### Why HttpOnly Cookies?

1. **XSS Protection**: JavaScript cannot access tokens
2. **Automatic Sending**: Browser handles token transmission
3. **CSRF Protection**: Combined with sameSite attribute
4. **No Local Storage**: Tokens never exposed to client-side code

## 2. Password Security

### Bcrypt Hashing

- **Salt Rounds**: 12 (recommended for 2024+)
- **Never Stored Plain**: Passwords immediately hashed on registration
- **Never Returned**: passwordHash excluded from all responses

```javascript
// Registration
const passwordHash = await bcrypt.hash(password, 12);

// Login verification
const isValid = await bcrypt.compare(password, user.passwordHash);
```

## 3. Input Validation

### Zod Schema Validation

All inputs validated before processing:

```javascript
// Example: Registration
const registerSchema = z
  .object({
    email: z.string().email("Invalid email format").optional(),
    phone: z.string().min(8, "Phone must be at least 8 characters").optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((d) => d.email || d.phone, {
    message: "Either email or phone is required",
  });
```

### NoSQL Injection Prevention

```javascript
// Sanitize queries to remove MongoDB operators
function sanitizeQuery(obj) {
  const sanitized = {};
  for (const key in obj) {
    if (key.startsWith("$")) continue; // Remove operators like $where, $ne
    sanitized[key] =
      typeof obj[key] === "object" ? sanitizeQuery(obj[key]) : obj[key];
  }
  return sanitized;
}
```

## 4. Rate Limiting

### Global Rate Limit

- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Purpose**: Prevent DoS attacks

### Auth Endpoint Rate Limit

- **Window**: 15 minutes
- **Max Requests**: 5 per IP
- **Purpose**: Prevent brute force attacks

```javascript
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many authentication attempts, please try again later",
});
```

## 5. CORS Configuration

### Restricted Origin

```javascript
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // Allow cookies
  })
);
```

**Production Checklist:**

- [ ] Set FRONTEND_URL to actual domain
- [ ] Never use wildcard (\*) origin with credentials
- [ ] Use HTTPS in production

## 6. HTTP Security Headers (Helmet)

Helmet automatically sets:

- `X-DNS-Prefetch-Control`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection`
- `Strict-Transport-Security` (HSTS)
- And more...

```javascript
app.use(helmet());
```

## 7. Request Size Limits

```javascript
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
```

Prevents:

- Memory exhaustion attacks
- Large payload DoS

## 8. Error Handling

### Production vs Development

```javascript
// Development: Full error details
if (process.env.NODE_ENV !== "production") {
  console.error("❌ Error:", err);
}

// Production: Minimal info, no stack traces
return ApiResponse.serverError(res, {
  message:
    process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message,
});
```

### Never Expose:

- Stack traces in production
- Database errors
- Internal paths
- Sensitive configuration

## 9. Database Security

### Mongoose Best Practices

```javascript
// Strict query mode
mongoose.set("strictQuery", true);

// Index sensitive fields
email: { type: String, unique: true, sparse: true, index: true }

// Never expose internal fields
.select("-__v -passwordHash")
```

### Connection Security

- Use connection string with authentication
- Enable SSL/TLS for MongoDB in production
- Restrict database user permissions

### Database User Permissions (Least Privilege)

In production, the application should connect using a **non-admin MongoDB user**
that has only the permissions it needs for the specific database.

Example (Mongo shell):

```javascript
use VerifyUp;

db.createUser({
  user: "verifyup_app",
  pwd: "<strong-unique-password>",
  roles: [
    {
      role: "readWrite",
      db: "VerifyUp",
    },
  ],
});
```

Recommendations:

- ✅ Use a dedicated app user (e.g. `verifyup_app`) with `readWrite` on the app DB only
- ✅ Store the full connection string (including user/password) in `MONGO_URI` via environment variables
- ❌ Do **not** use built-in `admin` or `root` users for the application
- ❌ Do **not** grant `dbAdmin`, `userAdminAnyDatabase`, or cluster-wide roles to the app user
- ✅ Consider separate users for read-only analytics/reporting if needed

## 10. Role-Based Access Control (RBAC)

### Middleware Chain

```javascript
// User routes
router.use(auth); // Verify authentication

// Admin routes
router.use(auth, admin); // Verify authentication + admin role
```

### Authorization Check

```javascript
function admin(req, res, next) {
  if (req.user?.role !== "admin") {
    return ApiResponse.forbidden(res, {
      message: "Admin access required",
    });
  }
  next();
}
```

## 11. Sensitive Data Handling

### User Sanitization

```javascript
function sanitizeUser(user) {
  const { passwordHash, __v, ...safe } = user.toObject ? user.toObject() : user;
  return safe;
}
```

### Never Return:

- Password hashes
- Internal MongoDB fields (`__v`)
- Refresh tokens in response bodies
- Other users' personal data

## 12. Token Refresh Strategy

### Flow

1. Access token expires (15 min)
2. Frontend receives 401 error
3. Frontend calls `/api/auth/refresh`
4. Backend validates refresh token (from cookie)
5. New access token issued
6. Original request retried

### Security Benefits

- Short-lived access tokens limit exposure
- Refresh tokens can be revoked
- Automatic token rotation

## 13. Logging

### Development

```javascript
app.use(morgan("dev")); // Detailed logs
```

### Production

```javascript
app.use(morgan("combined")); // Standard Apache format
```

### What to Log

- ✅ Authentication attempts
- ✅ Authorization failures
- ✅ Error timestamps
- ❌ Passwords
- ❌ Tokens
- ❌ Personal data

## 14. Environment Variables

### Required Secrets

```env
JWT_SECRET=<min-32-char-random-string>
JWT_REFRESH_SECRET=<different-min-32-char-random-string>
```

### Generate Strong Secrets

```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# OpenSSL
openssl rand -hex 32
```

### Never Commit

- Add `.env` to `.gitignore`
- Use environment-specific configs
- Rotate secrets regularly

## 15. Production Deployment Checklist

### Environment

- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secrets (32+ chars)
- [ ] Configure FRONTEND_URL to actual domain
- [ ] Enable HTTPS
- [ ] Set secure: true for cookies

### Database

- [ ] Enable MongoDB authentication
- [ ] Use SSL/TLS connection
- [ ] Restrict database user permissions
- [ ] Regular backups

### Server

- [ ] Use process manager (PM2, systemd)
- [ ] Set up monitoring (logs, errors, performance)
- [ ] Configure firewall
- [ ] Keep dependencies updated
- [ ] Regular security audits (`npm audit`)

### Network

- [ ] Use reverse proxy (nginx, Apache)
- [ ] Configure SSL/TLS certificates
- [ ] Set up CDN if needed
- [ ] DDoS protection

### Monitoring

- [ ] Error tracking (Sentry, etc.)
- [ ] Performance monitoring
- [ ] Security alerts
- [ ] Audit logs

## 16. Common Vulnerabilities Prevented

| Vulnerability          | Prevention Method                          |
| ---------------------- | ------------------------------------------ |
| XSS                    | HttpOnly cookies, input validation, helmet |
| CSRF                   | SameSite cookies, CORS restrictions        |
| SQL/NoSQL Injection    | Input validation, query sanitization       |
| Brute Force            | Rate limiting on auth endpoints            |
| Session Hijacking      | Short-lived tokens, secure cookies         |
| Man-in-the-Middle      | HTTPS, secure cookies                      |
| DoS                    | Rate limiting, request size limits         |
| Information Disclosure | Error handling, data sanitization          |

## 17. Security Testing

### Manual Testing

```bash
# Test rate limiting
for i in {1..10}; do curl -X POST http://localhost:4000/api/auth/login; done

# Test invalid tokens
curl -X GET http://localhost:4000/api/orders/me \
  --cookie "accessToken=invalid_token"

# Test CORS
curl -X GET http://localhost:4000/api/orders/me \
  -H "Origin: http://malicious-site.com"
```

### Automated Testing

- Use `npm audit` regularly
- Implement integration tests
- Use security scanning tools (Snyk, etc.)

## 18. Incident Response

### If Tokens Compromised

1. Rotate JWT secrets immediately
2. Force logout all users
3. Investigate breach source
4. Notify affected users
5. Update security measures

### If Database Compromised

1. Isolate affected systems
2. Change all credentials
3. Audit access logs
4. Restore from clean backup
5. Implement additional security

## 19. Additional Recommendations

### Future Enhancements

- [ ] Implement refresh token rotation
- [ ] Add 2FA (Two-Factor Authentication)
- [ ] Implement account lockout after failed attempts
- [ ] Add email verification
- [ ] Implement password reset flow
- [ ] Add audit logging for sensitive operations
- [ ] Implement IP whitelisting for admin
- [ ] Add webhook signature verification
- [ ] Implement file upload validation
- [ ] Add content security policy (CSP)

### Regular Maintenance

- Update dependencies monthly
- Review security logs weekly
- Rotate secrets quarterly
- Security audit annually
- Penetration testing as needed

## 20. Resources

### Documentation

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

### Tools

- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [Snyk](https://snyk.io/)
- [Helmet](https://helmetjs.github.io/)
- [OWASP ZAP](https://www.zaproxy.org/)

---

**Remember**: Security is an ongoing process, not a one-time implementation. Stay updated with latest security practices and vulnerabilities.
