import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from './vitest.base.mjs';
export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      globalSetup: ['./tests/setup.ts'],
      projects: [
        './vitest.core.mts',
        './examples/azure-functions/vitest.config.mts',
        './examples/express/vitest.config.mts',
      ],
      reporters: process.env.GITHUB_ACTIONS
        ? ['dot', 'github-actions']
        : ['dot'],
    },
  }),
);
