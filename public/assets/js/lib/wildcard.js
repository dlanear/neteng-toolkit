import { isValidIPv4, isValidSubnetMask, ipToLong, longToIp } from './ipv4.js';

export function maskToWildcard(mask) {
  if (!isValidIPv4(mask)) throw new Error('Invalid subnet mask.');
  const long = ipToLong(mask);
  return longToIp((~long) >>> 0);
}

export function wildcardToMask(wildcard) {
  if (!isValidIPv4(wildcard)) throw new Error('Invalid wildcard mask.');
  const long = ipToLong(wildcard);
  return longToIp((~long) >>> 0);
}

export { isValidSubnetMask };
