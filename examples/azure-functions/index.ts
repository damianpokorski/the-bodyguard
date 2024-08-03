import {
  app,
  FunctionResult,
  HttpRequest,
  HttpResponse,
  HttpResponseInit,
  InvocationContext
} from '@azure/functions';

import {
  Category,
  CategorySchema,
  CategoryValidator,
  PetValidator,
  UserValidatorWithErrors
} from './.api/dist';

// Simple validation
export const addPetHandler = async (
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> => {
  const body = await request.json();
  if (!PetValidator(body)) {
    return { jsonBody: { success: false }, status: 400 };
  }

  return { jsonBody: { success: true }, status: 200 };
};

app.http('addPet', {
  methods: ['POST'],
  route: 'pet',
  handler: addPetHandler
});

// Validation with error results
export const createUserHandler = async (
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> => {
  const body = await request.json();
  const [user, errors] = UserValidatorWithErrors(body);
  if (errors) {
    return {
      jsonBody: { success: false, errors },
      status: 400
    };
  }

  return {
    jsonBody: { success: true, user },
    status: 200
  };
};
app.http('createUser', {
  methods: ['POST'],
  route: 'user',
  handler: createUserHandler
});

// Validation as a wrapper function
const validated = <T>(
  validator: (body: unknown) => boolean,
  schema: Record<string, unknown>,
  handler: (
    request: HttpRequest,
    context: InvocationContext,
    validatedBody: T
  ) => FunctionResult<HttpResponseInit | HttpResponse>
) => {
  return async (
    request: HttpRequest,
    context: InvocationContext
  ): Promise<HttpResponseInit> => {
    // If validation fails - return error
    const body = await request.json();
    if (!validator(body)) {
      return {
        jsonBody: { error: 'Invalid response body', expectedSchema: schema },
        status: 400
      };
    }
    // If validation has passed, execute actual handler
    return await handler(request, context, body as T);
  };
};

// Validation with error results
export const createCategoryHandler = validated<Category>(
  CategoryValidator,
  CategorySchema,
  async (
    request: HttpRequest,
    context: InvocationContext,
    category
  ): Promise<HttpResponseInit> => {
    // We know for sure that we have received a valid body
    return {
      jsonBody: { success: true, category },
      status: 200
    };
  }
);
app.http('createCategory', {
  methods: ['POST'],
  route: 'category',
  handler: createCategoryHandler
});

export const server = app;
