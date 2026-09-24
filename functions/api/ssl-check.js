import { jsonResponse, errorResponse, isBlockedTarget } from './_utils.js';

// GET /api/ssl-check?domain=example.com
//
// IMPORTANT LIMITATION: the Cloudflare Workers/Pages Functions runtime does
// not expose the peer TLS certificate (issuer, subject, validity dates) for
// an outbound fetch() to an arbitrary domain — there is no certificate
// introspection API available at this layer. Rather than fabricate that
// data, this endpoint only reports what it can genuinely verify: whether an
// HTTPS connection to the domain succeeds (i.e. the platform's TLS stack
// accepted the certificate chain) and the negotiated protocol scheme.
// Full certificate detail (issuer, expiry, days remaining) is listed as a
// Phase 2 improvement, to be implemented via a dedicated certificate
// inspection service (e.g. an API such as SSL Labs, or a small dedicated
// TLS-probing service run outside the Workers runtime).
export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const domain = (url.searchParams.get('domain') || '').trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');

  if (!domain || !/^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(domain)) {
    return errorResponse('Please provide a valid domain name.');
  }
  if (isBlockedTarget(domain)) {
    return errorResponse('This target cannot be checked.', 403);
  }

  try {
    const start = Date.now();
    const resp = await fetch(`https://${domain}`, {
      method: 'HEAD',
      headers: { 'User-Agent': 'NetEngToolkit/1.0 (+SSL/TLS checker)' },
    });
    const responseTimeMs = Date.now() - start;

    return jsonResponse({
      ok: true,
      domain,
      httpsReachable: true,
      hostnameMatch: true,
      statusCode: resp.status,
      responseTimeMs,
      limitation:
        'This environment cannot extract full certificate details (issuer, subject, validity dates, TLS version) for an arbitrary domain — only whether the HTTPS handshake succeeded. See "Known limitations" in the project README for the recommended Phase 2 approach.',
    });
  } catch (err) {
    return jsonResponse({
      ok: true,
      domain,
      httpsReachable: false,
      message: 'Unable to establish an HTTPS connection to this domain. The certificate may be invalid, expired, self-signed, or the host may be unreachable.',
    });
  }
}
