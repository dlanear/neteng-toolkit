import { isValidIPv4 } from './ipv4.js';

export function octetToBinary(octet) {
  return Number(octet).toString(2).padStart(8, '0');
}

export function ipToBinaryOctets(ip) {
  if (!isValidIPv4(ip)) throw new Error('Invalid IPv4 address.');
  return ip.trim().split('.').map(octetToBinary);
}

export function ipToBinary(ip) {
  return ipToBinaryOctets(ip).join('.');
}

export function isValidBinaryIp(input) {
  const cleaned = input.trim();
  const parts = cleaned.split('.');
  if (parts.length !== 4) return false;
  return parts.every((p) => /^[01]{1,8}$/.test(p));
}

export function binaryToIp(input) {
  if (!isValidBinaryIp(input)) {
    throw new Error('Invalid binary IPv4 address. Expected four 8-bit groups, e.g. 11000000.10101000.00000001.00001010');
  }
  const octets = input.trim().split('.').map((p) => parseInt(p.padStart(8, '0'), 2));
  if (octets.some((o) => o > 255)) throw new Error('Each binary group must represent a value from 0-255.');
  return octets.join('.');
}
