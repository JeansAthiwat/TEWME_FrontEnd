// playwright-tests/chat.spec.js
import { test, expect } from '@playwright/test';

const FAKE_CONVERSATION = {
    _id: 'conv-1',
    participants: [
        { _id: 'learner-1', firstname: 'Learner', lastname: 'One', profilePicture: '' },
        { _id: 'tutor-1', firstname: 'Tutor', lastname: 'One', profilePicture: '' }
    ],
    courseId: { _id: 'course-1', course_name: 'Test Course' },
    lastMessage: { text: 'Hello from Tutor', createdAt: new Date().toISOString() },
    unreadCount: 0
};

const FAKE_MESSAGES = [
    { sender: 'tutor-1', text: 'Hello from Tutor', createdAt: new Date().toISOString() }
];

test.describe('Chat Functionality', () => {
    test.beforeEach(async ({ page }) => {
        // 1) Real login
        await page.goto('/login');
        await page.getByPlaceholder('Email Address').fill('learner1@example.com');
        await page.getByPlaceholder('Password').fill('1234');
        await page.getByRole('button', { name: 'Sign in', exact: true }).click();

        // 2) Stub-out socket.io completely
        await page.addInitScript(() => {
            window.io = () => ({ on: () => { }, emit: () => { }, disconnect: () => { } });
        });

        // 3) Stub the two backend calls
        await page.route('**/api/conversation/user**', route =>
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([FAKE_CONVERSATION])
            })
        );
        await page.route(`**/api/message/${FAKE_CONVERSATION._id}**`, route =>
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(FAKE_MESSAGES)
            })
        );

        // 4) Navigate to chat box
        await page.goto('/chatbox');

        // 5) Wait for our stubbed conversation to render (just the course name)
        await page.waitForSelector('text=Test Course', { timeout: 5_000 });

        // 6) Open it
        await page.click('text=Test Course');

        // 7) Verify the single stubbed message shows up
        await expect(page.locator('ul.flex.flex-col > li')).toHaveCount(1, { timeout: 5_000 });
    });

    test('Send valid message', async ({ page }) => {
        const items = page.locator('ul.flex.flex-col > li');
        const before = await items.count();

        await page.fill('input[placeholder="type here"]', 'Playwright Test');
        await page.click('button:has-text("Send")');

        // Should add one more
        await expect(items).toHaveCount(before + 1, { timeout: 5_000 });
        await expect(items.nth(before)).toHaveText('Playwright Test');
    });

    test('Empty message does not send', async ({ page }) => {
        const items = page.locator('ul.flex.flex-col > li');
        const before = await items.count();

        await page.fill('input[placeholder="type here"]', '');
        await page.click('button:has-text("Send")');

        // Count stays the same
        await expect(items).toHaveCount(before, { timeout: 3_000 });
    });
});
