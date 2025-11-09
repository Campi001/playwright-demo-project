import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import AllureReporter from 'allure-vitest/reporter';
import { defineConfig } from 'vitest/config';

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
    reporters: [
      'default',
      new AllureReporter({
        resultsDir: resolve(workspaceRoot, 'allure-results', 'frontend-unit'),
      }),
    ],
  },
});
