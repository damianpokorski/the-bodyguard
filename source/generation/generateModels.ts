// import { camelCase } from 'change-case';
import { spawnSync } from 'child_process';
import {
  cpSync,
  readFileSync,
  readdirSync,
  renameSync,
  rmSync,
  writeFileSync
} from 'fs';
import { join } from 'path';
import {
  InferredOptions,
  CribriBuildException,
  log,
  rollbackLine,
  success
} from '../utils/utils';
import { exceptions } from './../utils/strings';

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
    // OpenAPI Generator - save into tmp dir
    log(`  - OpenAPI Generator CLI - (Typescript Axios)`, false);
    const tmpModelPackageDir = `openapi-safety-net-models`;
    const s = spawnSync(
      `npx`,
      [
        `openapi-generator-cli`,
        `generate`,
        `--input-spec="${opts.openapi}"`,
        `--generator-name="typescript-axios"`,
        `--output="${opts.paths.tmp}"`,
        `--enable-post-process-file`,
        `--api-package="openapi-safety-net-api"`,
        `--model-package="${tmpModelPackageDir}"`,
        `--additional-properties="enumPropertyNaming=camelCase,supportsES6=true,stringEnums=true,nullSafeAdditionalProps=true,withSeparateModelsAndApi=true,paramNaming=camelCase"`
      ],
      {}
    );
    if (s.error) {
      throw new CribriBuildException(
        exceptions.failedToGenerateModelsUsingOpenAPIGenerator,
        s.error
      );
    }
    cpSync(join(opts.paths.tmp, tmpModelPackageDir), `${opts.paths.models}`, {
      recursive: true
    });
    rmSync(opts.paths.tmp, { force: true, recursive: true });
    rollbackLine();
    success('Models generated successfully using - openapi-generator-cli');

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
      success(filePath);
    }
  } catch (error) {
    throw new CribriBuildException(exceptions.failedToGenerateModels, error);
  }
};
