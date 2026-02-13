# Common Issues and Solutions

## Authentication Issues

### "Illegal arguments: string, undefined" on Login

**Symptom:**

- Login fails with error: `Illegal arguments: string, undefined`
- Error occurs in bcrypt.compare()

**Cause:**
The `passwordHash` field has `select: false` in the User model, so it's not included in query results by default.

**Solution:**
Explicitly select the `passwordHash` field when querying:

```javascript
// ❌ Wrong - passwordHash not included
const user = await User.findOne({ email: email });

// ✅ Correct - explicitly select passwordHash
const user = await User.findOne({ email: email }).select("+passwordHash");
```

**Fixed in:** `src/controllers/auth.controller.js` - login function

---

### User Not Found After Registration

**Symptom:**

- Registration succeeds
- Login fails with "user not found"

**Cause:**

- Email/phone not verified
- User query doesn't match registration data

**Solution:**
Check verification status:

```javascript
const user = await User.findOne({ email: email });
if (!user.emailVerified && !user.phoneVerified) {
  return ApiResponse.forbidden(res, {
    message: "حساب کاربری شما هنوز تأیید نشده است",
  });
}
```

---

### OTP Not Received

**Symptom:**

- Registration succeeds
- No OTP code visible

**Cause:**

- Running in production mode
- SMS service not configured
- OTP not in response

**Solution:**

1. **Check environment:**

   ```env
   NODE_ENV=development
   ```

2. **Check server logs:**

   ```
   ============================================================
   📱 OTP CODE FOR 09123456789: 123456
   ============================================================
   ```

3. **Check API response (development only):**
   ```json
   {
     "data": {
       "otp": "123456" // Should be present in development
     }
   }
   ```

---

### CORS Errors

**Symptom:**

- API calls fail with CORS error
- "Access-Control-Allow-Origin" error

**Cause:**

- Frontend URL not in CORS whitelist
- Credentials not included in request

**Solution:**

1. **Backend (.env):**

   ```env
   FRONTEND_URL=http://localhost:3000
   ```

2. **Frontend (api.js):**
   ```javascript
   const api = axios.create({
     baseURL: process.env.NEXT_PUBLIC_API_URL,
     withCredentials: true, // Important!
   });
   ```

---

### Cookies Not Set

**Symptom:**

- Login succeeds
- User not authenticated on next request
- Cookies not visible in browser

**Cause:**

- `withCredentials` not set
- `sameSite` configuration issue
- HTTPS required in production

**Solution:**

1. **Development:**

   ```javascript
   // Backend
   res.cookie("accessToken", token, {
     httpOnly: true,
     secure: false, // false for development
     sameSite: "lax",
   });
   ```

2. **Production:**
   ```javascript
   res.cookie("accessToken", token, {
     httpOnly: true,
     secure: true, // true for production
     sameSite: "lax",
   });
   ```

---

### MongoDB Connection Failed

**Symptom:**

- Server fails to start
- "MongooseServerSelectionError"

**Cause:**

- MongoDB not running
- Wrong connection string
- Network issue

**Solution:**

1. **Check MongoDB is running:**

   ```bash
   # Windows
   net start MongoDB

   # Linux/Mac
   sudo systemctl start mongod
   ```

2. **Check connection string:**

   ```env
   MONGO_URI=mongodb://localhost:27017/VerifyUp
   ```

3. **Test connection:**
   ```bash
   mongosh mongodb://localhost:27017/VerifyUp
   ```

---

### Port Already in Use

**Symptom:**

- Server fails to start
- "EADDRINUSE: address already in use :::4000"

**Cause:**

- Another process using port 4000
- Previous server instance still running

**Solution:**

1. **Find process:**

   ```bash
   # Windows
   netstat -ano | findstr :4000

   # Linux/Mac
   lsof -i :4000
   ```

2. **Kill process:**

   ```bash
   # Windows
   taskkill /PID <PID> /F

   # Linux/Mac
   kill -9 <PID>
   ```

3. **Or change port:**
   ```env
   PORT=4001
   ```

---

### JWT Token Invalid

**Symptom:**

- 401 Unauthorized on authenticated routes
- "Invalid token" error

**Cause:**

- Token expired
- Wrong JWT secret
- Token version mismatch

**Solution:**

1. **Check token expiry:**

   ```javascript
   // Default: 15 minutes for access token
   const accessToken = generateAccessToken(payload);
   ```

2. **Refresh token:**

   ```javascript
   // Frontend should auto-refresh
   await api.post("/auth/refresh");
   ```

3. **Check JWT secrets:**
   ```env
   JWT_SECRET=your_secret_here
   JWT_REFRESH_SECRET=your_refresh_secret_here
   ```

---

### SMS Not Sending (Production)

**Symptom:**

- No error in logs
- SMS not received
- "SMS sent successfully" message

**Cause:**

- Insufficient credit
- Wrong phone number format
- Template not approved

**Solution:**

1. **Check credit:**
   - Login to sms.ir panel
   - Check account balance

2. **Check phone format:**

   ```javascript
   const formatted = formatMobileNumber("09123456789");
   console.log(formatted); // Should be: 989123456789
   ```

3. **Check template:**
   - Ensure template is approved
   - Use correct template ID

---

### Rate Limit Exceeded

**Symptom:**

- 429 Too Many Requests
- "Rate limit exceeded"

**Cause:**

- Too many requests in short time
- Rate limiter triggered

**Solution:**

1. **Wait and retry:**
   - Wait 15 minutes
   - Try again

2. **Adjust rate limits (development):**
   ```javascript
   // In app.js
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000,
     max: 200, // Increase for development
   });
   ```

---

### Environment Variables Not Loading

**Symptom:**

- `process.env.VARIABLE` is undefined
- Features not working

**Cause:**

- `.env` file not in correct location
- `dotenv` not configured
- Wrong variable name

**Solution:**

1. **Check file location:**

   ```
   backend/
   ├── .env          ← Should be here
   ├── src/
   └── package.json
   ```

2. **Check dotenv:**

   ```javascript
   // In server.js or app.js
   require("dotenv").config();
   ```

3. **Verify variables:**
   ```bash
   cat .env | grep SMS_API_KEY
   ```

---

## Quick Diagnostics

### Check Backend Health

```bash
curl http://localhost:4000/api/auth/me
```

### Check SMS Service

```bash
cd backend
npm run test:sms
```

### Check Database Connection

```bash
mongosh mongodb://localhost:27017/VerifyUp
```

### Check Environment

```bash
cat backend/.env
```

---

## Getting Help

1. Check this document first
2. Review error logs
3. Check [Troubleshooting Guide](./SMS_TROUBLESHOOTING.md)
4. Check [Development Mode Guide](./DEVELOPMENT_MODE.md)
5. Review [API Documentation](./API_DOCUMENTATION.md)

---

**Last Updated:** After fixing login passwordHash issue
