import { Resolver } from '@stoplight/json-ref-resolver';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { OpenApiSpec } from '../preparation/parseSpec';
import {
  InferredOptions,
  SafetyNetBuildException,
  success
} from '../utils/utils';

export const extractSchemas = async (
  schema: OpenApiSpec,
  opts: InferredOptions
): Promise<void> => {
  try {
    // Iterate through resolved schemas & save into dir
    const schemas = Object.entries(
      (await new Resolver().resolve(schema)).result.components.schemas
    );
    for (const pair of schemas) {
      const [key, schema] = pair;
      const camelCaseModelNameForFile =
        key.charAt(0).toLowerCase() + key.slice(1);
      const resultSchemaPath = join(
        opts.paths.schemas,
        `${camelCaseModelNameForFile}.json`
      );
      writeFileSync(resultSchemaPath, JSON.stringify(schema, undefined, 2), {
        encoding: 'utf-8'
      });
      success(resultSchemaPath);
    }
  } catch (error) {
    throw new SafetyNetBuildException('Failed to extract schemas', error);
  }
};
