import {
  test,
  expect,
  chromium,
  Browser,
  Page,
  APIRequestContext,
} from "@playwright/test";

const BASE_URL = "https://yourapp.forstudy.space"; // Змініть на вашу URL

// Фікстура для збереження storage state
async function loginAndSaveStorageState(browser: Browser) {
  const context = await browser.newContext();
  const page = await context.newPage();

  // Логін під користувачем
  await page.goto(`${BASE_URL}/login`);
  await page.fill('input[name="email"]', "your_email@example.com"); // Вкажіть свій email
  await page.fill('input[name="password"]', "your_password"); // Вкажіть свій пароль
  await page.click('button[type="submit"]'); // Кнопка входу

  // Чекаємо на перенаправлення
  await page.waitForURL(`${BASE_URL}/garage`); // Змініть URL на ваш

  // Зберігаємо storage state
  await context.storageState({ path: "storageState.json" });

  await context.close();
}

// Кастомна фікстура userGaragePage
test.use({ storageState: "storageState.json" });

test.describe("Garage Page Tests", () => {
  let browser: Browser;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    await loginAndSaveStorageState(browser);
  });

  test.afterAll(async () => {
    await browser.close();
  });

  // Використання кастомної фікстури
  test("User can access Garage Page", async ({ page }) => {
    await page.goto(`${BASE_URL}/garage`);

    // Перевірка, що на сторінці Garage Page є необхідний контент
    const title = await page.title();
    expect(title).toContain("Garage"); // Переконайтесь, що заголовок містить "Garage"

    // Додайте інші перевірки, як вам потрібно
    const garageElement = await page.locator(".garage-container"); // Змініть селектор на ваш
    expect(await garageElement.isVisible()).toBe(true);
  });
});
