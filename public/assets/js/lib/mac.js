// MAC address normalization/validation + a small curated OUI reference
// database. This runs entirely in the browser — no MAC address is sent to
// any server. The database only covers common vendors; unmatched OUIs are
// clearly reported as "Manufacturer not found" rather than guessed.

export const OUI_DATABASE = {
  '00:00:0C': 'Cisco Systems',
  '00:1A:A0': 'Cisco Systems',
  '00:1B:D4': 'Cisco Systems',
  '00:50:56': 'VMware, Inc.',
  '00:0C:29': 'VMware, Inc.',
  '08:00:27': 'Oracle VirtualBox',
  '00:15:5D': 'Microsoft (Hyper-V)',
  '00:03:FF': 'Microsoft',
  '3C:5A:B4': 'Google, Inc.',
  '00:1A:11': 'Google, Inc.',
  'F4:F5:E8': 'Google, Inc.',
  '00:16:3E': 'Xen (Citrix)',
  'B8:27:EB': 'Raspberry Pi Foundation',
  'DC:A6:32': 'Raspberry Pi Trading Ltd',
  'E4:5F:01': 'Raspberry Pi Trading Ltd',
  '00:1C:B3': 'Apple, Inc.',
  '3C:15:C2': 'Apple, Inc.',
  '28:CF:E9': 'Apple, Inc.',
  'A4:83:E7': 'Apple, Inc.',
  'AC:87:A3': 'Apple, Inc.',
  'F0:18:98': 'Apple, Inc.',
  '00:1E:C2': 'Apple, Inc.',
  '3C:07:54': 'Samsung Electronics',
  '5C:0A:5B': 'Samsung Electronics',
  '8C:71:F8': 'Samsung Electronics',
  '00:26:37': 'Samsung Electronics',
  '00:15:99': 'Samsung Electronics',
  '00:0D:3A': 'Microsoft',
  '00:50:F2': 'Microsoft',
  '00:1D:D8': 'Microsoft',
  '00:1B:63': 'Apple, Inc.',
  '00:E0:4C': 'Realtek Semiconductor',
  '52:54:00': 'QEMU / KVM (virtual)',
  '00:0F:4B': 'Dell Inc.',
  '00:14:22': 'Dell Inc.',
  '18:03:73': 'Dell Inc.',
  'F8:B1:56': 'Dell Inc.',
  '00:1F:29': 'Hewlett Packard',
  '00:25:B3': 'Hewlett Packard Enterprise',
  '3C:D9:2B': 'Hewlett Packard Enterprise',
  '00:23:7D': 'Cisco-Linksys',
  '00:14:BF': 'Cisco-Linksys',
  '00:1D:7E': 'Cisco-Linksys',
  'C0:56:27': 'TP-Link Technologies',
  '50:C7:BF': 'TP-Link Technologies',
  '98:DA:C4': 'TP-Link Technologies',
  '14:CC:20': 'TP-Link Technologies',
  '00:1F:33': 'Netgear',
  '20:E5:2A': 'Netgear',
  'A0:04:60': 'Netgear',
  '00:18:39': 'Netgear',
  '00:24:B2': 'Ubiquiti Networks',
  '04:18:D6': 'Ubiquiti Networks',
  '78:8A:20': 'Ubiquiti Networks',
  'FC:EC:DA': 'Ubiquiti Networks',
  '00:26:B0': 'Ubiquiti Networks',
  '00:90:A9': 'Western Digital',
  '00:11:32': 'Synology Incorporated',
  '00:24:1D': 'ASUSTeK Computer',
  '1C:87:2C': 'ASUSTeK Computer',
  '2C:56:DC': 'ASUSTeK Computer',
  '00:1D:60': 'ASUSTeK Computer',
  '00:D0:C9': 'Intel Corporate',
  '3C:97:0E': 'Intel Corporate',
  '00:15:17': 'Intel Corporate',
  'A4:C3:F0': 'Intel Corporate',
  'FC:AA:14': 'Intel Corporate',
  '00:E0:B8': 'D-Link Corporation',
  '00:1B:11': 'D-Link Corporation',
  '00:26:5A': 'D-Link Corporation',
  '84:C9:B2': 'D-Link Corporation',
  'B0:C5:54': 'D-Link Corporation',
  '00:04:96': 'Extreme Networks',
  '00:23:04': 'Juniper Networks',
  '78:19:F7': 'Juniper Networks',
  '3C:8A:B0': 'Juniper Networks',
  '00:60:2F': 'Cisco Systems',
  '00:E0:1E': 'Cisco Systems',
  'F4:5F:D4': 'HUAWEI Technologies',
  '00:E0:FC': 'HUAWEI Technologies',
  '00:66:4B': 'HUAWEI Technologies',
  '18:C0:4D': 'Fortinet, Inc.',
  '90:6C:AC': 'Fortinet, Inc.',
  'AC:15:A2': 'Sophos Ltd',
  '00:1B:17': 'Sophos Ltd',
  '00:26:18': 'Palo Alto Networks',
  '00:1C:42': 'Parallels',
  '02:42:AC': 'Docker (dynamically assigned)',
};

export function normalizeMac(input) {
  if (typeof input !== 'string') return null;
  const cleaned = input.trim().toUpperCase().replace(/[^0-9A-F]/g, '');
  if (cleaned.length !== 12 || !/^[0-9A-F]{12}$/.test(cleaned)) return null;
  const pairs = cleaned.match(/.{1,2}/g);
  return {
    colon: pairs.join(':'),
    hyphen: pairs.join('-'),
    cisco: [cleaned.slice(0, 4), cleaned.slice(4, 8), cleaned.slice(8, 12)].join('.'),
    bare: cleaned,
    oui: pairs.slice(0, 3).join(':'),
  };
}

export function isValidMac(input) {
  return normalizeMac(input) !== null;
}

export function isUnicastLocallyAdministered(bareMac) {
  const firstByte = parseInt(bareMac.slice(0, 2), 16);
  return {
    multicast: (firstByte & 0b00000001) !== 0,
    locallyAdministered: (firstByte & 0b00000010) !== 0,
  };
}

export function lookupOui(oui) {
  return OUI_DATABASE[oui.toUpperCase()] || null;
}
