export function renderLayout({
  title,
  description,
  canonicalPath,
  bodyHtml,
  activeNav = '',
  extraHead = '',
  bodyScripts = '',
}) {
  const siteUrl = 'https://neteng-toolkit.pages.dev'; // update after custom domain is attached
  const canonical = `${siteUrl}${canonicalPath}`;

  const navItem = (href, label, key) =>
    `<a href="${href}"${activeNav === key ? ' aria-current="page"' : ''}>${label}</a>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<meta name="description" content="${description}" />
<link rel="canonical" href="${canonical}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="${canonical}" />
<meta name="twitter:card" content="summary" />
<meta name="theme-color" content="#0a5cad" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="stylesheet" href="/assets/css/style.css" />
<script>
  // Apply theme before paint to avoid a flash of the wrong theme.
  (function () {
    try {
      var t = localStorage.getItem('net-eng-toolkit-theme');
      if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
    } catch (e) {}
  })();
</script>
${extraHead}
</head>
<body>
<a class="skip-link" href="#main-content">Skip to main content</a>
<header class="site-header">
  <div class="site-header__inner">
    <a class="brand" href="/">
      <span class="brand__mark" aria-hidden="true">NE</span>
      <span>NetEngToolkit</span>
    </a>
    <nav class="main-nav" aria-label="Primary">
      ${navItem('/', 'Home', 'home')}
      ${navItem('/tools/', 'Tools', 'tools')}
      ${navItem('/about/', 'About', 'about')}
    </nav>
    <div class="header-actions">
      <button id="theme-toggle" class="theme-toggle" type="button" aria-pressed="false">
        <span aria-hidden="true">🌓</span>
        <span class="theme-toggle__label">Theme</span>
      </button>
    </div>
  </div>
</header>
<main id="main-content">
  <div class="container">
    ${bodyHtml}
  </div>
</main>
<footer class="site-footer">
  <div class="site-footer__inner">
    <div>© ${new Date().getFullYear()} NetEngToolkit. Practical network engineering tools.</div>
    <div class="footer-links">
      <a href="/about/">About</a>
      <a href="/privacy/">Privacy</a>
      <a href="/terms/">Terms</a>
      <a href="/tools/">All Tools</a>
    </div>
  </div>
</footer>
<script src="/assets/js/theme.js"></script>
<script src="/assets/js/search.js"></script>
${bodyScripts}
</body>
</html>
`;
}
