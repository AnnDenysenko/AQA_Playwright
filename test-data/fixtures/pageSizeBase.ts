import { test as base } from "@playwright/test";
export const test = base.extend({
  pageSmall: async ({ page }, use) => {
    await page.setViewportSize({
      width: 300,
      height: 300,
    });

    await use(page);
  },

  pageMedium: async ({ page }, use) => {
    await page.setViewportSize({
      width: 700,
      height: 700,
    });

    await use(page);
  },

  pageBig: async ({ page }, use) => {
    await page.setViewportSize({
      width: 1500,
      height: 1500,
    });

    await use(page);
  },
});
