/*
 * @poppinss/validator-lite
 *
 * (c) Poppinss
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import { test } from '@japa/runner'
import { isFQDN, isEmail, isURL, isIP, isUUID } from '../src/validator.js'

test.group('Validator', () => {
  test('Validate "{email}" address')
    .with([
      { email: 'foo@bar.com', isValid: true },
      { email: 'x@x.au', isValid: true },
      { email: 'foo@bar.com.au', isValid: true },
      { email: 'foo+bar@bar.com', isValid: true },
      { email: 'hans.m端ller@test.com', isValid: true },
      { email: 'hans@m端ller.com', isValid: true },
      { email: 'test|123@m端ller.com', isValid: true },
      { email: 'test123+ext@gmail.com', isValid: true },
      { email: 'some.name.midd.leNa.me.and.locality+extension@GoogleMail.com', isValid: true },
      { email: '"foobar"@example.com', isValid: true },
      { email: '"  foo  m端ller "@example.com', isValid: true },
      { email: '"foo\\@bar"@example.com', isValid: true },
      { email: `${'a'.repeat(64)}@${'a'.repeat(63)}.com`, isValid: true },
      { email: `${'a'.repeat(64)}@${'a'.repeat(63)}.com`, isValid: true },
      { email: `${'a'.repeat(31)}@gmail.com`, isValid: true },
      { email: 'test@gmail.com', isValid: true },
      { email: 'test.1@gmail.com', isValid: true },
      { email: 'test@1337.com', isValid: true },
      { email: 'invalidemail@', isValid: false },
      { email: 'invalid.com', isValid: false },
      { email: '@invalid.com', isValid: false },
      { email: 'foo@bar.com.', isValid: false },
      { email: 'foo@_bar.com', isValid: false },
      { email: 'somename@ｇｍａｉｌ.com', isValid: false },
      { email: 'foo@bar.co.uk.', isValid: false },
      { email: 'z@co.c', isValid: false },
      { email: `${'a'.repeat(64)}@${'a'.repeat(251)}.com`, isValid: false },
      { email: `${'a'.repeat(65)}@${'a'.repeat(250)}.com`, isValid: false },
      { email: `${'a'.repeat(64)}@${'a'.repeat(64)}.com`, isValid: false },
      {
        email: `${'a'.repeat(64)}@${'a'.repeat(63)}.${'a'.repeat(63)}.${'a'.repeat(63)}.${'a'.repeat(58)},com`,
        isValid: false,
      },
      { email: 'test1@invalid.co m', isValid: false },
      { email: 'test2@invalid.co m', isValid: false },
      { email: 'test3@invalid.co m', isValid: false },
      { email: 'test4@invalid.co m', isValid: false },
      { email: 'test5@invalid.co m', isValid: false },
      { email: 'test6@invalid.co m', isValid: false },
      { email: 'test7@invalid.co m', isValid: false },
      { email: 'test8@invalid.co m', isValid: false },
      { email: 'test9@invalid.co m', isValid: false },
      { email: 'test10@invalid.co m', isValid: false },
      { email: 'test11@invalid.co m', isValid: false },
      { email: 'test12@invalid.co　m', isValid: false },
      { email: 'test13@invalid.co　m', isValid: false },
      { email: 'multiple..dots@stillinvalid.com', isValid: false },
      { email: 'test123+invalid! sub_address@gmail.com', isValid: false },
      { email: 'gmail...ignores...dots...@gmail.com', isValid: false },
      { email: 'ends.with.dot.@gmail.com', isValid: false },
      { email: 'multiple..dots@gmail.com', isValid: false },
      { email: 'wrong()[]",:;<>@@gmail.com', isValid: false },
      { email: '"wrong()[]",:;<>@@gmail.com', isValid: false },
      { email: 'username@domain.com�', isValid: false },
      { email: 'username@domain.com©', isValid: false },
      { email: 'nbsp test@test.com', isValid: false },
      { email: 'nbsp_test@te st.com', isValid: false },
      { email: 'nbsp_test@test.co m', isValid: false },
      { email: '"foobar@gmail.com', isValid: false },
      { email: '"foo"bar@gmail.com', isValid: false },
      { email: 'foo"bar"@gmail.com', isValid: false },
    ])
    .run(({ assert }, { email, isValid }) => {
      assert.equal(isEmail(email), isValid)
    })

  test('Validate "{email}" address with underscores in the domain').run(({ assert }) => {
    assert.isTrue(
      isEmail('foobar@my_sarisari_store.typepad.com', {
        allow_underscores: true,
      })
    )
  })

  test('Validate "{email}" address without UTF8 characters in local part')
    .with([
      { email: 'foo@bar.com', isValid: true },
      { email: 'x@x.au', isValid: true },
      { email: 'foo@bar.com.au', isValid: true },
      { email: 'foo+bar@bar.com', isValid: true },
      { email: 'hans@m端ller.com', isValid: true },
      { email: 'test|123@m端ller.com', isValid: true },
      { email: 'test123+ext@gmail.com', isValid: true },
      { email: 'some.name.midd.leNa.me+extension@GoogleMail.com', isValid: true },
      { email: '"foobar"@example.com', isValid: true },
      { email: '"foo\\@bar"@example.com', isValid: true },
      { email: '"  foo  bar  "@example.com', isValid: true },
      { email: 'invalidemail@', isValid: false },
      { email: 'invalid.com', isValid: false },
      { email: '@invalid.com', isValid: false },
      { email: 'foo@bar.com.', isValid: false },
      { email: 'foo@bar.co.uk.', isValid: false },
      { email: 'somename@ｇｍａｉｌ.com', isValid: false },
      { email: 'hans.m端ller@test.com', isValid: false },
      { email: 'z@co.c', isValid: false },
      { email: 'tüst@invalid.com', isValid: false },
      { email: 'nbsp test@test.com', isValid: false },
    ])
    .run(({ assert }, { email, isValid }) => {
      assert.equal(
        isEmail(email, {
          allow_utf8_local_part: false,
        }),
        isValid
      )
    })

  test('Validate "{email}" address with display names')
    .with([
      { email: 'foo@bar.com', isValid: true },
      { email: 'x@x.au', isValid: true },
      { email: 'foo@bar.com.au', isValid: true },
      { email: 'foo+bar@bar.com', isValid: true },
      { email: 'hans.m端ller@test.com', isValid: true },
      { email: 'hans@m端ller.com', isValid: true },
      { email: 'test|123@m端ller.com', isValid: true },
      { email: 'test123+ext@gmail.com', isValid: true },
      { email: 'some.name.midd.leNa.me+extension@GoogleMail.com', isValid: true },
      { email: 'Some Name <foo@bar.com>', isValid: true },
      { email: 'Some Name <x@x.au>', isValid: true },
      { email: 'Some Name <foo@bar.com.au>', isValid: true },
      { email: 'Some Name <foo+bar@bar.com>', isValid: true },
      { email: 'Some Name <hans.m端ller@test.com>', isValid: true },
      { email: 'Some Name <hans@m端ller.com>', isValid: true },
      { email: 'Some Name <test|123@m端ller.com>', isValid: true },
      { email: 'Some Name <test123+ext@gmail.com>', isValid: true },
      { email: "'Foo Bar, Esq'<foo@bar.com>", isValid: true },
      { email: 'Some Name <some.name.midd.leNa.me+extension@GoogleMail.com>', isValid: true },
      {
        email: 'Some Middle Name <some.name.midd.leNa.me+extension@GoogleMail.com>',
        isValid: true,
      },
      { email: 'Name <some.name.midd.leNa.me+extension@GoogleMail.com>', isValid: true },
      { email: 'Name<some.name.midd.leNa.me+extension@GoogleMail.com>', isValid: true },
      { email: 'Some Name <foo@gmail.com>', isValid: true },
      { email: 'Name🍓With🍑Emoji🚴‍♀️🏆<test@aftership.com>', isValid: true },
      { email: '🍇🍗🍑<only_emoji@aftership.com>', isValid: true },
      { email: '"<displayNameInBrackets>"<jh@gmail.com>', isValid: true },
      { email: '"\\"quotes\\""<jh@gmail.com>', isValid: true },
      { email: '"name;"<jh@gmail.com>', isValid: true },
      { email: '"name;" <jh@gmail.com>', isValid: true },
      { email: 'invalidemail@', isValid: false },
      { email: 'invalid.com', isValid: false },
      { email: '@invalid.com', isValid: false },
      { email: 'foo@bar.com.', isValid: false },
      { email: 'foo@bar.co.uk.', isValid: false },
      { email: 'Some Name <invalidemail@>', isValid: false },
      { email: 'Some Name <invalid.com>', isValid: false },
      { email: 'Some Name <@invalid.com>', isValid: false },
      { email: 'Some Name <foo@bar.com.>', isValid: false },
      { email: 'Some Name <foo@bar.co.uk.>', isValid: false },
      { email: 'Some Name foo@bar.co.uk.>', isValid: false },
      { email: 'Some Name <foo@bar.co.uk.', isValid: false },
      { email: 'Some Name < foo@bar.co.uk >', isValid: false },
      { email: 'Name foo@bar.co.uk', isValid: false },
      { email: 'Some Name <some..name@gmail.com>', isValid: false },
      { email: 'Some Name<emoji_in_address🍈@aftership.com>', isValid: false },
      { email: 'invisibleCharacter\u001F<jh@gmail.com>', isValid: false },
      { email: '<displayNameInBrackets><jh@gmail.com>', isValid: false },
      { email: '\\"quotes\\"<jh@gmail.com>', isValid: false },
      { email: '""quotes""<jh@gmail.com>', isValid: false },
      { email: 'name;<jh@gmail.com>', isValid: false },
      { email: '    <jh@gmail.com>', isValid: false },
      { email: '"    "<jh@gmail.com>', isValid: false },
    ])
    .run(({ assert }, { email, isValid }) => {
      assert.equal(
        isEmail(email, {
          allow_display_name: true,
        }),
        isValid
      )
    })

  test('Validate "{email}" address with required display names')
    .with([
      { email: 'Some Name <foo@bar.com>', isValid: true },
      { email: 'Some Name <x@x.au>', isValid: true },
      { email: 'Some Name <foo@bar.com.au>', isValid: true },
      { email: 'Some Name <foo+bar@bar.com>', isValid: true },
      { email: 'Some Name <hans.m端ller@test.com>', isValid: true },
      { email: 'Some Name <hans@m端ller.com>', isValid: true },
      { email: 'Some Name <test|123@m端ller.com>', isValid: true },
      { email: 'Some Name <test123+ext@gmail.com>', isValid: true },
      { email: 'Some Name <some.name.midd.leNa.me+extension@GoogleMail.com>', isValid: true },
      {
        email: 'Some Middle Name <some.name.midd.leNa.me+extension@GoogleMail.com>',
        isValid: true,
      },
      { email: 'Name <some.name.midd.leNa.me+extension@GoogleMail.com>', isValid: true },
      { email: 'Name<some.name.midd.leNa.me+extension@GoogleMail.com>', isValid: true },
      { email: 'some.name.midd.leNa.me+extension@GoogleMail.com', isValid: false },
      { email: 'foo@bar.com', isValid: false },
      { email: 'x@x.au', isValid: false },
      { email: 'foo@bar.com.au', isValid: false },
      { email: 'foo+bar@bar.com', isValid: false },
      { email: 'hans.m端ller@test.com', isValid: false },
      { email: 'hans@m端ller.com', isValid: false },
      { email: 'test|123@m端ller.com', isValid: false },
      { email: 'test123+ext@gmail.com', isValid: false },
      { email: 'invalidemail@', isValid: false },
      { email: 'invalid.com', isValid: false },
      { email: '@invalid.com', isValid: false },
      { email: 'foo@bar.com.', isValid: false },
      { email: 'foo@bar.co.uk.', isValid: false },
      { email: 'Some Name <invalidemail@>', isValid: false },
      { email: 'Some Name <invalid.com>', isValid: false },
      { email: 'Some Name <@invalid.com>', isValid: false },
      { email: 'Some Name <foo@bar.com.>', isValid: false },
      { email: 'Some Name <foo@bar.co.uk.>', isValid: false },
      { email: 'Some Name foo@bar.co.uk.>', isValid: false },
      { email: 'Some Name <foo@bar.co.uk.', isValid: false },
      { email: 'Some Name < foo@bar.co.uk >', isValid: false },
      { email: 'Name foo@bar.co.uk', isValid: false },
    ])
    .run(({ assert }, { email, isValid }) => {
      assert.equal(
        isEmail(email, {
          require_display_name: true,
        }),
        isValid
      )
    })

  test('Validate "{URL}"')
    .with([
      { URL: 'foobar.com', isValid: true },
      { URL: 'www.foobar.com', isValid: true },
      { URL: 'foobar.com/', isValid: true },
      { URL: 'valid.au', isValid: true },
      { URL: 'http://www.foobar.com/', isValid: true },
      { URL: 'HTTP://WWW.FOOBAR.COM/', isValid: true },
      { URL: 'https://www.foobar.com/', isValid: true },
      { URL: 'HTTPS://WWW.FOOBAR.COM/', isValid: true },
      { URL: 'http://www.foobar.com:23/', isValid: true },
      { URL: 'http://www.foobar.com:65535/', isValid: true },
      { URL: 'http://www.foobar.com:5/', isValid: true },
      { URL: 'https://www.foobar.com/', isValid: true },
      { URL: 'ftp://www.foobar.com/', isValid: true },
      { URL: 'http://www.foobar.com/~foobar', isValid: true },
      { URL: 'http://user:pass@www.foobar.com/', isValid: true },
      { URL: 'http://user:@www.foobar.com/', isValid: true },
      { URL: 'http://:pass@www.foobar.com/', isValid: true },
      { URL: 'http://user@www.foobar.com', isValid: true },
      { URL: 'http://127.0.0.1/', isValid: true },
      { URL: 'http://10.0.0.0/', isValid: true },
      { URL: 'http://189.123.14.13/', isValid: true },
      { URL: 'http://duckduckgo.com/?q=%2F', isValid: true },
      { URL: "http://foobar.com/t$-_.+!*'(),", isValid: true },
      { URL: 'http://foobar.com/?foo=bar#baz=qux', isValid: true },
      { URL: 'http://foobar.com?foo=bar', isValid: true },
      { URL: 'http://foobar.com#baz=qux', isValid: true },
      { URL: 'http://www.xn--froschgrn-x9a.net/', isValid: true },
      { URL: 'http://xn--froschgrn-x9a.com/', isValid: true },
      { URL: 'http://foo--bar.com', isValid: true },
      { URL: 'http://høyfjellet.no', isValid: true },
      { URL: 'http://xn--j1aac5a4g.xn--j1amh', isValid: true },
      { URL: 'http://xn------eddceddeftq7bvv7c4ke4c.xn--p1ai', isValid: true },
      { URL: 'http://кулік.укр', isValid: true },
      { URL: 'test.com?ref=http://test2.com', isValid: true },
      { URL: 'http://[FEDC:BA98:7654:3210:FEDC:BA98:7654:3210]:80/index.html', isValid: true },
      { URL: 'http://[1080:0:0:0:8:800:200C:417A]/index.html', isValid: true },
      { URL: 'http://[3ffe:2a00:100:7031::1]', isValid: true },
      { URL: 'http://[1080::8:800:200C:417A]/foo', isValid: true },
      { URL: 'http://[::192.9.5.5]/ipng', isValid: true },
      { URL: 'http://[::FFFF:129.144.52.38]:80/index.html', isValid: true },
      { URL: 'http://[2010:836B:4179::836B:4179]', isValid: true },
      { URL: 'http://example.com/example.json#/foo/bar', isValid: true },
      { URL: 'http://1337.com', isValid: true },
      { URL: 'http://localhost:3000/', isValid: false },
      { URL: '//foobar.com', isValid: false },
      { URL: 'xyz://foobar.com', isValid: false },
      { URL: 'invalid/', isValid: false },
      { URL: 'invalid.x', isValid: false },
      { URL: 'invalid.', isValid: false },
      { URL: '.com', isValid: false },
      { URL: 'http://com/', isValid: false },
      { URL: 'http://300.0.0.1/', isValid: false },
      { URL: 'mailto:foo@bar.com', isValid: false },
      { URL: 'rtmp://foobar.com', isValid: false },
      { URL: 'http://www.xn--.com/', isValid: false },
      { URL: 'http://xn--.com/', isValid: false },
      { URL: 'http://www.foobar.com:0/', isValid: false },
      { URL: 'http://www.foobar.com:70000/', isValid: false },
      { URL: 'http://www.foobar.com:99999/', isValid: false },
      { URL: 'http://www.-foobar.com/', isValid: false },
      { URL: 'http://www.foobar-.com/', isValid: false },
      { URL: 'http://foobar/# lol', isValid: false },
      { URL: 'http://foobar/? lol', isValid: false },
      { URL: 'http://foobar/ lol/', isValid: false },
      { URL: 'http://lol @foobar.com/', isValid: false },
      { URL: 'http://lol:lol @foobar.com/', isValid: false },
      { URL: 'http://lol:lol:lol@foobar.com/', isValid: false },
      { URL: 'http://lol: @foobar.com/', isValid: false },
      { URL: 'http://www.foo_bar.com/', isValid: false },
      { URL: 'http://www.foobar.com/\t', isValid: false },
      { URL: 'http://@foobar.com', isValid: false },
      { URL: 'http://:@foobar.com', isValid: false },
      { URL: 'http://\n@www.foobar.com/', isValid: false },
      { URL: '', isValid: false },
      { URL: `http://foobar.com/${new Array(2083).join('f')}`, isValid: false },
      { URL: 'http://*.foo.com', isValid: false },
      { URL: '*.foo.com', isValid: false },
      { URL: '!.foo.com', isValid: false },
      { URL: 'http://example.com.', isValid: false },
      { URL: 'http://localhost:61500this is an invalid url!!!!', isValid: false },
      { URL: '////foobar.com', isValid: false },
      { URL: 'http:////foobar.com', isValid: false },
      { URL: "https://example.com/foo/<script>alert('XSS')</script>/", isValid: false },
    ])
    .run(({ assert }, { URL, isValid }) => {
      assert.equal(isURL(URL), isValid)
    })

  test('Validate "{URL}" with custom protocols')
    .with([
      { URL: 'rtmp://foobar.com', isValid: true },
      { URL: 'http://foobar.com', isValid: false },
    ])
    .run(({ assert }, { URL, isValid }) => {
      assert.equal(isURL(URL, { protocols: ['rtmp'] }), isValid)
    })

  test('Validate "{URL}" as file URL without a host')
    .with([
      { URL: 'file://localhost/foo.txt', isValid: true },
      { URL: 'file:///foo.txt', isValid: true },
      { URL: 'file:///', isValid: true },
      { URL: 'http://foobar.com', isValid: false },
      { URL: 'file://', isValid: false },
    ])
    .run(({ assert }, { URL, isValid }) => {
      assert.equal(
        isURL(URL, { protocols: ['file'], require_host: false, require_tld: false }),
        isValid
      )
    })

  test('Validate "{URL}" postgres URLs without a host')
    .with([
      { URL: 'postgres://user:pw@/test', isValid: true },
      { URL: 'http://foobar.com', isValid: false },
      { URL: 'postgres://', isValid: false },
    ])
    .run(({ assert }, { URL, isValid }) => {
      assert.equal(isURL(URL, { protocols: ['postgres'], require_host: false }), isValid)
    })

  test('Validate FQDN ("{address}")')
    .with([
      { address: 'domain.com', isValid: true },
      { address: 'dom.plato', isValid: true },
      { address: 'a.domain.co', isValid: true },
      { address: 'foo--bar.com', isValid: true },
      { address: 'xn--froschgrn-x9a.com', isValid: true },
      { address: 'rebecca.blackfriday', isValid: true },
      { address: '1337.com', isValid: true },
      { address: 'abc', isValid: false },
      { address: '256.0.0.0', isValid: false },
      { address: '_.com', isValid: false },
      { address: '*.some.com', isValid: false },
      { address: 's!ome.com', isValid: false },
      { address: 'domain.com/', isValid: false },
      { address: '/more.com', isValid: false },
      { address: 'domain.com�', isValid: false },
      { address: 'domain.co\u00A0m', isValid: false },
      { address: 'domain.co\u1680m', isValid: false },
      { address: 'domain.co\u2006m', isValid: false },
      { address: 'domain.co\u2028m', isValid: false },
      { address: 'domain.co\u2029m', isValid: false },
      { address: 'domain.co\u202Fm', isValid: false },
      { address: 'domain.co\u205Fm', isValid: false },
      { address: 'domain.co\u3000m', isValid: false },
      { address: 'domain.com\uDC00', isValid: false },
      { address: 'domain.co\uEFFFm', isValid: false },
      { address: 'domain.co\uFDDAm', isValid: false },
      { address: 'domain.co\uFFF4m', isValid: false },
      { address: 'domain.com©', isValid: false },
      { address: 'example.0', isValid: false },
      { address: '192.168.0.9999', isValid: false },
      { address: '192.168.0', isValid: false },
    ])
    .run(({ assert }, { address, isValid }) => {
      assert.equal(isFQDN(address), isValid)
    })

  test('Validate FQDN with trailing dot option ("{address}")')
    .with([{ address: 'example.com.', isValid: true }])
    .run(({ assert }, { address, isValid }) => {
      assert.equal(isFQDN(address, { allow_trailing_dot: true }), isValid)
    })

  test('Validate FQDN when not require_tld ("{address}")')
    .with([
      { address: 'example.0', isValid: false },
      { address: '192.168.0', isValid: false },
      { address: '192.168.0.9999', isValid: false },
    ])
    .run(({ assert }, { address, isValid }) => {
      assert.equal(isFQDN(address, { require_tld: false }), isValid)
    })

  test('Validate FQDN when not require_tld but allow_numeric_tld ("{address}")')
    .with([
      { address: 'example.0', isValid: true },
      { address: '192.168.0', isValid: true },
      { address: '192.168.0.9999', isValid: true },
    ])
    .run(({ assert }, { address, isValid }) => {
      assert.equal(isFQDN(address, { require_tld: false, allow_numeric_tld: true }), isValid)
    })

  test('Validate FQDN with wildcard option ("{address}")')
    .with([
      { address: '*.example.com', isValid: true },
      { address: '*.shop.example.com', isValid: true },
    ])
    .run(({ assert }, { address, isValid }) => {
      assert.equal(isFQDN(address, { allow_wildcard: true }), isValid)
    })

  test('Validate IP address ("{address}")')
    .with([
      { address: '127.0.0.1', isValid: true },
      { address: '0.0.0.0', isValid: true },
      { address: '255.255.255.255', isValid: true },
      { address: '1.2.3.4', isValid: true },
      { address: '::1', isValid: true },
      { address: '2001:db8:0000:1:1:1:1:1', isValid: true },
      { address: '2001:db8:3:4::192.0.2.33', isValid: true },
      { address: '2001:41d0:2:a141::1', isValid: true },
      { address: '::ffff:127.0.0.1', isValid: true },
      { address: '::0000', isValid: true },
      { address: '0000::', isValid: true },
      { address: '1::', isValid: true },
      { address: '1111:1:1:1:1:1:1:1', isValid: true },
      { address: 'fe80::a6db:30ff:fe98:e946', isValid: true },
      { address: '::', isValid: true },
      { address: '::8', isValid: true },
      { address: '::ffff:127.0.0.1', isValid: true },
      { address: '::ffff:255.255.255.255', isValid: true },
      { address: '::ffff:0:255.255.255.255', isValid: true },
      { address: '::2:3:4:5:6:7:8', isValid: true },
      { address: '::255.255.255.255', isValid: true },
      { address: '0:0:0:0:0:ffff:127.0.0.1', isValid: true },
      { address: '1:2:3:4:5:6:7::', isValid: true },
      { address: '1:2:3:4:5:6::8', isValid: true },
      { address: '1::7:8', isValid: true },
      { address: '1:2:3:4:5::7:8', isValid: true },
      { address: '1:2:3:4:5::8', isValid: true },
      { address: '1::6:7:8', isValid: true },
      { address: '1:2:3:4::6:7:8', isValid: true },
      { address: '1:2:3:4::8', isValid: true },
      { address: '1::5:6:7:8', isValid: true },
      { address: '1:2:3::5:6:7:8', isValid: true },
      { address: '1:2:3::8', isValid: true },
      { address: '1::4:5:6:7:8', isValid: true },
      { address: '1:2::4:5:6:7:8', isValid: true },
      { address: '1:2::8', isValid: true },
      { address: '1::3:4:5:6:7:8', isValid: true },
      { address: '1::8', isValid: true },
      { address: 'fe80::7:8%eth0', isValid: true },
      { address: 'fe80::7:8%1', isValid: true },
      { address: '64:ff9b::192.0.2.33', isValid: true },
      { address: '0:0:0:0:0:0:10.0.0.1', isValid: true },
      { address: 'abc', isValid: false },
      { address: '256.0.0.0', isValid: false },
      { address: '0.0.0.256', isValid: false },
      { address: '26.0.0.256', isValid: false },
      { address: '0200.200.200.200', isValid: false },
      { address: '200.0200.200.200', isValid: false },
      { address: '200.200.0200.200', isValid: false },
      { address: '200.200.200.0200', isValid: false },
      { address: '::banana', isValid: false },
      { address: 'banana::', isValid: false },
      { address: '::1banana', isValid: false },
      { address: '::1::', isValid: false },
      { address: '1:', isValid: false },
      { address: ':1', isValid: false },
      { address: ':1:1:1::2', isValid: false },
      { address: '1:1:1:1:1:1:1:1:1:1:1:1:1:1:1:1', isValid: false },
      { address: '::11111', isValid: false },
      { address: '11111:1:1:1:1:1:1:1', isValid: false },
      { address: '2001:db8:0000:1:1:1:1::1', isValid: false },
      { address: '0:0:0:0:0:0:ffff:127.0.0.1', isValid: false },
      { address: '0:0:0:0:ffff:127.0.0.1', isValid: false },
    ])
    .run(({ assert }, { address, isValid }) => {
      assert.equal(isIP(address), isValid)
    })

  test('Validate IPv4 address ("{address}")')
    .with([
      { address: '127.0.0.1', isValid: true },
      { address: '0.0.0.0', isValid: true },
      { address: '255.255.255.255', isValid: true },
      { address: '1.2.3.4', isValid: true },
      { address: '255.0.0.1', isValid: true },
      { address: '0.0.1.1', isValid: true },
      { address: '::1', isValid: false },
      { address: '2001:db8:0000:1:1:1:1:1', isValid: false },
      { address: '::ffff:127.0.0.1', isValid: false },
      { address: '137.132.10.01', isValid: false },
      { address: '0.256.0.256', isValid: false },
      { address: '255.256.255.256', isValid: false },
    ])
    .run(({ assert }, { address, isValid }) => {
      assert.equal(isIP(address, 4), isValid)
    })

  test('Validate IPv6 address ("{address}")')
    .with([
      { address: '::1', isValid: true },
      { address: '2001:db8:0000:1:1:1:1:1', isValid: true },
      { address: '::ffff:127.0.0.1', isValid: true },
      { address: 'fe80::1234%1', isValid: true },
      { address: 'ff08::9abc%10', isValid: true },
      { address: 'ff08::9abc%interface10', isValid: true },
      { address: 'ff02::5678%pvc1.3', isValid: true },
      { address: '127.0.0.1', isValid: false },
      { address: '0.0.0.0', isValid: false },
      { address: '255.255.255.255', isValid: false },
      { address: '1.2.3.4', isValid: false },
      { address: '255.0.0.1', isValid: false },
      { address: '0.0.1.1', isValid: false },
    ])
    .run(({ assert }, { address, isValid }) => {
      assert.equal(isIP(address, 6), isValid)
    })

  test('Validate UUID ("{uuid}")')
    .with([
      { uuid: '7b90ac86-e184-11ef-9cd2-0242ac120002', isValid: true },
      { uuid: '47eb026e-809d-4a11-909e-9c7cdce5fb48', isValid: true },
      { uuid: '0194c789-ee48-776c-bc09-24dcb622446a', isValid: true },
      { uuid: 'f47ac10b-58cc-4372-a567-0e02b2xc3d479', isValid: false },
      { uuid: 'f47ac10b-58cc-4372-a567-0e02b2xc3d49', isValid: false },
    ])
    .run(({ assert }, { uuid, isValid }) => {
      assert.equal(isUUID(uuid), isValid)
    })
})
