import { test, expect, Page} from "@playwright/test";
import { Severity } from "allure-js-commons";
import TextBoxPage from "../../pages/elements/TextBoxPage";
import HomePage from "../../pages/HomePage";
import { generateRandomEmail } from "../../utils/helper";
import { setMeta } from "../../utils/allure";


test.describe("DEMOQA Text Box module", () => {
  let textBoxPage: TextBoxPage
  let homePage: HomePage;
  const email: string = generateRandomEmail();

  test.beforeEach(({ page }: {page: Page}) => {
    textBoxPage = new TextBoxPage(page);
    homePage = new HomePage(page);
  });

  test("@smoke Verify open the page and add new user", async () => {

    // Report metadata
    setMeta({
      owner: "Nurul Arifin",
      severity: Severity.CRITICAL,
      tags: ["web", "Input", "smoke"],
    });

    await homePage.navigateToElements();
    await textBoxPage.clickOnTextBoxMenu();

    await textBoxPage.enterTextBox(
      "Nurul Arifin",
      email,
      "Jl. Persada I No 27",
      "Ajee Pagar Air"
    );

    await textBoxPage.clickOnSubmit();
    const isCorrect = await textBoxPage.verifyDisplayName("Nurul Arifin");
    expect(isCorrect).toBeTruthy;
  });
});
