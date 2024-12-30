/*
 * @poppinss/validator-lite
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import type { SchemaFnOptions } from '../types.js'
import { ensureValue, BOOLEAN_NEGATIVES, BOOLEAN_POSITIVES } from './helpers.js'

/**
 * Casts a string value to a boolean
 */
function castToBoolean(key: string, value: string, message?: string): boolean {
  if (BOOLEAN_POSITIVES.includes(value)) {
    return true
  }

  if (BOOLEAN_NEGATIVES.includes(value)) {
    return false
  }

  throw new Error(message || `"${key}" env variable must be a boolean (Current value: "${value}")`)
}

/**
 * Enforces the value to be of type boolean. Also casts
 * string representation of a boolean to a boolean
 * type
 */
export function boolean(options?: SchemaFnOptions) {
  return function validate(key: string, value?: string): boolean {
    ensureValue(key, value, options?.message)
    return castToBoolean(key, value, options?.message)
  }
}

/**
 * Same as boolean, but allows undefined values as well.
 */
boolean.optional = function optionalBoolean(options?: SchemaFnOptions) {
  return function validate(key: string, value?: string): boolean | undefined {
    if (!value) {
      return undefined
    }
    return castToBoolean(key, value, options?.message)
  }
}

/**
 * Same as the optional rule, but allows a condition to decide when to
 * validate the value
 */
boolean.optionalWhen = function optionalWhenBoolean(
  condition: boolean | ((key: string, value?: string) => boolean),
  options?: SchemaFnOptions
) {
  return function validate(key: string, value?: string): boolean | undefined {
    if (typeof condition === 'function' ? condition(key, value) : condition) {
      return boolean.optional(options)(key, value)
    }

    return boolean(options)(key, value)
  }
}
