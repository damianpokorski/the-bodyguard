// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPluginRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  prettierPluginRecommended,
  {
    ignores: ["*.js", "*.json", "*.d.ts", "bin/", "node_modules/", "coverage/"]
  }
);
