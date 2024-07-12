import { CribriBuildException } from '@utils/utils';
import { existsSync, rmSync } from 'fs';

export const exceptionBuilder = (messages: string[]) =>
  new CribriBuildException(messages.join(' - '));

export const cleanUpDir = (path: string) =>
  existsSync(path) && rmSync(path, { recursive: true });
