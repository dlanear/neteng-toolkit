import { renderLayout } from './layout.js';
import { TOOLS, CATEGORIES } from '../data/tools.js';

export function renderHome() {
  const featured = TOOLS.slice(0, 6);

  const bodyHtml = `
<section class="hero">
  <h1>NetEngToolkit</h1>
  <p class="lede">Practical Network Engineering Tools</p>
  <p class="lede">Free tools for subnetting, IP addressing, DNS, diagnostics, networking calculations, and everyday network engineering tasks.</p>
  <div class="search-box">
    <label for="home-search" class="visually-hidden">Search network tools</label>
    <input type="text" id="home-search" placeholder="Search network tools..." autocomplete="off" />
  </div>
  <div class="btn-row" style="justify-content:center;">
    <a href="/tools/" class="btn btn-primary">Explore Tools</a>
  </div>
</section>

<section>
  <h2>Popular Tools</h2>
  <div class="tool-grid">
    ${featured.map((t) => `
    <article class="tool-card" data-search="${t.name.toLowerCase()} ${t.keywords}">
      <span class="tool-card__icon" aria-hidden="true">${t.icon}</span>
      <h3>${t.name}</h3>
      <p>${t.description}</p>
      <a class="btn btn-secondary" href="/tools/${t.slug}/">Open Tool</a>
    </article>`).join('')}
  </div>
</section>

<section style="margin-top:40px;">
  <h2>Categories</h2>
  <div class="tool-grid">
    ${CATEGORIES.map((c) => `
    <article class="tool-card">
      <h3>${c.name}</h3>
      <p>${TOOLS.filter((t) => t.category === c.id).length} tools</p>
      <a class="btn btn-secondary" href="/tools/#${c.id}">View Category</a>
    </article>`).join('')}
  </div>
</section>
`;

  return renderLayout({
    title: 'NetEngToolkit – Practical Network Engineering Tools',
    description: 'Free tools for subnetting, IP addressing, DNS, diagnostics, networking calculations, and everyday network engineering tasks.',
    canonicalPath: '/',
    bodyHtml,
    activeNav: 'home',
  });
}
