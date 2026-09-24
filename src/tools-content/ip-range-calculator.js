export default {
  seoTitle: 'IP Range Calculator – Free Network Tool | NetEngToolkit',
  seoDescription: 'Calculate the total address count between a start and end IPv4 address, and see the CIDR blocks that summarize the range.',
  intro: 'Enter a start and end IPv4 address to see the total address count and the CIDR blocks that cover the range.',
  formHtml: `
    <div class="field-row">
      <div class="field">
        <label for="start-ip">Start IP</label>
        <input type="text" id="start-ip" placeholder="192.168.1.10" autocomplete="off" required />
      </div>
      <div class="field">
        <label for="end-ip">End IP</label>
        <input type="text" id="end-ip" placeholder="192.168.1.100" autocomplete="off" required />
      </div>
    </div>
  `,
  resultsHtml: `
    <div class="result-grid">
      <div class="result-item"><div class="label">First IP</div><div class="value" id="res-first">—</div></div>
      <div class="result-item"><div class="label">Last IP</div><div class="value" id="res-last">—</div></div>
      <div class="result-item"><div class="label">Total Addresses</div><div class="value" id="res-total">—</div></div>
    </div>
    <h3>Covering CIDR Blocks</h3>
    <div id="range-truncated-note" class="alert alert-warning" style="display:none;">This range is highly fragmented — showing the first blocks only.</div>
    <div class="table-scroll">
      <table id="range-table"><thead><tr><th>CIDR Block</th><th>Size</th></tr></thead><tbody></tbody></table>
    </div>
  `,
  howItWorks: `
    <p>Not every range of IP addresses aligns neatly to a single CIDR block. This tool finds the smallest set of CIDR blocks that exactly covers your range, using the standard "largest aligned block first" algorithm: at each step it finds the biggest power-of-two block that starts at the current address and doesn't overshoot the end of the range.</p>
  `,
  examples: `
    <ul>
      <li><strong>192.168.1.10 → 192.168.1.100</strong> → 91 addresses, summarized as several CIDR blocks.</li>
      <li>A range that starts and ends exactly on a power-of-two boundary summarizes to a single CIDR block.</li>
    </ul>
  `,
  relatedSlugs: ['subnet-calculator', 'cidr-calculator', 'vlsm-calculator'],
  scriptSrc: '/assets/js/tools/ip-range-calculator.js',
};
