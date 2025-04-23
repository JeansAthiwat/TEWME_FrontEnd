# Test info

- Name: Login fail with invalid email format
- Location: /home/catsunoki/TEWME_FrontEnd/playwright-tests/login.spec.js:37:1

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toContainText(expected)

Locator: locator('input[name="username"]').locator('..').locator('.error')
Expected string: "Please include an"
Received: <element(s) not found>
Call log:
  - expect.toContainText with timeout 5000ms
  - waiting for locator('input[name="username"]').locator('..').locator('.error')

    at /home/catsunoki/TEWME_FrontEnd/playwright-tests/login.spec.js:45:90
```

# Page snapshot

```yaml
- heading "Sign in" [level=1]
- textbox "Email Address": wsad3%;$m
- textbox "Password": wrongpass
- checkbox
- paragraph: Remember for 30 days
- link "Forget password?":
  - /url: /resetpassword
- button "Sign in"
- button "Google Logo Sign in with Google":
  - img "Google Logo"
  - text: Sign in with Google
- paragraph:
  - text: Don't have an account?
  - link "Sign Up":
    - /url: /signup
```

# Test source

```ts
   1 | // playwright-tests/login.spec.js
   2 | import { test, expect } from '@playwright/test';
   3 |
   4 | // test('Login success with correct credentials', async ({ page }) => {
   5 | //     await page.goto('/login');
   6 |
   7 | //     await page.fill('input[name="username"]', 'learner1@example.com');
   8 | //     await page.fill('input[name="password"]', '1234');
   9 | //     await page.click('button[type="submit"]');
  10 |
  11 | //     // ✅ Expect to be redirected to homepage or profile
  12 | //     await expect(page).toHaveURL(/\/(home|myprofile)?/);
  13 | // });
  14 |
  15 | // test('Login fail with wrong password', async ({ page }) => {
  16 | //     await page.goto('/login');
  17 |
  18 | //     await page.fill('input[name="username"]', 'learner1@example.com');
  19 | //     await page.fill('input[name="password"]', 'wrongpass');
  20 | //     await page.click('button[type="submit"]');
  21 |
  22 | //     // ✅ Expect error message to appear
  23 | //     await expect(page.locator('.error-message')).toContainText('Login failed');
  24 | // });
  25 |
  26 | // test('Login fail with wrong email', async ({ page }) => {
  27 | //     await page.goto('/login');
  28 |
  29 | //     await page.fill('input[name="username"]', 'wrongmail@example.com');
  30 | //     await page.fill('input[name="password"]', 'wrongpass');
  31 | //     await page.click('button[type="submit"]');
  32 |
  33 | //     // ✅ Expect error message to appear
  34 | //     await expect(page.locator('.error-message')).toContainText('Login failed');
  35 | // });
  36 |
  37 | test('Login fail with invalid email format', async ({ page }) => {
  38 |     await page.goto('/login');
  39 |
  40 |     await page.fill('input[name="username"]', 'wsad3%;$m');
  41 |     await page.fill('input[name="password"]', 'wrongpass');
  42 |     await page.click('button[type="submit"]');
  43 |
  44 |     // ✅ Expect error message to appear
> 45 |     await expect(page.locator('input[name="username"]').locator('..').locator('.error')).toContainText('Please include an');
     |                                                                                          ^ Error: Timed out 5000ms waiting for expect(locator).toContainText(expected)
  46 | });
  47 |
```