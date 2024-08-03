// Ignore certain azure function logs
const ignoreMsg = (msg: string, substr: string[]) =>
  substr.every((str) => msg.includes(str)) ? null : console.log(msg);
jest
  .spyOn(console, 'warn')
  .mockImplementation((arg) =>
    ignoreMsg(arg, ['"@azure/functions" package', 'test mode'])
  );
jest
  .spyOn(console, 'info')
  .mockImplementation((arg) =>
    ignoreMsg(arg, ['"@azure/functions" package', 'test mode'])
  );

// Import
import {
  HttpHandler,
  HttpRequest,
  HttpResponseInit,
  InvocationContext
} from '@azure/functions';
import {
  addPetHandler,
  createCategoryHandler,
  createUserHandler
} from '../index';

// Util functions
const useHandler = async (handler: HttpHandler, body: unknown) => {
  const context = new InvocationContext({
    functionName: 'test-function-name'
  });
  const request = new HttpRequest({
    url: 'http://localhost/test-path',
    method: 'POST',
    body: {
      string: JSON.stringify(body)
    }
  });
  return (await handler(request, context)) as HttpResponseInit;
};

// Tests
describe('Azure example tests', () => {
  describe('Simple validation', () => {
    it('Fails as expected', async () => {
      // Arrange
      const invalidBody = {};

      // Act
      const { jsonBody: response, status } = await useHandler(
        addPetHandler,
        invalidBody
      );

      // Assert
      expect(status).toEqual(400);
      expect(response).toEqual({ success: false });
    });
    it('Succeeds as expected', async () => {
      // Arrange
      const validPetRequestBody = {
        name: 'Bobby',
        photoUrls: ['https://bobbies.pics/1.jpg']
      };

      // Act
      const { jsonBody: response, status } = await await useHandler(
        addPetHandler,
        validPetRequestBody
      );

      // Assert
      expect(status).toEqual(200);
      expect(response).toEqual({ success: true });
    });
  });
  describe('Validation with errors', () => {
    it('Fails as expected', async () => {
      // Arrange
      const invalidUserBody = {
        id: '-1',
        username: null,
        firstName: 17,
        lastName: false,
        email: undefined
      };

      // Act
      const { jsonBody: response, status } = await await useHandler(
        createUserHandler,
        invalidUserBody
      );

      // Assert
      expect(status).toEqual(400);
      expect(response).toEqual({
        success: false,
        errors: [
          "'id' property type must be integer",
          "'username' property type must be string",
          "'firstName' property type must be string",
          "'lastName' property type must be string"
        ]
      });
    });
    it('Succeeds as expected', async () => {
      // Arrange
      const validRequestBody = {
        id: 1234091,
        username: 'bobbieg',
        firstName: 'bob',
        lastName: 'g'
      };

      // Act
      const { jsonBody: response, status } = await await useHandler(
        createUserHandler,
        validRequestBody
      );

      // Assert
      expect(status).toEqual(200);
      expect(response).toEqual({
        success: true,
        user: validRequestBody
      });
    });
  });

  describe('Validation as a middleware', () => {
    it('Fails as expected', async () => {
      // Arrange
      const invalidBody = {
        id: 'hello',
        name: ')(!"*£&)!("*£&!)("£_INVALID_REGEX'
      };

      // Act
      const { jsonBody: response, status } = await useHandler(
        createCategoryHandler,
        invalidBody
      );

      // Assert
      expect(status).toEqual(400);
      expect(response).toEqual({
        error: 'Invalid response body',
        expectedSchema: {
          description: 'A category for a pet',
          properties: {
            id: {
              format: 'int64',
              type: 'integer'
            },
            name: {
              pattern: '^[a-zA-Z0-9]+[a-zA-Z0-9\\.\\-_]*[a-zA-Z0-9]+$',
              type: 'string'
            }
          },
          title: 'Pet category',
          type: 'object',
          xml: {
            name: 'Category'
          }
        }
      });
    });
    it('Succeeds as expected', async () => {
      // Arrange
      const validRequestBody = {
        id: 1234091,
        name: 'Puppies'
      };

      // Act
      const { jsonBody: response, status } = await await useHandler(
        createCategoryHandler,
        validRequestBody
      );

      // Assert
      expect(status).toEqual(200);
      expect(response).toEqual({
        success: true,
        category: validRequestBody
      });
    });
  });
});
