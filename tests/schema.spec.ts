/*
 * @poppinss/validator-lite
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { schema } from '../src/schema'

test.group('schema | number', () => {
  test('raise error when value is missing', ({ assert }) => {
    const fn = () => schema.number()('PORT')
    assert.throws(fn, 'E_MISSING_ENV_VALUE: Missing environment variable "PORT"')
  })

  test('raise error when value is not a valid number', ({ assert }) => {
    const fn = () => schema.number()('PORT', 'foo')
    assert.throws(fn, 'E_INVALID_ENV_VALUE: Value for environment variable "PORT" must be numeric')
  })

  test('raise error when value is an empty string', ({ assert }) => {
    const fn = () => schema.number()('PORT', '')
    assert.throws(fn, 'E_MISSING_ENV_VALUE: Missing environment variable "PORT"')
  })

  test('cast string representation of number to a number', ({ assert, expectTypeOf }) => {
    const value = schema.number()('PORT', '22')
    expectTypeOf(value).toEqualTypeOf<number>()
    assert.deepEqual(value, 22)
  })

  test('cast float representation of number to a number', ({ assert, expectTypeOf }) => {
    const value = schema.number()('PORT', '22.198')
    expectTypeOf(value).toEqualTypeOf<number>()
    assert.deepEqual(value, 22.198)
  })

  test('cast signed representation of number to a number', ({ assert, expectTypeOf }) => {
    const value = schema.number()('PORT', '-22.198')
    expectTypeOf(value).toEqualTypeOf<number>()
    assert.deepEqual(value, -22.198)
  })
})

test.group('schema | number.optional', () => {
  test('return undefined when value is missing', ({ assert, expectTypeOf }) => {
    const value = schema.number.optional()('PORT')
    expectTypeOf(value).toEqualTypeOf<number | undefined>()
    assert.isUndefined(value)
  })

  test('raise error when value is not a valid number', ({ assert }) => {
    const fn = () => schema.number.optional()('PORT', 'foo')
    assert.throws(fn, 'E_INVALID_ENV_VALUE: Value for environment variable "PORT" must be numeric')
  })

  test('return undefined when value is an empty string', ({ assert, expectTypeOf }) => {
    const value = schema.number.optional()('PORT', '')
    expectTypeOf(value).toEqualTypeOf<number | undefined>()
    assert.isUndefined(value)
  })

  test('cast string representation of number to a number', ({ assert, expectTypeOf }) => {
    const value = schema.number.optional()('PORT', '22')
    expectTypeOf(value).toEqualTypeOf<number | undefined>()
    assert.deepEqual(value, 22)
  })

  test('cast float representation of number to a number', ({ assert, expectTypeOf }) => {
    const value = schema.number.optional()('PORT', '22.198')
    expectTypeOf(value).toEqualTypeOf<number | undefined>()
    assert.deepEqual(value, 22.198)
  })

  test('cast signed representation of number to a number', ({ assert, expectTypeOf }) => {
    const value = schema.number.optional()('PORT', '-22.198')
    expectTypeOf(value).toEqualTypeOf<number | undefined>()
    assert.deepEqual(value, -22.198)
  })
})

test.group('schema | string', () => {
  test('raise error when value is missing', ({ assert }) => {
    const fn = () => schema.string()('PORT')
    assert.throws(fn, 'E_MISSING_ENV_VALUE: Missing environment variable "PORT"')
  })

  test('return string value as it is', ({ assert, expectTypeOf }) => {
    const value = schema.string()('PORT', '-22.198')
    expectTypeOf(value).toEqualTypeOf<string>()
    assert.deepEqual(value, '-22.198')
  })
})

test.group('schema | string.optional', () => {
  test('return undefined when value is missing', ({ assert, expectTypeOf }) => {
    const value = schema.string.optional()('PORT')
    expectTypeOf(value).toEqualTypeOf<string | undefined>()
    assert.deepEqual(value, undefined)
  })

  test('return string value as it is', ({ assert, expectTypeOf }) => {
    const value = schema.string.optional()('PORT', '-22.198')
    expectTypeOf(value).toEqualTypeOf<string | undefined>()
    assert.deepEqual(value, '-22.198')
  })

  test('validate value as an email', ({ assert }) => {
    const fn = () => schema.string({ format: 'email' })('FROM_EMAIL', 'foo')
    assert.throws(fn, 'Value for environment variable "FROM_EMAIL" must be a valid email')
    assert.equal(schema.string({ format: 'email' })('FROM_EMAIL', 'foo@bar.com'), 'foo@bar.com')
  })

  test('validate value as host', ({ assert }) => {
    const fn = () => schema.string({ format: 'host' })('HOST', 'foo:bar')
    assert.throws(fn, 'Value for environment variable "HOST" must be a valid (domain or ip)')
    assert.equal(schema.string({ format: 'host' })('HOST', 'localhost'), 'localhost')
    assert.equal(schema.string({ format: 'host' })('HOST', '127.0.0.1'), '127.0.0.1')
    assert.equal(schema.string({ format: 'host' })('HOST', 'adonisjs.dev'), 'adonisjs.dev')
  })

  test('validate value as a url (strict defaults)', ({ assert }) => {
    const fn = () => schema.string({ format: 'url' })('MAILGUN_URL', 'foo.com')
    assert.throws(fn, 'Value for environment variable "MAILGUN_URL" must be a valid URL')
    const fnTld = () =>
      schema.string({ format: 'url' })('MAILGUN_URL', 'https://mailgun-service:1234/v1')
    assert.throws(fnTld, 'Value for environment variable "MAILGUN_URL" must be a valid URL')
    assert.equal(
      schema.string({ format: 'url' })('MAILGUN_URL', 'https://api.mailgun.net/v1'),
      'https://api.mailgun.net/v1'
    )
  })

  test('validate value as a url (loose options)', ({ assert }) => {
    assert.equal(
      schema.string({ format: 'url', protocol: false })('MAILGUN_URL', 'foo.com'),
      'foo.com'
    )
    assert.equal(
      schema.string({ format: 'url', tld: false })(
        'MAILGUN_URL',
        'https://mailgun-service:1234/v1'
      ),
      'https://mailgun-service:1234/v1'
    )
    assert.equal(
      schema.string({ format: 'url', protocol: false, tld: false })(
        'MAILGUN_URL',
        'mailgun:1234/v1'
      ),
      'mailgun:1234/v1'
    )
  })
})

test.group('schema | boolean', () => {
  test('raise error when value is missing', ({ assert }) => {
    const fn = () => schema.boolean()('CACHE_VIEWS')
    assert.throws(fn, 'E_MISSING_ENV_VALUE: Missing environment variable "CACHE_VIEWS"')
  })

  test('raise error when value is not a valid boolean', ({ assert }) => {
    const fn = () => schema.boolean()('CACHE_VIEWS', 'foo')
    assert.throws(
      fn,
      'E_INVALID_ENV_VALUE: Value for environment variable "CACHE_VIEWS" must be a boolean'
    )
  })

  test('raise error when value is an empty string', ({ assert }) => {
    const fn = () => schema.boolean()('CACHE_VIEWS', '')
    assert.throws(fn, 'E_MISSING_ENV_VALUE: Missing environment variable "CACHE_VIEWS"')
  })

  test('cast "true" to a boolean', ({ assert, expectTypeOf }) => {
    const value = schema.boolean()('PORT', 'true')
    expectTypeOf(value).toEqualTypeOf<boolean>()
    assert.deepEqual(schema.boolean()('PORT', 'true'), true)
  })

  test('cast "false" to a boolean', ({ assert, expectTypeOf }) => {
    const value = schema.boolean()('PORT', 'false')
    expectTypeOf(value).toEqualTypeOf<boolean>()
    assert.deepEqual(value, false)
  })

  test('cast "1" to a boolean', ({ assert, expectTypeOf }) => {
    const value = schema.boolean()('PORT', '1')
    expectTypeOf(value).toEqualTypeOf<boolean>()
    assert.deepEqual(value, true)
  })

  test('cast "0" to a boolean', ({ assert, expectTypeOf }) => {
    const value = schema.boolean()('PORT', '0')
    expectTypeOf(value).toEqualTypeOf<boolean>()
    assert.deepEqual(value, false)
  })
})

test.group('schema | boolean.optional', () => {
  test('return undefined when value is missing', ({ assert, expectTypeOf }) => {
    const value = schema.boolean.optional()('CACHE_VIEWS')
    expectTypeOf(value).toEqualTypeOf<boolean | undefined>()
    assert.deepEqual(value, undefined)
  })

  test('raise error when value is not a valid boolean', ({ assert }) => {
    const fn = () => schema.boolean.optional()('CACHE_VIEWS', 'foo')
    assert.throws(
      fn,
      'E_INVALID_ENV_VALUE: Value for environment variable "CACHE_VIEWS" must be a boolean'
    )
  })

  test('return undefined when value is an empty string', ({ assert, expectTypeOf }) => {
    const value = schema.boolean.optional()('CACHE_VIEWS', '')
    expectTypeOf(value).toEqualTypeOf<boolean | undefined>()
    assert.deepEqual(value, undefined)
  })

  test('cast "true" to a boolean', ({ assert, expectTypeOf }) => {
    const value = schema.boolean.optional()('PORT', 'true')
    expectTypeOf(value).toEqualTypeOf<boolean | undefined>()
    assert.deepEqual(value, true)
  })

  test('cast "false" to a boolean', ({ assert, expectTypeOf }) => {
    const value = schema.boolean.optional()('PORT', 'false')
    expectTypeOf(value).toEqualTypeOf<boolean | undefined>()
    assert.deepEqual(value, false)
  })

  test('cast "1" to a boolean', ({ assert, expectTypeOf }) => {
    const value = schema.boolean.optional()('PORT', '1')
    expectTypeOf(value).toEqualTypeOf<boolean | undefined>()
    assert.deepEqual(value, true)
  })

  test('cast "0" to a boolean', ({ assert, expectTypeOf }) => {
    const value = schema.boolean.optional()('PORT', '0')
    expectTypeOf(value).toEqualTypeOf<boolean | undefined>()
    assert.deepEqual(value, false)
  })
})

test.group('schema | enum', () => {
  test('raise error when value is missing', ({ assert }) => {
    const fn = () => schema.enum(['api', 'web'])('AUTH_GUARD')
    assert.throws(fn, 'E_MISSING_ENV_VALUE: Missing environment variable "AUTH_GUARD"')
  })

  test('raise error when value is not one of the defined options', ({ assert }) => {
    const fn = () => schema.enum(['api', 'web'])('AUTH_GUARD', 'foo')
    assert.throws(fn, 'Value for environment variable "AUTH_GUARD" must be one of "api,web"')
  })

  test('raise error when value is an empty string', ({ assert }) => {
    const fn = () => schema.enum(['api', 'web'])('AUTH_GUARD')
    assert.throws(fn, 'E_MISSING_ENV_VALUE: Missing environment variable "AUTH_GUARD"')
  })

  test('return value when it is in one of the defined choices', ({ assert, expectTypeOf }) => {
    const value = schema.enum(['api', 'web'] as const)('AUTH_GUARD', 'web')
    expectTypeOf(value).toEqualTypeOf<'api' | 'web'>()
    assert.deepEqual(value, 'web')
  })

  test('cast string representation of boolean', ({ assert, expectTypeOf }) => {
    const value = schema.enum([true, false] as const)('AUTH_GUARD', 'true')
    expectTypeOf(value).toEqualTypeOf<true | false>()
    assert.deepEqual(value, true)
  })

  test('cast string representation of number', ({ assert, expectTypeOf }) => {
    const value = schema.enum([10, 40, 60] as const)('AUTH_GUARD', '40')
    expectTypeOf(value).toEqualTypeOf<10 | 40 | 60>()
    assert.deepEqual(value, 40)
  })

  test('cast string representation of float', ({ assert, expectTypeOf }) => {
    const value = schema.enum([10, 40.22, 60.01] as const)('AUTH_GUARD', '60.010')
    expectTypeOf(value).toEqualTypeOf<10 | 40.22 | 60.01>()
    assert.deepEqual(value, 60.01)
  })

  test('define enum options from native enum type', ({ assert, expectTypeOf }) => {
    enum Guards {
      API = 'api',
      WEB = 'web',
    }
    const value = schema.enum(Object.values(Guards))('AUTH_GUARD', 'web')
    expectTypeOf(value).toEqualTypeOf<Guards>()
    assert.deepEqual(value, Guards.WEB)
  })
})
