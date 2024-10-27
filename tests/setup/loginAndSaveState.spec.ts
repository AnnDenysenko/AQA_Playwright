import { test } from "@playwright/test";
import { HomePage } from "../../page-objects/pages/HomePage";
import { SignInForm } from "../../page-objects/components/forms/SignInForm";
import { GaragePage } from "../../page-objects/pages/GaragePage";
import {
  mainUserEmail,
  mainUserPassword,
  mainUserEmail2,
  mainUserPassword2,
} from "../../test-data/credentials";

test.describe("Setup", () => {
  let homePage: HomePage;
  let signInForm: SignInForm;
  let garagePage: GaragePage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    signInForm = new SignInForm(page);
    garagePage = new GaragePage(page);
  });

  test("Log in to main user and save the state", async ({ page }) => {
    await homePage.open();
    await homePage.openSignInForm();

    await signInForm.loginWithCredentials(mainUserEmail, mainUserPassword);

    await garagePage.verifyPageIsOpen();

    await page
      .context()
      .storageState({ path: "test-data/states/mainUserState.json" });
  });

  test("Log in to main user 2 and save the state", async ({ page }) => {
    await homePage.open();
    await homePage.openSignInForm();

    await signInForm.loginWithCredentials(mainUserEmail2, mainUserPassword2);

    await garagePage.verifyPageIsOpen();

    await page
      .context()
      .storageState({ path: "test-data/states/mainUserState2.json" });
  });
});
