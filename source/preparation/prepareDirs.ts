import { existsSync, mkdirSync, rmSync } from 'fs';
import { InferredOptions } from '../utils';

export const prepareDirs = async (opts: InferredOptions) => {
  // Remove dir if it exists
  if (existsSync(opts.paths.main)) {
    rmSync(opts.paths.main, { recursive: true, force: true });
  }

  // Create new dir structure
  mkdirSync(opts.paths.main, { recursive: true });
  mkdirSync(opts.paths.models, { recursive: true });
  mkdirSync(opts.paths.schemas, { recursive: true });
  mkdirSync(opts.paths.validators, { recursive: true });
  mkdirSync(opts.paths.dist, { recursive: true });
};
