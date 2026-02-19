// @ts-check
/**
 * E2E tests: full order journey from product selection to order placement.
 * Run with project "order-flow" so auth runs once (auth.setup.js) and storage state
 * is reused. Requires: backend running, verified test user (TEST_USER_EMAIL / TEST_USER_PASSWORD).
 */
const { test, expect } = require('@playwright/test');

test.describe('Order flow (authenticated)', () => {
  // Auth is done once in auth.setup.js; this project uses storageState so we start logged in.

  test('1. Add to cart: select product, add, verify cart count and cart page', async ({
    page,
  }) => {
    await page.goto('/services');
    await expect(page).toHaveURL(/\/services/);

    // Plan2 has no options - single click add
    const addBtn = page.getByTestId('add-to-cart-plan2');
    await addBtn.waitFor({ state: 'visible' });
    await addBtn.click();

    // Cart count in header should increase (plan2 added = 1 item)
    await expect(page.getByTestId('cart-count')).toHaveText('1', { timeout: 5000 });

    await page.goto('/cart');
    await expect(page).toHaveURL(/\/cart/, { timeout: 8000 });

    await expect(page.getByTestId('cart-page')).toBeVisible();
    await expect(page.getByTestId('cart-item')).toHaveCount(1);
    await expect(page.getByTestId('cart-item-title').first()).toContainText(
      'مشاوره بهینه\u200cسازی اکانت'
    );
    await expect(page.getByTestId('cart-item-price').first()).toContainText('تومان');
    await expect(page.getByTestId('cart-total')).toContainText('تومان');
    await expect(page.getByTestId('cart-checkout-button')).toBeVisible();
  });

  test('2. Update cart: remove item and verify empty state', async ({ page }) => {
    await page.goto('/services');
    const addBtn = page.getByTestId('add-to-cart-plan2');
    await addBtn.waitFor({ state: 'visible' });
    await addBtn.click();
    await expect(page.getByTestId('cart-count')).toHaveText('1', { timeout: 5000 });

    await page.goto('/cart');
    await expect(page.getByTestId('cart-item')).toHaveCount(1);

    await page.getByTestId('cart-item-remove').first().click();
    await expect(page.getByTestId('cart-empty')).toBeVisible();
    await expect(page.getByTestId('cart-empty-title')).toHaveText(/سبد خرید شما خالی است/);
    await expect(page.getByTestId('cart-empty-link-services')).toBeVisible();
  });

  test('3. Cart clear all: multiple items then clear', async ({ page }) => {
    await page.goto('/services');
    await page.getByTestId('add-to-cart-plan2').click();
    await expect(page.getByTestId('cart-count')).toHaveText('1', { timeout: 5000 });

    await page.goto('/services');
    await page.getByTestId('add-to-cart-plan1').click();
    await expect(page.getByTestId('cart-count')).toHaveText('2', { timeout: 5000 });

    await page.goto('/cart');
    await expect(page.getByTestId('cart-item')).toHaveCount(2);
    await page.getByTestId('cart-clear-all').click();
    await expect(page.getByTestId('cart-empty')).toBeVisible();
  });

  test('4. Checkout: proceed from cart to checkout, verify summary and place order', async ({
    page,
  }) => {
    await page.goto('/services');
    await page.getByTestId('add-to-cart-plan2').click();
    await expect(page.getByTestId('cart-count')).toHaveText('1', { timeout: 5000 });

    await page.goto('/cart');
    await page.getByTestId('cart-checkout-button').click();
    await expect(page).toHaveURL(/\/checkout/, { timeout: 10000 });

    await expect(page.getByTestId('checkout-page')).toBeVisible();
    await expect(page.getByTestId('checkout-order-summary')).toBeVisible();
    await expect(page.getByTestId('checkout-order-summary')).toContainText(
      'مشاوره بهینه\u200cسازی اکانت'
    );
    await expect(page.getByTestId('checkout-submit')).toBeVisible();
    await expect(page.getByTestId('checkout-submit')).toContainText('پرداخت موفق');

    await page.getByTestId('checkout-submit').click();
    await expect(page).toHaveURL(/\/dashboard\/orders/, { timeout: 15000 });
    await expect(page.getByTestId('orders-list')).toBeVisible({ timeout: 10000 });
  });

  test('5. Place order: success redirect and cart cleared', async ({ page }) => {
    await page.goto('/services');
    await page.getByTestId('add-to-cart-plan2').click();
    await expect(page.getByTestId('cart-count')).toHaveText('1', { timeout: 5000 });

    await page.goto('/cart');
    await page.getByTestId('cart-checkout-button').click();
    await expect(page).toHaveURL(/\/checkout/);
    await page.getByTestId('checkout-submit').click();

    await expect(page).toHaveURL(/\/dashboard\/orders/, { timeout: 15000 });
    await expect(page.getByTestId('toast-message')).toBeVisible({ timeout: 8000 });

    await page.goto('/cart');
    await expect(page).toHaveURL(/\/cart/);
    await expect(page.getByTestId('cart-empty')).toBeVisible();
  });

  test('6. Orders page: new order appears with correct details', async ({ page }) => {
    await page.goto('/services');
    await page.getByTestId('add-to-cart-plan2').click();
    await expect(page.getByTestId('cart-count')).toHaveText('1', { timeout: 5000 });
    await page.goto('/cart');
    await page.getByTestId('cart-checkout-button').click();
    await page.getByTestId('checkout-submit').click();
    await expect(page).toHaveURL(/\/dashboard\/orders/, { timeout: 15000 });

    await expect(page.getByTestId('orders-list')).toBeVisible();
    const orderItems = page.getByTestId('order-item');
    await expect(orderItems.first()).toBeVisible();
    await expect(page.getByTestId('order-item-total').first()).toContainText('تومان');
    await expect(page.getByTestId('order-item-status').first()).toBeVisible();
    await expect(page.getByTestId('order-item-date').first()).toBeVisible();
  });
});
