# Test info

- Name: Chat Functionality >> Send valid message
- Location: C:\Users\Sumo\TEWME_FrontEnd\playwright-tests\chat.spec.js:61:5

# Error details

```
TimeoutError: page.waitForSelector: Timeout 5000ms exceeded.
Call log:
  - waiting for locator('text=Test Course') to be visible

    at C:\Users\Sumo\TEWME_FrontEnd\playwright-tests\chat.spec.js:52:20
```

# Test source

```ts
   1 | // playwright-tests/chat.spec.js
   2 | import { test, expect } from '@playwright/test';
   3 |
   4 | const FAKE_CONVERSATION = {
   5 |     _id: 'conv-1',
   6 |     participants: [
   7 |         { _id: 'learner-1', firstname: 'Learner', lastname: 'One', profilePicture: '' },
   8 |         { _id: 'tutor-1', firstname: 'Tutor', lastname: 'One', profilePicture: '' }
   9 |     ],
  10 |     courseId: { _id: 'course-1', course_name: 'Test Course' },
  11 |     lastMessage: { text: 'Hello from Tutor', createdAt: new Date().toISOString() },
  12 |     unreadCount: 0
  13 | };
  14 |
  15 | const FAKE_MESSAGES = [
  16 |     { sender: 'tutor-1', text: 'Hello from Tutor', createdAt: new Date().toISOString() }
  17 | ];
  18 |
  19 | test.describe('Chat Functionality', () => {
  20 |     test.beforeEach(async ({ page }) => {
  21 |         // 1) Real login
  22 |         await page.goto('/login');
  23 |         await page.getByPlaceholder('Email Address').fill('learner1@example.com');
  24 |         await page.getByPlaceholder('Password').fill('1234');
  25 |         await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  26 |
  27 |         // 2) Stub-out socket.io completely
  28 |         await page.addInitScript(() => {
  29 |             window.io = () => ({ on: () => { }, emit: () => { }, disconnect: () => { } });
  30 |         });
  31 |
  32 |         // 3) Stub the two backend calls
  33 |         await page.route('**/api/conversation/user**', route =>
  34 |             route.fulfill({
  35 |                 status: 200,
  36 |                 contentType: 'application/json',
  37 |                 body: JSON.stringify([FAKE_CONVERSATION])
  38 |             })
  39 |         );
  40 |         await page.route(`**/api/message/${FAKE_CONVERSATION._id}**`, route =>
  41 |             route.fulfill({
  42 |                 status: 200,
  43 |                 contentType: 'application/json',
  44 |                 body: JSON.stringify(FAKE_MESSAGES)
  45 |             })
  46 |         );
  47 |
  48 |         // 4) Navigate to chat box
  49 |         await page.goto('/chatbox');
  50 |
  51 |         // 5) Wait for our stubbed conversation to render (just the course name)
> 52 |         await page.waitForSelector('text=Test Course', { timeout: 5_000 });
     |                    ^ TimeoutError: page.waitForSelector: Timeout 5000ms exceeded.
  53 |
  54 |         // 6) Open it
  55 |         await page.click('text=Test Course');
  56 |
  57 |         // 7) Verify the single stubbed message shows up
  58 |         await expect(page.locator('ul.flex.flex-col > li')).toHaveCount(1, { timeout: 5_000 });
  59 |     });
  60 |
  61 |     test('Send valid message', async ({ page }) => {
  62 |         const items = page.locator('ul.flex.flex-col > li');
  63 |         const before = await items.count();
  64 |
  65 |         await page.fill('input[placeholder="type here"]', 'Playwright Test');
  66 |         await page.click('button:has-text("Send")');
  67 |
  68 |         // Should add one more
  69 |         await expect(items).toHaveCount(before + 1, { timeout: 5_000 });
  70 |         await expect(items.nth(before)).toHaveText('Playwright Test');
  71 |     });
  72 |
  73 |     test('Empty message does not send', async ({ page }) => {
  74 |         const items = page.locator('ul.flex.flex-col > li');
  75 |         const before = await items.count();
  76 |
  77 |         await page.fill('input[placeholder="type here"]', '');
  78 |         await page.click('button:has-text("Send")');
  79 |
  80 |         // Count stays the same
  81 |         await expect(items).toHaveCount(before, { timeout: 3_000 });
  82 |     });
  83 | });
  84 |
```