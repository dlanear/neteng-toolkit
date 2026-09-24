export const CATEGORIES = [
  { id: 'ip-subnetting', name: 'IP & Subnetting' },
  { id: 'dns-domain', name: 'DNS & Domain' },
  { id: 'diagnostics', name: 'Network Diagnostics' },
  { id: 'calculators', name: 'Calculators' },
];

export const TOOLS = [
  {
    slug: 'subnet-calculator',
    name: 'IPv4 Subnet Calculator',
    icon: '🧮',
    category: 'ip-subnetting',
    description: 'Calculate network, broadcast, usable range, mask, and wildcard from an IP + CIDR or subnet mask.',
    keywords: 'subnet network broadcast mask cidr usable hosts',
  },
  {
    slug: 'cidr-calculator',
    name: 'CIDR Calculator',
    icon: '📐',
    category: 'ip-subnetting',
    description: 'Break down a CIDR block into its network details, plus a full CIDR reference table.',
    keywords: 'cidr prefix notation reference table',
  },
  {
    slug: 'vlsm-calculator',
    name: 'VLSM Calculator',
    icon: '🧩',
    category: 'ip-subnetting',
    description: 'Allocate variable-length subnets from a base network to meet multiple host-count requirements.',
    keywords: 'vlsm variable length subnet mask allocation departments',
  },
  {
    slug: 'ip-range-calculator',
    name: 'IP Range Calculator',
    icon: '↔️',
    category: 'ip-subnetting',
    description: 'Find the total address count and the CIDR blocks that cover a start-to-end IP range.',
    keywords: 'ip range start end cidr blocks',
  },
  {
    slug: 'wildcard-calculator',
    name: 'Wildcard Mask Calculator',
    icon: '🔀',
    category: 'ip-subnetting',
    description: 'Convert between subnet masks and wildcard masks for ACLs and OSPF configuration.',
    keywords: 'wildcard mask acl ospf cisco',
  },
  {
    slug: 'ip-binary-converter',
    name: 'IPv4 ↔ Binary Converter',
    icon: '🔁',
    category: 'ip-subnetting',
    description: 'Convert an IPv4 address to its 32-bit binary form and back again, octet by octet.',
    keywords: 'binary octet convert ipv4',
  },
  {
    slug: 'dns-lookup',
    name: 'DNS Lookup',
    icon: '🌐',
    category: 'dns-domain',
    description: 'Query A, AAAA, CNAME, MX, NS, TXT, SOA, CAA, and SRV records for a domain.',
    keywords: 'dns a aaaa cname mx ns txt soa caa srv records',
  },
  {
    slug: 'reverse-dns',
    name: 'Reverse DNS Lookup',
    icon: '↩️',
    category: 'dns-domain',
    description: 'Look up the PTR hostname associated with an IPv4 or IPv6 address.',
    keywords: 'reverse dns ptr hostname ip',
  },
  {
    slug: 'port-lookup',
    name: 'Port Lookup',
    icon: '🔌',
    category: 'diagnostics',
    description: 'Look up well-known TCP/UDP ports by number or by service name.',
    keywords: 'port tcp udp service well-known reference',
  },
  {
    slug: 'mac-oui-lookup',
    name: 'MAC / OUI Lookup',
    icon: '🏷️',
    category: 'diagnostics',
    description: 'Normalize a MAC address, extract its OUI, and identify the manufacturer where known.',
    keywords: 'mac address oui vendor manufacturer normalize',
  },
  {
    slug: 'ping-latency',
    name: 'Ping / Latency',
    icon: '📡',
    category: 'diagnostics',
    description: 'Run an HTTP-based latency test against a host and see min/avg/max response times.',
    keywords: 'ping latency response time packet loss',
  },
  {
    slug: 'http-status',
    name: 'HTTP Status Checker',
    icon: '📶',
    category: 'diagnostics',
    description: 'Check the live HTTP status code, response time, and redirect chain for any URL.',
    keywords: 'http status code redirect 404 500 checker',
  },
  {
    slug: 'http-headers',
    name: 'HTTP Headers Checker',
    icon: '📋',
    category: 'diagnostics',
    description: 'Inspect response headers, including key security headers like HSTS and CSP.',
    keywords: 'http headers security hsts csp checker',
  },
  {
    slug: 'ssl-checker',
    name: 'SSL/TLS Checker',
    icon: '🔒',
    category: 'diagnostics',
    description: 'Verify that a domain establishes a working HTTPS connection.',
    keywords: 'ssl tls certificate https checker',
  },
  {
    slug: 'bandwidth-calculator',
    name: 'Bandwidth Calculator',
    icon: '⏱️',
    category: 'calculators',
    description: 'Estimate file transfer time from size and bandwidth, or work backward to required bandwidth.',
    keywords: 'bandwidth transfer time file size mbps gbps',
  },
];

export function toolBySlug(slug) {
  return TOOLS.find((t) => t.slug === slug);
}

export function toolsByCategory(categoryId) {
  return TOOLS.filter((t) => t.category === categoryId);
}
