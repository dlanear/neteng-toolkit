import { isValidIPv4, ipToLong, longToIp } from './ipv4.js';

// Standard range-to-CIDR-blocks algorithm: repeatedly find the largest
// aligned block starting at `start` that does not overshoot `end`.
function trailingZeroBits(x) {
  if (x === 0) return 32;
  let n = x >>> 0;
  let count = 0;
  while ((n & 1) === 0) {
    count++;
    n = n >>> 1;
  }
  return count;
}

export function rangeToCidrBlocks(startLong, endLong) {
  const blocks = [];
  let start = startLong;
  while (start <= endLong) {
    const maxSizeByAlignment = trailingZeroBits(start);
    // Largest block (as power-of-two bit count) that still fits within the remaining range.
    const remaining = endLong - start + 1;
    let maxSizeByRemaining = 0;
    while (Math.pow(2, maxSizeByRemaining + 1) <= remaining) maxSizeByRemaining++;

    const blockBits = Math.min(maxSizeByAlignment, maxSizeByRemaining);
    const prefix = 32 - blockBits;
    const size = Math.pow(2, blockBits);
    blocks.push({ network: longToIp(start), cidr: prefix, size });
    start += size;
    if (blocks.length > 4096) break; // safety cap; extremely fragmented ranges get summarized
  }
  return blocks;
}

export function calculateIpRange(startIp, endIp) {
  if (!isValidIPv4(startIp) || !isValidIPv4(endIp)) {
    throw new Error('Invalid IPv4 address.');
  }
  const startLong = ipToLong(startIp);
  const endLong = ipToLong(endIp);
  if (startLong > endLong) {
    throw new Error('Start IP must be less than or equal to End IP.');
  }
  const total = endLong - startLong + 1;
  const cidrBlocks = rangeToCidrBlocks(startLong, endLong);

  return {
    startIp,
    endIp,
    totalAddresses: total,
    cidrBlocks: cidrBlocks.map((b) => ({ ...b, notation: `${b.network}/${b.cidr}` })),
    truncated: cidrBlocks.length > 4096,
  };
}
