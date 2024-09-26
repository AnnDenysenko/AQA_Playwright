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
        // Defining locators for the input fields
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="name"]', 'Anna');
    await page.fill('input[name="lastName"]', 'User');
    await page.fill('input[name="password"]', 'Test.Passrowd1');
    await page.fill('input[name="repeatPassword"]', 'Test.Passrowd1');

    await page.getByRole('button', { name: 'Register' }).click({ force: true });

    await page.isVisible('h1:has-text("Garage")');
  });

  test('User cannot register with an empty name field', async ({ page }) => {
    const nameInput = page.locator('input[name="name"]');
    const surnameInput = page.locator('input[name="lastName"]');
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const repeatPasswordInput = page.locator('input[name="repeatPassword"]');

    await nameInput.fill('');
    await surnameInput.fill('Test');
    await emailInput.fill('test@gmail.com');
    await passwordInput.fill('TestPassword1');
    await repeatPasswordInput.fill('TestPassword1');

    const registerButton = page.getByRole('button', { name: 'Register' });

    await expect(registerButton).toBeDisabled();
  });

  test('User cannot register with a name shorter than 2 characters', async ({ page }) => {
    const nameInput = page.locator('input[name="name"]');
    const surnameInput = page.locator('input[name="lastName"]');
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const repeatPasswordInput = page.locator('input[name="repeatPassword"]');

    await nameInput.fill('A');
    await surnameInput.fill('Test');
    await emailInput.fill('user.anna@test.com');
    await passwordInput.fill('TestPassword1');
    await repeatPasswordInput.fill('TestPassword1');

    // const registerButton = page.getByRole('button', { name: 'Register' }).click();
    await page.locator('div.form-group').nth(0).click();

    await page.waitForTimeout(1000);

    // Assert the border color is the expected red (#dc3545)
    const borderColor = await nameInput.evaluate((el) => getComputedStyle(el).borderColor);

    // Convert rgb to hex
    const rgbToHex = (rgb) => {
        const rgbArray = rgb.match(/\d+/g).map(Number);
        return `#${((1 << 24) + (rgbArray[0] << 16) + (rgbArray[1] << 8) + rgbArray[2]).toString(16).slice(1)}`;
    };

    // Convert the obtained border color from rgb to hex
    const actualBorderColorHex = rgbToHex(borderColor);

    // Expect the border color to be #dc3545
    expect(actualBorderColorHex).toBe('#dc3545');

    const errorMessage = page.locator('text = Name has to be from 2 to 20 characters long'); 
    await expect(errorMessage).toBeVisible();

    const registerButton = page.getByRole('button', { name: 'Register' });

    await expect(registerButton).toBeDisabled();
  });

  test('User cannot register with a name дonger than 20 characters', async ({ page }) => {
    const nameInput = page.locator('input[name="name"]');
    const surnameInput = page.locator('input[name="lastName"]');
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const repeatPasswordInput = page.locator('input[name="repeatPassword"]');

    // Test case with name longer than 20 characters
    await nameInput.fill('ThisNameIsWayTooLongForValidation');
    await surnameInput.fill('Test');
    await emailInput.fill('user.anna@test.com');
    await passwordInput.fill('TesrPassword1');
    await repeatPasswordInput.fill('TestPassword1');

    await page.waitForTimeout(1000);

    // Assert the border color is the expected red (#dc3545)
    const borderColor = await nameInput.evaluate((el) => getComputedStyle(el).borderColor);

    // Convert rgb to hex
    const rgbToHex = (rgb) => {
        const rgbArray = rgb.match(/\d+/g).map(Number);
        return `#${((1 << 24) + (rgbArray[0] << 16) + (rgbArray[1] << 8) + rgbArray[2]).toString(16).slice(1)}`;
    };

    // Convert the obtained border color from rgb to hex
    const actualBorderColorHex = rgbToHex(borderColor);

    // Expect the border color to be #dc3545
    expect(actualBorderColorHex).toBe('#dc3545');

    const errorMessage = page.locator('text = Name has to be from 2 to 20 characters long'); 
    await expect(errorMessage).toBeVisible();

    const registerButton = page.getByRole('button', { name: 'Register' });

    await expect(registerButton).toBeDisabled();
  });


  test('Name field cannot contain non-latin symbols', async ({ page }) => {
    const nameInput = page.locator('input[name="name"]');
    const surnameInput = page.locator('input[name="lastName"]');
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const repeatPasswordInput = page.locator('input[name="repeatPassword"]');

    await nameInput.fill('Name&^*()');
    await surnameInput.fill('Test');
    await emailInput.fill('user.anna@test.com');
    await passwordInput.fill('TestPassword1');
    await repeatPasswordInput.fill('TestPassword1');

    // Wait for validation feedback
    await page.waitForTimeout(1000);

    // Assert the border color is the expected red (#dc3545)
    const borderColor = await nameInput.evaluate((el) => getComputedStyle(el).borderColor);

    // Function to convert RGB to HEX
    const rgbToHex = (rgb) => {
      const rgbArray = rgb.match(/\d+/g).map(Number);
      return `#${((1 << 24) + (rgbArray[0] << 16) + (rgbArray[1] << 8) + rgbArray[2]).toString(16).slice(1)}`;
    };

    // Convert the obtained border color from RGB to HEX
    const actualBorderColorHex = rgbToHex(borderColor);

    // Expect the border color to be #dc3545
    expect(actualBorderColorHex).toBe('#dc3545');

    const errorMessage = page.locator('text=Name is invalid');
    await expect(errorMessage).toBeVisible();

    const registerButton = page.getByRole('button', { name: 'Register' });

    await expect(registerButton).toBeDisabled();
  });

  test('Last name field cannot be empty', async ({ page }) => {

    const nameInput = page.locator('input[name="name"]');
    const surnameInput = page.locator('input[name="lastName"]');
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const repeatPasswordInput = page.locator('input[name="repeatPassword"]');

    await nameInput.fill('Anna');
    await surnameInput.fill('');
    await emailInput.fill('user.anna@test.com');
    await passwordInput.fill('TestPassword1');
    await repeatPasswordInput.fill('TestPassword1');

    const registerButton = page.getByRole('button', { name: 'Register' });

    await expect(registerButton).toBeDisabled();
  });

  test('Last name cannot contain non-latin symbols', async ({ page }) => {

    const nameInput = page.locator('input[name="name"]');
    const surnameInput = page.locator('input[name="lastName"]');
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const repeatPasswordInput = page.locator('input[name="repeatPassword"]');

    await nameInput.fill('Anna');
    await surnameInput.fill('User1^*^');
    await emailInput.fill('user.anna@test.com');
    await passwordInput.fill('TestPassword1');
    await repeatPasswordInput.fill('TestPassword1');

  // Wait for validation feedback
  await page.waitForTimeout(1000); 

  // Assert the border color is the expected red (#dc3545)
  const borderColor = await surnameInput.evaluate((el) => getComputedStyle(el).borderColor);

  // Function to convert RGB to HEX
  const rgbToHex = (rgb) => {
    const rgbArray = rgb.match(/\d+/g).map(Number);
    return `#${((1 << 24) + (rgbArray[0] << 16) + (rgbArray[1] << 8) + rgbArray[2]).toString(16).slice(1)}`;
  };

  // Convert the obtained border color from RGB to HEX
  const actualBorderColorHex = rgbToHex(borderColor);

  // Expect the border color to be #dc3545
  expect(actualBorderColorHex).toBe('#dc3545');

  const errorMessage = page.locator('text=Last name is invalid');
  await expect(errorMessage).toBeVisible();

  const registerButton = page.getByRole('button', { name: 'Register' });

  await expect(registerButton).toBeDisabled();
  });

  test('Email field format should reject invalid email', async ({ page }) => {

    const nameInput = page.locator('input[name="name"]');
    const surnameInput = page.locator('input[name="lastName"]');
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const repeatPasswordInput = page.locator('input[name="repeatPassword"]');

    await nameInput.fill('Anna');
    await surnameInput.fill('User');
    await emailInput.fill('user.test.com');
    await passwordInput.fill('TestPassword1');
    await repeatPasswordInput.fill('TestPassword1');

  // Wait for validation feedback
  await page.waitForTimeout(1000); 

  // Assert the border color is the expected red (#dc3545)
  const borderColor = await emailInput.evaluate((el) => getComputedStyle(el).borderColor);

  // Function to convert RGB to HEX
  const rgbToHex = (rgb) => {
    const rgbArray = rgb.match(/\d+/g).map(Number);
    return `#${((1 << 24) + (rgbArray[0] << 16) + (rgbArray[1] << 8) + rgbArray[2]).toString(16).slice(1)}`;
  };

  // Convert the obtained border color from RGB to HEX
  const actualBorderColorHex = rgbToHex(borderColor);

  // Expect the border color to be #dc3545
  expect(actualBorderColorHex).toBe('#dc3545');

  const errorMessage = page.locator('text=Email is incorrect');
  await expect(errorMessage).toBeVisible();

  const registerButton = page.getByRole('button', { name: 'Register' });

  await expect(registerButton).toBeDisabled();
  });

  test('Should show an error for an empty password field', async ({ page }) => {
    const nameInput = page.locator('input[name="name"]');
    const surnameInput = page.locator('input[name="lastName"]');
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const repeatPasswordInput = page.locator('input[name="repeatPassword"]');

    await nameInput.fill('Anna');
    await surnameInput.fill('User');
    await emailInput.fill('user@test.com');
    await passwordInput.fill('');
    await repeatPasswordInput.click();

  // Wait for validation feedback
  await page.waitForTimeout(1000); 

  // Assert the border color is the expected red (#dc3545)
  const borderColor = await passwordInput.evaluate((el) => getComputedStyle(el).borderColor);

  // Function to convert RGB to HEX
  const rgbToHex = (rgb) => {
    const rgbArray = rgb.match(/\d+/g).map(Number);
    return `#${((1 << 24) + (rgbArray[0] << 16) + (rgbArray[1] << 8) + rgbArray[2]).toString(16).slice(1)}`;
  };

  // Convert the obtained border color from RGB to HEX
  const actualBorderColorHex = rgbToHex(borderColor);

  // Expect the border color to be #dc3545
  expect(actualBorderColorHex).toBe('#dc3545');

  const errorMessage = page.locator('text=Password required');
  await expect(errorMessage).toBeVisible();

  const registerButton = page.getByRole('button', { name: 'Register' });

  await expect(registerButton).toBeDisabled(); 
  });

  test('Should show an error for a short password',  async ({ page }) => {
    const nameInput = page.locator('input[name="name"]');
    const surnameInput = page.locator('input[name="lastName"]');
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const repeatPasswordInput = page.locator('input[name="repeatPassword"]');

    await nameInput.fill('Anna');
    await surnameInput.fill('User');
    await emailInput.fill('user@test.com');
    await passwordInput.fill('abc123');
    await repeatPasswordInput.click();

  await page.waitForTimeout(1000); 

  // Assert the border color is the expected red (#dc3545)
  const borderColor = await passwordInput.evaluate((el) => getComputedStyle(el).borderColor);

  // Function to convert RGB to HEX
  const rgbToHex = (rgb) => {
    const rgbArray = rgb.match(/\d+/g).map(Number);
    return `#${((1 << 24) + (rgbArray[0] << 16) + (rgbArray[1] << 8) + rgbArray[2]).toString(16).slice(1)}`;
  };

  // Convert the obtained border color from RGB to HEX
  const actualBorderColorHex = rgbToHex(borderColor);

  // Expect the border color to be #dc3545
  expect(actualBorderColorHex).toBe('#dc3545');

  const errorMessage = page.locator('text=Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
  await expect(errorMessage).toBeVisible();

  const registerButton = page.getByRole('button', { name: 'Register' });

  await expect(registerButton).toBeDisabled(); 
  });


  test('Should show an error for a weak password',  async ({ page }) => {
    const nameInput = page.locator('input[name="name"]');
    const surnameInput = page.locator('input[name="lastName"]');
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const repeatPasswordInput = page.locator('input[name="repeatPassword"]');

    await nameInput.fill('Anna');
    await surnameInput.fill('User');
    await emailInput.fill('user@test.com');
    await passwordInput.fill('password');
    await repeatPasswordInput.click();

  await page.waitForTimeout(1000); 

  // Assert the border color is the expected red (#dc3545)
  const borderColor = await passwordInput.evaluate((el) => getComputedStyle(el).borderColor);

  // Function to convert RGB to HEX
  const rgbToHex = (rgb) => {
    const rgbArray = rgb.match(/\d+/g).map(Number);
    return `#${((1 << 24) + (rgbArray[0] << 16) + (rgbArray[1] << 8) + rgbArray[2]).toString(16).slice(1)}`;
  };

  // Convert the obtained border color from RGB to HEX
  const actualBorderColorHex = rgbToHex(borderColor);

  // Expect the border color to be #dc3545
  expect(actualBorderColorHex).toBe('#dc3545');

  const errorMessage = page.locator('text=Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
  await expect(errorMessage).toBeVisible();

  const registerButton = page.getByRole('button', { name: 'Register' });

  await expect(registerButton).toBeDisabled(); 
  });

  test('Password mismatch error should not be visible', async ({ page }) => {
    await page.locator('input[name="password"]').fill('TestPassword1');
    await page.locator('input[name="repeatPassword"]').fill('TestPassword1');
    await page.locator('form').click();
  
    const errorMessage = page.locator('text=Passwords do not match');
    await expect(errorMessage).not.toBeVisible();
  });
  

  test('Should show an error if passwords do not match',  async ({ page }) => {
    const nameInput = page.locator('input[name="name"]');
    const surnameInput = page.locator('input[name="lastName"]');
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const repeatPasswordInput = page.locator('input[name="repeatPassword"]');

    await nameInput.fill('Anna');
    await surnameInput.fill('User');
    await emailInput.fill('user@test.com');
    await passwordInput.fill('Password1');
    await repeatPasswordInput.fill('Password123');
    await passwordInput.click();
  await page.waitForTimeout(1000); 

  // Assert the border color is the expected red (#dc3545)
  const borderColor = await repeatPasswordInput.evaluate((el) => getComputedStyle(el).borderColor);

  // Function to convert RGB to HEX
  const rgbToHex = (rgb) => {
    const rgbArray = rgb.match(/\d+/g).map(Number);
    return `#${((1 << 24) + (rgbArray[0] << 16) + (rgbArray[1] << 8) + rgbArray[2]).toString(16).slice(1)}`;
  };

  // Convert the obtained border color from RGB to HEX
  const actualBorderColorHex = rgbToHex(borderColor);

  // Expect the border color to be #dc3545
  expect(actualBorderColorHex).toBe('#dc3545');

  const errorMessage = page.locator('text=Passwords do not match');
  await expect(errorMessage).toBeVisible();

  const registerButton = page.getByRole('button', { name: 'Register' });

  await expect(registerButton).toBeDisabled(); 
  });

  test('Should show an error for an empty re-enter password field',  async ({ page }) => {
    const nameInput = page.locator('input[name="name"]');
    const surnameInput = page.locator('input[name="lastName"]');
    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');
    const repeatPasswordInput = page.locator('input[name="repeatPassword"]');

    await nameInput.fill('Anna');
    await surnameInput.fill('User');
    await emailInput.fill('user@test.com');
    await passwordInput.fill('Password1');
    await repeatPasswordInput.fill('');
    await passwordInput.click();
  await page.waitForTimeout(1000); 

  // Assert the border color is the expected red (#dc3545)
  const borderColor = await repeatPasswordInput.evaluate((el) => getComputedStyle(el).borderColor);

  // Function to convert RGB to HEX
  const rgbToHex = (rgb) => {
    const rgbArray = rgb.match(/\d+/g).map(Number);
    return `#${((1 << 24) + (rgbArray[0] << 16) + (rgbArray[1] << 8) + rgbArray[2]).toString(16).slice(1)}`;
  };

  // Convert the obtained border color from RGB to HEX
  const actualBorderColorHex = rgbToHex(borderColor);

  // Expect the border color to be #dc3545
  expect(actualBorderColorHex).toBe('#dc3545');

  const errorMessage = page.locator('text=Re-enter password required');
  await expect(errorMessage).toBeVisible();

  const registerButton = page.getByRole('button', { name: 'Register' });

  await expect(registerButton).toBeDisabled(); 
  });
});

