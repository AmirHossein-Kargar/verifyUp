// @ts-check
/**
 * E2E: Order flow edge cases - empty cart checkout block, no-pending checkout, API error.
 */
const { test, expect } = require('@playwright/test');
const { loginAndWaitForDashboard } = require('../auth/auth-helpers');

const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com';
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || 'password123';

test.describe('Order edge cases', () => {
  test('checkout with no pending data shows no-order message', async ({
    page,
  }) => {
    await loginAndWaitForDashboard(page, {
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
    });
    await page.evaluate(() => window.localStorage.removeItem('pendingCheckout'));
    await page.goto('/checkout');
    await expect(page).toHaveURL(/\/checkout/);
    await expect(page.getByTestId('checkout-no-pending')).toBeVisible();
    await expect(page.getByTestId('checkout-no-pending')).toContainText(
      'سفارشی برای پرداخت یافت نشد'
    );
    await expect(page.getByRole('link', { name: /بازگشت به خدمات/ })).toBeVisible();
  });

  test('cart: proceed to checkout with empty cart shows warning and does not navigate', async ({
    page,
  }) => {
    await loginAndWaitForDashboard(page, {
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
    });
    await page.evaluate(() => {
      try {
        localStorage.setItem('cart', '[]');
      } catch (_) {}
    });
    await page.goto('/cart');
    await expect(page).toHaveURL(/\/cart/);
    await expect(page.getByTestId('cart-empty')).toBeVisible();
    await expect(page.getByTestId('cart-checkout-button')).not.toBeVisible();
    await expect(page.getByTestId('cart-empty-link-services')).toBeVisible();
  });

  test('backend failure: failed order API shows error toast', async ({
    page,
    context,
  }) => {
    await loginAndWaitForDashboard(page, {
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
    });

    await page.goto('/services');
    await page.getByTestId('add-to-cart-plan2').click();
    await expect(page.getByTestId('cart-count')).toHaveText('1', { timeout: 5000 });
    await page.goto('/cart');
    await page.getByTestId('cart-checkout-button').click();
    await expect(page).toHaveURL(/\/checkout/);
    await expect(page.getByTestId('checkout-submit')).toBeVisible();

    await context.route('**/api/orders/complete', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'خطای سرور' }),
      })
    );

    await page.getByTestId('checkout-submit').click();
    await expect(page.getByTestId('toast-message')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('toast-message')).toContainText(/خطا|سرور|error/i);
    await expect(page).toHaveURL(/\/checkout/);
  });
});
