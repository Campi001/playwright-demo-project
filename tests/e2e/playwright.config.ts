import { defineConfig } from '@playwright/test';

const isCI = !!process.env.CI;
const e2eJwtSecret =
  process.env.E2E_JWT_SECRET ?? 'playwright-e2e-test-secret-1234567890';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: isCI ? 2 : 0,
  timeout: 30 * 1000,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on',
    screenshot: 'on',
    video: 'on',
  },
  webServer: [
    {
      command: 'pnpm --filter @playwright-demo/backend dev:e2e',
      port: 3000,
      env: {
        PORT: '3000',
        JWT_SECRET: e2eJwtSecret,
      },
      reuseExistingServer: !isCI,
      timeout: 120 * 1000,
    },
    {
      command: 'pnpm --filter @playwright-demo/frontend dev',
      port: 5173,
      env: {
        VITE_API_BASE: 'http://localhost:3000/api',
      },
      reuseExistingServer: !isCI,
      timeout: 120 * 1000,
    },
  ],
});
