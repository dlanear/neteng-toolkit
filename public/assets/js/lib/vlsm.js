import { ipToLong, longToIp, cidrToMaskLong, cidrToMask, parseIpAndPrefix } from './ipv4.js';
import { maskToWildcard } from './wildcard.js';

// Smallest CIDR prefix that provides at least `hosts` usable addresses.
function prefixForHosts(hosts) {
  if (hosts <= 0) throw new Error('Required hosts must be greater than 0.');
  // Find smallest block (largest prefix) with usable >= hosts.
  for (let prefix = 32; prefix >= 0; prefix--) {
    const total = Math.pow(2, 32 - prefix);
    const usable = prefix === 32 ? 1 : prefix === 31 ? 2 : total - 2;
    if (usable >= hosts) return prefix;
  }
  throw new Error('Requested host count is too large.');
}

// requirements: [{ name, hosts }]
// baseNetworkInput: "192.168.10.0/24"
export function calculateVLSM(baseNetworkInput, requirements) {
  const { ip: baseIp, prefix: basePrefix } = parseIpAndPrefix(baseNetworkInput);
  const baseNetworkLong = (ipToLong(baseIp) & cidrToMaskLong(basePrefix)) >>> 0;
  const baseTotal = Math.pow(2, 32 - basePrefix);
  const baseStart = baseNetworkLong;
  const baseEnd = baseNetworkLong + baseTotal - 1;

  if (!requirements || requirements.length === 0) {
    throw new Error('At least one subnet requirement is required.');
  }

  // Sort largest host requirement first — standard VLSM allocation order.
  const sorted = [...requirements]
    .map((r, idx) => ({ ...r, originalIndex: idx }))
    .sort((a, b) => b.hosts - a.hosts);

  let cursor = baseStart;
  const allocations = [];

  for (const req of sorted) {
    const prefix = prefixForHosts(req.hosts);
    const blockSize = Math.pow(2, 32 - prefix);

    // Align cursor to the next boundary for this block size.
    const remainder = cursor % blockSize;
    const alignedStart = remainder === 0 ? cursor : cursor + (blockSize - remainder);
    const networkLong = alignedStart;
    const broadcastLong = networkLong + blockSize - 1;

    if (broadcastLong > baseEnd) {
      return {
        success: false,
        error: 'The requested subnets cannot fit inside the specified network.',
        allocations: [],
      };
    }

    const usable = prefix === 32 ? 1 : prefix === 31 ? 2 : blockSize - 2;
    const firstHost = prefix >= 31 ? networkLong : networkLong + 1;
    const lastHost = prefix >= 31 ? broadcastLong : broadcastLong - 1;

    allocations.push({
      originalIndex: req.originalIndex,
      name: req.name,
      requiredHosts: req.hosts,
      allocatedHosts: usable,
      cidr: prefix,
      subnetMask: cidrToMask(prefix),
      wildcardMask: maskToWildcard(cidrToMask(prefix)),
      network: longToIp(networkLong),
      firstHost: longToIp(firstHost),
      lastHost: longToIp(lastHost),
      broadcast: longToIp(broadcastLong),
      networkLong,
      broadcastLong,
    });

    cursor = broadcastLong + 1;
  }

  // Restore caller's original order for display, and compute remaining space.
  allocations.sort((a, b) => a.originalIndex - b.originalIndex);
  const usedEnd = Math.max(...allocations.map((a) => a.broadcastLong));
  const remainingAddresses = baseEnd - usedEnd;

  return {
    success: true,
    baseNetwork: `${baseIp}/${basePrefix}`,
    allocations,
    remainingAddresses: remainingAddresses < 0 ? 0 : remainingAddresses,
  };
}
