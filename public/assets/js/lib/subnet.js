import { ipToLong, longToIp, cidrToMaskLong, cidrToMask, classfulType, parseIpAndPrefix } from './ipv4.js';
import { ipToBinary } from './binary.js';
import { maskToWildcard } from './wildcard.js';

// Calculates full subnet details for a given IP + CIDR prefix.
// Correctly handles /31 (RFC 3021 point-to-point, 2 usable addresses, no
// network/broadcast in the traditional sense) and /32 (single host route).
export function calculateSubnet(ip, prefix) {
  const maskLong = cidrToMaskLong(prefix);
  const ipLong = ipToLong(ip);
  const networkLong = (ipLong & maskLong) >>> 0;
  const broadcastLong = (networkLong | (~maskLong >>> 0)) >>> 0;
  const totalAddresses = Math.pow(2, 32 - prefix);

  let firstUsable, lastUsable, usableAddresses, note;

  if (prefix === 32) {
    firstUsable = networkLong;
    lastUsable = networkLong;
    usableAddresses = 1;
    note = 'A /32 identifies a single host. There is no separate network or broadcast address — the address itself is the only usable address (host route).';
  } else if (prefix === 31) {
    firstUsable = networkLong;
    lastUsable = broadcastLong;
    usableAddresses = 2;
    note = 'A /31 is a point-to-point link (RFC 3021). Both addresses in the range are usable host addresses — there is no dedicated network or broadcast address.';
  } else {
    firstUsable = networkLong + 1;
    lastUsable = broadcastLong - 1;
    usableAddresses = totalAddresses - 2;
    note = null;
  }

  return {
    ip,
    cidr: prefix,
    subnetMask: cidrToMask(prefix),
    networkAddress: longToIp(networkLong),
    broadcastAddress: longToIp(broadcastLong),
    firstUsable: longToIp(firstUsable),
    lastUsable: longToIp(lastUsable),
    totalAddresses,
    usableAddresses,
    addressClass: classfulType(ip),
    wildcardMask: maskToWildcard(cidrToMask(prefix)),
    binary: {
      ip: ipToBinary(ip),
      mask: ipToBinary(cidrToMask(prefix)),
      network: ipToBinary(longToIp(networkLong)),
      broadcast: ipToBinary(longToIp(broadcastLong)),
    },
    note,
    networkLong,
    broadcastLong,
  };
}

// Convenience: parses "ip/prefix" or ip + mask/cidr, then calculates.
export function calculateSubnetFromInput(ipInput, maskOrCidr) {
  const { ip, prefix } = parseIpAndPrefix(ipInput, maskOrCidr);
  return calculateSubnet(ip, prefix);
}
