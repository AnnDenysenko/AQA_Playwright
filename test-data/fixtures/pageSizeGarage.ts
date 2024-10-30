import { test as base } from "@playwright/test";

export const test = base.extend({
  pageSmall: async ({ page }, use) => {
    await page.setViewportSize({
      width: 500,
      height: 500,
    });

    await use(page);
  },

  pageMedium: async ({ page }, use) => {
    await page.setViewportSize({
      width: 1000,
      height: 1000,
    });

    await use(page);
  },

  pageBig: async ({ page }, use) => {
    await page.setViewportSize({
      width: 1800,
      height: 1800,
    });

    await use(page);
  },
});
