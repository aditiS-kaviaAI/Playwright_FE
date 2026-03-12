# Playwright_FE

Playwright end-to-end tests for the React application's login screen.

## What’s included
- `playwright.config.ts` — config with `BASE_URL` support
- `tests/login.spec.ts` — login screen E2E tests
- `tests/pages/loginPage.ts` — Login Page Object with resilient locators

## Prerequisites
- The React app under test must be running separately (this repo does **not** start it).
- Default expectation: the login route is `GET /login`.

## Environment variables
- `BASE_URL` (optional): Base URL for the running app (default `http://localhost:3000`).
- `E2E_VALID_EMAIL` / `E2E_VALID_PASSWORD` (optional): If set, enables the “successful login redirects” test.

## Locator mapping alignment
These tests prefer accessible locators (`getByLabel`, `getByRole`) and include `data-testid` fallbacks:
- `login-email`
- `login-password`
- `login-submit`
- `login-error`
- `forgot-password-link`
- `signup-link`

If your locator mapping document specifies different selectors/test IDs, update:
- `tests/pages/loginPage.ts`

## Running (not executed as part of this task)
```bash
npm install
BASE_URL=http://localhost:3000 npm run test:e2e
```
