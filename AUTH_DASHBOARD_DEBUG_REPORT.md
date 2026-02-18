# Authentication & User Dashboard Debug Report

**Date:** February 18, 2025  
**Scope:** Full authentication flow, user dashboard, backend auth/dashboard APIs, guards, and session handling.

---

## 1. Issues Found and Root Causes

### 1.1 AuthContext – Logout state and CSRF

- **Issue:** After a successful logout, `isLoggingOut` was never reset to `false` (it was only reset in the `catch` block). This could leave the UI in a permanent “logging out” state.
- **Root cause:** Missing `finally` block to always clear `isLoggingOut`.
- **Additional:** On logout, the API client’s cached CSRF token was not cleared, so the next login could reuse an invalid or stale token.

### 1.2 Backend – Logout not clearing `userRole` cookie

- **Issue:** The backend set a client-readable `userRole` cookie on login but did not clear it on logout. Middleware or client code could still see the old role after logout.
- **Root cause:** `clearAuthCookies()` only clears `accessToken` and `refreshToken`; `userRole` was set separately and never cleared.

### 1.3 Backend – Typo in `userRole` cookie maxAge (verifyOtp)

- **Issue:** In `auth.controller.js` (verifyOtp), the `userRole` cookie used `maxAge: 7 * 24 * 60 * 60 * 000` (literal `000`), so the cookie expired immediately.
- **Root cause:** Typo: `000` instead of `1000`.

### 1.4 Backend – Resend OTP response shape (signup)

- **Issue:** In development, the backend put `otp` on the same object as `message` and passed it to `ApiResponse.success(res, responseData)`. `ApiResponse.success` only forwards `message`, `data`, and `meta`, so `otp` was dropped and the frontend never received it.
- **Root cause:** Response helper expects optional `data`; OTP was not passed inside `data`.

### 1.5 Profile page – Inconsistent auth guard and redirect

- **Issue:** Profile used a custom redirect (`router.push('/login')`) and did not use `useRequireAuth`, unlike other dashboard pages. Logout was fired without awaiting, so redirect could happen before logout completed.
- **Root cause:** Different guard pattern and synchronous redirect after calling async `logout()`.

### 1.6 Profile page – Stale state and duplicate skeleton logic

- **Issue:** After switching to `useRequireAuth`, a second `useEffect` still referenced the old `loading` variable (removed), which would have caused a runtime error. There was also redundant local skeleton state.
- **Root cause:** Incomplete refactor when introducing `useRequireAuth`.

### 1.7 Signup – Resend OTP reading wrong response field

- **Issue:** Signup expected `response.otp` after resend OTP; backend now returns OTP in `response.data.otp` when fixed. Frontend was not aligned with the corrected backend shape.
- **Root cause:** Frontend written for the previous (broken) response shape.

### 1.8 Logging and diagnostics

- **Issue:** API client logged full request headers in development (noisy and slightly sensitive). Auth had no clear dev-only success path log for session restore.
- **Root cause:** Ad-hoc logging; no consistent, minimal dev logging.

---

## 2. Fixes Applied

### 2.1 Frontend – AuthContext (`frontend/src/contexts/AuthContext.jsx`)

- In `logout()`:
  - Use `finally` to always set `isLoggingOut` to `false`.
  - On success, call `api.clearCsrfToken?.()` so the next login gets a fresh CSRF token.
  - On error, still set `setUser(null)` so the UI reflects “logged out” and avoid stale user state.
- In `checkAuth()`:
  - Set user with `response.data?.user ?? null` to avoid undefined.
  - Add dev-only `console.info` when session is restored (email or id only).
  - Restrict dev `console.warn` to status and message (no full error object).

### 2.2 Frontend – API client (`frontend/src/lib/api.js`)

- Add `clearCsrfToken()` to reset `csrfToken` and `csrfLoading` so the next state-changing request fetches a new CSRF token.
- Replace verbose request/response logs with:
  - `console.debug("[API]", method, endpoint, "csrf:", !!csrfToken)` for requests.
  - `console.warn` only for non-OK responses, excluding expected 401 on `/auth/me`.

### 2.3 Backend – Auth controller (`backend/src/controllers/auth.controller.js`)

- **Logout:** After `clearAuthCookies(res)`, clear the `userRole` cookie with the same path/options used when setting it (`path: "/"`, `httpOnly: false`, `sameSite: "lax"`).
- **verifyOtp:** Fix `userRole` cookie `maxAge` from `7 * 24 * 60 * 60 * 000` to `* 1000`.
- **resendOtp:** In development, return OTP inside the standard payload as `data: { otp }` so the client receives it as `response.data.otp`. Use the existing `ApiResponse.success(res, { message, data })` shape.

### 2.4 Frontend – Signup (`frontend/src/app/signup/page.jsx`)

- After resend OTP, read OTP from `response.data?.otp` and use `response.message` for the toast when present.

### 2.5 Frontend – Profile page (`frontend/src/app/dashboard/profile/page.jsx`)

- Use `useRequireAuth()` for auth guard and skeleton (same pattern as dashboard and orders).
- Remove custom “redirect when !user” effect and the broken effect that referenced `loading`.
- Remove redundant local `showSkeleton` state and the 800ms delay effect; rely on `authLoading` and `authSkeleton` from `useRequireAuth`.
- Make `handleLogout` async: `await logout()` then `router.replace('/')` so redirect happens after logout completes.

---

## 3. What Was Verified (No Code Change)

- **Login:** Frontend sends `email` + `password`; backend `loginSchema` allows exactly one of `email` or `phone`; cookie path `/api` and credentials are correct.
- **Session persistence:** `checkAuth()` runs once on load via `getMe()`; 401 is treated as “not logged in” and does not spam the console.
- **Guards:** Dashboard and orders use `useRequireAuth()` from `@/hooks/useRequireAuth`; admin uses `useRequireAuth({ allowedRoles: ['admin'] })`; signup uses `useGuestOnly()` from `@/hooks/useAuthGuard`. Role-based redirects (admin → `/admin`, user → `/dashboard`) are implemented in `useRequireAuth`.
- **Orders API:** `GET /api/orders/me` is protected by `auth` + `requireRole('user')`; frontend `useOrders` uses `response.data?.orders` and handles 401 by clearing orders.
- **Middleware:** Next.js `middleware.ts` only sets security headers; it does not perform route-based auth (auth is handled in layout/page hooks with `useRequireAuth`).
- **Backend CORS:** Uses `FRONTEND_URL` and `credentials: true`; CSRF and cookie configuration are consistent.

---

## 4. Remaining Risks and Recommendations

1. **Token refresh:** Access token expiry is 15 minutes. The frontend does not currently call `/auth/refresh` on 401; users are sent to login when the access token expires. For longer sessions without re-login, consider:
   - Detecting 401 on API responses (or a dedicated “token expired” response),
   - Calling `api.refreshToken()` and retrying the request,
   - Or a periodic refresh before expiry.

2. **Rate limit on auth:** Auth endpoints use a strict limiter (e.g. 5 attempts per 15 minutes per identifier). Ensure production uses a persistent store (e.g. Redis) for rate limits if you run multiple instances.

3. **Double auth hooks:** The codebase has both `useAuthGuard.js` (e.g. `useGuestOnly`, `useRequireAuth`, `useRequireAdmin`) and `useRequireAuth.js` (role/path-aware `useRequireAuth`). Dashboard and admin use `useRequireAuth.js`; signup uses `useAuthGuard.js`’s `useGuestOnly`. Consider consolidating into one auth-guard module to avoid confusion.

4. **Profile update:** Profile form “ذخیره تغییرات” only shows a toast; there is no PATCH/PUT to the backend to persist name/email/phone. Add an API and wire the form when profile updates are required.

5. **E2E tests:** Add E2E tests for: login → dashboard, logout → home, protected route redirect when unauthenticated, and (if applicable) signup → verify OTP → dashboard.

---

## 5. Summary Table

| Area              | Issue                                      | Fix                                                                 |
|-------------------|--------------------------------------------|---------------------------------------------------------------------|
| AuthContext       | `isLoggingOut` not reset on success        | `finally { setIsLoggingOut(false) }`; clear CSRF on success        |
| AuthContext       | No CSRF clear on logout                    | Call `api.clearCsrfToken?.()` after successful logout               |
| Backend logout    | `userRole` cookie not cleared              | `res.clearCookie("userRole", { path: "/", ... })`                   |
| Backend verifyOtp | `userRole` cookie maxAge typo              | `000` → `1000`                                                     |
| Backend resendOtp | OTP not in response in dev                 | Return `data: { otp }` in dev via `ApiResponse.success`            |
| Signup            | Resend OTP read wrong field                | Use `response.data?.otp` and `response.message`                     |
| Profile           | No `useRequireAuth`, redirect before logout | Use `useRequireAuth`; `await logout()` then `router.replace('/')`  |
| Profile           | Stale `loading` ref, duplicate skeleton   | Remove duplicate effect; rely on `authLoading` / `authSkeleton`     |
| Logging           | Noisy/sensitive API logs                   | Minimal dev-only `[API]` / `[Auth]` logs; no header dumps           |

All changes are backward-compatible and do not alter public API contracts. Authentication flow, dashboard loading, and logout behavior are now consistent and easier to debug.
