export default {
  seoTitle: 'DNS Lookup Tool – Free Network Tool | NetEngToolkit',
  seoDescription: 'Look up A, AAAA, CNAME, MX, NS, TXT, SOA, CAA, and SRV DNS records for any domain, powered by DNS-over-HTTPS.',
  intro: 'Look up DNS records for a domain. Queries are sent to a DNS-over-HTTPS resolver — real results only, never fabricated.',
  formHtml: `
    <div class="field-row">
      <div class="field">
        <label for="dns-domain">Domain name</label>
        <input type="text" id="dns-domain" placeholder="example.com" autocomplete="off" required />
      </div>
      <div class="field">
        <label for="dns-type">Record type</label>
        <select id="dns-type">
          <option>A</option><option>AAAA</option><option>CNAME</option><option>MX</option>
          <option>NS</option><option>TXT</option><option>SOA</option><option>CAA</option><option>SRV</option>
        </select>
      </div>
    </div>
    <p class="hint">This lookup is sent to a DNS-over-HTTPS resolver (cloudflare-dns.com) to perform the query — no data is stored.</p>
  `,
  resultsHtml: `
    <div id="dns-empty" class="alert alert-info">No records found for this query.</div>
    <div class="table-scroll">
      <table id="dns-table" style="display:none;">
        <thead><tr><th>Name</th><th>Type</th><th>TTL</th><th>Value</th></tr></thead>
        <tbody></tbody>
      </table>
    </div>
  `,
  howItWorks: `
    <p>A browser cannot perform arbitrary DNS queries directly — DNS runs over UDP/TCP port 53, which isn't accessible from client-side JavaScript. This tool sends your query to a DNS-over-HTTPS (DoH) resolver, which performs the real lookup and returns the actual records in JSON form. If the resolver can't be reached or returns an error, that failure is reported clearly rather than shown as an empty or fake result.</p>
  `,
  examples: `
    <ul>
      <li><strong>A</strong> records map a domain to an IPv4 address.</li>
      <li><strong>MX</strong> records show which mail servers handle email for a domain, with priority.</li>
      <li><strong>TXT</strong> records are often used for domain verification and SPF/DKIM/DMARC email authentication.</li>
      <li><strong>NS</strong> records show which name servers are authoritative for a domain.</li>
    </ul>
  `,
  relatedSlugs: ['reverse-dns', 'ssl-checker', 'http-headers'],
  scriptSrc: '/assets/js/tools/dns-lookup.js',
};
