import { chromium } from "@playwright/test";
import { HomePage } from "../../page-objects/pages/HomePage";
import { SignInForm } from "../../page-objects/components/forms/SignInForm";
import { GaragePage } from "../../page-objects/pages/GaragePage";
import generateRandomEmail from "../../utils (helpers)/randomEmailGenerator";
import {
  mainUserEmail,
  mainUserPassword,
  randomUserEmail,
} from "../../test-data/credentials";
import { test } from "../../test-data/fixtures/userGaragePage";

test.describe("Garage Page with Storage State fixture: User 1", () => {
  test("Verify GaragePage for main user 1", async ({ userGaragePage }) => {
    await userGaragePage.verifyPageIsOpen();
  });

  test("Add Fiat Ducato", async ({ userGaragePage }) => {
    await userGaragePage.addNewCar("Fiat", "Ducato", "100");
    await userGaragePage.verifyLastAddedCarName("Fiat Ducato");
  });

  test("Add Ford Fiesta", async ({ userGaragePage }) => {
    await userGaragePage.addNewCar("Ford", "Fiesta", "100");
    await userGaragePage.verifyLastAddedCarName("Ford Fiesta");
  });
});
