import { existsSync, rmSync } from 'node:fs';
import { BuildException } from '@utils/utils';

export const exceptionBuilder = (messages: string[]) =>
  new BuildException(messages.join(' - '));

export const cleanUpDir = (path: string) =>
  existsSync(path) && rmSync(path, { recursive: true });
