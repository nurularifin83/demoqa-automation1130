export interface AppConfig {
  BASE_URL: string;
  TIMEOUT: number;
  TESDIR: string;
  RETRIES: number;
  WORKERS: number;
  ARGS: string;
  HEADLESS: boolean;
  VIEWPORT: { width: number; height: number } | null;
}

export const CONFIG: AppConfig = {
  BASE_URL: process.env.BASE_URL || "https://demoqa.com",
  TIMEOUT: 120000,
  TESDIR: "./tests",
  RETRIES: process.env.CI ? 2 : 0,
  WORKERS: 1,
  ARGS: "--start-maximized",

  // 💻 Browser settings
  HEADLESS: process.env.HEADLESS === "true",
  VIEWPORT: null,
};
