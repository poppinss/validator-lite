/*
 * @poppinss/validator-lite
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * The shape of the validate fn
 */
export type ValidateFn<T extends unknown> = (key: string, value?: string) => T

/**
 * A standard set of options accepted by the schema validation
 * functions
 */
export type SchemaFnOptions = {
  message?: string
}

export type StringFnUrlOptions = SchemaFnOptions & {
  format: 'url'
  /**
   * Whether the URL must have a valid TLD in their domain.
   * Defaults to `true`.
   */
  tld?: boolean
  /**
   * Whether the URL must start with a valid protocol.
   * Defaults to `true`.
   */
  protocol?: boolean
}

/**
 * Options accepted by the string schema function
 */
export type StringFnOptions =
  | (SchemaFnOptions & {
      format?: 'host' | 'email'
    })
  | StringFnUrlOptions
