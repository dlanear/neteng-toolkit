export default {
  seoTitle: 'Wildcard Mask Calculator – Free Network Tool | NetEngToolkit',
  seoDescription: 'Convert between subnet masks and wildcard masks for Cisco ACL and OSPF configuration, with a clear explanation of what wildcard masks mean.',
  intro: 'Convert a subnet mask to its wildcard mask, or a wildcard mask back to a subnet mask. Commonly needed for Cisco ACLs and OSPF network statements.',
  formHtml: `
    <div class="field">
      <label for="wc-input">Subnet mask or wildcard mask</label>
      <input type="text" id="wc-input" placeholder="255.255.255.0 or 0.0.0.255" autocomplete="off" required />
    </div>
    <div class="field">
      <label for="wc-direction">Conversion direction</label>
      <select id="wc-direction">
        <option value="auto">Auto-detect</option>
        <option value="mask-to-wildcard">Subnet Mask → Wildcard Mask</option>
        <option value="wildcard-to-mask">Wildcard Mask → Subnet Mask</option>
      </select>
    </div>
  `,
  resultsHtml: `
    <div class="result-grid">
      <div class="result-item"><div class="label">Input</div><div class="value" id="res-input">—</div></div>
      <div class="result-item"><div class="label">Result</div><div class="value" id="res-output">—</div></div>
      <div class="result-item"><div class="label">Equivalent CIDR</div><div class="value" id="res-cidr">—</div></div>
    </div>
    <div class="alert alert-info">Wildcard masks identify which bits must match and which bits can vary. A wildcard mask is not itself a subnet mask — it is the mask's bitwise inverse, used by ACLs and routing protocols to specify match criteria.</div>
  `,
  howItWorks: `
    <p>A wildcard mask is the bitwise complement (inverse) of a subnet mask: every 1 bit becomes 0 and every 0 bit becomes 1. Where a subnet mask says "these bits must match to be in this network," a wildcard mask says "these bits are allowed to vary" — the convention used by Cisco access control lists and OSPF <code>network</code> statements.</p>
  `,
  examples: `
    <ul>
      <li><strong>255.255.255.0</strong> → wildcard <strong>0.0.0.255</strong> (matches any host in a /24).</li>
      <li><strong>255.255.255.240</strong> → wildcard <strong>0.0.0.15</strong> (a /28).</li>
      <li>In a Cisco ACL: <code>access-list 10 permit 192.168.1.0 0.0.0.255</code> uses a wildcard mask, not a subnet mask.</li>
    </ul>
  `,
  relatedSlugs: ['subnet-calculator', 'cidr-calculator', 'ip-binary-converter'],
  scriptSrc: '/assets/js/tools/wildcard-calculator.js',
};
