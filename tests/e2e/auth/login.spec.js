// @ts-check
const { test, expect } = require('@playwright/test');
const {
  loginWithCredentials,
  loginAndWaitForDashboard,
  getAuthCookies,
} = require('./auth-helpers');

// Use env vars for test user (must exist in DB and be verified)
const VALID_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com';
const VALID_PASSWORD = process.env.TEST_USER_PASSWORD || 'password123';

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('login page renders with form and main elements', async ({ page }) => {
    await expect(page.getByTestId('login-form')).toBeVisible();
    await expect(page.getByTestId('login-email')).toBeVisible();
    await expect(page.getByTestId('login-password')).toBeVisible();
    await expect(page.getByTestId('login-submit')).toBeVisible();
    await expect(page.getByRole('heading', { name: /ورود به حساب کاربری/ })).toBeVisible();
  });

  test('valid credentials: redirect to dashboard and show authenticated UI', async ({
    page,
  }) => {
    await loginWithCredentials(page, { email: VALID_EMAIL, password: VALID_PASSWORD });

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    await expect(page.getByTestId('dashboard-welcome')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('dashboard-content')).toBeVisible();
  });

  test('valid credentials: auth cookies are set after login', async ({ page }) => {
    await loginAndWaitForDashboard(page, {
      email: VALID_EMAIL,
      password: VALID_PASSWORD,
    });

    const authCookies = await getAuthCookies(page);
    const names = authCookies.map((c) => c.name);
    expect(names).toContain('accessToken');
    expect(names).toContain('refreshToken');
  });

  test('valid credentials: user remains logged in after page reload', async ({
    page,
  }) => {
    await loginAndWaitForDashboard(page, {
      email: VALID_EMAIL,
      password: VALID_PASSWORD,
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByTestId('dashboard-welcome')).toBeVisible();
  });
});

test.describe('Invalid Login', () => {
  test('invalid credentials: error toast shown and stay on login', async ({
    page,
  }) => {
    await loginWithCredentials(page, {
      email: 'wrong@example.com',
      password: 'wrongpassword',
    });

    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId('toast')).toBeVisible({ timeout: 8000 });
    await expect(page.getByTestId('toast-message')).toContainText(
      /اشتباه|نامعتبر|خطا|wrong|invalid/i,
      { timeout: 5000 }
    );
  });

  test('invalid credentials: no auth cookies set', async ({ page }) => {
    await loginWithCredentials(page, {
      email: 'nonexistent@example.com',
      password: 'somepassword',
    });

    await expect(page).toHaveURL(/\/login/);
    const authCookies = await getAuthCookies(page);
    expect(authCookies.length).toBe(0);
  });
});
