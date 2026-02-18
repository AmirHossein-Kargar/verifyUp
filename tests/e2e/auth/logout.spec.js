// @ts-check
const { test, expect } = require('@playwright/test');
const {
  loginAndWaitForDashboard,
  logoutViaHeader,
  getAuthCookies,
} = require('./auth-helpers');

const VALID_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com';
const VALID_PASSWORD = process.env.TEST_USER_PASSWORD || 'password123';

test.describe('Logout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await loginAndWaitForDashboard(page, {
      email: VALID_EMAIL,
      password: VALID_PASSWORD,
    });
  });

  test('click logout: redirect to home and authenticated UI is gone', async ({
    page,
  }) => {
    await logoutViaHeader(page);

    await expect(page).toHaveURL((url) => url.pathname === '/');
    await expect(page.getByTestId('user-menu-button')).not.toBeVisible();
    await expect(page.getByTestId('dashboard-welcome')).not.toBeVisible();
  });

  test('after logout: protected route redirects to login', async ({ page }) => {
    await logoutViaHeader(page);
    await expect(page).toHaveURL((url) => url.pathname === '/');

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);

    await page.goto('/dashboard/profile');
    await expect(page).toHaveURL(/\/login/);
  });

  test('after logout: auth cookies are cleared', async ({ page }) => {
    await logoutViaHeader(page);

    const authCookies = await getAuthCookies(page);
    expect(authCookies.length).toBe(0);
  });
});
