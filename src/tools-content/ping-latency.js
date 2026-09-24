export default {
  seoTitle: 'Ping / Latency Test – Free Network Tool | NetEngToolkit',
  seoDescription: 'Run a real HTTP latency test against a host and see minimum, maximum, and average response times. Clearly labeled — this is not raw ICMP ping.',
  intro: 'Test HTTP response latency against a host. Browsers and edge functions cannot send raw ICMP packets, so this performs a real HTTP latency test and labels it clearly as such.',
  formHtml: `
    <div class="field">
      <label for="ping-target">Target (hostname or URL)</label>
      <input type="text" id="ping-target" placeholder="example.com" autocomplete="off" required />
    </div>
  `,
  resultsHtml: `
    <div class="badge" id="test-type-badge">HTTP latency test</div>
    <div class="result-grid" style="margin-top:12px;">
      <div class="result-item"><div class="label">Minimum</div><div class="value" id="res-min">—</div></div>
      <div class="result-item"><div class="label">Average</div><div class="value" id="res-avg">—</div></div>
      <div class="result-item"><div class="label">Maximum</div><div class="value" id="res-max">—</div></div>
      <div class="result-item"><div class="label">Packet Loss</div><div class="value" id="res-loss">—</div></div>
    </div>
    <p class="hint" id="ping-note"></p>
  `,
  howItWorks: `
    <p>Real ICMP ping requires raw socket access, which is not available to browser JavaScript or to serverless edge functions like Cloudflare Workers. Instead, this tool sends several real HTTP requests to the target and measures how long each takes to respond — a genuine, useful latency signal for web-facing services, just measured at a different layer than ICMP. It is always labeled "HTTP latency test," never presented as ICMP ping.</p>
  `,
  examples: `
    <ul>
      <li>Use this to compare response times between two CDN endpoints or regions.</li>
      <li>High variance between minimum and maximum can indicate network congestion or an overloaded server.</li>
    </ul>
  `,
  relatedSlugs: ['http-status', 'http-headers', 'dns-lookup'],
  scriptSrc: '/assets/js/tools/ping-latency.js',
};
