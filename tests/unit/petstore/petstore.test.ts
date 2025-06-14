import { main } from '@main';
import type { Options } from '@utils/parseOptions';
import { cleanUpDir } from '../unit.utils';

const testDirs = [
  './tests/.builds.invalid-file-path',
  './tests/.builds.sample-generation',
];

describe('Petstore generation tests', () => {
  vi.useFakeTimers();

  // Prearrange
  process.stdout.clearLine = process.stdout.clearLine ?? vi.fn();
  process.stdout.cursorTo = process.stdout.cursorTo ?? vi.fn();
  const mocks = {
    clearLine: vi
      .spyOn(process.stdout, 'clearLine')
      .mockImplementation(vi.fn()),
    cursorTo: vi.spyOn(process.stdout, 'cursorTo').mockImplementation(vi.fn()),
    write: vi.spyOn(process.stdout, 'write').mockImplementation(vi.fn()),
  };

  // Cleaning up temporarary dirs, before and after each run
  const cleanUp = () => {
    for (const testDir of testDirs) {
      console.log(`Cleaned up ${testDir}`);
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
        output: testDirs[0],
      };

      // Act
      const result = main(opts);

      // Assert
      await expect(result).rejects.toThrowErrorMatchingInlineSnapshot(
        `[Error: Failed to parse OpenAPI Specification - File does not exists - ./invalid-file.yaml]`,
      );
    });
  });

  it('Can generate OpenAPI using petstore', async () => {
    // Arrange
    const opts: Options = {
      openapi: 'tests/unit/petstore/petstore.yaml',
      output: testDirs[1],
    };

    // Act
    await main(opts);

    // Assert
    expect(mocks.write).toMatchInlineSnapshot(`
      [MockFunction spy] {
        "calls": [
          [
            "Looking for past checksums..
      ",
          ],
          [
            "  [33m![39m Failed to find matching checksums.. generating.
      ",
          ],
          [
            "Checking whether the required NPM packages are installed...
      ",
          ],
          [
            "  [92m✔[39m esbuild
      ",
          ],
          [
            "  [92m✔[39m typescript
      ",
          ],
          [
            "  [92m✔[39m corepack
      ",
          ],
          [
            "
      Starting...
      ",
          ],
          [
            "Looking for past checksums..
      ",
          ],
          [
            "  [33m![39m Failed to find matching checksums.. generating.
      ",
          ],
          [
            "Checking whether the required NPM packages are installed...
      ",
          ],
          [
            "  [92m✔[39m esbuild
      ",
          ],
          [
            "  [92m✔[39m typescript
      ",
          ],
          [
            "  [92m✔[39m corepack
      ",
          ],
          [
            "
      Starting...
      ",
          ],
          [
            "  [92m✔[39m OpenAPI Specification validated
      ",
          ],
          [
            "
      Extracting JSON Schemas...
      ",
          ],
          [
            "  [92m✔[39m tests/.builds.sample-generation/schemas/order.json
      ",
          ],
          [
            "  [92m✔[39m tests/.builds.sample-generation/schemas/category.json
      ",
          ],
          [
            "  [92m✔[39m tests/.builds.sample-generation/schemas/user.json
      ",
          ],
          [
            "  [92m✔[39m tests/.builds.sample-generation/schemas/tag.json
      ",
          ],
          [
            "  [92m✔[39m tests/.builds.sample-generation/schemas/pet.json
      ",
          ],
          [
            "  [92m✔[39m tests/.builds.sample-generation/schemas/apiResponse.json
      ",
          ],
          [
            "
      Generating Typescript models...
      ",
          ],
          [
            "  - JSON Schema to typescript conversion",
          ],
          [
            "  [92m✔[39m Models generated successfully using - json-schema-to-typescript
      ",
          ],
          [
            "  - Ensuring camel case naming convention",
          ],
          [
            "  - Updating imports & Saving",
          ],
          [
            "  [92m✔[39m tests/.builds.sample-generation/models/apiResponse.ts
      ",
          ],
          [
            "  [92m✔[39m tests/.builds.sample-generation/models/category.ts
      ",
          ],
          [
            "  [92m✔[39m tests/.builds.sample-generation/models/order.ts
      ",
          ],
          [
            "  [92m✔[39m tests/.builds.sample-generation/models/pet.ts
      ",
          ],
          [
            "  [92m✔[39m tests/.builds.sample-generation/models/tag.ts
      ",
          ],
          [
            "  [92m✔[39m tests/.builds.sample-generation/models/user.ts
      ",
          ],
          [
            "
      Generating AJV Standalone validators (with better-ajv-errors)...
      ",
          ],
          [
            "  [92m✔[39m apiResponse - Generated... ",
          ],
          [
            "  [92m✔[39m tests/.builds.sample-generation/validators/apiResponse.ts
      ",
          ],
          [
            "  [92m✔[39m category - Generated... ",
          ],
          [
            "  [92m✔[39m tests/.builds.sample-generation/validators/category.ts
      ",
          ],
          [
            "  [92m✔[39m order - Generated... ",
          ],
          [
            "  [92m✔[39m tests/.builds.sample-generation/validators/order.ts
      ",
          ],
          [
            "  [92m✔[39m pet - Generated... ",
          ],
          [
            "  [92m✔[39m tests/.builds.sample-generation/validators/pet.ts
      ",
          ],
          [
            "  [92m✔[39m tag - Generated... ",
          ],
          [
            "  [92m✔[39m tests/.builds.sample-generation/validators/tag.ts
      ",
          ],
          [
            "  [92m✔[39m user - Generated... ",
          ],
          [
            "  [92m✔[39m tests/.builds.sample-generation/validators/user.ts
      ",
          ],
          [
            "
      Compiling the final bundle...
      ",
          ],
          [
            "  [92m✔[39m Prepared the typescript interfaces
      ",
          ],
          [
            "  [92m✔[39m Mapped types for apiResponse
      ",
          ],
          [
            "  [92m✔[39m Mapped types for category
      ",
          ],
          [
            "  [92m✔[39m Mapped types for order
      ",
          ],
          [
            "  [92m✔[39m Mapped types for pet
      ",
          ],
          [
            "  [92m✔[39m Mapped types for tag
      ",
          ],
          [
            "  [92m✔[39m Mapped types for user
      ",
          ],
          [
            "Generating typescript declarion files before final bundling...",
          ],
          [
            "  [92m✔[39m Validated & generated declaration files using tsc
      ",
          ],
          [
            "Bundling & minifying... (esbuild / commonjs)",
          ],
          [
            "  [92m✔[39m Bundled and minified (esbuild)
      ",
          ],
          [
            "
      Generating checksums...
      ",
          ],
        ],
        "results": [
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
          {
            "type": "return",
            "value": undefined,
          },
        ],
      }
    `);
  });
});
