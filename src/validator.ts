/*
 * @poppinss/validator-lite
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Source code copied from https://github.com/validatorjs/validator.js
 */

/* eslint-disable no-control-regex */
const splitNameAddress = /^([^\x00-\x1F\x7F-\x9F\cX]+)</i
const emailUserPart = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i
const quotedEmailUser =
  /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i
const emailUserUtf8Part =
  /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A1-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i
const quotedEmailUserUtf8 =
  /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i
/* eslint-enable no-control-regex */
const defaultMaxEmailLength = 254

const IPv4SegmentFormat = '(?:[0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])'
const IPv4AddressFormat = `(${IPv4SegmentFormat}[.]){3}${IPv4SegmentFormat}`
const IPv4AddressRegExp = new RegExp(`^${IPv4AddressFormat}$`)

const IPv6SegmentFormat = '(?:[0-9a-fA-F]{1,4})'
const IPv6AddressRegExp = new RegExp(
  '^(' +
    `(?:${IPv6SegmentFormat}:){7}(?:${IPv6SegmentFormat}|:)|` +
    `(?:${IPv6SegmentFormat}:){6}(?:${IPv4AddressFormat}|:${IPv6SegmentFormat}|:)|` +
    `(?:${IPv6SegmentFormat}:){5}(?::${IPv4AddressFormat}|(:${IPv6SegmentFormat}){1,2}|:)|` +
    `(?:${IPv6SegmentFormat}:){4}(?:(:${IPv6SegmentFormat}){0,1}:${IPv4AddressFormat}|(:${IPv6SegmentFormat}){1,3}|:)|` +
    `(?:${IPv6SegmentFormat}:){3}(?:(:${IPv6SegmentFormat}){0,2}:${IPv4AddressFormat}|(:${IPv6SegmentFormat}){1,4}|:)|` +
    `(?:${IPv6SegmentFormat}:){2}(?:(:${IPv6SegmentFormat}){0,3}:${IPv4AddressFormat}|(:${IPv6SegmentFormat}){1,5}|:)|` +
    `(?:${IPv6SegmentFormat}:){1}(?:(:${IPv6SegmentFormat}){0,4}:${IPv4AddressFormat}|(:${IPv6SegmentFormat}){1,6}|:)|` +
    `(?::((?::${IPv6SegmentFormat}){0,5}:${IPv4AddressFormat}|(?::${IPv6SegmentFormat}){1,7}|:))` +
    ')(%[0-9a-zA-Z-.:]{1,})?$'
)
const WRAPPED_IPV6 = /^\[([^\]]+)\](?::([0-9]+))?$/

function validateDisplayName(displayName: string) {
  const displayNameWithoutQuotes = displayName.replace(/^"(.+)"$/, '$1')
  // display name with only spaces is not valid
  if (!displayNameWithoutQuotes.trim()) {
    return false
  }

  // check whether display name contains illegal character
  const containsIllegal = /[\.";<>]/.test(displayNameWithoutQuotes)
  if (containsIllegal) {
    // if contains illegal characters,
    // must to be enclosed in double-quotes, otherwise it's not a valid display name
    if (displayNameWithoutQuotes === displayName) {
      return false
    }

    // the quotes in display name must start with character symbol \
    const allStartWithBackSlash =
      displayNameWithoutQuotes.split('"').length === displayNameWithoutQuotes.split('\\"').length
    if (!allStartWithBackSlash) {
      return false
    }
  }

  return true
}

/**
 * Check if the provided value is a valid IP address
 */
export function isIP(str: string, version?: 4 | 6): boolean {
  if (version === 4) {
    return IPv4AddressRegExp.test(str)
  } else if (version === 6) {
    return IPv6AddressRegExp.test(str)
  }
  return isIP(str, 4) || isIP(str, 6)
}

export function isFQDN(
  str: string,
  options?: Partial<{
    require_tld: boolean
    allow_underscores: boolean
    allow_trailing_dot: boolean
    allow_numeric_tld: boolean
    allow_wildcard: boolean
    ignore_max_length: boolean
  }>
) {
  options = Object.assign(
    {
      require_tld: true,
      allow_underscores: false,
      allow_trailing_dot: false,
      allow_numeric_tld: false,
      allow_wildcard: false,
      ignore_max_length: false,
    },
    options
  )

  /* Remove the optional trailing dot before checking validity */
  if (options.allow_trailing_dot && str[str.length - 1] === '.') {
    str = str.substring(0, str.length - 1)
  }

  /* Remove the optional wildcard before checking validity */
  if (options.allow_wildcard === true && str.indexOf('*.') === 0) {
    str = str.substring(2)
  }

  const parts = str.split('.')
  const tld = parts[parts.length - 1]

  if (options.require_tld) {
    // disallow fqdns without tld
    if (parts.length < 2) {
      return false
    }

    if (
      !options.allow_numeric_tld &&
      !/^([a-z\u00A1-\u00A8\u00AA-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}|xn[a-z0-9-]{2,})$/i.test(
        tld
      )
    ) {
      return false
    }

    // disallow spaces
    if (/\s/.test(tld)) {
      return false
    }
  }

  // reject numeric TLDs
  if (!options.allow_numeric_tld && /^\d+$/.test(tld)) {
    return false
  }

  return parts.every((part) => {
    if (part.length > 63 && !options.ignore_max_length) {
      return false
    }

    if (!/^[a-z_\u00a1-\uffff0-9-]+$/i.test(part)) {
      return false
    }

    // disallow full-width chars
    if (/[\uff01-\uff5e]/.test(part)) {
      return false
    }

    // disallow parts starting or ending with hyphen
    if (/^-|-$/.test(part)) {
      return false
    }

    if (!options.allow_underscores && /_/.test(part)) {
      return false
    }

    return true
  })
}

export function isURL(
  url: string,
  options?: Partial<{
    protocols: string[]
    require_tld: boolean
    require_protocol: boolean
    require_host: boolean
    require_port: boolean
    disallow_auth: boolean
    require_valid_protocol: boolean
    allow_underscores: boolean
    allow_trailing_dot: boolean
    allow_protocol_relative_urls: boolean
    allow_fragments: boolean
    allow_query_components: boolean
    validate_length: boolean
    max_allowed_length: number
  }>
) {
  if (!url || /[\s<>]/.test(url)) {
    return false
  }
  if (url.indexOf('mailto:') === 0) {
    return false
  }

  const normalizedOptions = Object.assign(
    {
      protocols: ['http', 'https', 'ftp'],
      require_tld: true,
      require_protocol: false,
      require_host: true,
      require_port: false,
      require_valid_protocol: true,
      allow_underscores: false,
      allow_trailing_dot: false,
      allow_protocol_relative_urls: false,
      allow_fragments: true,
      allow_query_components: true,
      validate_length: true,
      max_allowed_length: 2084,
    },
    options
  )

  if (normalizedOptions.validate_length && url.length > normalizedOptions.max_allowed_length) {
    return false
  }

  if (!normalizedOptions.allow_fragments && url.includes('#')) {
    return false
  }

  if (!normalizedOptions.allow_query_components && (url.includes('?') || url.includes('&'))) {
    return false
  }

  let protocol: string | undefined
  let auth: string | undefined
  let host: string | undefined | null
  let hostname: string | undefined
  let port: number | undefined
  let portStr: string | undefined | null
  let ipv6: string | undefined | null

  let split = url.split('#')
  url = split.shift()!

  split = url.split('?')
  url = split.shift()!

  split = url.split('://')
  if (split.length > 1) {
    protocol = split.shift()!.toLowerCase()
    if (
      normalizedOptions.require_valid_protocol &&
      normalizedOptions.protocols.indexOf(protocol) === -1
    ) {
      return false
    }
  } else if (normalizedOptions.require_protocol) {
    return false
  } else if (url.slice(0, 2) === '//') {
    if (!normalizedOptions.allow_protocol_relative_urls) {
      return false
    }
    split[0] = url.slice(2)
  }
  url = split.join('://')

  if (url === '') {
    return false
  }

  split = url.split('/')
  url = split.shift()!

  if (url === '' && !normalizedOptions.require_host) {
    return true
  }

  split = url.split('@')
  if (split.length > 1) {
    if (normalizedOptions.disallow_auth) {
      return false
    }
    if (split[0] === '') {
      return false
    }
    auth = split.shift()!
    if (auth.indexOf(':') >= 0 && auth.split(':').length > 2) {
      return false
    }
    const [user, password] = auth.split(':')
    if (user === '' && password === '') {
      return false
    }
  }
  hostname = split.join('@')

  portStr = null
  ipv6 = null
  const ipv6Match = hostname.match(WRAPPED_IPV6)
  if (ipv6Match) {
    host = ''
    ipv6 = ipv6Match[1]
    portStr = ipv6Match[2] || null
  } else {
    split = hostname.split(':')
    host = split.shift()
    if (split.length) {
      portStr = split.join(':')
    }
  }

  if (portStr !== null && portStr.length > 0) {
    port = Number.parseInt(portStr, 10)
    if (!/^[0-9]+$/.test(portStr) || port <= 0 || port > 65535) {
      return false
    }
  } else if (normalizedOptions.require_port) {
    return false
  }

  if (host === '' && !normalizedOptions.require_host) {
    return true
  }

  if (!isIP(host!) && !isFQDN(host!, options) && (!ipv6 || !isIP(ipv6, 6))) {
    return false
  }

  host = host || ipv6
  return true
}

export function isEmail(
  str: string,
  options?: Partial<{
    allow_display_name: boolean
    allow_underscores: boolean
    require_display_name: boolean
    allow_utf8_local_part: boolean
    ignore_max_length: boolean
    require_tld: boolean
  }>
) {
  options = Object.assign(
    {
      allow_display_name: false,
      allow_underscores: false,
      require_display_name: false,
      allow_utf8_local_part: true,
      ignore_max_length: false,
      require_tld: true,
    },
    options
  )

  if (options.require_display_name || options.allow_display_name) {
    const displayEmail = str.match(splitNameAddress)
    if (displayEmail) {
      let displayName = displayEmail[1]

      // Remove display name and angle brackets to get email address
      // Can be done in the regex but will introduce a ReDOS (See  #1597 for more info)
      str = str.replace(displayName, '').replace(/(^<|>$)/g, '')

      // sometimes need to trim the last space to get the display name
      // because there may be a space between display name and email address
      // eg. myname <address@gmail.com>
      // the display name is `myname` instead of `myname `, so need to trim the last space
      if (displayName.endsWith(' ')) {
        displayName = displayName.slice(0, -1)
      }

      if (!validateDisplayName(displayName)) {
        return false
      }
    } else if (options.require_display_name) {
      return false
    }
  }

  if (!options.ignore_max_length && str.length > defaultMaxEmailLength) {
    return false
  }

  const parts = str.split('@')
  const domain = parts.pop()!

  let user = parts.join('@')

  if (
    !isFQDN(domain, {
      require_tld: options.require_tld,
      allow_underscores: options.allow_underscores,
    })
  ) {
    if (!isIP(domain)) {
      if (!domain.startsWith('[') || !domain.endsWith(']')) {
        return false
      }

      let noBracketdomain = domain.slice(1, -1)

      if (noBracketdomain.length === 0 || !isIP(noBracketdomain)) {
        return false
      }
    }
  }

  if (user[0] === '"' && user[user.length - 1] === '"') {
    user = user.slice(1, user.length - 1)
    return options.allow_utf8_local_part
      ? quotedEmailUserUtf8.test(user)
      : quotedEmailUser.test(user)
  }

  const pattern = options.allow_utf8_local_part ? emailUserUtf8Part : emailUserPart

  const userParts = user.split('.')
  for (const userPart of userParts) {
    if (!pattern.test(userPart)) {
      return false
    }
  }

  return true
}

export function isUUID(str: string) {
  return /^[0-9A-F]{8}-[0-9A-F]{4}-\d[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(str)
}
