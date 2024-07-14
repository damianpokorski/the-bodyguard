import {
  ApiResponseSchema,
  ApiResponseValidator,
  ApiResponseValidatorWithErrors,
  CategorySchema,
  CategoryValidator,
  CategoryValidatorWithErrors,
  OrderSchema,
  OrderValidator,
  OrderValidatorWithErrors,
  Pet,
  PetSchema,
  PetValidator,
  PetValidatorWithErrors,
  PetValidatorWithErrorsWithHints,
  TagSchema,
  TagValidator,
  TagValidatorWithErrors,
  UserSchema,
  UserValidator,
  UserValidatorWithErrors
} from './../../.builds.petstore-output/dist';

describe.each`
  name             | schema               | validator               | validatorWithErrors
  ${'ApiResponse'} | ${ApiResponseSchema} | ${ApiResponseValidator} | ${ApiResponseValidatorWithErrors}
  ${'Category'}    | ${CategorySchema}    | ${CategoryValidator}    | ${CategoryValidatorWithErrors}
  ${'Order'}       | ${OrderSchema}       | ${OrderValidator}       | ${OrderValidatorWithErrors}
  ${'Pet'}         | ${PetSchema}         | ${PetValidator}         | ${PetValidatorWithErrors}
  ${'Tag'}         | ${TagSchema}         | ${TagValidator}         | ${TagValidatorWithErrors}
  ${'User'}        | ${UserSchema}        | ${UserValidator}        | ${UserValidatorWithErrors}
`('Module testing $name', ({ schema, validator, validatorWithErrors }) => {
  const invalidValues = [null, undefined, [], -1, false, function () {}];

  it(`Schema is defined`, () => {
    expect(schema).toBeDefined();
  });
  it.each(invalidValues)(
    `Validator rejects unexpected value of %s`,
    (value) => {
      expect(validator(value)).toEqual(false);
    }
  );

  it.each(invalidValues)(
    `Validator rejects unexpected value of %s with explicit error messages`,
    (value) => {
      const [_, errors] = validatorWithErrors(value);
      expect((errors as string[]).length).toBeGreaterThan(0);
    }
  );
});

describe('Lab rat tests', () => {
  it('Can detect invalid objects', async () => {
    // Arrange
    const labRat = {};

    // Act
    const validationResult = PetValidator(labRat);

    // Assert
    expect(validationResult).toEqual(false);
  });

  it('Can detect malformed objects', async () => {
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
  });
  it('Can detect valid objects', async () => {
    // Arrange
    const labRat = {
      name: 'Bobby',
      photoUrls: ['https://bobbyspictures/1.png']
    } as unknown as Pet;

    // Act
    const validatorResult = PetValidator(labRat);
    const [validatedPet, errors] = PetValidatorWithErrors(labRat);
    const [validatedPetWithHints, errorsWithHints] =
      PetValidatorWithErrorsWithHints(labRat);

    // Assert - Plain validator
    expect(validatorResult).toBeDefined();

    // Assert - Validator with Errors
    expect(validatedPet).toBeDefined();
    expect(errors).toBeUndefined();

    // Assert - Validator with errors & hints
    expect(validatedPetWithHints).toBeDefined();
    expect(errorsWithHints).toBeUndefined();
  });
});
