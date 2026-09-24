// ipv4.js — core IPv4 parsing, validation, and conversion utilities.
// Pure functions, no DOM/Node dependencies, safe to run in browser or Node (ESM).

export function isValidOctet(str) {
  if (!/^\d{1,3}$/.test(str)) return false;
  const n = Number(str);
  if (n < 0 || n > 255) return false;
  // reject leading zeros like "01" (ambiguous / non-canonical), but allow "0"
  if (str.length > 1 && str[0] === '0') return false;
  return true;
}

export function isValidIPv4(ip) {
  if (typeof ip !== 'string') return false;
  const parts = ip.trim().split('.');
  if (parts.length !== 4) return false;
  return parts.every(isValidOctet);
}

export function ipToLong(ip) {
  if (!isValidIPv4(ip)) throw new Error(`Invalid IPv4 address: ${ip}`);
  return ip
    .trim()
    .split('.')
    .reduce((acc, octet) => (acc << 8) + Number(octet), 0) >>> 0;
}

export function longToIp(long) {
  const n = long >>> 0;
  return [
    (n >>> 24) & 255,
    (n >>> 16) & 255,
    (n >>> 8) & 255,
    n & 255,
  ].join('.');
}

export function isValidCidrPrefix(prefix) {
  const n = Number(prefix);
  return Number.isInteger(n) && n >= 0 && n <= 32;
}

export function cidrToMaskLong(prefix) {
  if (!isValidCidrPrefix(prefix)) throw new Error(`CIDR prefix must be between 0 and 32.`);
  const p = Number(prefix);
  return p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0;
}

export function cidrToMask(prefix) {
  return longToIp(cidrToMaskLong(prefix));
}

// Returns the CIDR prefix length for a dotted-decimal subnet mask, or null if
// the mask is not a valid contiguous subnet mask (e.g. 255.0.255.0).
export function maskToCidr(mask) {
  if (!isValidIPv4(mask)) return null;
  const long = ipToLong(mask);
  // A valid mask, in binary, is a run of 1s followed by a run of 0s.
  const inverted = (~long) >>> 0;
  // inverted + 1 must be a power of two (or inverted === 0 for /32, or long === 0 for /0)
  if (long === 0) return 0;
  if (inverted === 0xffffffff) return 0;
  const isPowerOfTwo = (inverted & (inverted + 1)) === 0;
  if (!isPowerOfTwo) return null;
  let ones = 0;
  let l = long;
  for (let i = 0; i < 32; i++) {
    if ((l & 0x80000000) !== 0) ones++;
    else break;
    l = (l << 1) >>> 0;
  }
  // Verify contiguity fully (no 0 followed by 1)
  const rebuilt = cidrToMaskLong(ones);
  return rebuilt === long ? ones : null;
}

export function isValidSubnetMask(mask) {
  return maskToCidr(mask) !== null;
}

// Accepts "192.168.1.10/24" or "192.168.1.10" + separate mask/cidr.
// Returns { ip, prefix } or throws.
export function parseIpAndPrefix(input, maskOrCidr) {
  let ip = input.trim();
  let prefixSource = maskOrCidr;

  if (ip.includes('/')) {
    const [ipPart, prefixPart] = ip.split('/');
    ip = ipPart.trim();
    prefixSource = prefixPart.trim();
  }

  if (!isValidIPv4(ip)) {
    throw new Error('Invalid IPv4 address.');
  }

  if (prefixSource === undefined || prefixSource === null || prefixSource === '') {
    throw new Error('A subnet mask or CIDR prefix is required.');
  }

  const trimmedPrefix = String(prefixSource).trim();
  let prefix;

  if (/^\d{1,2}$/.test(trimmedPrefix)) {
    if (!isValidCidrPrefix(trimmedPrefix)) {
      throw new Error('CIDR prefix must be between 0 and 32.');
    }
    prefix = Number(trimmedPrefix);
  } else if (isValidIPv4(trimmedPrefix)) {
    const cidr = maskToCidr(trimmedPrefix);
    if (cidr === null) {
      throw new Error('Invalid subnet mask (not a contiguous mask).');
    }
    prefix = cidr;
  } else {
    throw new Error('Invalid subnet mask or CIDR prefix.');
  }

  return { ip, prefix };
}

export const CLASSFUL_RANGES = [
  { class: 'A', start: 0, end: 127 },
  { class: 'B', start: 128, end: 191 },
  { class: 'C', start: 192, end: 223 },
  { class: 'D (Multicast)', start: 224, end: 239 },
  { class: 'E (Reserved)', start: 240, end: 255 },
];

export function classfulType(ip) {
  const firstOctet = Number(ip.split('.')[0]);
  const match = CLASSFUL_RANGES.find((r) => firstOctet >= r.start && firstOctet <= r.end);
  return match ? match.class : 'Unknown';
}
