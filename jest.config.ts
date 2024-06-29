import type { JestConfigWithTsJest } from 'ts-jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const config: JestConfigWithTsJest = {
    verbose: true,
    testMatch: [
        `**/tests/**/*.test.ts`
    ],
    preset: 'ts-jest',
    roots: ['<rootDir>'],
    modulePaths: [compilerOptions.baseUrl],
    moduleNameMapper: {
        ...pathsToModuleNameMapper(compilerOptions.paths),
        ...{
            "^(\\./.*)\\.js$": "$1",
        }
    },
    transformIgnorePatterns: []
};

export default config;