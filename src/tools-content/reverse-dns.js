export default {
  seoTitle: 'Reverse DNS Lookup Tool – Free Network Tool | NetEngToolkit',
  seoDescription: 'Look up the PTR hostname associated with an IPv4 or IPv6 address using a real DNS-over-HTTPS query.',
  intro: 'Enter an IPv4 or IPv6 address to look up its PTR (reverse DNS) hostname, if one exists.',
  formHtml: `
    <div class="field">
      <label for="rdns-ip">IP address</label>
      <input type="text" id="rdns-ip" placeholder="8.8.8.8" autocomplete="off" required />
    </div>
  `,
  resultsHtml: `
    <div class="result-grid">
      <div class="result-item"><div class="label">IP Address</div><div class="value" id="res-ip">—</div></div>
      <div class="result-item"><div class="label">Hostname (PTR)</div><div class="value" id="res-hostname">—</div></div>
    </div>
  `,
  howItWorks: `
    <p>Reverse DNS looks up the domain name associated with an IP address, using a special zone (<code>in-addr.arpa</code> for IPv4, <code>ip6.arpa</code> for IPv6). Not every IP address has a PTR record — many residential and cloud IPs don't. If none exists, this tool clearly reports "No PTR record found" rather than guessing a hostname.</p>
  `,
  examples: `
    <ul>
      <li><strong>8.8.8.8</strong> → typically resolves to a Google-operated hostname.</li>
      <li>Reverse DNS is commonly checked by mail servers as a spam-filtering signal.</li>
    </ul>
  `,
  relatedSlugs: ['dns-lookup', 'mac-oui-lookup', 'ping-latency'],
  scriptSrc: '/assets/js/tools/reverse-dns.js',
};
