// @ts-check
/**
 * E2E: Checkout is protected; unauthenticated user is redirected to login.
 */
const { test, expect } = require('@playwright/test');

test.describe('Checkout protected route', () => {
  test('accessing /checkout without login redirects to /login', async ({
    page,
  }) => {
    await page.goto('/checkout');
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    await expect(page.getByTestId('login-form')).toBeVisible();
  });

  test('direct navigation to /checkout when logged out shows login then redirect', async ({
    page,
  }) => {
    await page.goto('/');
    await page.goto('/checkout');
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });
});
