// playwright-tests/chat.spec.js
import { test, expect } from '@playwright/test';

test.describe('Chat Functionality', () => {
    test.beforeEach(async ({ page }) => {
        // Go to login page
        await page.goto('http://localhost:3000/login');
        await page.getByPlaceholder('Email Address').fill('learner1@example.com');
        await page.getByPlaceholder('Password').fill('1234');
        await page.getByRole('button', { name: 'Sign in', exact: true }).click();

        // Wait for redirect to home and navigate to chat
        await page.waitForURL('http://localhost:3000/');
        await page.goto('http://localhost:3000/chatbox');

        // Wait for chatbox UI to load
        await page.waitForSelector('text=Contacts');
    });

    test('Send valid message', async ({ page }) => {
        // Wait for any real conversation to load
        await page.waitForSelector('div.conversation-name', { timeout: 10000 });

        // Open the first conversation
        await page.locator('div.conversation-name:has-text("Course:")').first().click();

        // Wait for messages to load
        await page.waitForSelector('ul.flex.flex-col > li');

        const beforeCount = await page.locator('ul.flex.flex-col > li').count();

        await page.fill('input[placeholder="type here"]', 'Playwright Test Message');
        await page.click('button:has-text("Send")');

        await expect(page.locator('ul.flex.flex-col > li')).toHaveCount(beforeCount + 1);
        await expect(page.locator('ul.flex.flex-col > li').nth(-1)).toContainText('Playwright Test Message');
    });

    test('Empty message does not send', async ({ page }) => {
        // Open first conversation
        await page.waitForSelector('div.conversation-name', { timeout: 10000 });
        await page.locator('div.conversation-name:has-text("Course:")').first().click();

        const beforeCount = await page.locator('ul.flex.flex-col > li').count();

        await page.fill('input[placeholder="type here"]', '');
        await page.click('button:has-text("Send")');

        await expect(page.locator('ul.flex.flex-col > li')).toHaveCount(beforeCount);
    });
});
