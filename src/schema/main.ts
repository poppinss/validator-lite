/*
 * @poppinss/validator-lite
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { oneOf } from './one_of.js'
import { number } from './number.js'
import { string } from './string.js'
import { boolean } from './boolean.js'

export const schema = {
  number,
  string,
  boolean,
  enum: oneOf,
}
