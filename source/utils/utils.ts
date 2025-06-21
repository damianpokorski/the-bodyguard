import { spawnSync } from 'node:child_process';

export const defaultEncoding = { encoding: 'utf-8' as BufferEncoding };

export class BuildException extends Error {
  constructor(
    msg?: string,
    private innerError?: Error | unknown,
  ) {
    super(
      [msg, ((innerError ?? {}) as Error).message ?? undefined]
        .filter((isValid) => isValid)
        .join(' - '),
    );
  }
}

export const exec = async (
  cmd: string,
  ...args: string[]
): Promise<[boolean, string, string]> => {
  const result = spawnSync(cmd, args, {});
  return [
    result.status === 0 && result.error === undefined,
    result.stdout.toString(),
    result.stderr.toString(),
  ];
};
