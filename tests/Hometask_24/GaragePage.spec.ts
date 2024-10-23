import test from "@playwright/test";
import { HomePage } from "../../page-objects/pages/HomePage";
import { SignInForm } from "../../page-objects/components/forms/SignInForm";
import { GaragePage } from "../../page-objects/pages/GaragePage";
import generateRandomEmail from "../../utils (helpers)/randomEmailGenerator";
import { mainUserEmail, mainUserPassword, randomUserEmail } from "../../test-data/credentials";


test.describe(('Sign in '), () => {
    let homePage: HomePage;
    let signInForm: SignInForm;
    let garagePage: GaragePage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        signInForm = new SignInForm(page);
        garagePage = new GaragePage(page);

        await homePage.open();
        await signInForm.loginWithCredentials(mainUserEmail, mainUserPassword);
        await garagePage.verifyPageIsOpen();
    });

    // test('Add BMW X6'), async () => {

    // }
});
