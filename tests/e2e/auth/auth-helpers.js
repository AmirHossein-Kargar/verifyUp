/**
 * Reusable E2E helpers for authentication flows.
 * Use these in auth specs to avoid duplication and keep selectors in one place.
 */

/**
 * Navigate to login page and fill credentials, then submit.
 * Does not wait for redirect; caller should assert redirect to /dashboard or error.
 * @param {import('@playwright/test').Page} page
 * @param {{ email: string, password: string }} credentials
 */
async function loginWithCredentials(page, { email, password }) {
  await page.goto('/login');
  await page.getByTestId('login-form').waitFor({ state: 'visible' });
  await page.getByTestId('login-email').fill(email);
  await page.getByTestId('login-password').fill(password);
  await page.getByTestId('login-submit').click();
}

/**
 * Perform full login and wait until dashboard is visible.
 * Use when tests need an authenticated session (e.g. logout, protected routes).
 * @param {import('@playwright/test').Page} page
 * @param {{ email: string, password: string }} credentials
 */
async function loginAndWaitForDashboard(page, { email, password }) {
  await loginWithCredentials(page, { email, password });
  await page.waitForURL(/\/dashboard/, { timeout: 15000 });
  await page.getByTestId('dashboard-welcome').waitFor({ state: 'visible', timeout: 10000 });
}

/**
 * Open user menu (desktop) and click logout. Waits for redirect to home.
 * Assumes user is already logged in and on a page where the header is visible.
 * Uses desktop viewport; on mobile the hamburger menu would need to be opened first.
 * @param {import('@playwright/test').Page} page
 */
async function logoutViaHeader(page) {
  const userMenu = page.getByTestId('user-menu-button');
  const logoutBtn = page.getByTestId('logout-button').first();

  if (await userMenu.isVisible()) {
    await userMenu.click();
    await logoutBtn.waitFor({ state: 'visible', timeout: 3000 });
  }
  await logoutBtn.click();
  await page.waitForURL((url) => url.pathname === '/' || url.pathname === '/login', {
    timeout: 15000,
  });
}

/**
 * API origin where auth cookies are set (backend).
 * Frontend calls this origin; cookies are set in responses from this origin.
 */
const API_ORIGIN =
  process.env.PLAYWRIGHT_API_URL?.replace(/\/api\/?$/, '') ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') ||
  'http://localhost:4000';

/**
 * Get auth cookies (accessToken, refreshToken) from the browser context.
 * Backend sets these on the API origin (e.g. localhost:4000); we must request
 * cookies for that origin so Playwright returns them.
 * @param {import('@playwright/test').Page} page
 * @returns {Promise<Array<{ name: string, value: string }>>}
 */
async function getAuthCookies(page) {
  const cookies = await page.context().cookies(API_ORIGIN);
  return cookies.filter((c) => c.name === 'accessToken' || c.name === 'refreshToken');
}

/**
 * Check if the current page shows authenticated UI (dashboard welcome or user menu).
 * @param {import('@playwright/test').Page} page
 */
async function isAuthenticatedUIVisible(page) {
  const welcome = page.getByTestId('dashboard-welcome');
  const userMenu = page.getByTestId('user-menu-button');
  return (await welcome.isVisible()) || (await userMenu.isVisible());
}

module.exports = {
  loginWithCredentials,
  loginAndWaitForDashboard,
  logoutViaHeader,
  getAuthCookies,
  isAuthenticatedUIVisible,
};
