/*
 * @poppinss/validator-lite
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { number } from './number'
import { string } from './string'
import { boolean } from './boolean'
import { oneOf } from './oneOf'

export const schema = {
  number,
  string,
  boolean,
  enum: oneOf,
}
