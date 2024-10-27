import { test as base } from "@playwright/test";
import { HomePage } from "../../page-objects/pages/HomePage";
import { SignInForm } from "../../page-objects/components/forms/SignInForm";
import { GaragePage } from "../../page-objects/pages/GaragePage";
import { Page } from "@playwright/test";

type MyFixtures = {
  garagePageWithRemoving: GaragePage;
  signInForm: SignInForm;
  pageSmall: Page;
};

export const test = base.extend<MyFixtures>({
  garagePageWithRemoving: async ({ page }, use) => {
    // const context = await browser.newContext({
    //     storageState: 'test-data/states/mainUserState.json'
    // })
    // const page = await context.newPage();
    let garagePage = new GaragePage(page);
    await garagePage.open();
    await use(garagePage);
    await page.locator(".icon-edit").first().click();
    await page.locator(".btn-outline-danger").click();
    await page.locator(".btn-danger").click();
  },

  pageSmall: async ({ page }, use) => {
    await page.setViewportSize({
      width: 300,
      height: 300,
    });

    await use(page);
  },
});
