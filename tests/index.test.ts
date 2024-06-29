import { main } from "@main";
import { Options } from "@utils/utils";

describe("Main tests", () => {
    it("Can initialize", async () => {
        // Arrange
        const opts: Options = {
            openapi: './invalid-path.yaml',
            output: './tmp'
        };

        // Act
        const promise = main(opts);

        // Assert
        expect(promise).rejects.toThrow("Failed to parse OpenAPI Specification");
    })
});