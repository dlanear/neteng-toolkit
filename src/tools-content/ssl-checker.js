export default {
  seoTitle: 'SSL/TLS Checker – Free Network Tool | NetEngToolkit',
  seoDescription: 'Verify that a domain establishes a working HTTPS connection. Honest about what can and cannot be verified from this environment.',
  intro: 'Check whether a domain establishes a working HTTPS connection.',
  formHtml: `
    <div class="field">
      <label for="ssl-domain">Domain name</label>
      <input type="text" id="ssl-domain" placeholder="example.com" autocomplete="off" required />
    </div>
  `,
  resultsHtml: `
    <div class="result-grid">
      <div class="result-item"><div class="label">HTTPS Reachable</div><div class="value" id="res-reachable">—</div></div>
      <div class="result-item"><div class="label">Status Code</div><div class="value" id="res-status">—</div></div>
      <div class="result-item"><div class="label">Response Time</div><div class="value" id="res-time">—</div></div>
    </div>
    <div class="alert alert-warning" id="ssl-limitation"></div>
  `,
  howItWorks: `
    <p><strong>Known limitation:</strong> Cloudflare Pages Functions (and browsers) do not expose certificate-level detail — issuer, subject, validity dates, TLS version — for an arbitrary domain's certificate. This tool honestly reports only what it can verify: whether an HTTPS connection succeeds. It never claims a certificate is valid, shows an issuer, or reports an expiry date unless that data is actually obtained. Full certificate inspection is listed as a Phase 2 improvement, to be built on a dedicated certificate-inspection API.</p>
  `,
  examples: `
    <ul>
      <li>A successful HTTPS connection means the platform's TLS stack accepted the certificate chain presented by the server.</li>
      <li>A failed connection can mean an invalid, expired, or self-signed certificate — or simply that the host is unreachable.</li>
    </ul>
  `,
  relatedSlugs: ['http-status', 'http-headers', 'dns-lookup'],
  scriptSrc: '/assets/js/tools/ssl-checker.js',
};
