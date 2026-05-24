import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",

  globalSetup: "./e2e/globalSetup.ts",

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "https://axon-med.vercel.app",
    trace: "on-first-retry",
  },

  projects: [
    // ── Smoke (sem autenticação — comportamento existente) ──────────────────
    {
      name: "smoke",
      testMatch: "smoke.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },

    // ── Autenticado (requer E2E_EMAIL + E2E_PASSWORD) ──────────────────────
    {
      name: "authenticated",
      testMatch: "authenticated.spec.ts",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "e2e/.auth/user.json",
      },
    },
  ],
});
