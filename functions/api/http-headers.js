import { jsonResponse, errorResponse, isBlockedTarget, extractHostname } from './_utils.js';

const HIGHLIGHTED = [
  'content-type', 'content-length', 'cache-control', 'server', 'location',
  'strict-transport-security', 'content-security-policy', 'x-content-type-options',
  'referrer-policy', 'permissions-policy',
];

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const target = (url.searchParams.get('url') || '').trim();
  if (!target) return errorResponse('Please provide a URL.');

  const hostname = extractHostname(target);
  if (!hostname) return errorResponse('Please provide a valid URL.');
  if (isBlockedTarget(hostname)) return errorResponse('This target cannot be checked.', 403);

  const fullUrl = target.includes('://') ? target : `https://${target}`;

  try {
    const resp = await fetch(fullUrl, { redirect: 'follow', headers: { 'User-Agent': 'NetEngToolkit/1.0 (+HTTP headers checker)' } });
    const headers = {};
    for (const [key, value] of resp.headers.entries()) {
      headers[key] = value;
    }

    const highlighted = HIGHLIGHTED
      .filter((h) => headers[h] !== undefined)
      .map((h) => ({ name: h, value: headers[h] }));

    const missingSecurityHeaders = HIGHLIGHTED.filter(
      (h) => h.includes('security') || h === 'x-content-type-options' || h === 'referrer-policy' || h === 'permissions-policy'
    ).filter((h) => headers[h] === undefined);

    return jsonResponse({
      ok: true,
      requestedUrl: fullUrl,
      finalUrl: resp.url,
      statusCode: resp.status,
      headers,
      highlighted,
      missingSecurityHeaders,
      note: 'Some headers may be altered or hidden by intermediary proxies, CDNs, or browser restrictions and may not exactly match what the origin server sent.',
    });
  } catch (err) {
    return errorResponse('Unable to reach that URL to retrieve headers. It may be offline or blocking automated requests.', 502);
  }
}
