/// <reference types="vitest" />

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      tests: path.resolve(__dirname, './tests'),
    },
  },
  test: {
    environment: 'happy-dom',
    setupFiles: ['tests/vitest.setup.ts'],
    coverage: {
      provider: 'istanbul',
      include: ['src/**/*.{tsx,ts,js}'],
      exclude: ['src/assets/**', 'src/main.tsx', 'src/**/__test__'],
    },
    css: false,
  },
});
