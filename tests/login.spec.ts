import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/loginPage';

test.describe('Login screen', () => {
  test('loads and shows expected fields', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.assertLoaded();

    // Additional real-page elements (helps catch regressions and ensures locators stay unique).
    await expect(login.findOrganizationsButton).toBeVisible();
  });

  test('shows validation when submitting empty form (if implemented)', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.assertLoaded();

    await login.submitButton.click();

    /**
     * Validation UX varies by implementation:
     * - could show inline messages
     * - could set aria-invalid / required constraint messages
     * - could show an alert banner
     *
     * We assert at least one reasonable signal.
     */
    const inlineError = page.getByText(/required|enter email|enter password|invalid/i);
    const alert = login.errorAlert;

    await expect
      .poll(
        async () => {
          const candidates = [
            await alert.isVisible().catch(() => false),
            await inlineError.isVisible().catch(() => false),
            // If aria-invalid is used:
            (await login.emailInput.getAttribute('aria-invalid')) === 'true',
            (await login.passwordInput.getAttribute('aria-invalid')) === 'true'
          ];
          return candidates.some(Boolean);
        },
        { timeout: 3000 }
      )
      .toBe(true);
  });

  test('shows an error for invalid credentials (if backend wired)', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.assertLoaded();

    await login.login('invalid@example.com', 'wrong-password');

    /**
     * If the app is wired to an auth backend, this should show an error.
     * We look for a generic error banner or common error copy.
     */
    const commonErrorText = page.getByText(/invalid|incorrect|failed|unable|error/i);
    await expect(login.errorAlert.or(commonErrorText)).toBeVisible({ timeout: 10_000 });
  });

  test('successful login redirects away from /login (optional; requires valid creds)', async ({ page }) => {
    test.skip(
      !process.env.E2E_VALID_EMAIL || !process.env.E2E_VALID_PASSWORD,
      'Set E2E_VALID_EMAIL and E2E_VALID_PASSWORD to enable success-path login test.'
    );

    const login = new LoginPage(page);

    await login.goto();
    await login.assertLoaded();

    await login.login(process.env.E2E_VALID_EMAIL!, process.env.E2E_VALID_PASSWORD!);

    // Expect navigation away from the login page.
    await expect(page, 'Expected to navigate away from /login after successful login').not.toHaveURL(/\/login\b/, {
      timeout: 15_000
    });
  });
});
