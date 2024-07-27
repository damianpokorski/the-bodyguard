import { spawnSync } from 'child_process';

module.exports = () => {
  console.log('');
  console.log('- setup.ts - preparing a bundle for validation testing');
  const testValidator = spawnSync('npm', ['run', 'build:validation']);
  if (testValidator.error) {
    throw new Error('Failed to prebuild petstore validators');
  }
  console.log('- setup.ts - preparation complete');
};
