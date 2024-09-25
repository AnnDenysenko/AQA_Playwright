import { test, expect } from '@playwright/test';

const BASE_URL = 'https://qauto.forstudy.space';
const EMAIL_PREFIX = 'aqa'; // Prefix for test users

test.describe('Registration Form Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`https://guest:welcome2qauto@qauto.forstudy.space/`);

    await page.locator('button.hero-descriptor_btn.btn.btn-primary', { hasText: 'Sign up' }).click();
  });


  test('Successfully register a new user with valid credentials', async ({ page }) => {
    const email = `${EMAIL_PREFIX}-user.anna@test.com`;
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', 'validpassword');
    await page.fill('input[name="confirmPassword"]', 'validpassword');
    await page.click('button[type="submit"]');

    // Verify success message
    await expect(page.locator('.success-message')).toBeVisible();
    await expect(page.locator('.success-message')).toHaveText('Registration successful');
  });
});