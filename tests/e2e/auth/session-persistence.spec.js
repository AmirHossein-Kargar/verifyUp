// @ts-check
const { test, expect } = require('@playwright/test');
const { loginAndWaitForDashboard } = require('./auth-helpers');

const VALID_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com';
const VALID_PASSWORD = process.env.TEST_USER_PASSWORD || 'password123';

test.describe('Session Persistence', () => {
  test('after login, reload keeps user authenticated and dashboard loads', async ({
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
    await expect(page.getByTestId('dashboard-content')).toBeVisible();
  });

  test('after login, navigate away and back to dashboard still shows content', async ({
    page,
  }) => {
    await loginAndWaitForDashboard(page, {
      email: VALID_EMAIL,
      password: VALID_PASSWORD,
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByTestId('dashboard-welcome')).toBeVisible();
  });
});
