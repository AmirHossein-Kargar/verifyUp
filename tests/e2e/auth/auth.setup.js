// @ts-check
/**
 * Runs once to log in and save storage state. Used by order-flow project so
 * order tests start authenticated without repeating login in every beforeEach.
 * If login fails, this fails with a clear error and order tests are skipped.
 */
const { test } = require('@playwright/test');
const path = require('path');
const fs = require('fs');
const { loginAndWaitForDashboard } = require('./auth-helpers');

const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com';
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || 'password123';

const AUTH_FILE = path.join(__dirname, '.auth', 'user.json');

test('authenticate and save storage state', async ({ page, context }) => {
  fs.mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
  await loginAndWaitForDashboard(page, {
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
  });
  await context.storageState({ path: AUTH_FILE });
});
