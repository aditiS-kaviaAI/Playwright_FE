import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Page Object Model for the Login screen.
 *
 * Locator strategy:
 * - Prefer *exact*, accessible queries (getByRole/getByLabel) to avoid Playwright strict-mode ambiguity.
 * - Provide optional data-testid fallbacks where commonly used.
 *
 * This project runs against the deployed app. The real `/login` page uses:
 * - Email textbox aria-label: "Email address"
 * - Password textbox aria-label: "Password"
 * - Organization combobox aria-label: "Organization"
 * - Button aria-label: "Find organizations for this email"
 * - Submit button role/name: "Login"
 */
export class LoginPage {
  private readonly page: Page;

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly organizationSelect: Locator;
  readonly findOrganizationsButton: Locator;
  readonly submitButton: Locator;

  // Optional elements frequently present on login screens
  readonly errorAlert: Locator;
  readonly forgotPasswordLink: Locator;
  readonly signUpLink: Locator;

  constructor(page: Page) {
    this.page = page;

    /**
     * Use exact label matches to avoid collisions:
     * Previously `/email/i` matched BOTH:
     * - textbox "Email address"
     * - button "Find organizations for this email"
     */
    this.emailInput = page.getByLabel('Email address', { exact: true }).or(page.getByTestId('login-email'));
    this.passwordInput = page.getByLabel('Password', { exact: true }).or(page.getByTestId('login-password'));

    // Present on the current deployed login UI
    this.organizationSelect = page.getByLabel('Organization', { exact: true });
    this.findOrganizationsButton = page.getByRole('button', { name: 'Find organizations for this email', exact: true });

    this.submitButton = page
      .getByRole('button', { name: 'Login', exact: true })
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

    // If org selection is required by the UI, this is a good place to extend logic later.
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  // PUBLIC_INTERFACE
  async assertLoaded(): Promise<void> {
    /** Verify the login screen is visible and ready for interaction. */
    await expect(this.emailInput, 'Expected email input to be visible on login screen').toBeVisible();
    await expect(this.organizationSelect, 'Expected organization selector to be visible on login screen').toBeVisible();
    await expect(this.passwordInput, 'Expected password input to be visible on login screen').toBeVisible();
    await expect(this.submitButton, 'Expected submit button to be visible on login screen').toBeVisible();
  }
}
