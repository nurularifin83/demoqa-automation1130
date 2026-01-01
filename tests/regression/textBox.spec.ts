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

  test("@regression Verify open the page and add new user", async () => {

    // Report metadata
    setMeta({
      owner: "Nurul Arifin",
      severity: Severity.CRITICAL,
      tags: ["web", "add data", "regression"],
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

  test("@regression Verify open the page and leave mandatory field empty!", async () => {

    // Report metadata
    setMeta({
      owner: "Nurul Arifin",
      severity: Severity.CRITICAL,
      tags: ["web", "invalid", "regression"],
    });

    await homePage.navigateToElements();
    await textBoxPage.clickOnTextBoxMenu();

    await textBoxPage.enterTextBox("", "", "", "")
    ;
    await textBoxPage.clickOnSubmit();
    expect(await textBoxPage.isDisplayNameAbsent()).toBe(true);

  });

  test("@regression Verify open the page and input invalid email format!", async () => {

    // Report metadata
    setMeta({
      owner: "Nurul Arifin",
      severity: Severity.CRITICAL,
      tags: ["web", "invalid email", "regression"],
    });

    await homePage.navigateToElements();
    await textBoxPage.clickOnTextBoxMenu();

    await textBoxPage.enterTextBox("", "dkjashdakj@gmail", "", "");
    await textBoxPage.clickOnSubmit();
    
    expect(await textBoxPage.verifyErrorOnEmail()).toBe(true);

  });
});
