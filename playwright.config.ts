import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for the frontend E2E tests.
 *
 * Note: These tests are designed to run against an already-running dev server.
 * Configure the server URL via the BASE_URL environment variable.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [['list']],

  use: {
    // Configure target app base URL (dev server should already be running)
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
