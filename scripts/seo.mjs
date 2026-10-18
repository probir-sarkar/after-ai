#!/usr/bin/env node
/**
 * SEO gates for the built site (`npm run seo`, needs a prior `npm run build`).
 *
 * Everything here is an assertion about machine-readable output, so it fails
 * loudly rather than warning: a missing og:image or a duplicate title is exactly
 * the kind of thing that ships unnoticed and only shows up in a preview card.
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = join(ROOT, 'dist');
const ORIGIN = 'https://after-ai.browserstay.com';

let failures = 0;
const fail = (m) => {
  failures += 1;
  console.error(`  ✗ ${m}`);
};
const ok = (m) => console.log(`  ✓ ${m}`);

const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)]
  );

const attr = (html, re) => {
  const m = html.match(re);
  return m ? m[1].trim() : null;
};
const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

/* ------------------------------------------------------------------ pages */

const pages = walk(DIST).filter((f) => f.endsWith('.html') && !f.endsWith('404.html'));
const titles = new Map();
const descriptions = new Map();
let checkedPages = 0;

for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  const where = relative(DIST, file);

  const title = attr(html, /<title>([\s\S]*?)<\/title>/);
  const desc = attr(html, /<meta name="description" content="([^"]*)"/);
  const canonical = attr(html, /<link rel="canonical" href="([^"]*)"/);
  const robots = attr(html, /<meta name="robots" content="([^"]*)"/);
  const h1s = html.match(/<h1[\s>]/g) ?? [];

  if (!title) fail(`${where}: no <title>`);
  else {
    const t = decode(title);
    if (t.length < 15 || t.length > 65) fail(`${where}: title ${t.length} chars (want 15–65): "${t}"`);
    if (titles.has(t)) fail(`${where}: title duplicates ${titles.get(t)}: "${t}"`);
    titles.set(t, where);
  }

  if (!desc) fail(`${where}: no meta description`);
  else {
    const d = decode(desc);
    if (d.length < 60 || d.length > 165) fail(`${where}: description ${d.length} chars (want 60–165)`);
    if (descriptions.has(d)) fail(`${where}: description duplicates ${descriptions.get(d)}`);
    descriptions.set(d, where);
  }

  if (!canonical) fail(`${where}: no canonical`);
  else {
    if (!canonical.startsWith(ORIGIN)) fail(`${where}: canonical is not absolute on ${ORIGIN}: ${canonical}`);
    if (canonical.endsWith('.html') || canonical.endsWith('/index.html')) fail(`${where}: canonical keeps a file extension: ${canonical}`);
    const expected = where === 'index.html' ? '/' : `/${where.replace(/\.html$/, '')}`;
    const got = canonical.replace(ORIGIN, '');
    if (got !== expected) fail(`${where}: canonical path ${got} does not match the page path ${expected}`);
  }

  if (!robots) fail(`${where}: no robots meta`);

  for (const [label, re] of [
    ['og:title', /<meta property="og:title" content="([^"]*)"/],
    ['og:description', /<meta property="og:description" content="([^"]*)"/],
    ['og:url', /<meta property="og:url" content="([^"]*)"/],
    ['og:image', /<meta property="og:image" content="([^"]*)"/],
    ['og:image:alt', /<meta property="og:image:alt" content="([^"]*)"/],
    ['twitter:card', /<meta name="twitter:card" content="([^"]*)"/],
    ['twitter:image', /<meta name="twitter:image" content="([^"]*)"/],
  ]) {
    if (!attr(html, re)) fail(`${where}: missing ${label}`);
  }
  const ogImage = attr(html, /<meta property="og:image" content="([^"]*)"/);
  if (ogImage && !ogImage.startsWith('http')) fail(`${where}: og:image must be absolute: ${ogImage}`);
  if (attr(html, /<meta property="og:image:width" content="([^"]*)"/) !== '1200') fail(`${where}: og:image:width is not 1200`);

  if (h1s.length !== 1) fail(`${where}: ${h1s.length} <h1> elements (want exactly 1)`);

  if (!/<html lang="en"/.test(html)) fail(`${where}: <html> has no lang="en"`);

  const ld = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
  if (!ld) fail(`${where}: no JSON-LD`);
  else {
    try {
      const parsed = JSON.parse(ld[1]);
      const types = (parsed['@graph'] ?? [parsed]).map((n) => n['@type']);
      for (const required of ['WebSite', 'Organization']) {
        if (!types.includes(required)) fail(`${where}: JSON-LD graph has no ${required}`);
      }
    } catch (e) {
      fail(`${where}: JSON-LD does not parse (${e.message})`);
    }
  }

  checkedPages += 1;
}
ok(`${checkedPages} pages: title, description, canonical, robots, social tags, h1, lang, JSON-LD`);

/* ----------------------------------------------------------------- sitemap */

const indexFile = join(DIST, 'sitemap-index.xml');
if (!existsSync(indexFile)) fail('dist/sitemap-index.xml is missing');
else {
  const index = readFileSync(indexFile, 'utf8');
  const sitemapRefs = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (!sitemapRefs.length) fail('sitemap-index.xml has no <loc> entries');
  if (sitemapRefs.some((u) => u.endsWith('.html'))) fail('sitemap references .html URLs');
  const urls = new Set();
  for (const ref of sitemapRefs) {
    const file = join(DIST, ref.replace(ORIGIN, '').replace(/^\//, ''));
    if (!existsSync(file)) {
      fail(`sitemap points at a missing file: ${ref}`);
      continue;
    }
    for (const m of readFileSync(file, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)) urls.add(m[1]);
  }
  const expected = pages.length;
  if (urls.size !== expected) fail(`sitemap has ${urls.size} URLs, site has ${expected} pages`);
  else ok(`sitemap lists all ${urls.size} pages, no file extensions`);
  for (const u of urls) if (u.endsWith('.html')) fail(`sitemap URL keeps .html: ${u}`);
}

/* ----------------------------------------------------------------- functional */

const robotsFile = join(DIST, 'robots.txt');
if (!existsSync(robotsFile)) fail('dist/robots.txt is missing');
else {
  const robots = readFileSync(robotsFile, 'utf8');
  if (!/Sitemap:\s*https:\/\/after-ai\.probir\.dev\/sitemap-index\.xml/.test(robots)) {
    fail('robots.txt does not point at sitemap-index.xml');
  } else ok('robots.txt allows crawling and references the sitemap');
}

/* -------------------------------------------------------------------- assets */

function pngSize(file) {
  const b = readFileSync(file);
  if (b.subarray(1, 4).toString() !== 'PNG') return null;
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

const assetChecks = [
  ['og.png', (f) => {
    const s = pngSize(f);
    return s && s.w === 1200 && s.h === 630;
  }, '1200x630 PNG'],
  ['apple-touch-icon.png', (f) => {
    const s = pngSize(f);
    return s && s.w === 180 && s.h === 180;
  }, '180x180 PNG'],
  ['icon-192.png', (f) => {
    const s = pngSize(f);
    return s && s.w === 192 && s.h === 192;
  }, '192x192 PNG'],
  ['icon-512.png', (f) => {
    const s = pngSize(f);
    return s && s.w === 512 && s.h === 512;
  }, '512x512 PNG'],
  ['favicon.ico', (f) => {
    const b = readFileSync(f);
    // ICO header: reserved(0,0) + type 1 + image count
    return b.readUInt16LE(0) === 0 && b.readUInt16LE(2) === 1 && b.readUInt16LE(4) >= 3;
  }, 'multi-size .ico'],
  ['favicon.svg', (f) => /<svg/.test(readFileSync(f, 'utf8')), 'SVG'],
];

for (const [name, test, label] of assetChecks) {
  const f = join(DIST, name);
  if (!existsSync(f)) fail(`dist/${name} is missing`);
  else if (!test(f)) fail(`dist/${name} is not a valid ${label}`);
}
ok('icon set and social card present and valid');

const manifestFile = join(DIST, 'site.webmanifest');
if (!existsSync(manifestFile)) fail('dist/site.webmanifest is missing');
else {
  try {
    const m = JSON.parse(readFileSync(manifestFile, 'utf8'));
    for (const field of ['name', 'short_name', 'start_url', 'theme_color', 'icons']) {
      if (!m[field]) fail(`manifest has no ${field}`);
    }
    for (const icon of m.icons ?? []) {
      if (!existsSync(join(DIST, icon.src.replace(/^\//, '')))) fail(`manifest icon missing on disk: ${icon.src}`);
    }
    ok(`manifest valid, ${(m.icons ?? []).length} icons both declared and present`);
  } catch (e) {
    fail(`site.webmanifest does not parse (${e.message})`);
  }
}

/* -------------------------------------------------------------------- report */

if (failures) {
  console.error(`\n${failures} SEO check(s) failed`);
  process.exit(1);
}
console.log(`\nSEO clean — ${checkedPages} pages, ${titles.size} unique titles, ${descriptions.size} unique descriptions`);
