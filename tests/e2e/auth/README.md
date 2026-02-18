# E2E Auth Tests

Playwright tests for the full authentication flow (login, logout, signup, protected routes, session persistence, role-based access).

## Prerequisites

- **Frontend** running at `http://localhost:3000` (e.g. `cd frontend && npm run dev`)
- **Backend API** running at `http://localhost:4000` (e.g. `cd backend && npm run dev`)
- A **verified test user** in the database for login/logout/session tests

## Environment variables (optional)

From the **repo root**:

| Variable | Description |
|----------|-------------|
| `TEST_USER_EMAIL` | Email of a verified user (default: `test@example.com`) |
| `TEST_USER_PASSWORD` | Password for that user (default: `password123`) |
| `TEST_ADMIN_EMAIL` | Admin user email (for role-based tests) |
| `TEST_ADMIN_PASSWORD` | Admin password |
| `TEST_SIGNUP_PHONE` | Phone for signup tests (default: `09121234567`) |
| `TEST_SIGNUP_EMAIL_BASE` | Base for unique signup emails (default: `e2e`) |
| `PLAYWRIGHT_BASE_URL` | Frontend URL (default: `http://localhost:3000`) |

## Run tests

From the **repo root**:

```bash
npm install
npx playwright install
npm run e2e:auth
```

Run only Chromium (19 tests, faster; use when debugging):

```bash
npx playwright test tests/e2e/auth/ --project=chromium
```

Or run all E2E tests:

```bash
npm run e2e
```

Run a single file:

```bash
npx playwright test tests/e2e/auth/login.spec.js
```

### Troubleshooting

- **37 failures / many red**: Often due to (1) auth cookies being set by the API (port 4000) — tests now request cookies for that origin; (2) logout dropdown not open — tests now wait for the logout button after opening the menu; (3) viewport — config uses 1280×720 so the desktop header (user menu) is visible.
- **Valid login tests fail**: Ensure a **verified** test user exists in the DB and set `TEST_USER_EMAIL` and `TEST_USER_PASSWORD`. Backend must be on the same host as in the frontend (e.g. `NEXT_PUBLIC_API_URL=http://localhost:4000/api`).
- **Cookie assertions fail**: Backend sets cookies on the API origin. If your API is not on `http://localhost:4000`, set `PLAYWRIGHT_API_URL` (e.g. `http://localhost:4000`) so the test helper requests cookies for that origin.

## Test structure

- **auth-helpers.js** – Reusable `loginWithCredentials`, `loginAndWaitForDashboard`, `logoutViaHeader`, `getAuthCookies`, `isAuthenticatedUIVisible`
- **login.spec.js** – Login page render, valid login, cookies, reload persistence; invalid login and no cookies
- **logout.spec.js** – Logout from header, redirect to home, protected redirect, cookies cleared
- **protected-routes.spec.js** – Unauthenticated access to `/dashboard`, `/dashboard/profile`, `/dashboard/orders` → redirect to `/login`
- **signup.spec.js** – Signup form render, submit → verification step; full signup with OTP (dev only, skips in CI)
- **session-persistence.spec.js** – Login then reload; login then navigate away and back
- **role-based.spec.js** – User can access `/dashboard`, user redirected from `/admin`; admin can access `/admin` (when credentials set)

## Selectors

Tests use `data-testid` attributes to avoid brittle class-based selectors:

- Login: `login-form`, `login-email`, `login-password`, `login-submit`
- Toast: `toast`, `toast-message`
- Header: `user-menu-button`, `logout-button`
- Dashboard: `dashboard-content`, `dashboard-welcome`
- Signup: `signup-form`, `signup-name`, `signup-email`, `signup-phone`, `signup-password`, `signup-confirm-password`, `signup-submit`, `signup-otp-form`, `signup-otp`, `signup-otp-submit`, `signup-otp-dev`, `signup-otp-value`
