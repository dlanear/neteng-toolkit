export default {
  seoTitle: 'HTTP Headers Checker – Free Network Tool | NetEngToolkit',
  seoDescription: 'Inspect the live HTTP response headers for any URL, including key security headers like HSTS, CSP, and X-Content-Type-Options.',
  intro: 'Inspect the real HTTP response headers sent by any URL, with key security headers highlighted.',
  formHtml: `
    <div class="field">
      <label for="headers-url">URL</label>
      <input type="url" id="headers-url" placeholder="https://example.com" autocomplete="off" required />
    </div>
  `,
  resultsHtml: `
    <h3>Highlighted Headers</h3>
    <div class="table-scroll">
      <table id="highlighted-table"><thead><tr><th>Header</th><th>Value</th></tr></thead><tbody></tbody></table>
    </div>
    <div id="missing-security" class="alert alert-warning" style="display:none;"></div>
    <h3>All Response Headers</h3>
    <div class="table-scroll">
      <table id="all-headers-table"><thead><tr><th>Header</th><th>Value</th></tr></thead><tbody></tbody></table>
    </div>
  `,
  howItWorks: `
    <p>This fetches the URL from our edge function and returns the actual response headers received. Some headers — like <code>Content-Security-Policy</code>, <code>Strict-Transport-Security</code>, and <code>X-Content-Type-Options</code> — are highlighted because they directly affect a site's security posture. Note that intermediary proxies, CDNs, or the fetching environment itself can sometimes normalize or strip certain headers, so this may not always be byte-identical to what a browser sees directly.</p>
  `,
  examples: `
    <ul>
      <li><strong>Strict-Transport-Security</strong> tells browsers to always use HTTPS for this domain.</li>
      <li><strong>Content-Security-Policy</strong> restricts what resources a page is allowed to load.</li>
      <li><strong>Cache-Control</strong> and <strong>Content-Type</strong> are useful for debugging caching and content-rendering issues.</li>
    </ul>
  `,
  relatedSlugs: ['http-status', 'ssl-checker', 'dns-lookup'],
  scriptSrc: '/assets/js/tools/http-headers.js',
};
