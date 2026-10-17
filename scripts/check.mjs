#!/usr/bin/env node
/**
 * Build gates. Runs after `astro build` (npm run build).
 *
 *  1. sources   — every source id used in data/content exists, and every source
 *                 in the bibliography is used. Catches a typo'd reference and a
 *                 stale bibliography entry.
 *  2. links     — every internal href in the built HTML resolves to a file.
 *  3. no-slop   — a short list of phrases that should never reach public copy.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = join(ROOT, 'dist');
const SRC = join(ROOT, 'src');
let failures = 0;

const fail = (msg) => {
  failures += 1;
  console.error(`  ✗ ${msg}`);
};
const ok = (msg) => console.log(`  ✓ ${msg}`);

/* ------------------------------------------------------------------ 1. sources */

const sourcesFile = readFileSync(join(SRC, 'data/sources.ts'), 'utf8');
const declared = new Set([...sourcesFile.matchAll(/\bid:\s*'([^']+)'/g)].map((m) => m[1]));

const used = new Map(); // id -> where
const noteUse = (id, where) => {
  if (!used.has(id)) used.set(id, where);
};

// series + any data module
for (const f of readdirSync(join(SRC, 'data'))) {
  if (!f.endsWith('.ts') || f === 'sources.ts') continue;
  const text = readFileSync(join(SRC, 'data', f), 'utf8');
  for (const m of text.matchAll(/source:\s*'([^']+)'/g)) noteUse(m[1], `src/data/${f}`);
}

// job.json records
const jobsDir = join(SRC, 'content/jobs');
for (const slug of readdirSync(jobsDir)) {
  const file = join(jobsDir, slug, 'job.json');
  if (!existsSync(file)) continue;
  const record = JSON.parse(readFileSync(file, 'utf8'));
  for (const m of record.metrics ?? []) noteUse(m.source, `${slug}/job.json (metric)`);
  for (const c of record.claims ?? []) noteUse(c.source, `${slug}/job.json (claim)`);
  for (const s of record.series ?? []) noteUse(s.source, `${slug}/job.json (series)`);
}

// <Cite ids="a,b" /> inside MDX
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)]
  );

for (const file of walk(join(SRC, 'content')).filter((f) => /\.mdx?$/.test(f))) {
  const text = readFileSync(file, 'utf8');
  for (const m of text.matchAll(/<Cite\s+ids="([^"]+)"/g)) {
    for (const id of m[1].split(',').map((s) => s.trim())) noteUse(id, relative(SRC, file));
  }
}

let unknown = 0;
for (const [id, where] of used) {
  if (!declared.has(id)) {
    unknown += 1;
    fail(`unknown source id "${id}" used in ${where}`);
  }
}
if (unknown === 0) ok(`${used.size} source ids referenced, all declared`);

const unused = [...declared].filter((id) => !used.has(id));
if (unused.length) fail(`declared but never used: ${unused.join(', ')}`);
else ok('no unused bibliography entries');

/* -------------------------------------------------------------------- 2. links */

const pages = walk(DIST).filter((f) => f.endsWith('.html'));
let checked = 0;
let broken = 0;
const seen = new Set();

for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (!href.startsWith('/')) continue;
    const path = href.split('#')[0].split('?')[0];
    if (!path || seen.has(path)) continue;
    seen.add(path);
    checked += 1;

    const candidates = path.endsWith('/')
      ? [join(DIST, path, 'index.html')]
      : [join(DIST, `${path}.html`), join(DIST, path, 'index.html'), join(DIST, path)];

    const found = candidates.some((c) => existsSync(c) && statSync(c).isFile());
    if (!found) {
      broken += 1;
      fail(`${href} (from ${relative(DIST, page)}) resolves to nothing`);
    }
  }
}
if (!broken) ok(`${checked} internal links resolve`);

/* ------------------------------------------------------------------- 3. copy */

const banned = ['philosopher', 'lorem ipsum', 'TODO', 'PLACEHOLDER', 'John Doe'];
const hits = [];
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  for (const word of banned) if (html.includes(word)) hits.push(`${word} in ${relative(DIST, page)}`);
}
if (hits.length) hits.forEach(fail);
else ok('no scaffolding copy in the output');

/* ---------------------------------------------------------------------- done */

if (failures) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log(`\nall checks passed — ${pages.length} pages, ${checked} distinct internal links`);
