import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    exclude: ['**\/node_modules/**'],
    include: ['tests/**/*.{test,spec}.?(ts)'],
    globals: true,
    globalSetup: [],
    hookTimeout: 30000,
    silent: Object.keys(process.env).includes('GITHUB_ACTIONS'),
    coverage: {
      thresholds: {
        lines: 80,
        branches: 0,
        functions: 0,
      },
      include: ['source/**/*.?(ts)', 'examples/**/*.?(ts)'],
      exclude: ['examples/**/tests/*', 'examples/**/\\.api/*'],
      reporter: process.env.GITHUB_ACTIONS ? ['text', 'cobertura'] : ['text'],
      provider: 'v8',
    },
  },
  plugins: [tsconfigPaths()],
});
