import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: [
      'tests/scripts/**/*.{test,spec}.{ts,tsx}'
    ],
    passWithNoTests: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
    },
    css: true,
    testTimeout: 30000, // Script tests may take longer
    // Run script tests sequentially to avoid race conditions
    fileParallelism: false,
    sequence: {
      concurrent: false,
    },
  },
});

