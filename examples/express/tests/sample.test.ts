import { default as request } from 'supertest';
import { server } from '../index';

describe('Express example tests', () => {
  it('Server initializes as expected', async () => {
    // Arrange

    // Act
    const response = await request(server).get('/');

    // Assert
    expect(response.body).toEqual({ hello: 'world' });
  });
  describe('Simple validation', () => {
    it('Fails as expected', async () => {
      // Arrange
      const emptyBody = {};

      // Act
      const response = await request(server).post('/pet').send(emptyBody);

      // Assert
      expect(response.body).toEqual({ success: false });
    });
    it('Succeeds as expected', async () => {
      // Arrange
      const validPetRequestBody = {
        name: 'Bobby',
        photoUrls: ['https://bobbies.pics/1.jpg']
      };

      // Act
      const response = await request(server)
        .post('/pet')
        .send(validPetRequestBody);

      // Assert
      expect(response.body).toEqual({ success: true });
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
      const response = await request(server)
        .post('/user')
        .send(invalidUserBody);

      // Assert
      expect(response.body).toEqual({
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
      const response = await request(server)
        .post('/user')
        .send(validRequestBody);

      // Assert
      expect(response.body).toEqual({
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
      const response = await request(server)
        .post('/category')
        .send(invalidBody);

      // Assert
      expect(response.body).toEqual({
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
      const response = await request(server)
        .post('/category')
        .send(validRequestBody);

      // Assert
      expect(response.body).toEqual({
        success: true,
        category: validRequestBody
      });
    });
  });
});
