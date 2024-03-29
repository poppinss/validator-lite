/*
 * @poppinss/validator-lite
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SchemaFnOptions } from '../contracts'
import { ensureValue } from './helpers'

/**
 * Casts the string to a number and ensures it is no NaN
 */
export function castToNumber(key: string, value: string, message?: string): number {
  const castedValue = Number(value)
  if (isNaN(castedValue)) {
    throw new Error(
      message ||
        `Value for environment variable "${key}" must be numeric, instead received "${value}"`
    )
  }

  return castedValue
}

/**
 * Enforces the value to be of valid number type and the
 * value will also be casted to a number
 */
export function number(options?: SchemaFnOptions) {
  return function validate(key: string, value?: string): number {
    ensureValue(key, value, options?.message)
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
