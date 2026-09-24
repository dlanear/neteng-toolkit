// Build script: generates every static HTML page into /public from the
// shared layout + per-tool content modules. No build dependencies required —
// pure Node ESM. Run with: node scripts/build.js
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { TOOLS } from '../src/data/tools.js';
import { renderHome } from '../src/templates/home.js';
import { renderToolsIndex } from '../src/templates/toolsIndex.js';
import { renderToolPage } from '../src/templates/toolPage.js';
import { renderStaticPage, STATIC_SLUGS } from '../src/templates/staticPage.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC_DIR = join(ROOT, 'public');
const SITE_URL = 'https://neteng-toolkit.pages.dev';

function writePage(relativeDir, html) {
  const dir = join(PUBLIC_DIR, relativeDir);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html, 'utf8');
  console.log(`  wrote /${relativeDir}/index.html`);
}

async function build() {
  console.log('Building NetEngToolkit static site...');

  const paths = ['/', '/tools/'];

  // Homepage
  writePage('', renderHome());

  // Tools directory
  writePage('tools', renderToolsIndex());

  // Static pages
  for (const slug of STATIC_SLUGS) {
    writePage(slug, renderStaticPage(slug));
    paths.push(`/${slug}/`);
  }

  // Tool pages — each tool's content module lives in src/tools-content/<slug>.js
  for (const tool of TOOLS) {
    const contentModule = await import(`../src/tools-content/${tool.slug}.js`);
    const content = contentModule.default;
    const html = renderToolPage({ tool, ...content });
    writePage(`tools/${tool.slug}`, html);
    paths.push(`/tools/${tool.slug}/`);
  }

  // sitemap.xml
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`).join('\n')}
</urlset>
`;
  writeFileSync(join(PUBLIC_DIR, 'sitemap.xml'), sitemap, 'utf8');
  console.log('  wrote /sitemap.xml');

  console.log(`\nDone. Generated ${paths.length} pages into /public.`);
}

build().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
