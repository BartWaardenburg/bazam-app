import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    include: ['src/**/*.spec.ts'],
  },
  resolve: {
    alias: {
      '@bazam/shared-types': resolve(__dirname, '../../libs/shared-types/src/index.ts'),
    },
  },
});
