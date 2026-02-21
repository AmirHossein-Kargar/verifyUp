# Profile E2E tests

## Profile image upload flow

- **Spec:** `profile-image.spec.js`
- **Project:** `profile-flow` (uses shared auth from `auth.setup.js`)

### What it covers

1. Navigate to `/dashboard/profile`
2. Upload a new profile image via the profile image upload control
3. Verify the new image is displayed on the profile page avatar
4. Verify the header/navbar avatar shows the new image
5. Refresh the page and confirm the image persists
6. Navigate to another dashboard page (`/dashboard/orders`) and confirm the header still shows the updated profile image

### How to run

From the repo root, with frontend (e.g. `http://localhost:3000`) and backend (e.g. `http://localhost:4000`) running:

```bash
# Install Playwright browsers once (if needed)
npx playwright install

# Run with default test user (from auth.setup.js)
npm run e2e:profile
```

To use a specific account, set `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` before running (same as order-flow):

- **PowerShell:** `$env:TEST_USER_EMAIL="your@email.com"; $env:TEST_USER_PASSWORD="yourpassword"; npm run e2e:profile`
- **Bash:** `TEST_USER_EMAIL="your@email.com" TEST_USER_PASSWORD="yourpassword" npm run e2e:profile`

The setup logs in, redirects to `/dashboard`, then the profile test runs the image upload flow.
