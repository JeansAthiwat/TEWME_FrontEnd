# Test info

- Name: Chat Functionality >> Send valid message
- Location: C:\Users\Sumo\TEWME_FrontEnd\playwright-tests\chat.spec.js:27:5

# Error details

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('.flex-row.items-center').first()

    at C:\Users\Sumo\TEWME_FrontEnd\playwright-tests\chat.spec.js:21:62
```

# Test source

```ts
   1 | // playwright-tests/chat.spec.js
   2 | import { test, expect } from '@playwright/test';
   3 |
   4 | test.describe('Chat Functionality', () => {
   5 |     // Log in and open first conversation before each test
   6 |     test.beforeEach(async ({ page }) => {
   7 |         // 1) Go to login page
   8 |         await page.goto('/login');
   9 |
  10 |         // 2) Fill credentials
  11 |         await page.getByPlaceholder('Email Address').fill('learner1@example.com');
  12 |         await page.getByPlaceholder('Password').fill('1234');
  13 |
  14 |         // 3) Click only the form submit button
  15 |         await page.locator('button[type="submit"]').click();
  16 |
  17 |         // 4) Navigate to chat box
  18 |         await page.goto('/chatbox');
  19 |
  20 |         // 5) Open the first conversation in the list
> 21 |         await page.locator('.flex-row.items-center').first().click();
     |                                                              ^ Error: locator.click: Test timeout of 30000ms exceeded.
  22 |
  23 |         // 6) Wait for messages to load
  24 |         await expect(page.locator('ul.flex.flex-col > li')).toHaveCountGreaterThan(0, { timeout: 5000 });
  25 |     });
  26 |
  27 |     test('Send valid message', async ({ page }) => {
  28 |         const messageText = 'Hello from Playwright';
  29 |
  30 |         // Count existing messages
  31 |         const messageItems = page.locator('ul.flex.flex-col > li');
  32 |         const initialCount = await messageItems.count();
  33 |
  34 |         // Type and send
  35 |         await page.fill('input[placeholder="type here"]', messageText);
  36 |         await page.click('button:has-text("Send")');
  37 |
  38 |         // Expect count to increase by one
  39 |         await expect(messageItems).toHaveCount(initialCount + 1, { timeout: 5000 });
  40 |
  41 |         // And the last message item contains the text
  42 |         await expect(messageItems.nth(initialCount)).toHaveText(messageText);
  43 |     });
  44 |
  45 |     test('Empty message does not send', async ({ page }) => {
  46 |         // Count existing messages
  47 |         const messageItems = page.locator('ul.flex.flex-col > li');
  48 |         const initialCount = await messageItems.count();
  49 |
  50 |         // Attempt to send an empty message
  51 |         await page.fill('input[placeholder="type here"]', '');
  52 |         await page.click('button:has-text("Send")');
  53 |
  54 |         // Expect count to remain unchanged
  55 |         await expect(messageItems).toHaveCount(initialCount, { timeout: 3000 });
  56 |     });
  57 | });
  58 |
```