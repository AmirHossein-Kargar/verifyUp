// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Protected Route Access', () => {
  test('access /dashboard without login redirects to /login', async ({
    page,
  }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId('login-form')).toBeVisible();
  });

  test('access /dashboard/profile without login redirects to /login', async ({
    page,
  }) => {
    await page.goto('/dashboard/profile');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId('login-form')).toBeVisible();
  });

  test('access /dashboard/orders without login redirects to /login', async ({
    page,
  }) => {
    await page.goto('/dashboard/orders');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId('login-form')).toBeVisible();
  });
});
