import { chromium } from "@playwright/test";
import { HomePage } from "../../page-objects/pages/HomePage";
import { SignInForm } from "../../page-objects/components/forms/SignInForm";
import {
  mainUserEmail,
  mainUserPassword,
  randomUserEmail,
} from "../../test-data/credentials";
import { GaragePage } from "../../page-objects/pages/GaragePage";
import { test } from "../../test-data/fixtures/fixtureBase";

test.describe("GaragePage with POM", () => {
  test.use({ storageState: "test-data/states/mainUserState.json" });
  let homePage: HomePage;
  let signInForm: SignInForm;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    signInForm = new SignInForm(page);
  });

  test("Add BMW X5", async ({ garagePageWithRemoving, pageSmall, page }) => {
    page.on("request", (request) =>
      console.log(">>", request.method(), request.url())
    );
    page.on("response", (response) =>
      console.log("<<", response.status(), response.url())
    );
    await garagePageWithRemoving.addNewCar("BMW", "X5", "100");
    await garagePageWithRemoving.verifyLastAddedCarName("BMW X5");
  });

  test("Add Audi TT", async ({ garagePageWithRemoving }) => {
    await garagePageWithRemoving.addNewCar("Audi", "TT", "100");
    await garagePageWithRemoving.verifyLastAddedCarName("Audi TT");
  });

  test("Add Fiat Ducato", async ({ garagePageWithRemoving }) => {
    await garagePageWithRemoving.addNewCar("Fiat", "Ducato", "100");
    await garagePageWithRemoving.verifyLastAddedCarName("Fiat Ducato");
  });

  test("Add Ford Fiesta", async ({ garagePageWithRemoving }) => {
    await garagePageWithRemoving.addNewCar("Ford", "Fiesta", "100");
    await garagePageWithRemoving.verifyLastAddedCarName("Ford Fiesta");
  });
});
