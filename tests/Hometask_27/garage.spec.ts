import test, { chromium } from "@playwright/test";
import { HomePage } from "../../page-objects/pages/HomePage";
import { SignInForm } from "../../page-objects/components/forms/SignInForm";
import { GaragePage } from "../../page-objects/pages/GaragePage";
import generateRandomEmail from "../../utils (helpers)/randomEmailGenerator";
import {
  mainUserEmail,
  mainUserPassword,
  randomUserEmail,
} from "../../test-data/credentials";

test.describe("Garage Page with Storage State fixture: 1", () => {
  test.use({ storageState: "test-data/states/mainUserState.json" });
  let homePage: HomePage;
  let signInForm: SignInForm;
  let garagePage: GaragePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    signInForm = new SignInForm(page);
    garagePage = new GaragePage(page);
    // await homePage.open();
    // await homePage.openSignInForm();
    // await signInForm.loginWithCredentials(mainUserEmail, mainUserPassword);
    // await garagePage.verifyPageIsOpen();
    await garagePage.open();
  });

  test("Add BMW X5", async () => {
    await garagePage.addNewCar("BMW", "X5", "100");
    await garagePage.verifyLastAddedCarName("BMW X5");
  });

  test("Add Audi TT", async ({ page }) => {
    await garagePage.addNewCar("Audi", "TT", "100");
    await garagePage.verifyLastAddedCarName("Audi TT");
  });

  test("Add Fiat Ducato", async () => {
    await garagePage.addNewCar("Fiat", "Ducato", "100");
    await garagePage.verifyLastAddedCarName("Fiat Ducato");
  });

  test("Add Ford Fiesta", async () => {
    await garagePage.addNewCar("Ford", "Fiesta", "100");
    await garagePage.verifyLastAddedCarName("Ford Fiesta");
  });
});

// ----------------------------------------------------------------------------------------------------------------------------

test.describe("Garage Page with Storage State fixture: 2", () => {
  test.use({ storageState: "test-data/states/mainUserState2.json" });
  let homePage: HomePage;
  let signInForm: SignInForm;
  let garagePage: GaragePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    signInForm = new SignInForm(page);
    garagePage = new GaragePage(page);
    await garagePage.open();
  });

  test("Add BMW X5", async () => {
    await garagePage.addNewCar("BMW", "X5", "100");
    await garagePage.verifyLastAddedCarName("BMW X5");
  });

  test("Add Audi TT", async ({ page }) => {
    await garagePage.addNewCar("Audi", "TT", "100");
    await garagePage.verifyLastAddedCarName("Audi TT");
  });

  test("Add Fiat Ducato", async () => {
    await garagePage.addNewCar("Fiat", "Ducato", "100");
    await garagePage.verifyLastAddedCarName("Fiat Ducato");
  });

  test("Add Ford Fiesta", async () => {
    await garagePage.addNewCar("Ford", "Fiesta", "100");
    await garagePage.verifyLastAddedCarName("Ford Fiesta");
  });
});
