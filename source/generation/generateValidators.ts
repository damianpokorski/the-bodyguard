import { Ajv } from 'ajv';
import addFormats from 'ajv-formats';
import { default as ajvStandaloneCode } from 'ajv/dist/standalone';
import * as esbuild from 'esbuild';
import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { exceptions } from '../utils/strings';
import {
  InferredOptions,
  CribriBuildException,
  error,
  log,
  rollbackLine,
  success,
  warn
} from '../utils/utils';

export const generateValidators = async (
  opts: InferredOptions
): Promise<void> => {
  try {
    for (const file of readdirSync(opts.paths.schemas)) {
      // Extract name
      const modelName = file.endsWith(`.json`)
        ? file.substring(0, file.length - 5)
        : file;

      // Load the json schema
      const schemaContents = readFileSync(`${opts.paths.schemas}/${file}`);
      const schema = JSON.parse(schemaContents.toString());

      // Create a new AJV Standalone instance
      const errors: string[] = [];
      const warnings: string[] = [];
      const ajv = new Ajv({
        code: { source: true, esm: true },
        strict: false,
        logger: {
          error: (err) => errors.push(err as string),
          warn: (warn) => warnings.push(warn as string),
          log
        },
        allErrors: true
      });
      addFormats(ajv);

      // Compile & generate validator (pre-bundled)
      const validate = ajv.compile(schema);
      let moduleCode = ajvStandaloneCode(ajv, validate);

      warnings.length > 0 &&
        warn(`Warnings: ${[...new Set(warnings)].join(', ')}`);
      errors.length > 0 && error(`Errors: ${[...new Set(errors)].join(', ')}`);

      // Add better-ajv-errors wrapper fn into the function before compiling
      moduleCode += `
const betterAjvErrors = require('@apideck/better-ajv-errors').betterAjvErrors;
export const betterValidator = (data, options = {}) => {
    const result = validate10(data, options);
    // On success - no errors
    if (result) {
        return [data, undefined];
    }
    // Otherwise generate better errors
    // const errors = betterAjvErrors(schema11, data, validate10.errors, { format: 'js' });
    const errors = betterAjvErrors({
        schema: schema11, 
        data, 
        errors: validate10.errors
    });
    // validate10.errors = [];
    return [undefined, errors];
}
export const betterValidatorShort = (data, options = {}) => {
    const [result, errors] = betterValidator(data, options);
    if(errors) {
        return [result, errors.map(e => e.message.trim())];
    }
    return [result, errors];
}
`;

      // Adjust the module code to make schemas exportable
      moduleCode = moduleCode
        .replaceAll(`const schema11 `, `export const schema11`)
        .replaceAll(`schema11`, `${modelName}Schema`)
        .replaceAll(`export const validate = validate10;`, '');

      // Export module
      writeFileSync(`${opts.paths.validators}/${modelName}.js`, moduleCode);
      success(`${modelName} - Generated... `, false);

      // Bundle external packages into the js
      await esbuild.build({
        entryPoints: [`${opts.paths.validators}/${modelName}.js`],
        bundle: true,
        outfile: `${opts.paths.validators}/${modelName}.js`,
        // outfile: `${opts.paths.validators}/${modelName}.bundled.js`,
        minify: false,
        allowOverwrite: true,
        treeShaking: true,
        target: 'es2020',
        format: 'esm'
      });

      rollbackLine();

      // Add eslint and tslint disabled flags
      writeFileSync(
        `${opts.paths.validators}/${modelName}.js`,
        [
          `/* eslint-disable */`,
          `/* Auto generated file, do not edit manually */`,
          readFileSync(`${opts.paths.validators}/${modelName}.js`, {
            encoding: 'utf-8'
          })
            .replace(
              'betterValidator,',
              `betterValidator as ${modelName}ValidatorWithErrors,`
            )
            .replace(
              'betterValidatorShort,',
              `betterValidatorShort as ${modelName}ValidatorWithErrorsShort,`
            )
            .replace('_default as default', `_default as ${modelName}Validator`)
        ].join('\n')
      );

      // Log progress
      success(`${opts.paths.validators}/${modelName}.ts`);
    }
  } catch (error) {
    throw new CribriBuildException(
      exceptions.failedToGenerateValidators,
      error
    );
  }
};
