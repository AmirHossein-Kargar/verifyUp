# Quick Start - Authentication

## 🚀 Start the Application

### 1. Backend Setup (First Time Only)

```bash
cd backend
npm install
```

Make sure you have a `.env` file in the `backend` folder with:

```env
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/VerifyUp
JWT_SECRET=your_super_secret_access_token_key_minimum_32_characters_long
JWT_REFRESH_SECRET=your_super_secret_refresh_token_key_minimum_32_characters_long
FRONTEND_URL=http://localhost:3000
```

### 2. Frontend Setup (First Time Only)

```bash
# In root directory
npm install
```

Create `.env.local` in root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# Windows (if installed as service)
net start MongoDB

# Or use MongoDB Compass to start it
```

### 4. Start Backend Server

```bash
cd backend
npm run dev
```

You should see:

```
✓ MongoDB connected successfully
✓ Server running on port 4000
```

### 5. Start Frontend Server

```bash
# In root directory (new terminal)
npm run dev
```

You should see:

```
▲ Next.js running on http://localhost:3000
```

## 🧪 Test the Authentication

### Test Signup:

1. Go to http://localhost:3000/signup
2. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
   - Confirm Password: password123
   - ✓ Accept terms
3. Click "ثبت نام"
4. You should see a success toast and be redirected to dashboard

### Test Login:

1. Go to http://localhost:3000/login
2. Fill in:
   - Email: test@example.com
   - Password: password123
3. Click "ورود به حساب کاربری"
4. You should see a success toast and be redirected to dashboard

### Test Dashboard:

1. After login, you should be on http://localhost:3000/dashboard
2. You should see your user information
3. Click "خروج از حساب" to logout

## ✅ What's Working

- ✅ User registration with email/password
- ✅ User login with email/password
- ✅ JWT authentication with HttpOnly cookies
- ✅ Toast notifications (success/error)
- ✅ Automatic redirect to dashboard
- ✅ Protected dashboard route
- ✅ User logout
- ✅ Form validation
- ✅ RTL support
- ✅ Dark mode support

## 🐛 Common Issues

### "Failed to fetch" error:

- Make sure backend is running on port 4000
- Check `.env.local` has correct API URL
- Verify MongoDB is running

### "User already exists" error:

- Use a different email
- Or delete the user from MongoDB

### Toast not showing:

- Check browser console for errors
- Make sure you're using the latest code

### Redirect not working:

- Check browser console for errors
- Make sure cookies are enabled
- Try clearing browser cookies

## 📝 API Endpoints

All endpoints use `http://localhost:4000/api` as base URL:

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user
- `POST /auth/refresh` - Refresh access token

## 🔐 Security Features

- JWT tokens in HttpOnly cookies (XSS protection)
- CORS configured for frontend only
- Rate limiting (5 requests per 15 min for auth)
- Password hashing with bcrypt
- Input validation with Zod
- Helmet security headers

## 📱 Pages

- `/` - Home page
- `/login` - Login page
- `/signup` - Signup page
- `/dashboard` - Protected dashboard (requires auth)
- `/cart` - Cart page (no footer)

Enjoy! 🎉
