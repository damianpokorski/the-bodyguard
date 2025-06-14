import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    exclude: ['**\/node_modules/**'],
    include: ['tests/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    globals: true,
    globalSetup: ['./tests/setup.ts'],
    hookTimeout: 30000,
    silent: false,
  },
  plugins: [tsconfigPaths()],
});
