import { jsonResponse, errorResponse, isBlockedTarget, extractHostname } from './_utils.js';

// GET /api/http-status?url=https://example.com
// Performs a real fetch and reports the actual status/redirect chain.
// Never reports a result if the target could not actually be reached.
export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const target = (url.searchParams.get('url') || '').trim();
  if (!target) return errorResponse('Please provide a URL.');

  const hostname = extractHostname(target);
  if (!hostname) return errorResponse('Please provide a valid URL.');
  if (isBlockedTarget(hostname)) return errorResponse('This target cannot be checked.', 403);

  const fullUrl = target.includes('://') ? target : `https://${target}`;

  try {
    const start = Date.now();
    // manual redirect mode lets us report the redirect chain explicitly
    // instead of only the final destination.
    let currentUrl = fullUrl;
    const chain = [];
    let finalResponse = null;

    for (let i = 0; i < 10; i++) {
      const resp = await fetch(currentUrl, { redirect: 'manual', headers: { 'User-Agent': 'NetEngToolkit/1.0 (+HTTP status checker)' } });
      chain.push({ url: currentUrl, status: resp.status });
      if (resp.status >= 300 && resp.status < 400 && resp.headers.get('location')) {
        currentUrl = new URL(resp.headers.get('location'), currentUrl).toString();
        continue;
      }
      finalResponse = resp;
      break;
    }

    const responseTime = Date.now() - start;

    if (!finalResponse) {
      return errorResponse('Too many redirects — unable to determine a final status.', 502);
    }

    return jsonResponse({
      ok: true,
      requestedUrl: fullUrl,
      finalUrl: chain[chain.length - 1].url,
      statusCode: finalResponse.status,
      statusMessage: finalResponse.statusText || STATUS_TEXT[finalResponse.status] || '',
      responseTimeMs: responseTime,
      redirectCount: chain.length - 1,
      redirectChain: chain,
    });
  } catch (err) {
    return errorResponse('Unable to reach that URL. It may be offline, blocking automated requests, or unreachable from this network.', 502);
  }
}

const STATUS_TEXT = {
  200: 'OK', 201: 'Created', 204: 'No Content',
  301: 'Moved Permanently', 302: 'Found', 304: 'Not Modified',
  400: 'Bad Request', 401: 'Unauthorized', 403: 'Forbidden', 404: 'Not Found',
  429: 'Too Many Requests',
  500: 'Internal Server Error', 502: 'Bad Gateway', 503: 'Service Unavailable', 504: 'Gateway Timeout',
};
