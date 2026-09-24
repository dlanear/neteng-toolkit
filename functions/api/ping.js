import { jsonResponse, errorResponse, isBlockedTarget, extractHostname } from './_utils.js';

// GET /api/ping?target=example.com
// Cloudflare Workers/Pages Functions cannot send raw ICMP packets — there is
// no socket-level access in the Workers runtime. This performs a real
// HTTP(S) latency test instead and labels it accordingly. It is never
// presented as an ICMP ping.
const ATTEMPTS = 4;

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const target = (url.searchParams.get('target') || '').trim();
  if (!target) return errorResponse('Please provide a hostname or URL.');

  const hostname = extractHostname(target);
  if (!hostname) return errorResponse('Please provide a valid hostname or URL.');
  if (isBlockedTarget(hostname)) return errorResponse('This target cannot be tested.', 403);

  const fullUrl = target.includes('://') ? target : `https://${target}`;
  const samples = [];
  let failures = 0;

  for (let i = 0; i < ATTEMPTS; i++) {
    const start = Date.now();
    try {
      const resp = await fetch(fullUrl, { method: 'HEAD', headers: { 'User-Agent': 'NetEngToolkit/1.0 (+HTTP latency test)' } });
      // Some servers reject HEAD; fall back to GET without reading the body.
      if (resp.status === 405) {
        await fetch(fullUrl, { method: 'GET', headers: { 'User-Agent': 'NetEngToolkit/1.0 (+HTTP latency test)' } });
      }
      samples.push(Date.now() - start);
    } catch {
      failures++;
    }
  }

  if (samples.length === 0) {
    return errorResponse('Unable to reach that target. It may be offline, blocking automated requests, or unreachable from this network.', 502);
  }

  return jsonResponse({
    ok: true,
    target: fullUrl,
    testType: 'HTTP latency test',
    note: 'This measures HTTP response time, not raw ICMP echo (ping). Browsers and edge functions cannot send ICMP packets.',
    attempts: ATTEMPTS,
    successfulAttempts: samples.length,
    packetLossPercent: Math.round((failures / ATTEMPTS) * 100),
    minMs: Math.min(...samples),
    maxMs: Math.max(...samples),
    avgMs: Math.round(samples.reduce((a, b) => a + b, 0) / samples.length),
    samples,
  });
}
