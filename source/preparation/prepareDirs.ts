import { existsSync, mkdirSync, rmSync } from 'fs';
import { InferredOptions } from '../utils/utils.js';


export const prepareDirs = async (opts: InferredOptions) => {
    // Remove dir if it exists
    if (existsSync(opts.paths.main)) {
        rmSync(opts.paths.main, { recursive: true, force: true });
    }

    // Create new dir structure
    mkdirSync(opts.paths.main);
    mkdirSync(opts.paths.models);
    mkdirSync(opts.paths.schemas);
    mkdirSync(opts.paths.validators);
    mkdirSync(opts.paths.dist);
};