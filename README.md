# Validator Lite
> Typed schema-based validation with low calories

[![github-actions-image]][github-actions-url] [![npm-image]][npm-url] [![license-image]][license-url] [![typescript-image]][typescript-url]

A lightweight schema-based validation library similar to Zod and VineJS. It is used by the  [**@adonisjs/env**](https://github.com/adonisjs/env) package for validating environment variables, as bundling a full-blown validation library to validate environment variables seems like overkill.

## Installation
Install the module from the npm registry as follows:

```sh
npm install @poppinss/validator-lite
```

```sh
yarn add @poppinss/validator-lite
```

```sh
pnpm add @poppinss/validator-lite
```

## Basic usage
The following example shows how to use the validator :

```ts
import { schema } from '@poppinss/validator-lite'

/**
 * Define a schema
 */
const envSchema = {
  HOST: schema.string({ format: 'host' }),
  PORT: schema.number(),
  APP_URL: schema.string.optional({ type: 'url', tld: false }),
}

/**
 * Define the data
 */
const envVariables = {
  HOST: 'localhost',
  PORT: '3333'
}

/**
 * Validate the data
 */
for (let [key, schemaFn] of Object.entries(envSchema)) {
  schemaFn(key, envVariables[key])
}
```

## API
Following is the list of available methods :

### schema.string
Validate the value to exist and be a valid non-empty string.

```ts
{
  APP_KEY: schema.string()
}
```

```ts
{
  APP_KEY: schema.string.optional()
}
```

You can also force the value to have one of the pre-defined formats.

```ts
/**
 * Must be a valid host (URL or IP address)
 */
schema.string({ format: 'host' })

/**
 * Must be a valid URL with or without tld
 */
schema.string({ format: 'url' })
schema.string({ format: 'url', tld: false })

/**
 * Must be a valid email address
 */
schema.string({ format: 'email' })

/**
 * Must be a valid UUID
 */
schema.string({ format: 'uuid' })
```

When validating the `url` format, you can also define additional options to force/ignore the `tld` and `protocol`.

```ts
schema.string({
  format: 'url',
  tld: false, // allow URL without .com, .net, and so on
  protocol: false
})
```

### schema.boolean
Validate the value to exist and be a valid non-empty boolean value. The following values will be cast to a JavaScript boolean data type.

- `'1', 'true'` are casted to `Boolean(true)`
- `'0', 'false'` are casted to `Boolean(false)`

```ts
{
  CACHE_VIEWS: schema.boolean()
}
```

```ts
{
  CACHE_VIEWS: schema.boolean.optional()
}
```

### schema.number
Validate the value to exist and be a valid non-empty numeric value. The string representation of a number value will be cast to a JavaScript number data type.

```ts
{
  PORT: schema.number()
}
```

```ts
{
  PORT: schema.number.optional()
}
```

### schema.enum
Validate the value to exist and must be one of the pre-defined values.

```ts
{
  NODE_ENV: schema.enum(['development', 'production'] as const)
}
```

```ts
{
  MY_ENUM: schema.enum.optional(['development', 'production'] as const)
}
```

### Custom functions
For all other validation use cases, you can use custom functions. A custom function can throw errors for invalid values and must return the final output value. 

```ts
{
  PORT: (key, value) => {
    if (!value) {
      throw new Error('Value for PORT is required')
    }

    if (isNaN(Number(value))) {
      throw new Error('Value for PORT must be a valid number')    
    }

    return Number(value)
  }
}
```

[github-actions-image]: https://img.shields.io/github/actions/workflow/status/poppinss/validator-lite/checks.yml?style=for-the-badge
[github-actions-url]: https://github.com/poppinss/validator-lite/actions "github-actions"

[npm-image]: https://img.shields.io/npm/v/@poppinss/validator-lite.svg?style=for-the-badge&logo=npm
[npm-url]: https://www.npmjs.com/package/@poppinss/validator-lite "npm"

[license-image]: https://img.shields.io/npm/l/validator-lite?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md "license"

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]:  "typescript"
