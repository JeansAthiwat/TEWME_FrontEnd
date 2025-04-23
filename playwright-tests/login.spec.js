// playwright-tests/login.spec.js
import { test, expect } from '@playwright/test';

test('Login success with correct credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill in the login form
    await page.fill('input[name="username"]', 'learner1@example.com');
    await page.fill('input[name="password"]', '1234');
    await page.click('button[type="submit"]');

    // ✅ Wait for the local storage to be updated with the UID
    await page.waitForFunction(() => 
        window.localStorage.getItem('UID') !== null
    );

    // ✅ Check if the UID is set in local storage
    const uid = await page.evaluate(() => window.localStorage.getItem('UID'));
    expect(uid).toBeTruthy();  // Ensure there is a UID set
});


test('Login fail with wrong password', async ({ page }) => {
    await page.goto('/login');

    // Fill in the login form
    await page.fill('input[name="username"]', 'learner1@example.com');
    await page.fill('input[name="password"]', 'wrongpass');
    await page.click('button[type="submit"]');

    // ✅ Wait for the local storage to ensure UID is not set
    await page.waitForFunction(() => 
        window.localStorage.getItem('UID') === null
    );

    // ✅ Ensure that no UID is set in local storage
    const uid = await page.evaluate(() => window.localStorage.getItem('UID'));
    expect(uid).toBeNull();  // Verify that UID is not present in local storage
});


test('Login fail with wrong email', async ({ page }) => {
    await page.goto('/login');

    // Fill in the login form
    await page.fill('input[name="username"]', 'wrongmail@example.com');
    await page.fill('input[name="password"]', 'wrongpass');
    await page.click('button[type="submit"]');

    // ✅ Wait for the local storage to ensure UID is not set
    await page.waitForFunction(() => 
        window.localStorage.getItem('UID') === null
    );

    // ✅ Ensure that no UID is set in local storage
    const uid = await page.evaluate(() => window.localStorage.getItem('UID'));
    expect(uid).toBeNull();  // Verify that UID is not present in local storage
});


test('Login fail with invalid email scheme', async ({ page }) => {
    await page.goto('/login');

    // Fill in the login form
    await page.fill('input[name="username"]', '2;$%.com');
    await page.fill('input[name="password"]', 'wrongpass');
    await page.click('button[type="submit"]');

    // ✅ Wait for the local storage to ensure UID is not set
    await page.waitForFunction(() => 
        window.localStorage.getItem('UID') === null
    );

    // ✅ Ensure that no UID is set in local storage
    const uid = await page.evaluate(() => window.localStorage.getItem('UID'));
    expect(uid).toBeNull();  // Verify that UID is not present in local storage
});
