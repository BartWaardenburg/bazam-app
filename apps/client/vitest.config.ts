/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import angular from '@analogjs/vite-plugin-angular';
import { resolve } from 'path';

export default defineConfig({
  plugins: [angular()],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
    setupFiles: ['src/test-setup.ts'],
  },
  resolve: {
    alias: {
      '@bazam/shared-types': resolve(__dirname, '../../libs/shared-types/src/index.ts'),
      '@bazam/ui': resolve(__dirname, '../../libs/ui/src/index.ts'),
    },
  },
});
