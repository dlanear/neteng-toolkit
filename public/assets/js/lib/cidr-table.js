import { cidrToMask } from './ipv4.js';

// Builds the standard CIDR reference table (/0 through /32).
export function buildCidrTable() {
  const rows = [];
  for (let prefix = 0; prefix <= 32; prefix++) {
    const total = Math.pow(2, 32 - prefix);
    let usable;
    if (prefix === 32) usable = 1;
    else if (prefix === 31) usable = 2;
    else usable = total - 2;
    rows.push({
      cidr: `/${prefix}`,
      mask: cidrToMask(prefix),
      totalAddresses: total,
      usableHosts: usable,
    });
  }
  return rows;
}
