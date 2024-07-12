import { ApiResponseSchema, ApiResponseValidator, ApiResponseValidatorWithErrors, CategorySchema, CategoryValidator, CategoryValidatorWithErrors, OrderSchema, OrderValidator, OrderValidatorWithErrors, Pet, PetSchema, PetValidator, PetValidatorWithErrors, PetValidatorWithErrorsWithHints, TagSchema, TagValidator, TagValidatorWithErrors, UserSchema, UserValidator, UserValidatorWithErrors } from './../../.builds.petstore-output/dist';


describe.each`
    name             | schema               | validator               | validatorWithErrors
    ${"Pet"}         | ${PetSchema}         | ${PetValidator}         | ${PetValidatorWithErrors}
    ${"Tag"}         | ${TagSchema}         | ${TagValidator}         | ${TagValidatorWithErrors}
    ${"User"}        | ${UserSchema}        | ${UserValidator}        | ${UserValidatorWithErrors}
    ${"Order"}       | ${OrderSchema}       | ${OrderValidator}       | ${OrderValidatorWithErrors}
    ${"Category"}    | ${CategorySchema}    | ${CategoryValidator}    | ${CategoryValidatorWithErrors}
    ${"ApiResponse"} | ${ApiResponseSchema} | ${ApiResponseValidator} | ${ApiResponseValidatorWithErrors}
`("Module testing $name", ({ name, schema, validator, validatorWithErrors }) => {
    const invalidValues = [
        null,
        undefined,
        [],
        -1,
        false,
        function () { }
    ];

    it(`Schema is defined`, () => {
        expect(schema).toBeDefined();
    })
    it.each(invalidValues)(`Validator rejects unexpected value of %s`, (value) => {
        expect(validator(value)).toEqual(false);
    })

    it.each(invalidValues)(`Validator rejects unexpected value of %s with explicit error messages`, (value) => {
        const [_, errors] = validatorWithErrors(value);
        expect((errors as string[]).length).toBeGreaterThan(0);
    })
})

describe("Lab rat tests", () => {
    it("Can detect invalid objects", async () => {
        // Arrange
        const labRat = {};

        // Act
        const validationResult = PetValidator(labRat);

        // Assert
        expect(validationResult).toEqual(false);
    });

    it("Can detect malformed objects", async () => {
        // Arrange
        const labRat = {
            name: {
                firstName: 'Bobby'
            },
            photoUrls: -167
        };

        // Act
        const validationResult = PetValidator(labRat);

        // Assert
        expect(validationResult).toEqual(false);
    })
    it("Can detect valid objects", async () => {
        // Arrange
        const labRat = {
            name: 'Bobby',
            photoUrls: [
                'https://bobbyspictures/1.png'
            ]
        } as Pet;

        // Act
        const [validatedPet, errors] = PetValidatorWithErrors(labRat);

        // Assert
        expect(errors).toEqual(undefined);
        expect(validatedPet).toBeDefined();
    })
});