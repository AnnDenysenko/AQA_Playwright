// fixtures.ts
import { test as base } from "@playwright/test";
import { GaragePage } from "../../page-objects/pages/GaragePage";

// First user fixture
export const test = base.extend<{
  userGaragePage: GaragePage;
}>({
  userGaragePage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: "test-data/states/mainUserState.json",
    });
    const page = await context.newPage();
    const garagePage = new GaragePage(page);
    await garagePage.open();
    await use(garagePage);
    await context.close();
  },
});

// Second user fixture
export const testUser2 = base.extend<{
  userGaragePage: GaragePage;
}>({
  userGaragePage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: "test-data/states/mainUserState2.json",
    });
    const page = await context.newPage();
    const garagePage = new GaragePage(page);
    await garagePage.open();
    await use(garagePage);
    await context.close();
  },
});

export { expect } from "@playwright/test";
