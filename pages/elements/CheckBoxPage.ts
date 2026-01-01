import { Page } from "@playwright/test";
import BasePage from "../BasePage";

export default class CheckBoxPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async clickOnCheckBoxMenu() {
    const selector = "//li[@id='item-1']//span[text()='Check Box']";
    await this.waitForElement(selector, "visible");
    await this.page.click(selector);
  }

  async expandAll() {
    const selector = "//button[@class='rct-collapse rct-collapse-btn']";
    await this.waitForElement(selector, "visible");
    await this.page.click(selector);
  }

  async selectHomeCheckBox() {
    const selector = "(//span[@class='rct-checkbox'])[1]";
    await this.waitForElement(selector, "visible");
    await this.page.click(selector);
  }

  async verifySuccessMessage(expectedText: string): Promise<boolean> {
    try {
      const selector = "//div[@id='result']";
      await this.waitForElement(selector, "visible");
        const text = await this.page.textContent(selector);
        if (!text) return false;
        return text.includes(expectedText);
    } catch {
      return false;
    }
    }

}