import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.integration.test.ts'],
    setupFiles: ['src/test-setup.ts'],
    hookTimeout: 20000,
    testTimeout: 10000,
    coverage: {
      provider: 'v8'
    }
  }
});
