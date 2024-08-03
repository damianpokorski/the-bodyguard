import { join } from 'path/posix';

// Base options
export interface Options {
  openapi: string;
  output: string;
  // flags
  force?: boolean;
  sourcemaps?: boolean;
}

// Generated options
export interface InferredOptions extends Options {
  paths: {
    main: string;
    barrel: string;
    barrelDeclarations: string;
    models: string;
    schemas: string;
    tmp: string;
    validators: string;
    dist: string;
  };
  checksums: string;
}
export const parseOptions = (input: Options): InferredOptions => ({
  ...input,
  paths: {
    main: input.output,
    barrel: join(process.cwd(), input.output, 'index.ts'),
    barrelDeclarations: join(process.cwd(), input.output, 'index.d.ts'),
    models: join(process.cwd(), input.output, 'models'),
    schemas: join(process.cwd(), input.output, 'schemas'),
    validators: join(process.cwd(), input.output, 'validators'),
    dist: join(process.cwd(), input.output, 'dist'),
    tmp: join(process.cwd(), input.output, 'tmp')
  },
  checksums: join(process.cwd(), input.output, 'dist', 'checksums.json')
});
