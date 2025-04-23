// playwright-tests/login.spec.js
import { test, expect } from '@playwright/test';

// test('Login success with correct credentials', async ({ page }) => {
//     await page.goto('/login');

//     await page.fill('input[name="username"]', 'learner1@example.com');
//     await page.fill('input[name="password"]', '1234');
//     await page.click('button[type="submit"]');

//     // ✅ Expect to be redirected to homepage or profile
//     await expect(page).toHaveURL(/\/(home|myprofile)?/);
// });

// test('Login fail with wrong password', async ({ page }) => {
//     await page.goto('/login');

//     await page.fill('input[name="username"]', 'learner1@example.com');
//     await page.fill('input[name="password"]', 'wrongpass');
//     await page.click('button[type="submit"]');

//     // ✅ Expect error message to appear
//     await expect(page.locator('.error-message')).toContainText('Login failed');
// });

// test('Login fail with wrong email', async ({ page }) => {
//     await page.goto('/login');

//     await page.fill('input[name="username"]', 'wrongmail@example.com');
//     await page.fill('input[name="password"]', 'wrongpass');
//     await page.click('button[type="submit"]');

//     // ✅ Expect error message to appear
//     await expect(page.locator('.error-message')).toContainText('Login failed');
// });

test('Login fail with invalid email format', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[name="username"]', 'wsad3%;$m');
    await page.fill('input[name="password"]', 'wrongpass');
    await page.click('button[type="submit"]');

    // ✅ Expect error message to appear
    await expect(page.locator('input[name="username"]').locator('..').locator('.error')).toContainText('Please include an');
});
