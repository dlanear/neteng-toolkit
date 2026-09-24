export default {
  seoTitle: 'IPv4 Subnet Calculator – Free Network Tool | NetEngToolkit',
  seoDescription: 'Calculate IPv4 network address, broadcast address, usable hosts, subnet mask, wildcard mask, and CIDR information with the free NetEngToolkit subnet calculator.',
  intro: 'Enter an IPv4 address with a CIDR prefix or subnet mask to get the full breakdown: network, broadcast, usable range, wildcard mask, and binary form. Handles /31 and /32 correctly.',
  formHtml: `
    <div class="field">
      <label for="ip-input">IP address (with optional /CIDR)</label>
      <input type="text" id="ip-input" name="ip" placeholder="192.168.1.10 or 192.168.1.10/24" autocomplete="off" required />
    </div>
    <div class="field" id="mask-field">
      <label for="mask-input">Subnet mask or CIDR prefix (optional if included above)</label>
      <input type="text" id="mask-input" name="mask" placeholder="255.255.255.0 or 24" autocomplete="off" />
      <p class="hint">You can enter the CIDR inline above (e.g. 192.168.1.10/24) or provide a mask/prefix here.</p>
    </div>
  `,
  resultsHtml: `
    <div class="result-grid" id="result-grid">
      ${[
        ['ip', 'IP Address'], ['cidr', 'CIDR'], ['mask', 'Subnet Mask'],
        ['network', 'Network Address'], ['broadcast', 'Broadcast Address'],
        ['first', 'First Usable'], ['last', 'Last Usable'],
        ['total', 'Total Addresses'], ['usable', 'Usable Addresses'],
        ['class', 'Address Class'], ['wildcard', 'Wildcard Mask'],
      ].map(([id, label]) => `
      <div class="result-item"><div class="label">${label}</div><div class="value" id="res-${id}">—</div></div>`).join('')}
    </div>
    <div id="special-note" class="alert alert-warning" style="display:none;"></div>
    <h3>Binary Representation</h3>
    <div class="table-scroll">
      <table>
        <thead><tr><th>Field</th><th>Binary</th></tr></thead>
        <tbody>
          <tr><td>IP Address</td><td class="mono" id="bin-ip">—</td></tr>
          <tr><td>Subnet Mask</td><td class="mono" id="bin-mask">—</td></tr>
          <tr><td>Network</td><td class="mono" id="bin-network">—</td></tr>
          <tr><td>Broadcast</td><td class="mono" id="bin-broadcast">—</td></tr>
        </tbody>
      </table>
    </div>
  `,
  howItWorks: `
    <p>The calculator combines your IP address with the subnet mask (converted from CIDR if needed) using a bitwise AND to find the network address, then inverts the mask to find the broadcast address. Everything between those two — minus the network and broadcast themselves — is the usable host range.</p>
    <p><strong>Special cases:</strong> a /31 network (RFC 3021) has no separate network or broadcast address — both addresses are usable, commonly used for point-to-point links. A /32 identifies exactly one host with no broadcast at all. The calculator reports these correctly instead of blindly subtracting 2.</p>
  `,
  examples: `
    <ul>
      <li><strong>192.168.1.10/24</strong> → network 192.168.1.0, broadcast 192.168.1.255, 254 usable hosts.</li>
      <li><strong>10.0.0.1/30</strong> → a tiny 4-address subnet with 2 usable hosts, common for router links.</li>
      <li><strong>203.0.113.5/31</strong> → both addresses usable, no broadcast — typical for WAN point-to-point links.</li>
      <li><strong>198.51.100.7/32</strong> → a single host route.</li>
    </ul>
  `,
  relatedSlugs: ['cidr-calculator', 'wildcard-calculator', 'ip-binary-converter', 'vlsm-calculator'],
  scriptSrc: '/assets/js/tools/subnet-calculator.js',
};
