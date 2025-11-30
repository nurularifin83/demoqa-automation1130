import { Page } from "@playwright/test";
import fs from "fs";
import path from "path";

export default class BasePage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // ------------------------------
    // 🪵 Logger system
    // ------------------------------
    log(
        message: string,
        type: "info" | "warn" | "error" | "success" = "info",
    ): void {
        const timestamp = new Date().toISOString();
        const prefix = type === "warn"
            ? "⚠️"
            : type === "error"
            ? "❌"
            : type === "success"
            ? "✅"
            : "ℹ️";

        const finalMessage = `${prefix} [${timestamp}] ${message}`;
        console.log(finalMessage);
    }

    // ------------------------------
    // 📸 Screenshot helper
    // ------------------------------
    async captureErrorScreenshot(name: string = "error"): Promise<void> {
        try {
            const dir = path.resolve("screenshots");

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }

            const filePath = path.join(
                dir,
                `${name}_${Date.now().toString()}.png`,
            );

            await this.page.screenshot({ path: filePath, fullPage: true });

            this.log(`Screenshot saved at: ${filePath}`, "warn");
        } catch (err: any) {
            console.log("⚠️ Failed to take screenshot:", err.message);
        }
    }

    // ------------------------------
    // 🧩 Wait for element helper
    // ------------------------------
    async waitForElement(
        selector: string,
        state: "attached" | "detached" | "visible" | "hidden",
        timeout: number = 10000,
    ): Promise<boolean> {
        try {
            await this.page.waitForSelector(selector, { state, timeout });
            return true;
        } catch {
            this.log(`Element not found: ${selector} (${state})`, "warn");
            await this.captureErrorScreenshot("waitForElement_failed");
            return false;
        }
    }

    async safeGoto(
        url: string,
        waitUntil: "domcontentloaded" | "load" | "networkidle" =
            "domcontentloaded",
    ): Promise<void> {
        try {
            if (this.page.isClosed()) {
                console.warn(
                    "⚠️ Page was closed, reopening a new one via browser context...",
                );
                // Attempt to reopen using the same browser context
                const context = this.page.context();
                this.page = await context.newPage();
            }

            await this.page.goto(url, {
                waitUntil,
                timeout: 60000,
            });
        } catch (error: any) {
            console.error(`❌ Failed to navigate to ${url}: ${error.message}`);
            throw error;
        }
    }

    // ------------------------------
    // 🖱️ Safe Click (improved for CI/CD)
    // ------------------------------
    async safeClick(selector: string): Promise<void> {
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                if (this.page.isClosed()) {
                    console.warn("⚠️ Page closed before click, reopening...");
                    const context = this.page.context();
                    this.page = await context.newPage();
                    await this.page.goto("/", {
                        waitUntil: "domcontentloaded",
                    });
                }

                // Wait for page to be ready and ads removed
                await this.page.waitForLoadState("domcontentloaded");
                await this.page.waitForTimeout(800); // small buffer for animations

                // 🧹 Remove ad overlays (DemoQA issue)
                await this.page.evaluate(() => {
                    const ads = ["#fixedban", "iframe", ".advertisement"];
                    ads.forEach((sel) => {
                        const el = document.querySelector(sel) as
                            | HTMLElement
                            | null;
                        if (el) el.style.display = "none";
                    });
                });

                // Wait until element is visible and clickable
                await this.page.waitForSelector(selector, {
                    state: "visible",
                    timeout: 20000, // ⏳ increased for CI stability
                });

                await this.page
                    .waitForSelector(".modal.show", {
                        state: "hidden",
                        timeout: 2000,
                    })
                    .catch(() => {});

                await this.page.click(selector);
                this.log(`✅ Clicked: ${selector}`);
                return; // ✅ success
            } catch (error: any) {
                const msg = error.message || "";
                if (
                    msg.includes("Target page") ||
                    msg.includes("has been closed") ||
                    msg.includes("intercepts pointer events") ||
                    msg.includes("Timeout")
                ) {
                    console.warn(
                        `⚠️ Retry click attempt ${attempt} due to: ${msg}`,
                    );
                    await this.page.waitForTimeout(1000);
                } else {
                    throw error;
                }
            }
        }

        throw new Error(`❌ Failed to click on ${selector} after 3 retries.`);
    }

    async safeFill(selector: string, text: string): Promise<void> {
        if (this.page.isClosed()) {
            console.warn("⚠️ Page closed before fill, reopening...");
            const context = this.page.context();
            this.page = await context.newPage();
        }

        await this.page.waitForSelector(selector, {
            state: "visible",
            timeout: 15000,
        });
        await this.page.fill(selector, text);
    }
}
