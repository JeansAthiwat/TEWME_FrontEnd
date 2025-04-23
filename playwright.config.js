// playwright.config.js
import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './playwright-tests',
    timeout: 30000,
    use: {
        headless: false, // change to true if you don't want browser UI
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
    },
});
