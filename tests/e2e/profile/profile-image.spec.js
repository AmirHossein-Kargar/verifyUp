// @ts-check
/**
 * E2E test: full profile image upload journey.
 * - Navigate to /dashboard/profile
 * - Upload a new profile image
 * - Verify image on profile page and in header
 * - Refresh and verify persistence
 * - Navigate to another dashboard page and verify header still shows image
 *
 * Run with project "profile-flow" so auth runs once (auth.setup.js) and storage state
 * is reused. Requires: backend running, verified test user (TEST_USER_EMAIL / TEST_USER_PASSWORD).
 */
const { test, expect } = require('@playwright/test');

// Minimal valid 1x1 PNG (67 bytes) – backend accepts any image buffer
const MINIMAL_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
const TEST_IMAGE_BUFFER = Buffer.from(MINIMAL_PNG_BASE64, 'base64');

test.describe('Profile image upload flow (authenticated)', () => {
  test('full journey: upload profile image, verify on page and header, persist after refresh and on other pages', async ({
    page,
  }) => {
    // --- Arrange ---
    await page.goto('/dashboard/profile');
    await expect(page).toHaveURL(/\/dashboard\/profile/);
    await page.getByTestId('profile-page').waitFor({ state: 'visible', timeout: 15000 });

    const fileInput = page.getByTestId('profile-image-input');
    const uploadButton = page.getByTestId('profile-image-upload-button');
    const profileAvatar = page.getByTestId('profile-page-avatar');
    const profileAvatarImg = page.getByTestId('profile-page-avatar-img');

    await uploadButton.waitFor({ state: 'visible' });

    // --- Act: choose file and trigger upload ---
    await uploadButton.click();
    await fileInput.setInputFiles({
      name: 'profile-test.png',
      mimeType: 'image/png',
      buffer: TEST_IMAGE_BUFFER,
    });

    // Save button appears after file selection
    const saveButton = page.getByTestId('profile-image-save-button');
    await saveButton.waitFor({ state: 'visible', timeout: 5000 });
    await saveButton.click();

    // --- Assert: success toast and profile page avatar ---
    const toast = page.getByTestId('toast-message');
    await expect(toast).toBeVisible({ timeout: 10000 });
    await expect(toast).toContainText(/ذخیره|موفقیت/, { timeout: 5000 });

    // Profile page avatar shows the new image (img inside avatar container)
    await expect(profileAvatarImg).toBeVisible({ timeout: 10000 });
    await expect(profileAvatar).toBeVisible();

    // Header avatar shows the new image (same context, so it should update immediately)
    const headerAvatar = page.getByTestId('header-avatar');
    await expect(headerAvatar).toBeVisible({ timeout: 5000 });
    await expect(headerAvatar).toHaveAttribute('src', /.+/);

    // --- Act: refresh and assert persistence ---
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.getByTestId('profile-page').waitFor({ state: 'visible', timeout: 15000 });

    const profileAvatarAfterReload = page.getByTestId('profile-page-avatar-img');
    await expect(profileAvatarAfterReload).toBeVisible({ timeout: 10000 });

    const headerAvatarAfterReload = page.getByTestId('header-avatar');
    await expect(headerAvatarAfterReload).toBeVisible({ timeout: 5000 });

    // --- Act: navigate to another dashboard page and verify header avatar ---
    await page.goto('/dashboard/orders');
    await expect(page).toHaveURL(/\/dashboard\/orders/);

    const headerAvatarOnOrders = page.getByTestId('header-avatar');
    await expect(headerAvatarOnOrders).toBeVisible({ timeout: 5000 });
    await expect(headerAvatarOnOrders).toHaveAttribute('src', /.+/);
  });
});
