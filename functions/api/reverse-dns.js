import { jsonResponse, errorResponse, isBlockedTarget } from './_utils.js';

// GET /api/reverse-dns?ip=8.8.8.8
// Builds the in-addr.arpa / ip6.arpa PTR name and queries it via Cloudflare DoH.
function isValidIPv4(ip) {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(ip) && ip.split('.').every((o) => Number(o) <= 255);
}

function isValidIPv6(ip) {
  // Permissive check; DoH will reject genuinely malformed addresses.
  return /^[0-9a-f:]+$/i.test(ip) && ip.includes(':');
}

function ipv4ToPtrName(ip) {
  return ip.split('.').reverse().join('.') + '.in-addr.arpa';
}

function ipv6ToPtrName(ip) {
  // Expand to full 32-nibble form, then reverse for ip6.arpa.
  const parts = ip.split('::');
  let head = parts[0] ? parts[0].split(':') : [];
  let tail = parts.length > 1 ? parts[1].split(':') : [];
  const missing = 8 - head.length - tail.length;
  const groups = [...head, ...Array(Math.max(missing, 0)).fill('0'), ...tail];
  const hex = groups.map((g) => g.padStart(4, '0')).join('');
  return hex.split('').reverse().join('.') + '.ip6.arpa';
}

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const ip = (url.searchParams.get('ip') || '').trim();

  if (!ip) return errorResponse('Please provide an IPv4 or IPv6 address.');

  let ptrName;
  if (isValidIPv4(ip)) {
    ptrName = ipv4ToPtrName(ip);
  } else if (isValidIPv6(ip)) {
    ptrName = ipv6ToPtrName(ip);
  } else {
    return errorResponse('Invalid IPv4 or IPv6 address.');
  }

  if (isBlockedTarget(ip)) {
    return errorResponse('This target cannot be queried.', 403);
  }

  try {
    const dohUrl = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(ptrName)}&type=PTR`;
    const resp = await fetch(dohUrl, { headers: { Accept: 'application/dns-json' } });
    if (!resp.ok) {
      return errorResponse('Unable to retrieve DNS information right now. Please try again.', 502);
    }
    const data = await resp.json();
    const answers = (data.Answer || []).filter((a) => a.type === 12);

    if (answers.length === 0) {
      return jsonResponse({ ok: true, ip, hostname: null, message: 'No PTR record found.' });
    }

    return jsonResponse({
      ok: true,
      ip,
      hostname: answers[0].data.replace(/\.$/, ''),
      allHostnames: answers.map((a) => a.data.replace(/\.$/, '')),
    });
  } catch (err) {
    return errorResponse('Unable to retrieve DNS information right now. Please try again.', 502);
  }
}
