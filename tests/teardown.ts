import { existsSync, rmSync } from 'fs';

export const teardown = () => {
  console.log('');
  const output = './tests/.builds.petstore-output';
  if (existsSync(output)) {
    rmSync(output, { force: true, recursive: true });
  }
  console.log(' - teardown.ts - teardown complete');
};

module.exports = teardown;
