import { main } from '@main';
import { exceptions } from '@utils/strings';
import { Options } from '@utils/utils';
import { cleanUpDir, exceptionBuilder } from '../unit.utils';

const testDirs = [
  './tests/.builds.invalid-file-path',
  './tests/.builds.sample-generation'
];

describe('Petstore generation tests', () => {
  jest.setTimeout(60000);
  jest.useFakeTimers();

  // Prearrange
  process.stdout.clearLine = process.stdout.clearLine ?? jest.fn();
  process.stdout.cursorTo = process.stdout.cursorTo ?? jest.fn();
  const mocks = {
    clearLine: jest
      .spyOn(process.stdout, 'clearLine')
      .mockImplementation(jest.fn()),
    cursorTo: jest
      .spyOn(process.stdout, 'cursorTo')
      .mockImplementation(jest.fn()),
    write: jest.spyOn(process.stdout, 'write').mockImplementation(jest.fn())
  };

  // Cleaning up temporarary dirs, before and after each run
  const cleanUp = () => {
    for (const testDir of testDirs) {
      cleanUpDir(testDir);
    }
  };
  beforeEach(() => cleanUp());
  afterEach(() => cleanUp());

  describe('Fails to generate', () => {
    it('Fails to generate with missing OpenAPI', async () => {
      // Arrange
      const opts: Options = {
        openapi: './invalid-file.yaml',
        output: testDirs[0]
      };

      // Act
      const result = main(opts);

      // Assert
      expect(result).rejects.toThrow(
        exceptionBuilder([
          exceptions.invalidOpenApiFile,
          exceptions.openApiFileDoesNotExist,
          opts.openapi
        ])
      );
    });
  });

  it('Can generate OpenAPI using petstore', async () => {
    // Arrange
    const opts: Options = {
      openapi: 'tests/unit/petstore/petstore.yaml',
      output: testDirs[1]
    };

    // Act
    await main(opts);

    // Assert
    expect(mocks.write).toMatchSnapshot();
  });
});
