# The bodyguard

A an opinionated request body validation generator - and it achieves that by relying on an existing set of tools rather than re-inventing the wheel. Just wrapping them around in a convenient plug and play package.

![#f03c15](https://placehold.co/15x15/f03c15/f03c15.png) _This package is very much under active development & not production ready for time being._ ![#f03c15](https://placehold.co/15x15/f03c15/f03c15.png)

The core of the process is as follows:

- Parse & Validate specification ([js-yaml](https://www.npmjs.com/package/js-yaml) as an initial pass)
- Extract & Flatten JSON Schemas from an OpenAPI specification ([@stoplight/json-ref-resolver](https://www.npmjs.com/package/json-schema-to-typescript))
- Generate typescript models for the same schemas json-schema-to-typescript ([json-schema-to-typescript](https://openapi-generator.tech/docs/generators/typescript-axios))
- Generate a set of standalone validators for each of the Schemas ([ajv](https://ajv.js.org/) is absolutely amazing, we also utilize [standlone](https://ajv.js.org/standalone.html))
- Generate a single bundled and minified output, that can be inserted into any platform without relying on any dependencies ((esbuild)[https://esbuild.github.io/])

## The goals

This package has been designed with a few key points in mind:

**We should use OpenAPI as single source of truth** - for both requests & responses, and wherever else is applicable.

- Every other framework or library comes with their own set of custom decorators that you have to re-learn time and time again - why should you spend ages trying to re-learn a different tool to achieve the same job. And some of them have their own sets of edge cases, or do not support certain scenarios. **Also, I prefer to just write an OpenAPI specification first, and work from there.**

- Allowing the validation to be lifted and shifted between the frameworks, if one day I decide I want to switch from express to serverless, or Azure Functions, why should I have to re-write something as simple as a request body validation layer...

**We should have a platform agnostic result**

- Leverage type generation as much as possible to minimize drift between documentation and code. Ideally I would want to just treat generated validators as a dependency, & not have to worry about validating their code. With this generator you get all of the relevant declarions, but final bundle is just a common.js import - in a single file. Bundled, tree-shaken & minified (sourcemaps are optional)

- Generates a fast authentication layer that's immune to cold start issues (i.e. processing a complex json schema can take precious milliseconds, doing it on repeat - on FaaS infrastructure is quite wasteful.. ) - we can sidestep that with ajv standalone & esbuild.

- Error output should be as straightfoward and focus on the actual errors, no custom object, random exceptions being thrown unexpectedly etc. A few different variations should be available, whether we just need a `true/false` or something a bit more verbose.


## Installation

![NPM Version](https://img.shields.io/npm/v/the-bodyguard)

[NPM - the-bodyguard](https://www.npmjs.com/package/the-bodyguard)

```bash
npm i the-bodyguard --save-dev
```

## Usage

### Generation

```
Usage: the-bodyguard [options]

Options:
  --openapi <string>  Path to the OpenAPI specification
  --output <string>   Output path
  --force             Force generation even if checksums match (default: false)
  --sourcemaps        Generate sourcemaps (default: false)
  -h, --help          display help for command
```

#### Via package.json
```json
...
  "scripts": {
    "build-validation": "the-bodyguard --openapi petstore.yaml --output .validation",
```
And then

```sh
npm run build-validation
```

#### Via npx

```sh
npx the-bodyguard --openapi petstore.yaml --output .api
```

### Implementation
Now that generation is complete, we can make use of our:

- Types
    - `{SchemaName}` - OpenApi schemas have been converted to 
- JSON Schemas
- Validators
    - `{SchemaName}Validator` - a validator accepting any objects, and resulting in a true/false output
    - `{SchemaName}ValidatorWithErrors` - a validator accepting any objects, and resulting in output of `[validatedInstance, errors]`
        - In case of a valid result validatedInstance, the error will be `null`
        - In case of invalid result, the validatedInstance will be null


For example, given OpenApi Schema of a category that can be found in the popular petstore example:

```yaml
component:
  schemas:
    Category:
      title: Pet category
      description: A category for a pet
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
```

We can do the following:

### Use exact types

```ts
import { Category } from './.api';

const myCategory: Category = {
    id: 1
    name: "Bobbie"
};
```

### Validate unknown objects
```ts
import { Category, CategoryValidator } from './.api';

const invalidCategory = {
    id: "1"
}

if (!CategoryValidator(invalidCategory)) {
    console.log("Category is not valid");
    return;
}

// We can safely proceed
```

### Validate & point out the exact issues
```ts
import { Category, CategoryWithErrors } from './.api';

const [category, errors] = UserValidatorWithErrors({
    id: "1"
});

// If validation errors are defined
if (errors) {
    console.log("Category is not valid");
    console.log(errors);
    return;
}

// We can safely proceed & category is correctly typed
console.log(`Category ${category.id} is valid`)
```
