export default {
  seoTitle: 'VLSM Calculator – Free Network Tool | NetEngToolkit',
  seoDescription: 'Allocate variable-length subnets from a base network across multiple departments or host-count requirements, sorted largest-first, with full subnet detail.',
  intro: 'Enter a base network and a list of required host counts (one per line, e.g. one per department). The calculator allocates the smallest fitting subnet for each, largest requirement first.',
  formHtml: `
    <div class="field">
      <label for="base-network">Base network</label>
      <input type="text" id="base-network" placeholder="192.168.10.0/24" autocomplete="off" required />
    </div>
    <div class="field">
      <label for="requirements">Required subnets (one per line: name, hosts)</label>
      <textarea id="requirements" rows="6" placeholder="Department A, 100&#10;Department B, 50&#10;Department C, 25&#10;Department D, 10" required></textarea>
      <p class="hint">Format: <code>name, host count</code> — one requirement per line.</p>
    </div>
  `,
  resultsHtml: `
    <div class="table-scroll">
      <table id="vlsm-table">
        <thead>
          <tr><th>Subnet</th><th>Required</th><th>Allocated</th><th>CIDR</th><th>Mask</th><th>Network</th><th>First Host</th><th>Last Host</th><th>Broadcast</th></tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
    <p id="vlsm-remaining" class="hint"></p>
  `,
  howItWorks: `
    <p>VLSM (Variable-Length Subnet Masking) lets you carve one network into subnets of different sizes rather than one fixed size for all. The standard approach — used here — is to sort requirements from largest to smallest, then allocate each on the next available boundary aligned to its block size. This avoids wasting address space between subnets.</p>
    <p>If a requirement doesn't fit inside the remaining space of the base network, the calculator reports this clearly rather than allocating an invalid range.</p>
  `,
  examples: `
    <ul>
      <li><strong>192.168.10.0/24</strong> with 100, 50, 25, and 10 hosts fits comfortably, leaving room to spare.</li>
      <li>Try requesting more hosts than the base network can hold to see the "cannot fit" message.</li>
    </ul>
  `,
  relatedSlugs: ['subnet-calculator', 'cidr-calculator', 'ip-range-calculator'],
  scriptSrc: '/assets/js/tools/vlsm-calculator.js',
};
