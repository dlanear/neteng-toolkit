export default {
  seoTitle: 'Bandwidth Calculator – Free Network Tool | NetEngToolkit',
  seoDescription: 'Estimate file transfer time from file size and bandwidth, or work backward from a target transfer time to the bandwidth required.',
  intro: 'Estimate how long a file transfer will take given a file size and bandwidth, or work backward to find the bandwidth needed to hit a target time.',
  formHtml: `
    <div class="field">
      <label for="bw-mode">Mode</label>
      <select id="bw-mode">
        <option value="time">File Size + Bandwidth → Transfer Time</option>
        <option value="bandwidth">File Size + Transfer Time → Required Bandwidth</option>
      </select>
    </div>
    <div class="field-row">
      <div class="field">
        <label for="bw-size">File size</label>
        <input type="number" id="bw-size" min="0" step="any" placeholder="100" required />
      </div>
      <div class="field">
        <label for="bw-size-unit">Unit</label>
        <select id="bw-size-unit"><option>KB</option><option selected>MB</option><option>GB</option><option>TB</option></select>
      </div>
    </div>
    <div class="field-row" id="bw-rate-fields">
      <div class="field">
        <label for="bw-rate">Bandwidth</label>
        <input type="number" id="bw-rate" min="0" step="any" placeholder="100" required />
      </div>
      <div class="field">
        <label for="bw-rate-unit">Unit</label>
        <select id="bw-rate-unit"><option>bps</option><option>Kbps</option><option selected>Mbps</option><option>Gbps</option></select>
      </div>
    </div>
    <div class="field" id="bw-time-field" style="display:none;">
      <label for="bw-time">Target transfer time (seconds)</label>
      <input type="number" id="bw-time" min="0" step="any" placeholder="60" />
    </div>
  `,
  resultsHtml: `
    <div class="result-grid" id="bw-results-time">
      <div class="result-item"><div class="label">Transfer Time</div><div class="value" id="res-time">—</div></div>
      <div class="result-item"><div class="label">Bits Transferred</div><div class="value" id="res-bits">—</div></div>
      <div class="result-item"><div class="label">Bytes Transferred</div><div class="value" id="res-bytes">—</div></div>
    </div>
    <div class="result-grid" id="bw-results-bandwidth" style="display:none;">
      <div class="result-item"><div class="label">Required (Mbps)</div><div class="value" id="res-mbps">—</div></div>
      <div class="result-item"><div class="label">Required (Kbps)</div><div class="value" id="res-kbps">—</div></div>
      <div class="result-item"><div class="label">Required (Gbps)</div><div class="value" id="res-gbps">—</div></div>
    </div>
    <div class="alert alert-info">Actual transfer speed is typically lower than the theoretical rate due to protocol overhead, network congestion, latency, and other real-world conditions.</div>
  `,
  howItWorks: `
    <p>This calculator converts your file size to bits and divides by your bandwidth (also in bits per second) to estimate transfer time — or rearranges the same formula to solve for the bandwidth needed to hit a target time. File size units use the decimal convention (1 KB = 1000 bytes), matching how bandwidth and file sizes are typically marketed and billed.</p>
  `,
  examples: `
    <ul>
      <li><strong>100 MB over a 100 Mbps connection</strong> → roughly 8 seconds at full theoretical throughput.</li>
      <li>Use reverse mode to find out what connection speed you'd need to transfer a 4 GB file in under 5 minutes.</li>
    </ul>
  `,
  relatedSlugs: ['ping-latency', 'http-status'],
  scriptSrc: '/assets/js/tools/bandwidth-calculator.js',
};
