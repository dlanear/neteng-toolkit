export default {
  seoTitle: 'HTTP Status Checker – Free Network Tool | NetEngToolkit',
  seoDescription: 'Check the live HTTP status code, response time, and full redirect chain for any URL.',
  intro: 'Check the real, live HTTP status code for a URL, including the full redirect chain and response time.',
  formHtml: `
    <div class="field">
      <label for="status-url">URL</label>
      <input type="url" id="status-url" placeholder="https://example.com" autocomplete="off" required />
    </div>
  `,
  resultsHtml: `
    <div class="result-grid">
      <div class="result-item"><div class="label">Status Code</div><div class="value" id="res-code">—</div></div>
      <div class="result-item"><div class="label">Status Message</div><div class="value" id="res-message">—</div></div>
      <div class="result-item"><div class="label">Response Time</div><div class="value" id="res-time">—</div></div>
      <div class="result-item"><div class="label">Final URL</div><div class="value" id="res-final">—</div></div>
    </div>
    <h3>Redirect Chain</h3>
    <div class="table-scroll">
      <table id="redirect-table"><thead><tr><th>#</th><th>URL</th><th>Status</th></tr></thead><tbody></tbody></table>
    </div>
  `,
  howItWorks: `
    <p>This performs a real HTTP request to the URL from our edge function and reports the actual status code returned — nothing is simulated. Redirects (3xx responses with a Location header) are followed manually, one hop at a time, so you can see the full chain rather than just the final destination. If the target can't be reached at all, that failure is reported explicitly rather than shown as a fake status.</p>
  `,
  examples: `
    <ul>
      <li><strong>200 OK</strong> — the request succeeded.</li>
      <li><strong>301 / 302</strong> — the URL redirects elsewhere; the chain shows every hop.</li>
      <li><strong>404 Not Found</strong> — the server has no resource at that URL.</li>
      <li><strong>500 / 502 / 503</strong> — server-side errors, often transient.</li>
    </ul>
  `,
  relatedSlugs: ['http-headers', 'ssl-checker', 'ping-latency'],
  scriptSrc: '/assets/js/tools/http-status.js',
};
