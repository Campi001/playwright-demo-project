/* eslint-disable import/no-extraneous-dependencies */
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import AllureReporter from 'allure-vitest/reporter';
import { defineConfig } from 'vitest/config';

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.integration.test.ts'],
    setupFiles: ['src/test-setup.ts'],
    hookTimeout: 20000,
    testTimeout: 10000,
    reporters: [
      'default',
      new AllureReporter({
        resultsDir: resolve(workspaceRoot, 'allure-results', 'backend-integration'),
      }),
    ],
    coverage: {
      provider: 'v8',
    },
  },
});
