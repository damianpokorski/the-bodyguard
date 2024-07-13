import { extractSchemas } from './extraction/extractSchemas';
import { generateBundle } from './generation/generateBundle';
import { generateModels } from './generation/generateModels';
import { generateValidators } from './generation/generateValidators';
import { parseSpec } from './preparation/parseSpec';
import { prepareDirs } from './preparation/prepareDirs';
import { validateRequiredPackages } from './preparation/validateRequiredPackages';
import { Options, log, parseOptions, success } from './utils';

export const main = async (config: Options) => {
  const opts = parseOptions(config);

  //
  log(`Checking whether the required NPM packages are installed...`);
  await validateRequiredPackages();

  // Import
  log(`\nStarting...`);
  await prepareDirs(opts);
  const spec = await parseSpec(opts);
  success(`OpenAPI Specification validated`);

  // Export JSONchemas
  log(`\nExtracting JSON Schemas...`);
  await extractSchemas(spec, opts);

  // Generate & exports typescript models
  log(`\nGenerating Typescript models...`);
  await generateModels(opts);

  // Generate & exports typescript models
  log(`\nGenerating AJV Standalone validators (with better-ajv-errors)...`);
  await generateValidators(opts);

  // Generate bundle
  log(`\nCompiling the final bundle...`);
  await generateBundle(opts);
};
