// @ts-check
/**
 * Production-grade E2E: complete user order flow (login → clean cart → add product → checkout → order success).
 * Stable, non-flaky; uses data-testid only, no waitForTimeout, no toast reliance.
 * Run: npx playwright test tests/e2e/orders/full-order-flow.spec.js
 */
const { test, expect } = require('@playwright/test');

const E2E_EMAIL = process.env.E2E_ORDER_EMAIL || 'Amirkaargar@hotmail.com';
const E2E_PASSWORD = process.env.E2E_ORDER_PASSWORD || 'SS321mFl';

test.describe('Full order flow (login → cart → checkout → orders)', () => {
  test('complete flow: login, clean cart, add product, validate cart, checkout, submit order, verify success', async ({
    page,
  }) => {
    // 1) Login
    await page.goto('/login');
    await expect(page).toHaveURL(/\/login/);
    await page.getByTestId('login-form').waitFor({ state: 'visible' });
    await page.getByTestId('login-email').fill(E2E_EMAIL);
    await page.getByTestId('login-password').fill(E2E_PASSWORD);
    await page.getByTestId('login-submit').click();

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 20000 });
    await expect(page.getByTestId('dashboard-welcome')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('user-menu-button')).toBeVisible();

    // 2) Ensure clean cart state
    await page.goto('/cart');
    await expect(page).toHaveURL(/\/cart/, { timeout: 8000 });

    while ((await page.getByTestId('cart-item').count()) > 0) {
      const n = await page.getByTestId('cart-item').count();
      await page.getByTestId('cart-item-remove').first().click();
      if (n === 1) {
        await expect(page.getByTestId('cart-empty')).toBeVisible({ timeout: 5000 });
      } else {
        await expect(page.getByTestId('cart-item')).toHaveCount(n - 1, { timeout: 5000 });
      }
    }
    await expect(page.getByTestId('cart-empty')).toBeVisible();

    // 3) Add product to cart
    await page.goto('/services');
    await expect(page).toHaveURL(/\/services/);
    await page.getByTestId('add-to-cart-plan2').waitFor({ state: 'visible' });
    await page.getByTestId('add-to-cart-plan2').click();
    await expect(page.getByTestId('cart-count')).toHaveText('1', { timeout: 5000 });

    // 4) Validate cart
    await page.goto('/cart');
    await expect(page).toHaveURL(/\/cart/);
    await expect(page.getByTestId('cart-page')).toBeVisible();
    await expect(page.getByTestId('cart-item')).toHaveCount(1);
    await expect(page.getByTestId('cart-total')).toContainText('تومان');

    // 5) Checkout
    await Promise.all([
      page.waitForURL(/\/checkout/, { timeout: 10000 }),
      page.getByTestId('cart-checkout-button').click(),
    ]);
    await expect(page.getByTestId('checkout-page')).toBeVisible();
    await expect(page.getByTestId('checkout-order-summary')).toBeVisible();
    await expect(page.getByTestId('checkout-submit')).toBeVisible();

    // 6) Submit order
    await Promise.all([
      page.waitForURL(/\/dashboard\/orders/, { timeout: 15000 }),
      page.getByTestId('checkout-submit').click(),
    ]);

    // 7) Verify order success (stable assertions only; no toast)
    await expect(page.getByTestId('orders-list')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('order-item').first()).toBeVisible();
    await expect(page.getByTestId('order-item-total').first()).toContainText('تومان');
    await expect(page.getByTestId('order-item-status').first()).toBeVisible();
    await expect(page.getByTestId('order-item-date').first()).toBeVisible();

    // 8) Verify cart is empty after successful order
    await page.goto('/cart');
    await expect(page).toHaveURL(/\/cart/);
    await expect(page.getByTestId('cart-empty')).toBeVisible();
  });
});
