// playwright-tests/chat.spec.js
import { test, expect } from '@playwright/test';

test.describe('Chat Functionality', () => {
    // Log in and open first conversation before each test
    test.beforeEach(async ({ page }) => {
        // 1) Go to login page
        await page.goto('/login');

        // 2) Fill credentials
        await page.getByPlaceholder('Email Address').fill('learner1@example.com');
        await page.getByPlaceholder('Password').fill('1234');

        // 3) Click only the form submit button
        await page.locator('button[type="submit"]').click();

        // 4) Navigate to chat box
        await page.goto('/chatbox');

        // 5) Open the first conversation in the list
        await page.locator('.flex-row.items-center').first().click();

        // 6) Wait for messages to load
        await expect(page.locator('ul.flex.flex-col > li')).toHaveCountGreaterThan(0, { timeout: 5000 });
    });

    test('Send valid message', async ({ page }) => {
        const messageText = 'Hello from Playwright';

        // Count existing messages
        const messageItems = page.locator('ul.flex.flex-col > li');
        const initialCount = await messageItems.count();

        // Type and send
        await page.fill('input[placeholder="type here"]', messageText);
        await page.click('button:has-text("Send")');

        // Expect count to increase by one
        await expect(messageItems).toHaveCount(initialCount + 1, { timeout: 5000 });

        // And the last message item contains the text
        await expect(messageItems.nth(initialCount)).toHaveText(messageText);
    });

    test('Empty message does not send', async ({ page }) => {
        // Count existing messages
        const messageItems = page.locator('ul.flex.flex-col > li');
        const initialCount = await messageItems.count();

        // Attempt to send an empty message
        await page.fill('input[placeholder="type here"]', '');
        await page.click('button:has-text("Send")');

        // Expect count to remain unchanged
        await expect(messageItems).toHaveCount(initialCount, { timeout: 3000 });
    });
});
