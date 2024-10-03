import { test, expect } from '@playwright/test';

const BASE_URL = 'https://guest:welcome2qauto@qauto.forstudy.space/';
const EMAIL_PREFIX = 'aqa';

test.describe('Registration Form Tests', () => {

  // Declaring utility function for converting RGB to HEX
  const rgbToHex = (rgb) => {
    const rgbArray = rgb.match(/\d+/g).map(Number);
    return `#${((1 << 24) + (rgbArray[0] << 16) + (rgbArray[1] << 8) + rgbArray[2]).toString(16).slice(1)}`;
  };

  // Declaring a function to define all locators for the further use
  const defineLocators = (page) => ({
    nameInput: page.locator('input[name="name"]'),
    surnameInput: page.locator('input[name="lastName"]'),
    emailInput: page.locator('input[name="email"]'),
    passwordInput: page.locator('input[name="password"]'),
    repeatPasswordInput: page.locator('input[name="repeatPassword"]'),
    registerButton: page.getByRole('button', { name: 'Register' }),
  });

  // Declaring a function to fill the registration form
  const fillRegistrationForm = async (page, { name, surname, email, password, repeatPassword }) => {
    const locators = defineLocators(page);
    await locators.nameInput.fill(name || '');
    await locators.surnameInput.fill(surname || '');
    await locators.emailInput.fill(email || '');
    await locators.passwordInput.fill(password || '');
    await locators.repeatPasswordInput.fill(repeatPassword || '');
  };

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.locator('button.hero-descriptor_btn.btn.btn-primary', { hasText: 'Sign up' }).click();
  });

  test('Successfully register a new user with valid credentials', async ({ page }) => {
    const email = `${EMAIL_PREFIX}-user.anna@test.com`;

        await fillRegistrationForm(page, {
            name: 'Anna',
            surname: 'User',
            email: email,
            password: 'Test.Passrowd1',
            repeatPassword: 'Test.Passrowd1'
          });

    await page.getByRole('button', { name: 'Register' }).click({ force: true });
    await page.isVisible('h1:has-text("Garage")');
  });

  test('User cannot register with an empty name field', async ({ page }) => {
    await fillRegistrationForm(page, {
        name: '',
        surname: 'Test',
        email: 'test@gmail.com',
        password: 'TestPassword1',
        repeatPassword: 'TestPassword1'
      });

    const registerButton = page.getByRole('button', { name: 'Register' });
    await expect(registerButton).toBeDisabled();
  });

  test('User cannot register with a name shorter than 2 characters', async ({ page }) => {
    const locators = defineLocators(page);

    await fillRegistrationForm(page, {
        name: 'A',
        surname: 'Test',
        email: 'test@gmail.com',
        password: 'TestPassword1',
        repeatPassword: 'TestPassword1'
      });

    // const registerButton = page.getByRole('button', { name: 'Register' }).click();
    await page.locator('div.form-group').nth(0).click();
    await page.waitForTimeout(1000);

    const borderColor = await locators.nameInput.evaluate((el) => getComputedStyle(el).borderColor);
    expect(rgbToHex(borderColor)).toBe('#dc3545');

    const errorMessage = page.locator('text = Name has to be from 2 to 20 characters long'); 
    await expect(errorMessage).toBeVisible();

    const registerButton = page.getByRole('button', { name: 'Register' });
    await expect(registerButton).toBeDisabled();
  });

  test('User cannot register with a name longer than 20 characters', async ({ page }) => {
    const locators = defineLocators(page);

    await fillRegistrationForm(page, {
        name: 'Test Name to check validation',
        surname: 'Test',
        email: 'test@gmail.com',
        password: 'TestPassword1',
        repeatPassword: 'TestPassword1'
      });

    await page.waitForTimeout(1000);

    const borderColor = await locators.nameInput.evaluate((el) => getComputedStyle(el).borderColor);
    expect(rgbToHex(borderColor)).toBe('#dc3545');

    const errorMessage = page.locator('text = Name has to be from 2 to 20 characters long'); 
    await expect(errorMessage).toBeVisible();

    const registerButton = page.getByRole('button', { name: 'Register' });
    await expect(registerButton).toBeDisabled();
  });


  test('Name field cannot contain non-latin symbols', async ({ page }) => {
    const locators = defineLocators(page);

    await fillRegistrationForm(page, {
      name: 'Name&^*()',
      surname: 'Test',
      email: 'user.anna@test.com',
      password: 'TestPassword1',
      repeatPassword: 'TestPassword1'
    });

    // Wait for validation feedback
    await page.waitForTimeout(1000);

    const borderColor = await locators.nameInput.evaluate((el) => getComputedStyle(el).borderColor);
    expect(rgbToHex(borderColor)).toBe('#dc3545');

    const errorMessage = page.locator('text=Name is invalid');
    await expect(errorMessage).toBeVisible();

    const registerButton = page.getByRole('button', { name: 'Register' });
    await expect(registerButton).toBeDisabled();
  });

  test('Last name field cannot be empty', async ({ page }) => {
    const locators = defineLocators(page);

    await fillRegistrationForm(page, {
      name: 'Username',
      surname: '',
      email: 'user.anna@test.com',
      password: 'TestPassword1',
      repeatPassword: 'TestPassword1'
    });

    const registerButton = page.getByRole('button', { name: 'Register' });
    await expect(registerButton).toBeDisabled();
  });

  test('Last name cannot contain non-latin symbols', async ({ page }) => {
    const locators = defineLocators(page);

    await fillRegistrationForm(page, {
      name: 'Anna',
      surname: 'User1^*^',
      email: 'user.anna@test.com',
      password: 'TestPassword1',
      repeatPassword: 'TestPassword1'
    });

  // Wait for validation feedback
  await page.waitForTimeout(1000); 

  const borderColor = await locators.surnameInput.evaluate((el) => getComputedStyle(el).borderColor);
  expect(rgbToHex(borderColor)).toBe('#dc3545');

  const errorMessage = page.locator('text=Name is invalid');
  await expect(errorMessage).toBeVisible();

  const registerButton = page.getByRole('button', { name: 'Register' });
  await expect(registerButton).toBeDisabled();
  });

  test('Email field format should reject invalid email', async ({ page }) => {
    const locators = defineLocators(page);

    await fillRegistrationForm(page, {
      name: 'Anna',
      surname: 'User',
      email: 'user.user.com',
      password: 'TestPassword1',
      repeatPassword: 'TestPassword1'
    });

  // Wait for validation feedback
  await page.waitForTimeout(1000); 

  const borderColor = await locators.emailInput.evaluate((el) => getComputedStyle(el).borderColor);
  expect(rgbToHex(borderColor)).toBe('#dc3545');

  const errorMessage = page.locator('text=Email is incorrect');
  await expect(errorMessage).toBeVisible();

  const registerButton = page.getByRole('button', { name: 'Register' });
  await expect(registerButton).toBeDisabled();
  });

  test('Should show an error for an empty password field', async ({ page }) => {
    const locators = defineLocators(page);

    await fillRegistrationForm(page, {
      name: 'Anna',
      surname: 'User',
      email: 'mytestuser@gmail.com',
      password: '',
      repeatPassword: ''
    });

  // Wait for validation feedback
  await page.waitForTimeout(1000); 

  const borderColor = await locators.passwordInput.evaluate((el) => getComputedStyle(el).borderColor);
  expect(rgbToHex(borderColor)).toBe('#dc3545');

  const errorMessage = page.locator('text=Password required');
  await expect(errorMessage).toBeVisible();

  const registerButton = page.getByRole('button', { name: 'Register' });
  await expect(registerButton).toBeDisabled(); 
  });

  test('Should show an error for a short password',  async ({ page }) => {
    const locators = defineLocators(page);

    await fillRegistrationForm(page, {
      name: 'Anna',
      surname: 'User',
      email: 'user@test.com',
      password: 'abc123',
      repeatPassword: 'abc123',
    }); 

  await locators.repeatPasswordInput.click();

  await page.waitForTimeout(1000); 

  const borderColor = await locators.passwordInput.evaluate((el) => getComputedStyle(el).borderColor);
  expect(rgbToHex(borderColor)).toBe('#dc3545');

  const errorMessage = page.locator('text=Password has to be from 8 to 15 characters long and contain at least one integer, one capital, and one small letter');
  await expect(errorMessage).toBeVisible();

  const registerButton = page.getByRole('button', { name: 'Register' });
  await expect(registerButton).toBeDisabled(); 
  });

  test('Should show an error for a weak password',  async ({ page }) => {
    const locators = defineLocators(page);

    await fillRegistrationForm(page, {
      name: 'Anna',
      surname: 'User',
      email: 'user@test.com',
      password: 'password',
      repeatPassword: 'password',
    });

  await locators.repeatPasswordInput.click();

  await page.waitForTimeout(1000); 

  const borderColor = await locators.passwordInput.evaluate((el) => getComputedStyle(el).borderColor);
  expect(rgbToHex(borderColor)).toBe('#dc3545');

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
    const locators = defineLocators(page);

    await fillRegistrationForm(page, {
      name: 'Anna',
      surname: 'User',
      email: 'user@test.com',
      password: 'Password1',
      repeatPassword: 'Password123',
    });

   await locators.passwordInput.click();
   await page.waitForTimeout(1000); 

   const borderColor = await locators.repeatPasswordInput.evaluate((el) => getComputedStyle(el).borderColor);
   expect(rgbToHex(borderColor)).toBe('#dc3545');

  const errorMessage = page.locator('text=Passwords do not match');
  await expect(errorMessage).toBeVisible();

  const registerButton = page.getByRole('button', { name: 'Register' });
  await expect(registerButton).toBeDisabled(); 
  });

  test('Should show an error for an empty re-enter password field',  async ({ page }) => {
    const locators = defineLocators(page);

    await fillRegistrationForm(page, {
      name: 'Anna',
      surname: 'User',
      email: 'user@test.com',
      password: 'Password1',
      repeatPassword: '',
    });

    await locators.passwordInput.click();
    await page.waitForTimeout(1000); 

    const borderColor = await locators.repeatPasswordInput.evaluate((el) => getComputedStyle(el).borderColor);
    expect(rgbToHex(borderColor)).toBe('#dc3545');

  const errorMessage = page.locator('text=Re-enter password required');
  await expect(errorMessage).toBeVisible();

  const registerButton = page.getByRole('button', { name: 'Register' });
  await expect(registerButton).toBeDisabled(); 
  });
});

