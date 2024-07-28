// import { camelCase } from 'change-case';
import { readFileSync, readdirSync, renameSync, writeFileSync } from 'fs';
import { JSONSchema4 } from 'json-schema';
import { compile } from 'json-schema-to-typescript';
import { join, relative } from 'path';
import {
  BuildException,
  InferredOptions,
  exceptions,
  log,
  rollbackLine,
  success
} from '../utils';

const encoding = { encoding: 'utf-8' as BufferEncoding };

const camelCase = (string: string) => {
  return string
    .split('-')
    .map((part, index) => {
      if (index == 0) {
        return part;
      }
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join('');
};

export const generateModels = async (opts: InferredOptions): Promise<void> => {
  try {
    log(`  - JSON Schema to typescript conversion`, false);
    for (const file of readdirSync(opts.paths.schemas)) {
      const modelName = file.replace('.json', '');
      const path = join(opts.paths.schemas, file);
      const schema = JSON.parse(
        readFileSync(path, {
          encoding: 'utf-8'
        })
      );
      schema['title'] = modelName;
      const compiled = await compile(schema as JSONSchema4, modelName, {
        format: false
      });
      writeFileSync(join(opts.paths.models, `${modelName}.ts`), compiled);
    }

    rollbackLine();
    success('Models generated successfully using - json-schema-to-typescript');

    // Ensure consistent naming - swap any snake-case filenames & model names into camelcases
    log(`  - Ensuring camel case naming convention`, false);
    const replaces = {} as Record<string, string>;
    for (const modelFilename of readdirSync(`${opts.paths.models}`)) {
      const ext = '.ts';
      const modelName = modelFilename.replace(ext, '');
      const modelNameCamelCase = camelCase(modelName);
      replaces[modelName] = modelNameCamelCase;
      // Rename files if needed
      if (modelName != modelNameCamelCase) {
        renameSync(
          join(opts.paths.models, modelFilename),
          join(opts.paths.models, `${modelNameCamelCase}${ext}`)
        );
      }
    }

    // Update all of the imports to match renamed filenames
    rollbackLine();
    log(`  - Updating imports & Saving`, false);
    for (const modelFilename of readdirSync(`${opts.paths.models}`)) {
      const filePath = join(opts.paths.models, modelFilename);
      let fileContents = readFileSync(filePath, encoding);
      for (const [search, replace] of Object.entries(replaces)) {
        fileContents = fileContents.replace(search, replace);
      }
      writeFileSync(filePath, fileContents, encoding);
      rollbackLine();
      success(relative(process.cwd(), filePath));
    }
  } catch (error) {
    throw new BuildException(exceptions.failedToGenerateModels, error);
  }
};
