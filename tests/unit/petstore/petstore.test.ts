import { main } from "@main";
import { exceptions } from "@utils/strings";
import { Options, SafetyNetBuildException } from "@utils/utils";
import { exceptionBuilder } from "../unit.utils";

describe("Petstore tests", () => {
    jest.setTimeout(60000);
    jest.useFakeTimers();

    // Prearrange
    process.stdout.clearLine = process.stdout.clearLine ?? jest.fn();
    process.stdout.cursorTo = process.stdout.cursorTo ?? jest.fn();
    const mocks = {
        clearLine: jest.spyOn(process.stdout, "clearLine").mockImplementation(jest.fn()),
        cursorTo: jest.spyOn(process.stdout, "cursorTo").mockImplementation(jest.fn()),
        write: jest.spyOn(process.stdout, "write").mockImplementation(jest.fn())
    };

    describe("Fails to generate ", () => {
        it("Fails to generate with missing OpenAPI", async () => {
            // Arrange
            const opts: Options = {
                openapi: "./invalid-file.yaml",
                output: './tests/.builds.invalid-file-path'
            };

            // Act
            const result = main(opts);

            // Assert
            expect(result).rejects.toThrow(exceptionBuilder([exceptions.invalidOpenApiFile, exceptions.openApiFileDoesNotExist, opts.openapi]));
        })
    })

    it("Can generate OpenAPI using petstore", async () => {
        // Arrange
        const opts: Options = {
            openapi: "tests/unit/petstore/petstore.yaml",
            output: './tests/.builds.sample-generation'
        };

        // Act
        const result = await main(opts);

        // Assert
        expect(mocks.write).toHaveBeenCalledWith([]);
    })
});