import { renderLayout } from './layout.js';
import { TOOLS, CATEGORIES } from '../data/tools.js';

export function renderToolsIndex() {
  const bodyHtml = `
<nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Home</a> &rsaquo; <span>Tools</span></nav>
<h1>All Tools</h1>
<p class="lede">Browse every NetEngToolkit tool, organized by category, or search below.</p>
<div class="search-box" style="margin:0 0 32px;">
  <label for="tools-search" class="visually-hidden">Search network tools</label>
  <input type="text" id="tools-search" placeholder="Search network tools..." autocomplete="off" />
</div>
<p id="search-empty-state" class="alert alert-info" hidden>No tools match your search.</p>

${CATEGORIES.map((c) => `
<section class="tool-category" id="${c.id}">
  <h2>${c.name}</h2>
  <div class="tool-grid">
    ${TOOLS.filter((t) => t.category === c.id).map((t) => `
    <article class="tool-card" data-search="${t.name.toLowerCase()} ${t.keywords} ${c.name.toLowerCase()}">
      <span class="tool-card__icon" aria-hidden="true">${t.icon}</span>
      <h3>${t.name}</h3>
      <p>${t.description}</p>
      <a class="btn btn-secondary" href="/tools/${t.slug}/">Open Tool</a>
    </article>`).join('')}
  </div>
</section>`).join('')}
`;

  return renderLayout({
    title: 'All Network Tools | NetEngToolkit',
    description: 'Browse the full directory of free network engineering tools: subnet calculators, DNS lookups, diagnostics, and more.',
    canonicalPath: '/tools/',
    bodyHtml,
    activeNav: 'tools',
  });
}
