export default {
  seoTitle: 'IPv4 to Binary Converter – Free Network Tool | NetEngToolkit',
  seoDescription: 'Convert an IPv4 address to its 32-bit binary representation octet by octet, or convert binary back to a dotted-decimal IPv4 address.',
  intro: 'Convert an IPv4 address to binary, octet by octet, or convert a binary address back to dotted-decimal notation.',
  formHtml: `
    <div class="field">
      <label for="bin-mode">Direction</label>
      <select id="bin-mode">
        <option value="to-binary">IPv4 → Binary</option>
        <option value="to-ipv4">Binary → IPv4</option>
      </select>
    </div>
    <div class="field">
      <label for="bin-input">Value</label>
      <input type="text" id="bin-input" placeholder="192.168.1.10" autocomplete="off" required />
      <p class="hint">For Binary → IPv4, use dot-separated 8-bit groups, e.g. 11000000.10101000.00000001.00001010</p>
    </div>
  `,
  resultsHtml: `
    <div class="result-grid">
      <div class="result-item"><div class="label">IPv4</div><div class="value" id="res-ip">—</div></div>
      <div class="result-item"><div class="label">Binary</div><div class="value" id="res-binary">—</div></div>
    </div>
    <h3>Octet Breakdown</h3>
    <div class="table-scroll">
      <table><thead><tr><th>Octet</th><th>Decimal</th><th>Binary</th></tr></thead><tbody id="octet-body"></tbody></table>
    </div>
  `,
  howItWorks: `
    <p>Each of the four octets in an IPv4 address is an 8-bit number (0–255). Converting to binary means expressing each octet in base 2, padded to 8 digits. This underlies every subnetting calculation — subnet masks, network boundaries, and wildcard masks are all binary operations under the hood.</p>
  `,
  examples: `
    <ul>
      <li><strong>192</strong> → <code>11000000</code>, <strong>168</strong> → <code>10101000</code>, <strong>1</strong> → <code>00000001</code>, <strong>10</strong> → <code>00001010</code></li>
      <li>Full address: <code>192.168.1.10</code> → <code>11000000.10101000.00000001.00001010</code></li>
    </ul>
  `,
  relatedSlugs: ['subnet-calculator', 'wildcard-calculator', 'cidr-calculator'],
  scriptSrc: '/assets/js/tools/ip-binary-converter.js',
};
