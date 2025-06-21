import { writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { Resolver } from '@stoplight/json-ref-resolver';
import type { OpenApiSpec } from '../preparation/parseSpec';
import { BuildException, type InferredOptions, success } from '../utils';

export const extractSchemas = async (
  schema: OpenApiSpec,
  opts: InferredOptions,
): Promise<void> => {
  try {
    // Iterate through resolved schemas & save into dir
    const schemas = Object.entries(
      (await new Resolver().resolve(schema)).result.components.schemas,
    );
    for (const pair of schemas) {
      const [key, schema] = pair;
      const camelCaseModelNameForFile =
        key.charAt(0).toLowerCase() + key.slice(1);
      const resultSchemaPath = join(
        opts.paths.schemas,
        `${camelCaseModelNameForFile}.json`,
      );
      writeFileSync(resultSchemaPath, JSON.stringify(schema, undefined, 2), {
        encoding: 'utf-8',
      });
      success(relative(process.cwd(), resultSchemaPath));
    }
  } catch (error) {
    throw new BuildException('Failed to extract schemas', error);
  }
};
