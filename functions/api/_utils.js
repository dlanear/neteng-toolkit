// Shared helpers for backend-powered tools (DNS, reverse DNS, MAC/OUI,
// HTTP status/headers, latency, SSL). These run as Cloudflare Pages
// Functions. Keep them dependency-free (Workers runtime, no npm installs).

const PRIVATE_IPV4_RANGES = [
  [/^127\./],           // loopback
  [/^10\./],             // RFC1918
  [/^192\.168\./],       // RFC1918
  [/^169\.254\./],       // link-local
  [/^0\./],              // "this" network
  [/^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./], // CGNAT 100.64.0.0/10
];

function isPrivateIPv4(host) {
  if (!/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return false;
  if (PRIVATE_IPV4_RANGES.some(([re]) => re.test(host))) return true;
  // 172.16.0.0/12
  const parts = host.split('.').map(Number);
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return true;
  return false;
}

const BLOCKED_HOSTNAMES = new Set([
  'localhost', 'localhost.localdomain', 'ip6-localhost', 'metadata.google.internal',
]);

// Rejects requests aimed at loopback / private / link-local / cloud-metadata
// targets so these public tools cannot be used to probe internal networks
// (SSRF protection). This is a best-effort hostname/literal-IP check; it does
// not resolve DNS itself before fetching (Workers' fetch() resolves at the
// edge), so it is combined with restricting these tools to read-only,
// low-impact operations (DNS/HTTP metadata) rather than arbitrary requests.
export function isBlockedTarget(hostname) {
  const h = hostname.trim().toLowerCase().replace(/\.$/, '');
  if (!h) return true;
  if (BLOCKED_HOSTNAMES.has(h)) return true;
  if (h === '::1' || h.startsWith('fe80:') || h.startsWith('fc') || h.startsWith('fd')) return true;
  if (h.endsWith('.internal') || h.endsWith('.local')) return true;
  if (isPrivateIPv4(h)) return true;
  return false;
}

export function extractHostname(input) {
  let value = input.trim();
  try {
    // Allow full URLs or bare hostnames.
    const url = value.includes('://') ? new URL(value) : new URL(`https://${value}`);
    return url.hostname;
  } catch {
    return null;
  }
}

export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export function errorResponse(message, status = 400) {
  return jsonResponse({ ok: false, error: message }, status);
}

// Simple in-memory-per-isolate rate limiting is not reliable on Workers
// (isolates are short-lived and not shared), so real deployments should
// front these endpoints with Cloudflare's Rate Limiting rules (see README).
// This helper just centralizes the standard response shape.
export function withTiming(fn) {
  return async (context) => {
    const start = Date.now();
    const res = await fn(context);
    return res;
  };
}
