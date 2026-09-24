export default {
  seoTitle: 'Port Lookup Tool – Free Network Tool | NetEngToolkit',
  seoDescription: 'Look up well-known TCP and UDP ports by number or service name — a reference tool, not a port scanner.',
  intro: 'Search the common TCP/UDP port reference database by port number or service name. This is a lookup tool, not a scanner — it never probes any live host.',
  formHtml: `
    <div class="field">
      <label for="port-query">Port number or service name</label>
      <input type="text" id="port-query" placeholder="443 or HTTPS" autocomplete="off" required />
    </div>
  `,
  resultsHtml: `
    <div id="port-empty" class="alert alert-info" style="display:none;">No matching ports found in the reference database.</div>
    <div class="table-scroll">
      <table id="port-table" style="display:none;">
        <thead><tr><th>Port</th><th>Protocol</th><th>Service</th><th>Description</th></tr></thead>
        <tbody></tbody>
      </table>
    </div>
  `,
  howItWorks: `
    <p>This tool searches a bundled reference database of well-known and commonly used TCP/UDP ports entirely in your browser — no network request is made, and no host is ever contacted or scanned. It's meant for quickly recalling what a given port is typically used for during troubleshooting or documentation.</p>
  `,
  examples: `
    <ul>
      <li><strong>22</strong> → SSH</li>
      <li><strong>53</strong> → DNS</li>
      <li><strong>443</strong> → HTTPS</li>
      <li><strong>3389</strong> → RDP</li>
      <li>Search "SQL" to find database-related ports like MySQL (3306) and MS SQL Server (1433).</li>
    </ul>
  `,
  relatedSlugs: ['dns-lookup', 'http-status', 'mac-oui-lookup'],
  scriptSrc: '/assets/js/tools/port-lookup.js',
};
