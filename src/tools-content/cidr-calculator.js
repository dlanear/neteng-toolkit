export default {
  seoTitle: 'CIDR Calculator – Free Network Tool | NetEngToolkit',
  seoDescription: 'Break down any CIDR block into its network, broadcast, usable host range, and subnet mask, plus a full /0 to /32 CIDR reference table.',
  intro: 'Enter an IP address and CIDR prefix to see the full network breakdown, plus a complete CIDR-to-subnet-mask reference table below.',
  formHtml: `
    <div class="field">
      <label for="cidr-input">IP address / CIDR prefix</label>
      <input type="text" id="cidr-input" name="cidr" placeholder="10.10.10.15/20" autocomplete="off" required />
    </div>
  `,
  resultsHtml: `
    <div class="result-grid" id="result-grid">
      ${[
        ['ip', 'IP'], ['prefix', 'Prefix'], ['mask', 'Subnet Mask'],
        ['network', 'Network'], ['broadcast', 'Broadcast'],
        ['first', 'First Address'], ['last', 'Last Address'],
        ['total', 'Total Addresses'], ['usable', 'Usable Hosts'], ['wildcard', 'Wildcard Mask'],
      ].map(([id, label]) => `
      <div class="result-item"><div class="label">${label}</div><div class="value" id="res-${id}">—</div></div>`).join('')}
    </div>
    <h3>Binary</h3>
    <p class="mono" id="bin-out">—</p>
    <h3>CIDR Reference Table</h3>
    <div class="table-scroll">
      <table id="cidr-table">
        <thead><tr><th>CIDR</th><th>Subnet Mask</th><th>Total Addresses</th><th>Usable Hosts</th></tr></thead>
        <tbody></tbody>
      </table>
    </div>
  `,
  howItWorks: `
    <p>CIDR (Classless Inter-Domain Routing) notation expresses a subnet mask as a prefix length — the number of leading 1 bits. <code>/24</code> means the first 24 bits are network bits, equivalent to a 255.255.255.0 mask. This tool converts the prefix to a full mask and calculates the resulting network boundaries.</p>
  `,
  examples: `
    <ul>
      <li><strong>10.10.10.15/20</strong> → network 10.10.0.0, 4094 usable hosts.</li>
      <li><strong>172.16.5.1/16</strong> → a full Class B–sized block, 65,534 usable hosts.</li>
      <li>Use the reference table to quickly recall how many hosts a given prefix provides without doing the math by hand.</li>
    </ul>
  `,
  relatedSlugs: ['subnet-calculator', 'vlsm-calculator', 'ip-range-calculator'],
  scriptSrc: '/assets/js/tools/cidr-calculator.js',
};
