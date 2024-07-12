import type { JestConfigWithTsJest } from 'ts-jest';
import { pathsToModuleNameMapper } from 'ts-jest';
import { readFileSync } from 'fs';
import ts from 'typescript';

const { compilerOptions } = JSON.parse(readFileSync('./tsconfig.json', { encoding: 'utf-8' })) as {
    compilerOptions: {
        baseUrl: string,
        paths: ts.MapLike<string[]>
    }
}
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