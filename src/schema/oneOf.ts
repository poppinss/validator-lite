/*
 * @poppinss/validator-lite
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { SchemaFnOptions } from '../contracts'
import { ensureValue, BOOLEAN_NEGATIVES, BOOLEAN_POSITIVES } from './helpers'

/**
 * Validates the number to be present in the user defined choices.
 *
 * The incoming value will be casted as follows:
 *
 * - "0", 0, "false", false will be casted to false
 * - "1", 1, "true", true will be casted to true
 * - string representation of a number will be casted to a number
 */
function ensureOneOf(choices: readonly any[], key: string, value: any, message?: string) {
  if (BOOLEAN_NEGATIVES.includes(value)) {
    value = false
  } else if (BOOLEAN_POSITIVES.includes(value)) {
    value = true
  } else {
    const toNumber = Number(value)
    if (!isNaN(toNumber)) {
      value = toNumber
    }
  }

  /**
   * If choices includes the value, then return the casted
   * value
   */
  if (choices.includes(value)) {
    return value
  }

  /**
   * Otherwise raise exception
   */
  throw new Error(
    message ||
      `Value for environment variable "${key}" must be one of "${choices.join(
        ','
      )}", instead received "${value}"`
  )
}

/**
 * Enforces value to be one of the defined choices
 */
export function oneOf<K extends any>(choices: readonly K[], options?: SchemaFnOptions) {
  return function validate(key: string, value?: string): K {
    ensureValue(key, value, options?.message)
    return ensureOneOf(choices, key, value, options?.message)
  }
}

/**
 * Similar to oneOf, but also allows optional properties
 */
oneOf.optional = function optionalEnum<K extends any>(
  choices: readonly K[],
  options?: SchemaFnOptions
) {
  return function validate(key: string, value?: string): K | undefined {
    if (!value) {
      return undefined
    }
    return ensureOneOf(choices, key, value, options?.message)
  }
}
