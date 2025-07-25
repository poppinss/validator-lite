/*
 * @poppinss/validator-lite
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ensureExists } from './helpers.js'
import type { SchemaFnOptions } from '../types.js'

/**
 * Casts the string to a number and ensures it is no NaN
 */
export function castToNumber(key: string, value: string, message?: string): number {
  const castedValue = Number(value)
  if (Number.isNaN(castedValue)) {
    throw new Error(message || `"${key}" env variable must be a number (Current value: "${value}")`)
  }

  return castedValue
}

/**
 * Enforces the value to be of valid number type and the
 * value will also be casted to a number
 */
export function number(options?: SchemaFnOptions) {
  return function validate(key: string, value?: string): number {
    ensureExists(key, value, options?.message)
    return castToNumber(key, value, options?.message)
  }
}

/**
 * Similar to the number rule, but also allows optional
 * values
 */
number.optional = function optionalNumber(options?: SchemaFnOptions) {
  return function validate(key: string, value?: string): number | undefined {
    if (!value) {
      return undefined
    }
    return castToNumber(key, value, options?.message)
  }
}

/**
 * Same as the optional rule, but allows a condition to decide when to
 * validate the value
 */
number.optionalWhen = function optionalWhenNumber(
  condition: boolean | ((key: string, value?: string) => boolean),
  options?: SchemaFnOptions
) {
  return function validate(key: string, value?: string): number | undefined {
    if (typeof condition === 'function' ? condition(key, value) : condition) {
      return number.optional(options)(key, value)
    }

    return number(options)(key, value)
  }
}
