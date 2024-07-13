import { spawnSync } from 'child_process';
import { existsSync, rmSync } from 'node:fs';

module.exports = () => {
  console.log('');
  console.log('- setup.ts - preparing a bundle for validation testing');
  const output = './tests/.builds.petstore-output';
  if (existsSync(output)) {
    rmSync(output, { force: true, recursive: true });
  }
  const testValidator = spawnSync('npm', [
    'run',
    'cli',
    '--',
    '--openapi',
    './tests/unit/petstore/petstore.yaml',
    '--output',
    output
  ]);

  if (testValidator.error) {
    throw new Error('Failed to prebuild petstore validators');
  }
  console.log('- setup.ts - preparation complete');
};
