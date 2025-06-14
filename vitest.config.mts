import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    exclude: ['**\/node_modules/**'],
    include: ['tests/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    globals: true,
    projects: [
      './vitest.core.mts',
      './examples/azure-functions/vitest.config.mts',
      './examples/express/vitest.config.mts',
    ],
    setupFiles: ['tests/setup.ts'],
    hookTimeout: 30000,
    silent: false,
    reporters: ['verbose'],
  },
  plugins: [tsconfigPaths()],
});
