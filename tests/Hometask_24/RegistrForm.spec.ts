import { test, expect } from "@playwright/test";
import { HomePage } from "../../page-objects/pages/HomePage";
import generateRandomEmail from "../../utils (helpers)/randomEmailGenerator";
import { mainUserEmail, mainUserPassword, randomUserEmail } from "../../test-data/credentials";

test.describe("Registration Form Tests", () => {
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    await homePage.open();
    await homePage.openRegistrationForm();
  });

  test.skip("Successfully register a new user with valid credentials", async ({
    page,
  }) => {
    await homePage.fillRegistrationForm(
      "Anna",
      "User",
      "user1.anna@test.com",
      "TestPassword1",
      "TestPassword1"
    );
    await homePage.submitForm();
    await expect(page.locator('h1:has-text("Garage")')).toBeVisible();
  });

  test("User cannot register with an empty name field", async () => {
    await homePage.fillRegistrationForm(
      "",
      "Test",
      "test@gmail.com",
      "TestPassword1",
      "TestPassword1"
    );
    await expect(homePage.registerButton).toBeDisabled();
  });

  test("User cannot register with a name shorter than 2 characters", async ({
    page,
  }) => {
    await homePage.fillRegistrationForm(
      "A",
      "Test",
      "test@gmail.com",
      "TestPassword1",
      "TestPassword1"
    );

    // Click on the first form-group div and wait for 1 second (per the request)
    await page.locator("div.form-group").nth(0).click();
    await page.waitForTimeout(1000);

    await homePage.checkFieldError(
      homePage.nameInput,
      "Name has to be from 2 to 20 characters long"
    );
    await expect(homePage.registerButton).toBeDisabled();
  });

  test("User cannot register with a name longer than 20 characters", async ({
    page,
  }) => {
    await homePage.fillRegistrationForm(
      "Test Name to check validation",
      "Test",
      "test@gmail.com",
      "TestPassword1",
      "TestPassword1"
    );

    await page.waitForTimeout(1000);

    await homePage.checkFieldError(
      homePage.nameInput,
      "Name has to be from 2 to 20 characters long"
    );
    await expect(homePage.registerButton).toBeDisabled();
  });

  test("Name field cannot contain non-latin symbols", async ({ page }) => {
    await homePage.fillRegistrationForm(
      "Name&^*()",
      "Test",
      "test@gmail.com",
      "TestPassword1",
      "TestPassword1"
    );

    await page.waitForTimeout(1000);

    await homePage.checkFieldError(homePage.nameInput, "Name is invalid");
    await expect(homePage.registerButton).toBeDisabled();
  });

  test("Last name field cannot be empty", async ({ page }) => {
    await homePage.fillRegistrationForm(
      "Username",
      "",
      "test@gmail.com",
      "TestPassword1",
      "TestPassword1"
    );

    await expect(homePage.registerButton).toBeDisabled();
  });

  test("Last name cannot contain non-latin symbols", async ({ page }) => {
    await homePage.fillRegistrationForm(
      "Anna",
      "User1^*^",
      "test@gmail.com",
      "TestPassword1",
      "TestPassword1"
    );

    // Wait for validation feedback
    await page.waitForTimeout(1000);

    await homePage.checkFieldError(homePage.surnameInput, "Name is invalid");
    await expect(homePage.registerButton).toBeDisabled();
  });

  test("Email field format should reject invalid email", async ({ page }) => {
    await homePage.fillRegistrationForm(
      "Anna",
      "User",
      "user.user.com",
      "TestPassword1",
      "TestPassword1"
    );

    // Wait for validation feedback
    await page.waitForTimeout(1000);

    await homePage.checkFieldError(homePage.emailInput, "Email is incorrect");
    await expect(homePage.registerButton).toBeDisabled();
  });

  test("Should show an error for an empty password field", async ({ page }) => {
    await homePage.fillRegistrationForm(
      "Anna",
      "User",
      "mytestuser@gmail.com",
      "",
      ""
    );

    // Wait for validation feedback
    await page.waitForTimeout(1000);

    await homePage.checkFieldError(homePage.passwordInput, "Password required");
    await expect(homePage.registerButton).toBeDisabled();
  });

  test("Should show an error for a short password", async ({ page }) => {
    const registrationPage = new HomePage(page);
    await homePage.fillRegistrationForm(
      "Anna",
      "User",
      "mytestuser@gmail.com",
      "abc123",
      "abc123"
    );
    await registrationPage.repeatPasswordInput.click();

    await page.waitForTimeout(1000);

    await homePage.checkFieldError(
      homePage.passwordInput,
      "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter"
    );
    await expect(homePage.registerButton).toBeDisabled();
  });

  test("Should show an error for a weak password", async ({ page }) => {
    const registrationPage = new HomePage(page);
    await homePage.fillRegistrationForm(
      "Anna",
      "User",
      "mytestuser@gmail.com",
      "password",
      "password"
    );

    await page.waitForTimeout(1000);

    await homePage.checkFieldError(
      homePage.passwordInput,
      "Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter"
    );
    await expect(homePage.registerButton).toBeDisabled();
  });

  test("Should show an error if passwords do not match", async ({ page }) => {
    const registrationPage = new HomePage(page);
    await homePage.fillRegistrationForm(
      "Anna",
      "User",
      "mytestuser@gmail.com",
      "Password1",
      "Password123"
    );
    await registrationPage.passwordInput.click();

    await page.waitForTimeout(1000);

    await homePage.checkFieldError(
      homePage.repeatPasswordInput,
      "Passwords do not match"
    );
    await expect(homePage.registerButton).toBeDisabled();
  });

  test("Should show an error for an empty re-enter password field", async ({
    page,
  }) => {
    const registrationPage = new HomePage(page);
    await homePage.fillRegistrationForm(
      "Anna",
      "User",
      "mytestuser@gmail.com",
      "Password1",
      ""
    );
    await registrationPage.passwordInput.click();

    await page.waitForTimeout(1000);

    await homePage.checkFieldError(
      homePage.repeatPasswordInput,
      "Re-enter password required"
    );
    await expect(homePage.registerButton).toBeDisabled();
  });
});
