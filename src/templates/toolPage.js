import { renderLayout } from './layout.js';
import { TOOLS } from '../data/tools.js';

export function renderToolPage({
  tool,
  seoTitle,
  seoDescription,
  intro,
  formHtml,
  resultsHtml,
  howItWorks,
  examples,
  relatedSlugs = [],
  scriptSrc,
  jsonLd = '',
}) {
  const related = relatedSlugs
    .map((slug) => TOOLS.find((t) => t.slug === slug))
    .filter(Boolean);

  const bodyHtml = `
<nav class="breadcrumb" aria-label="Breadcrumb">
  <a href="/">Home</a> &rsaquo; <a href="/tools/">Tools</a> &rsaquo; <span>${tool.name}</span>
</nav>
<h1>${tool.icon} ${tool.name}</h1>
<p class="lede">${intro}</p>

<section class="card" aria-labelledby="input-heading">
  <h2 id="input-heading">Input</h2>
  <form id="tool-form" novalidate>
    ${formHtml}
    <div class="btn-row">
      <button type="submit" class="btn btn-primary">Calculate</button>
      <button type="reset" class="btn btn-secondary" id="reset-btn">Reset</button>
    </div>
  </form>
  <div id="form-error" class="alert alert-error" role="alert" style="display:none;"></div>
</section>

<section class="card results" id="results-card" aria-labelledby="results-heading">
  <h2 id="results-heading">Results</h2>
  <div id="results-body">
    ${resultsHtml}
  </div>
  <div class="btn-row">
    <button type="button" class="btn btn-secondary copy-btn" id="copy-btn">Copy Results</button>
  </div>
  <p role="status" aria-live="polite" class="visually-hidden" id="live-status"></p>
</section>

<section class="card">
  <h2>How It Works</h2>
  ${howItWorks}
</section>

<section class="card">
  <h2>Examples &amp; Common Use Cases</h2>
  ${examples}
</section>

${related.length ? `
<section aria-labelledby="related-heading">
  <h2 id="related-heading">Related Tools</h2>
  <div class="related-tools">
    ${related.map((r) => `<a href="/tools/${r.slug}/">${r.icon} ${r.name}</a>`).join('\n    ')}
  </div>
</section>` : ''}
`;

  return renderLayout({
    title: seoTitle,
    description: seoDescription,
    canonicalPath: `/tools/${tool.slug}/`,
    bodyHtml,
    activeNav: 'tools',
    extraHead: jsonLd,
    bodyScripts: `<script type="module" src="${scriptSrc}"></script>`,
  });
}
