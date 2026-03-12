import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model for the Login screen.
 *
 * Locator strategy:
 * - Prefer accessible queries (getByRole/getByLabel) for resilience.
 * - Provide optional data-testid fallbacks where commonly used.
 *
 * IMPORTANT:
 * If your app uses a specific locator mapping document (e.g., exact data-testid values),
 * update the fallback selectors in this file to match that mapping.
 */
export class LoginPage {
  private readonly page: Page;

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  // Optional elements frequently present on login screens
  readonly errorAlert: Locator;
  readonly forgotPasswordLink: Locator;
  readonly signUpLink: Locator;

  constructor(page: Page) {
    this.page = page;

    // Primary: accessible labels/roles
    // Fallback: common test ids
    this.emailInput = page.getByLabel(/email/i).or(page.getByTestId('login-email'));
    this.passwordInput = page.getByLabel(/password/i).or(page.getByTestId('login-password'));
    this.submitButton = page
      .getByRole('button', { name: /log\s*in|sign\s*in/i })
      .or(page.getByTestId('login-submit'));

    this.errorAlert = page.getByRole('alert').or(page.getByTestId('login-error'));
    this.forgotPasswordLink = page
      .getByRole('link', { name: /forgot password/i })
      .or(page.getByTestId('forgot-password-link'));
    this.signUpLink = page.getByRole('link', { name: /sign up|create account/i }).or(page.getByTestId('signup-link'));
  }

  // PUBLIC_INTERFACE
  async goto(): Promise<void> {
    /**
     * Navigate to the login screen.
     *
     * Assumption: login route is `/login`.
     * If the app uses a different route, update it here (or set BASE_URL to include the route).
     */
    await this.page.goto('/login');
  }

  // PUBLIC_INTERFACE
  async login(email: string, password: string): Promise<void> {
    /** Fill in credentials and submit the login form. */
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  // PUBLIC_INTERFACE
  async assertLoaded(): Promise<void> {
    /** Verify the login screen is visible and ready for interaction. */
    await expect(this.emailInput, 'Expected email input to be visible on login screen').toBeVisible();
    await expect(this.passwordInput, 'Expected password input to be visible on login screen').toBeVisible();
    await expect(this.submitButton, 'Expected submit button to be visible on login screen').toBeVisible();
  }
}
