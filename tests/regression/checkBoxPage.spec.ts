import {test, expect, Page} from "@playwright/test";
import { Severity } from "allure-js-commons";
import CheckBoxPage from "../../pages/elements/CheckBoxPage";
import HomePage from "../../pages/HomePage";
import { setMeta } from "../../utils/allure";

test.describe("DEMOQA Check Box module", () => {
    let checkBoxPage: CheckBoxPage
    let homePage: HomePage;

    test.beforeEach(({ page }: {page: Page}) => {
        checkBoxPage = new CheckBoxPage(page);
        homePage = new HomePage(page);

        setMeta({
            owner: "Nurul Arifin",
            severity: Severity.CRITICAL,
            tags: ["web", "Checkbox", "smoke"],
        });
    });

    test("@regression Verify open the page and select checkbox", async () => {
        await homePage.navigateToElements();
        await checkBoxPage.clickOnCheckBoxMenu();
        await checkBoxPage.expandAll();
        await checkBoxPage.selectHomeCheckBox();
        const isSuccess = await checkBoxPage.verifySuccessMessage("home");
        expect(isSuccess).toBeTruthy;
    });

    test("@regression Verify collapse and uncheck checkbox", async () => {
        await homePage.navigateToElements();
        await checkBoxPage.clickOnCheckBoxMenu();
        await checkBoxPage.expandAll();
        await checkBoxPage.selectHomeCheckBox();

        await checkBoxPage.selectHomeCheckBox();
    })
});