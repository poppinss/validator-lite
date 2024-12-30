/*
 * @poppinss/validator-lite
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { ensureValue } from './helpers.js'
import type { StringFnOptions } from '../types.js'
import { isFQDN, isIP, isURL, isEmail } from '../validator.js'

/**
 * Formats against which a string can be optionally validated. We
 * lazy load the dependencies required for validating formats
 */
const formats: {
  [format in 'email' | 'host' | 'url']: (
    key: string,
    value: string,
    options: StringFnOptions
  ) => void
} = {
  email: (key, value, options) => {
    if (!isEmail(value)) {
      throw new Error(
        options.message ||
          `Value for environment variable "${key}" must be a valid email, instead received "${value}"`
      )
    }
  },
  host: (key, value, options) => {
    if (!isFQDN(value, { require_tld: false }) && !isIP(value)) {
      throw new Error(
        options.message ||
          `Value for environment variable "${key}" must be a valid (domain or ip), instead received "${value}"`
      )
    }
  },
  url: (key, value, options) => {
    const { tld, protocol } = Object.assign(
      {
        tld: true,
        protocol: true,
      },
      options
    )
    if (!isURL(value, { require_tld: tld, require_protocol: protocol })) {
      throw new Error(
        options.message ||
          `Value for environment variable "${key}" must be a valid URL, instead received "${value}"`
      )
    }
  },
}

/**
 * Enforces the value to exist and be of type string
 */
export function string(options?: StringFnOptions) {
  return function validate(key: string, value?: string): string {
    ensureValue(key, value, options?.message)

    if (options?.format) {
      formats[options.format](key, value, options)
    }

    return value
  }
}

/**
 * Same as the string rule, but allows non-existing values too
 */
string.optional = function optionalString(options?: StringFnOptions) {
  return function validate(key: string, value?: string): string | undefined {
    if (!value) {
      return undefined
    }

    if (options?.format) {
      formats[options.format](key, value, options)
    }

    return value
  }
}

/**
 * Same as the optional rule, but allows a condition to decide when to
 * validate the value
 */
string.optionalWhen = function optionalWhenString(
  condition: boolean | ((key: string, value?: string) => boolean),
  options?: StringFnOptions
) {
  return function validate(key: string, value?: string): string | undefined {
    if (typeof condition === 'function' ? condition(key, value) : condition) {
      return string.optional(options)(key, value)
    }

    return string(options)(key, value)
  }
}
