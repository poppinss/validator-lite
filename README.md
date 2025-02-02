
# Validator Lite
> Typed schema based validation with low calories

[![github-actions-image]][github-actions-url] [![npm-image]][npm-url] [![license-image]][license-url] [![typescript-image]][typescript-url]

Really simple and lightweight validation library for JavaScript. Used by [**@adonisjs/env**](https://github.com/adonisjs/env/) for validating environment variables.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation
Install the module from npm registry as follows:

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
const userSchema = {
  name: schema.string(),
  age: schema.number(),
  email: schema.string.optional(),
  website: schema.string({ format: 'url' }),
}

/**
 * Define the data
 */
const data = {
  name: 'John doe',
  age: 25,
  website: 'https://adonisjs.com',
}

/**
 * Validate the data
 */
for (let [key, fn] of Object.entries(userSchema)) {
  fn(key, user[key])
}
```

## API
Following is the list of available methods :

### schema.string
Validates the value to check if it exists and if it is a valid string. Empty strings fail the validations, and you must use the optional variant to allow empty strings.

```ts
{
  APP_KEY: schema.string()
}
// Mark it as optional
{
  APP_KEY: schema.string.optional()
}
```

You can also force the value to have one of the pre-defined formats.

```ts
// Must be a valid host (url or ip)
schema.string({ format: 'host' })
// Must be a valid URL
schema.string({ format: 'url' })
// Must be a valid email address
schema.string({ format: 'email' })
// Must be a valid UUID
schema.string({ format: 'uuid' })
```

When validating the `url` format, you can also define additional options to force/ignore the `tld` and `protocol`.

```ts
schema.string({ format: 'url', tld: false, protocol: false })
```

---

### schema.boolean

Enforces the value to be a valid string representation of a boolean. Following values are considered as valid booleans and will be converted to `true` or `false`.

- `'1', 'true'` are casted to `Boolean(true)`
- `'0', 'false'` are casted to `Boolean(false)`

```ts
{
  CACHE_VIEWS: schema.boolean()
}
// Mark it as optional
{
  CACHE_VIEWS: schema.boolean.optional()
}
```

---

### schema.number

Enforces the value to be a valid string representation of a number.

```ts
{
  PORT: schema.number()
}
// Mark it as optional
{
  PORT: schema.number.optional()
}
```

---

### schema.enum

Forces the value to be one of the pre-defined values.

```ts
{
  MY_ENUM: schema.enum(['development', 'production'] as const)
}
// Mark it as optional
{
  MY_ENUM: schema.enum.optional(['development', 'production'] as const)
}
```

---

### Custom functions
For every other validation use case, you can define your custom functions.

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

- Make sure to always return the value after validating it.
- The return value can be different from the initial input value.

[github-actions-image]: https://img.shields.io/github/actions/workflow/status/poppinss/validator-lite/checks.yml?style=for-the-badge
[github-actions-url]: https://github.com/poppinss/validator-lite/actions "github-actions"

[npm-image]: https://img.shields.io/npm/v/@poppinss/validator-lite.svg?style=for-the-badge&logo=npm
[npm-url]: https://www.npmjs.com/package/@poppinss/validator-lite "npm"

[license-image]: https://img.shields.io/npm/l/validator-lite?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md "license"

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]:  "typescript"
