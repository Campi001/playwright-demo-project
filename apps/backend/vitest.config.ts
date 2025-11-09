import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import AllureReporter from 'allure-vitest/reporter';
import { defineConfig } from 'vitest/config';

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    reporters: [
      'default',
      new AllureReporter({
        resultsDir: resolve(workspaceRoot, 'allure-results', 'backend'),
      }),
    ],
    coverage: {
      provider: 'v8',
    },
  },
});
