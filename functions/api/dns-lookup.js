import { jsonResponse, errorResponse, isBlockedTarget } from './_utils.js';

// GET /api/dns-lookup?domain=example.com&type=A
// Uses Cloudflare's public DNS-over-HTTPS resolver (cloudflare-dns.com).
// No API key required. Real DoH results only — never fabricated.
const ALLOWED_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'TXT', 'SOA', 'CAA', 'SRV'];

const DNS_TYPE_NUMBERS = {
  A: 1, NS: 2, CNAME: 5, SOA: 6, MX: 15, TXT: 16, AAAA: 28, SRV: 33, CAA: 257,
};

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const domain = (url.searchParams.get('domain') || '').trim().toLowerCase();
  const type = (url.searchParams.get('type') || 'A').toUpperCase();

  if (!domain || !/^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(domain)) {
    return errorResponse('Please provide a valid domain name.');
  }
  if (isBlockedTarget(domain)) {
    return errorResponse('This target cannot be queried.', 403);
  }
  if (!ALLOWED_TYPES.includes(type)) {
    return errorResponse(`Unsupported record type. Supported: ${ALLOWED_TYPES.join(', ')}`);
  }

  try {
    const dohUrl = `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=${type}`;
    const resp = await fetch(dohUrl, { headers: { Accept: 'application/dns-json' } });

    if (!resp.ok) {
      return errorResponse('Unable to retrieve DNS information right now. Please try again.', 502);
    }

    const data = await resp.json();
    // Standard field, per RFC 1035 / DoH JSON: 0 = NOERROR
    if (data.Status !== 0 && data.Status !== 3) {
      return errorResponse('The DNS resolver returned an error for this query.', 502);
    }

    const records = (data.Answer || []).map((a) => ({
      name: a.name,
      type: DNS_TYPE_NAME(a.type),
      ttl: a.TTL,
      value: a.data,
    }));

    return jsonResponse({
      ok: true,
      domain,
      queryType: type,
      records,
      hasRecords: records.length > 0,
      message: records.length === 0 ? `No ${type} records found for ${domain}.` : null,
    });
  } catch (err) {
    return errorResponse('Unable to retrieve DNS information right now. Please try again.', 502);
  }
}

function DNS_TYPE_NAME(num) {
  const entry = Object.entries(DNS_TYPE_NUMBERS).find(([, v]) => v === num);
  return entry ? entry[0] : String(num);
}
