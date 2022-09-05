
# Validator Lite
> Typed schema based validation with low calories

[![github-actions-image]][github-actions-url] [![npm-image]][npm-url] [![license-image]][license-url] [![typescript-image]][typescript-url]

Really simple and lightweight validation library for JavaScript. Used by [**@adonisjs/env**](https://github.com/adonisjs/env/) for validating environment variables.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation
Install the module from npm registry as follows:
```
npm install @poppinss/validator-lite
```

## Usage
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

[github-actions-image]: https://github.com/validator-lite/actions/workflows/test.yml
[github-actions-url]: https://img.shields.io/github/workflow/status/poppinss/validator-lite/test?style=for-the-badge "github-actions"

[npm-image]: https://img.shields.io/npm/v/validator-lite.svg?style=for-the-badge&logo=npm
[npm-url]: https://npmjs.org/package/validator-lite "npm"

[license-image]: https://img.shields.io/npm/l/validator-lite?color=blueviolet&style=for-the-badge
[license-url]: LICENSE.md "license"

[typescript-image]: https://img.shields.io/badge/Typescript-294E80.svg?style=for-the-badge&logo=typescript
[typescript-url]:  "typescript"
