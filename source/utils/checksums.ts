import { existsSync, readFileSync, writeFileSync } from 'fs';
import * as md5 from 'md5-file';
import { join } from 'path';
import { log } from './logging';
import { InferredOptions } from './utils';

export const fileChecksum = (path: string) => {
  if (existsSync(path)) {
    return md5.sync(path);
  }
  return null;
};

export const generateChecksumsFile = (opts: InferredOptions) => {
  writeFileSync(
    opts.checksums,
    JSON.stringify(
      [
        opts.openapi,
        join(opts.paths.dist, `index.js`),
        join(opts.paths.dist, `index.d.ts`)
      ]
        .map((path) => ({ [path]: fileChecksum(path) }))
        .reduce((pathEntry, paths) => ({ ...pathEntry, ...paths }))
    )
  );
};

export const validateChecksums = (opts: InferredOptions) => {
  log(`Looking for past checksums..`);
  if (opts.force || !existsSync(opts.checksums)) {
    return false;
  }
  const checksums = JSON.parse(
    readFileSync(opts.checksums, { encoding: 'utf-8' })
  ) as Record<string, string | null>;

  for (const [file, pastChecksum] of Object.entries(checksums)) {
    const newChecksum = fileChecksum(file);
    if (newChecksum !== pastChecksum) {
      return false;
    }
  }

  log(
    `Checksums match, skipping generation... use --force if you want to regenerate anyways`
  );
  return true;
};
