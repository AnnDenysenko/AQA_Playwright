// userGaragePage.ts
import { test as base, expect } from "@playwright/test"; // Import base test and expect from Playwright
import { GaragePage } from "../../page-objects/pages/GaragePage"; // Import the GaragePage class
import { SignInForm } from "../../page-objects/components/forms/SignInForm"; // Import the SignInForm class
import { Page } from "@playwright/test";

// Define custom fixtures
type MyFixtures = {
  userGaragePage: GaragePage; // Fixture for GaragePage
  signInForm: SignInForm; // Fixture for SignInForm
  pageSmall: Page;
};

// Extend the base test with custom fixtures
export const test = base.extend<MyFixtures>({
  userGaragePage: async ({ browser }, use) => {
    // Create a new browser context with the specified storage state
    const context = await browser.newContext({
      storageState: "test-data/states/mainUserState.json", // Path to the storage state file
    });

    // Create a new page in the context
    const page = await context.newPage();
    const garagePage = new GaragePage(page); // Instantiate the GaragePage with the new page

    await garagePage.open(); // Open the garage page
    await use(garagePage); // Provide the garagePage instance to tests
    await context.close(); // Close the context after tests
  },

  signInForm: async ({ page }, use) => {
    const signInForm = new SignInForm(page); // Instantiate SignInForm with the current page
    await use(signInForm); // Provide the signInForm instance to tests
  },

  pageSmall: async ({ browser }, use) => {
    // Create a new browser context with a specific viewport size
    const context = await browser.newContext({
      viewport: { width: 640, height: 480 }, // Small viewport size for testing
    });
    const page = await context.newPage(); // Create a new page in this context
    await use(page); // Provide the page instance to tests
    await context.close(); // Close the context after tests
  },
});

// Re-export the expect function for assertions in tests
export { expect };
