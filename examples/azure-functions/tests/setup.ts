import { spawnSync } from 'child_process';

module.exports = () => {
  console.log('');
  console.log(
    '- examples/azure-functions/tests/setup.ts - preparing a bundle for validation testing'
  );
  const testValidator = spawnSync('npm', ['run', 'build:validation'], {
    cwd: __dirname
  });
  if (testValidator.error) {
    throw new Error('Failed to prebuild petstore validators');
  }
  console.log(
    '- examples/azure-functions/tests/setup.ts - preparation complete'
  );
};
