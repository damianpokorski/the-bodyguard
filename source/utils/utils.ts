import { getInstalledPath } from 'get-installed-path';
import { spawnSync } from 'node:child_process';
import { join } from 'path';

// Base options
export interface Options {
  openapi: string;
  output: string;
  // flags
  force?: boolean;
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

export const defaultEncoding = { encoding: 'utf-8' as BufferEncoding };

export class BuildException extends Error {
  constructor(
    msg?: string,
    private innerError?: Error | unknown
  ) {
    super(
      [msg, ((innerError ?? {}) as unknown as Error)['message'] ?? undefined]
        .filter((isValid) => isValid)
        .join(' - ')
    );
  }
}

export const exec = async (
  cmd: string,
  ...args: string[]
): Promise<[boolean, string, string]> => {
  const result = spawnSync(cmd, args, {});
  return [
    result.status == 0 && result.error == undefined,
    result.stdout.toString(),
    result.stderr.toString()
  ];
};

export const npxPackageAvailable = async (packageName: string) => {
  try {
    await getInstalledPath(packageName);
    return true;
  } catch (packageNotAvailableGlobally) {
    try {
      await getInstalledPath(packageName, { local: true });
      return true;
    } catch (packageNotAvailableLocally) {
      return false;
    }
  }
};