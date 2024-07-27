import { json } from 'body-parser';
import express, { Express, NextFunction, Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import {
  Category,
  CategorySchema,
  CategoryValidator,
  PetValidator,
  UserValidatorWithErrors
} from './.generated/validation/dist';

// Initialize app
const port = process.env.PORT || 21654;
const app: Express = express();
app.use(json());

// Endpoints
app.get('/', (_req: Request, res: Response) => {
  res.send({ hello: 'world' });
});

// Simple validation
app.post(`/pet`, (req: Request, res: Response) => {
  if (PetValidator(req.body)) {
    return res.status(200).send({ success: true });
  }
  return res.status(400).send({ success: false });
});

// Validation with error results
app.post(`/user`, (req: Request, res: Response) => {
  const [user, errors] = UserValidatorWithErrors(req.body);
  if (user) {
    return res.status(200).send({ success: true, user });
  }
  return res.status(400).send({ success: false, errors });
});

// Validation as a middleware factory - pass any validator & schema, and use it as a guard
const validationMiddleware = (
  validator: (body: unknown) => boolean,
  expectedSchema: Record<string, unknown>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!validator(req.body)) {
      return res
        .status(400)
        .send({ error: 'Invalid response body', expectedSchema });
    }
    next();
  };
};

app.post(
  `/category`,
  validationMiddleware(CategoryValidator, CategorySchema),
  (req: Request<ParamsDictionary, Category>, res: Response) => {
    // Category is strongly type hinted now
    const category = req.body;
    return res.status(200).send({ success: true, category });
  }
);

// Start service if not in unit test context
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}

export const server = app;
