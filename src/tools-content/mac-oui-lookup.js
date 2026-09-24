export default {
  seoTitle: 'MAC Address / OUI Lookup – Free Network Tool | NetEngToolkit',
  seoDescription: 'Normalize a MAC address into common formats, extract its OUI, and identify the manufacturer where known. Runs entirely in your browser.',
  intro: 'Enter a MAC address in any common format to normalize it and identify its manufacturer from the OUI. Runs entirely in your browser — the address is never sent anywhere.',
  formHtml: `
    <div class="field">
      <label for="mac-input">MAC address</label>
      <input type="text" id="mac-input" placeholder="00:11:22:33:44:55" autocomplete="off" required />
      <p class="hint">Accepts colon, hyphen, Cisco dot, or plain formats.</p>
    </div>
  `,
  resultsHtml: `
    <div class="result-grid">
      <div class="result-item"><div class="label">Colon format</div><div class="value" id="res-colon">—</div></div>
      <div class="result-item"><div class="label">Hyphen format</div><div class="value" id="res-hyphen">—</div></div>
      <div class="result-item"><div class="label">Cisco format</div><div class="value" id="res-cisco">—</div></div>
      <div class="result-item"><div class="label">OUI</div><div class="value" id="res-oui">—</div></div>
      <div class="result-item"><div class="label">Manufacturer</div><div class="value" id="res-vendor">—</div></div>
      <div class="result-item"><div class="label">Address Type</div><div class="value" id="res-type">—</div></div>
    </div>
    <div class="alert alert-info" id="mac-note" style="display:none;"></div>
  `,
  howItWorks: `
    <p>The first 3 bytes (24 bits) of a MAC address form the OUI (Organizationally Unique Identifier), assigned by the IEEE to a manufacturer. This tool matches the OUI against a curated local reference database of common vendors, entirely client-side. If the OUI isn't in the local database, it clearly reports "Manufacturer not found" rather than guessing — the full IEEE registry has tens of thousands of entries and a complete offline copy is planned for a future phase.</p>
  `,
  examples: `
    <ul>
      <li><strong>B8:27:EB:12:34:56</strong> → Raspberry Pi Foundation</li>
      <li><strong>00:1C:B3:AA:BB:CC</strong> → Apple, Inc.</li>
      <li>The second least-significant bit of the first byte indicates whether the address is "locally administered" (e.g. set by software) rather than burned in by the manufacturer.</li>
    </ul>
  `,
  relatedSlugs: ['reverse-dns', 'port-lookup', 'ip-binary-converter'],
  scriptSrc: '/assets/js/tools/mac-oui-lookup.js',
};
