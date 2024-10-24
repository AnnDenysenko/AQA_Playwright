import { test, expect } from '@playwright/test';

test.describe('Intercepting test', () => {
  test('Should change the user name to Polar Bear', async ({ browser }) => {
    // Defining the body for intercept response
    const body = {
      "status": "ok",
      "data": {
        "userId": 151949,
        "photoFilename": "default-user.png",
        "name": "Polar",
        "lastName": "Bear",
        "dateBirth": "2021-03-17T15:21:05.000Z",
        "country": "Ukraine"
      }
    };

    // Creating a new browser context with HTTP basic authentication
    const context = await browser.newContext({
      httpCredentials: {
        username: 'guest',
        password: 'welcome2qauto',
      },
    });

    // Creating a new page in that context
    const page = await context.newPage();

    // Intercepting the GET request and modifying the response
    await page.route('**/api/users/profile', route =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(body),
      })
    );

    await page.goto('https://qauto.forstudy.space/');

    await page.click('.header_signin');

    // Fill in the sign-in form and log in
    await page.fill('input[name="email"]', 'anna.denysenko@gmail.com');
    await page.fill('input[name="password"]', 'Hillel2024');
    await page.locator('button:has-text("Login")').click();

    // Simulate clicking on the profile icon
    await page.click('.icon-profile');

    // Waiting for the intercepted request to complete
    const responsePromise = page.waitForResponse('https://qauto.forstudy.space/api/users/profile');

      // Waiting for the Profile button to be visible
      const profileButton = await page.locator('a[routerlink="profile"]');
      // Clicking the Profile button
      await profileButton.click();

    // await page.getByText('').click();
    const response = await responsePromise;

    // Validating the displayed name on the profile page
    const profileName = await page.textContent('.profile_name');
    expect(profileName).toBe('Polar Bear');
  });
});
