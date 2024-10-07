import { Locator, Page, expect } from "@playwright/test";
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    readonly page: Page;
    readonly signInButton: Locator;
    readonly nameInput: Locator;
    readonly surnameInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly repeatPasswordInput: Locator;
    readonly registerButton: Locator;
    readonly signUpButton: Locator;

    constructor (page: Page) {
        super(page);
        this.page = page;

        // Locators list
        this.signInButton = page.locator('.header _signin');
        this.nameInput = page.locator('input[name="name"]');
        this.surnameInput = page.locator('input[name="lastName"]');
        this.emailInput = page.locator('input[name="email"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.repeatPasswordInput = page.locator('input[name="repeatPassword"]');
        this.registerButton = page.getByRole('button', { name: 'Register' });
        this.signUpButton = page.locator('button.hero-descriptor_btn.btn.btn-primary', { hasText: 'Sign up' });
    }

    async open() {
        await this.page.goto('');
    }

    async openSignInForm() {
        await this.signInButton.click();
    }

    async openRegistrationForm() {
        await this.signUpButton.click();
    }

    async fillRegistrationForm(name: string, surname: string, email: string, password: string, repeatPassword: string) {
        await this.nameInput.fill(name);
        await this.surnameInput.fill(surname);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.repeatPasswordInput.fill(repeatPassword);
    }

    async submitForm() {
        await this.registerButton.click({ force: true });
    }

    // Utility function to convert RGB to HEX
    rgbToHex(rgb: string): string {
        const rgbArray = rgb.match(/\d+/g)?.map(Number);
        return `#${((1 << 24) + (rgbArray![0] << 16) + (rgbArray![1] << 8) + rgbArray![2]).toString(16).slice(1)}`;
    }

    // Borders color validation
    async checkFieldError(fieldLocator: Locator, errorMessage: string) {
        const borderColor = await fieldLocator.evaluate((el) => getComputedStyle(el).borderColor);
        expect(this.rgbToHex(borderColor)).toBe('#dc3545');
        const errorLocator = this.page.locator(`text=${errorMessage}`);
        await expect(errorLocator).toBeVisible();
    }
}
