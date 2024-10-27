import test, { chromium, expect } from "@playwright/test";
import { HomePage } from "../../page-objects/pages/HomePage";
import { SignInForm } from "../../page-objects/components/forms/SignInForm";
import { GaragePage } from "../../page-objects/pages/GaragePage";
import generateRandomEmail from "../../utils (helpers)/randomEmailGenerator";
import {
  mainUserEmail,
  mainUserPassword,
  randomUserEmail,
} from "../../test-data/credentials";

test.describe("Session storage", () => {
  let homePage: HomePage;
  let signInForm: SignInForm;
  let garagePage: GaragePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    signInForm = new SignInForm(page);
    garagePage = new GaragePage(page);
  });

  test("console.log", async ({ page }) => {
    page.evaluate(() => {
      console.log("Hello from browser");
    });
    console.log("Hello from JS");
  });

  test("get session storage without cars", async ({ page }) => {
    await homePage.open();
    await page.getByText("Guest log in").click();
    const parsedData = await page.evaluate(
      () => window.sessionStorage.getItem("guestData") || ""
    );
    const obj = JSON.parse(parsedData);
    expect(obj.cars).toHaveLength(0);
  });

  test("get session storage with cars", async ({ page }) => {
    await homePage.open();
    await page.getByText("Guest log in").click();
    await garagePage.addNewCar("BMW", "X5", "100");
    await garagePage.verifyLastAddedCarName("BMW X5");
    const parsedData = await page.evaluate(
      () => window.sessionStorage.getItem("guestData") || ""
    );
    const obj = JSON.parse(parsedData);
    expect(obj.cars).toHaveLength(1);
  });

  test("set session storage", async ({ page }) => {
    await homePage.open();
    await page.getByText("Guest log in").click();
    const objWithCars = {
      expenses: [],
      cars: [
        {
          id: 1,
          brand: "Audi",
          model: "TT",
          logo: "audi.png",
          initialMileage: 4353,
          updatedMileageAt: "2024-10-14T17:07:08.329Z",
          carCreatedAt: "2024-10-14T17:07:08.329Z",
          carBrandId: 1,
          carModelId: 1,
          mileage: 4353,
        },
      ],
      nextCarId: 2,
      nextExpenseId: 1,
    };
    await page.evaluate(
      (data) =>
        window.sessionStorage.setItem("guestData", JSON.stringify(data)),
      objWithCars
    );
    await homePage.open();
  });
});
