import { existsSync, readFileSync } from 'fs';
import { load } from 'js-yaml';
import { exceptions } from '../utils/strings';
import { InferredOptions, SafetyNetBuildException } from '../utils/utils';

interface OpenApiSpecComponent {
  schemas: Record<string, unknown>;
}

export interface OpenApiSpec {
  components: OpenApiSpecComponent;
}

export const parseSpec = async (opts: InferredOptions) => {
  try {
    if (!existsSync(opts.openapi)) {
      throw new Error(
        [exceptions.openApiFileDoesNotExist, opts.openapi].join(' - ')
      );
    }
    return load(readFileSync(opts.openapi, 'utf-8')) as OpenApiSpec;
  } catch (error) {
    throw new SafetyNetBuildException(exceptions.invalidOpenApiFile, error);
  }
};
