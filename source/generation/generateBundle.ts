import * as esbuild from 'esbuild';
import { cpSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import { spawnSync } from 'node:child_process';
import { join } from 'path';
import {
  BuildException,
  InferredOptions,
  defaultEncoding,
  exceptions,
  log,
  rollbackLine,
  success
} from '../utils';

const titleCase = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const generateBundle = async (opts: InferredOptions): Promise<void> => {
  try {
    // Initialize barrel file generation
    const barrel = [
      `
        interface Validator<T> {
            <T>(data: unknown): boolean
        };`,

      `interface ValidatorWithErrors<T> {
    (data: unknown): [T | undefined, string[] | undefined]
};

interface ValidatorWithDetailedErrors<T> {
    (data: unknown): [T | undefined, {
        suggestion?: string;
        start: { line: number; column: number; offset: number };
        // Optional fields
        end?: { line: number; column: number; offset: number };
        error: string;
    }[] | undefined]
};

interface ModuleDefinition<T> {
    schema: any,
    validator: Validator<T>,
    validatorWithErrors: ValidatorWithErrors<T>,
    validatorWithDetailedErrors: ValidatorWithDetailedErrors<T>,
};
;`
    ];
    success('Prepared the typescript interfaces');
    const models = readdirSync(opts.paths.validators);
    for (const validator of models) {
      // Get names
      const modelName = validator.endsWith('.js')
        ? validator.substring(0, validator.length - 3)
        : validator;
      // const modelNameTitleCase = changeCase.capitalCase(modelName).split(" ").join("");
      const modelNameTitleCase = titleCase(modelName).split(' ').join('');

      // Import
      barrel.push(
        ...[
          `/* ${modelNameTitleCase} START */`,
          ``,
          `/* ${modelNameTitleCase} - OpenApi Models */`,
          ...readFileSync(
            join(opts.paths.models, `${modelName}.ts`),
            defaultEncoding
          )
            .split('\n')
            .filter((line) => !line.includes('import type {')),
          ``,
          `/* ${modelNameTitleCase} - AJV Validators */`,
          `import * as ${modelName}Module  from './validators/${validator}';`,
          `export const ${modelNameTitleCase}Validator = ${modelName}Module.${modelName}Validator;`,
          `export const ${modelNameTitleCase}ValidatorWithErrors = ${modelName}Module.${modelName}ValidatorWithErrorsShort as unknown as ValidatorWithErrors<${modelNameTitleCase}>;`,
          `export const ${modelNameTitleCase}ValidatorWithErrorsWithHints = ${modelName}Module.${modelName}ValidatorWithErrors as unknown as ValidatorWithDetailedErrors<${modelNameTitleCase}>;`,
          ``,
          `/* ${modelNameTitleCase} - JSON Schemas */`,
          `export const ${modelNameTitleCase}Schema = ${modelName}Module.${modelName}Schema;`,
          `/* ${modelNameTitleCase} END */`
        ]
      );
      success(`Mapped types for ${modelName}`);
    }
    const barrelContents = barrel.join('\n');
    writeFileSync(opts.paths.barrel, barrelContents, { encoding: 'utf-8' });

    log(
      `Generating typescript declarion files before final bundling...`,
      false
    );
    const s = spawnSync(
      `npx`,
      [
        `-p`,
        `typescript`,
        `--input-spec="${opts.openapi}"`,
        `tsc`,
        opts.paths.barrel,
        `--declaration`,
        `--allowJs`,
        `--removeComments`,
        `--emitDeclarationOnly`
      ],
      {}
    );
    if (s.error || s.status !== 0) {
      throw new BuildException(
        `${exceptions.failedToGenerateBundleDeclarations}`,
        s.error
      );
    }
    rollbackLine();
    success('Validated & generated declaration files using tsc');

    // Minify
    log(`Bundling & minifying... (esbuild / commonjs)`, false);

    const result = esbuild.buildSync({
      bundle: true,
      outfile: join(opts.paths.dist, `index.js`),
      minify: true,
      keepNames: true,
      treeShaking: true,
      target: 'es2020',
      format: 'cjs',
      entryPoints: [opts.paths.barrel],
      sourcemap: opts.sourcemaps
    });

    if (result.errors && result.errors.length > 0) {
      throw new BuildException(
        exceptions.failedToGenerateBundleEsbuild,
        result.errors
      );
    }

    cpSync(opts.paths.barrelDeclarations, join(opts.paths.dist, `index.d.ts`));
    rollbackLine();
    success('Bundled and minified (esbuild)');
  } catch (e) {
    throw new BuildException(`${exceptions.failedToGenerateBundle} -2`, e);
  }
};
