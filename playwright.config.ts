import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:3000"
  },
  webServer: {
    command: "pnpm dev",
    url: "http://127.0.0.1:3000",
    env: {
      NEXTAUTH_SECRET: "test-secret-for-e2e",
      NEXTAUTH_URL: "http://127.0.0.1:3000",
      ADMIN_EMAIL: "admin@rclub.fr",
      ADMIN_PASSWORD: "secret1234"
    },
    reuseExistingServer: true
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
