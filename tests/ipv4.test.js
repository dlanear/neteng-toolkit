import assert from 'node:assert/strict';
import { isValidIPv4, ipToLong, longToIp, maskToCidr, cidrToMask, parseIpAndPrefix } from '../public/assets/js/lib/ipv4.js';

test('isValidIPv4 accepts valid addresses', () => {
  assert.equal(isValidIPv4('192.168.1.1'), true);
  assert.equal(isValidIPv4('0.0.0.0'), true);
  assert.equal(isValidIPv4('255.255.255.255'), true);
});

test('isValidIPv4 rejects invalid addresses', () => {
  assert.equal(isValidIPv4('999.999.1.1'), false);
  assert.equal(isValidIPv4('192.168.1'), false);
  assert.equal(isValidIPv4('192.168.1.1.1'), false);
  assert.equal(isValidIPv4('192.168.01.1'), false); // leading zero
  assert.equal(isValidIPv4('abc.def.1.1'), false);
});

test('ipToLong / longToIp round-trip', () => {
  assert.equal(longToIp(ipToLong('192.168.1.10')), '192.168.1.10');
  assert.equal(longToIp(ipToLong('0.0.0.0')), '0.0.0.0');
  assert.equal(longToIp(ipToLong('255.255.255.255')), '255.255.255.255');
});

test('maskToCidr converts valid contiguous masks', () => {
  assert.equal(maskToCidr('255.255.255.0'), 24);
  assert.equal(maskToCidr('255.255.255.255'), 32);
  assert.equal(maskToCidr('0.0.0.0'), 0);
  assert.equal(maskToCidr('255.255.255.252'), 30);
});

test('maskToCidr rejects non-contiguous masks', () => {
  assert.equal(maskToCidr('255.0.255.0'), null);
});

test('cidrToMask converts prefix to dotted mask', () => {
  assert.equal(cidrToMask(24), '255.255.255.0');
  assert.equal(cidrToMask(30), '255.255.255.252');
  assert.equal(cidrToMask(0), '0.0.0.0');
  assert.equal(cidrToMask(32), '255.255.255.255');
});

test('parseIpAndPrefix handles inline CIDR', () => {
  const { ip, prefix } = parseIpAndPrefix('192.168.1.1/24');
  assert.equal(ip, '192.168.1.1');
  assert.equal(prefix, 24);
});

test('parseIpAndPrefix handles separate mask input', () => {
  const { ip, prefix } = parseIpAndPrefix('192.168.1.1', '255.255.255.0');
  assert.equal(ip, '192.168.1.1');
  assert.equal(prefix, 24);
});

test('parseIpAndPrefix rejects invalid CIDR prefix', () => {
  assert.throws(() => parseIpAndPrefix('192.168.1.1/99'), /between 0 and 32/);
});

test('parseIpAndPrefix rejects invalid IP', () => {
  assert.throws(() => parseIpAndPrefix('999.999.1.1/24'), /Invalid IPv4/);
});
