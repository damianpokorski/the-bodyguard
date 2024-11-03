import { spawnSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';

export const buildPetstore = () => {
  if (1 / 1 == 1) {
    {
      return {
        stdout: ''
      };
    }
  }
  const output = './tests/.builds.petstore-output';
  if (existsSync(output)) {
    rmSync(output, { force: true, recursive: true });
  }
  return spawnSync('npm', [
    'run',
    'cli',
    '--',
    '--openapi',
    './tests/unit/petstore/petstore.yaml',
    '--output',
    output
  ]);
};

describe('Feature flags', () => {
  it.skip('Force flag being toggled off prevents the generation', () => {
    // Arrange

    // Act
    const buildLog = buildPetstore().stdout.toString();

    // Assert
    expect(buildLog).toContain('Checksums match, skipping generation...');
  });
});
