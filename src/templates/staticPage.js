import { renderLayout } from './layout.js';

const PAGES = {
  about: {
    title: 'About | NetEngToolkit',
    description: 'NetEngToolkit is a free, practical toolkit of calculators, converters, and diagnostics for network engineers and learners.',
    heading: 'About NetEngToolkit',
    bodyHtml: `
      <p class="lede">NetEngToolkit is a free, practical toolkit built for network engineers, system administrators, IT professionals, students, and anyone learning networking.</p>
      <h2>What we're building</h2>
      <p>Phase 1 focuses on the tools engineers reach for most often: subnetting and CIDR calculators, DNS lookups, and everyday diagnostics like HTTP status and header checks — all in one fast, ad-free, account-free place.</p>
      <h2>Our principles</h2>
      <ul>
        <li>Calculations that can run in your browser, run in your browser. Nothing is sent to a server unnecessarily.</li>
        <li>We never fabricate a result. If a lookup or diagnostic can't be completed, we say so clearly.</li>
        <li>No accounts, no unnecessary sign-ups, no tracking beyond what's needed to keep the site running.</li>
      </ul>
      <h2>Open development</h2>
      <p>NetEngToolkit is built for GitHub-based development and Cloudflare deployment, with a modular architecture designed to make adding new tools straightforward in future phases.</p>
    `,
  },
  privacy: {
    title: 'Privacy Policy | NetEngToolkit',
    description: 'How NetEngToolkit handles your data: what runs locally in your browser, and what is sent to a lookup service and why.',
    heading: 'Privacy Policy',
    bodyHtml: `
      <p class="lede">This page explains what happens to the information you enter into NetEngToolkit's tools.</p>
      <h2>Calculations that run locally</h2>
      <p>Subnet, CIDR, VLSM, IP range, wildcard mask, binary conversion, bandwidth, port lookup, and MAC/OUI lookup tools run entirely in your browser. The values you enter into these tools are never transmitted to our servers or any third party.</p>
      <h2>Tools that require an external lookup</h2>
      <p>DNS Lookup and Reverse DNS Lookup send your query to a DNS-over-HTTPS resolver operated by Cloudflare in order to perform a real DNS query. Ping/Latency, HTTP Status, HTTP Headers, and SSL/TLS Checker send a request, from our server, to the host or URL you specify, in order to report genuine results. We do not store the domains, IPs, MAC addresses, or URLs you enter beyond what is needed to serve the immediate request.</p>
      <h2>No accounts, no unnecessary data collection</h2>
      <p>NetEngToolkit does not require an account to use any Phase 1 tool. We store your light/dark theme preference in your browser's local storage so it persists between visits — this stays on your device and is not sent to us.</p>
      <h2>Changes to this policy</h2>
      <p>As NetEngToolkit adds tools in future phases, this policy will be updated to reflect any new data handling.</p>
    `,
  },
  terms: {
    title: 'Terms of Use | NetEngToolkit',
    description: 'Terms of use for NetEngToolkit — acceptable use, no warranty, and limitations on the diagnostic tools provided.',
    heading: 'Terms of Use',
    bodyHtml: `
      <p class="lede">By using NetEngToolkit, you agree to the following terms.</p>
      <h2>Acceptable use</h2>
      <p>NetEngToolkit's diagnostic tools (Ping/Latency, HTTP Status, HTTP Headers, SSL/TLS Checker, DNS Lookup, Reverse DNS) are intended for legitimate network engineering, troubleshooting, and educational use against hosts you own, operate, or are otherwise authorized to test. These tools are reference/diagnostic utilities, not scanning or reconnaissance tools, and must not be used to probe systems without authorization.</p>
      <h2>No warranty</h2>
      <p>NetEngToolkit is provided "as is," without warranty of any kind. Calculations are believed to be accurate, but you are responsible for verifying results before applying them to production network configurations.</p>
      <h2>External data and lookups</h2>
      <p>Some tools depend on third-party or public services (such as DNS-over-HTTPS resolvers) that are outside our control and may be unavailable or rate-limited at times. We report these failures honestly rather than presenting fabricated results.</p>
      <h2>Changes</h2>
      <p>These terms may be updated as NetEngToolkit adds new tools in future phases.</p>
    `,
  },
};

export function renderStaticPage(slug) {
  const page = PAGES[slug];
  const bodyHtml = `
<nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> &rsaquo; <span>${page.heading}</span></nav>
<h1>${page.heading}</h1>
<div class="card">${page.bodyHtml}</div>
`;
  return renderLayout({
    title: page.title,
    description: page.description,
    canonicalPath: `/${slug}/`,
    bodyHtml,
    activeNav: slug === 'about' ? 'about' : '',
  });
}

export const STATIC_SLUGS = Object.keys(PAGES);
