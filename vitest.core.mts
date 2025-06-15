import { defineConfig, mergeConfig } from 'vitest/config';
import baseConfig from './vitest.base.mjs';
export default mergeConfig(baseConfig, defineConfig({}));
