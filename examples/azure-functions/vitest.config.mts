import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from '../../vitest.base.mjs';

const config = defineConfig({
  test: {
    exclude: ['**\/node_modules/**'],
    include: ['tests/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    globalSetup: ['./tests/setup.ts'],
    coverage: {
      thresholds: {
        lines: 80,
        branches: 0,
        functions: 0,
      },
      include: ['**/*.?(c|m)[jt]s?(x)', '*.?(c|m)[jt]s?(x)'],
    },
  },
});

export default mergeConfig(baseConfig, config);
