// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright config for VerifyUp E2E tests.
 * Run: npm run e2e (from repo root)
 * Requires: frontend (Next.js) on http://localhost:3000 and backend API on http://localhost:4000
 * @see https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.js/, teardown: undefined },
    {
      name: 'order-flow',
      testMatch: /orders\/order-flow\.spec\.js/,
      use: { ...devices['Desktop Chrome'], storageState: 'tests/e2e/auth/.auth/user.json' },
      dependencies: ['setup'],
    },
    {
      name: 'profile-flow',
      testMatch: /profile\/profile-image\.spec\.js/,
      use: { ...devices['Desktop Chrome'], storageState: 'tests/e2e/auth/.auth/user.json' },
      dependencies: ['setup'],
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: [/orders\/order-flow\.spec\.js/, /profile\/profile-image\.spec\.js/],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: [/orders\/order-flow\.spec\.js/, /profile\/profile-image\.spec\.js/],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: [/orders\/order-flow\.spec\.js/, /profile\/profile-image\.spec\.js/],
    },
  ],
  timeout: 30_000,
  expect: { timeout: 10_000 },
});
