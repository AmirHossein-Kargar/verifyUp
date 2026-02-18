// @ts-check
const { test, expect } = require('@playwright/test');
const {
  loginAndWaitForDashboard,
  loginWithCredentials,
} = require('./auth-helpers');

const USER_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com';
const USER_PASSWORD = process.env.TEST_USER_PASSWORD || 'password123';
const ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || 'adminpassword123';

test.describe('Role-based Access', () => {
  test('normal user: can access /dashboard', async ({ page }) => {
    await loginAndWaitForDashboard(page, {
      email: USER_EMAIL,
      password: USER_PASSWORD,
    });

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByTestId('dashboard-welcome')).toBeVisible();
  });

  test('normal user: redirect from /admin to /dashboard or /login', async ({
    page,
  }) => {
    await loginAndWaitForDashboard(page, {
      email: USER_EMAIL,
      password: USER_PASSWORD,
    });

    await page.goto('/admin');
    await page.waitForURL(/\/(admin|dashboard|login)/);

    const path = new URL(page.url()).pathname;
    expect(path).not.toMatch(/^\/admin\/?$/);
  });

  test('admin user: can access /admin', async ({ page }) => {
    test.skip(
      !process.env.TEST_ADMIN_EMAIL || !process.env.TEST_ADMIN_PASSWORD,
      'Admin credentials not set (TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD)'
    );

    await loginWithCredentials(page, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    await page.waitForURL(/\/(admin|dashboard)/);
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin/);
  });
});
