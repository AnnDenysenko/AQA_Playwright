import { test, expect } from '@playwright/test';

test.describe("Registration", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("https://guest:welcome2qauto@qauto.forstudy.space/");
        await page.locator('text=Sign up').click();
    });

    //Filed name
    test('Field name. Empty field', async ({ page }) => {
    await page.locator('#signupName').focus();
    await page.locator('#signupName').blur();
    await page.locator('#signupLastName').fill('Dou');
    await page.locator('#signupEmail').fill('384934+testUser3@gmail.com');
    await page.locator('#signupPassword').fill('QazQwe123');
    await page.locator('#signupRepeatPassword').fill('QazQwe123');
    await expect (page.getByText ('Name required')).toBeVisible();
    //await page.textContent('.invalid-feedback').to.have('Name required');
    });

});