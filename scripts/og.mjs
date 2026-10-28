// Per-page OG cards for After AI.
//
// The single /og.png told a reader nothing about the page they were clicking —
// at thumbnail size only "The work that stays." survived, so every job link
// looked identical. These cards carry three things and nothing else, because
// three is what remains legible at 300px wide: what kind of page it is, the
// page's own name, and the verdict where there is one.
//
// Rendered with headless Chrome from a local HTML file, so no new dependency
// and no server. Run: node scripts/og.mjs   (then `npm run build`)
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const OUT = join(ROOT, 'public', 'og');
const TMP = join(ROOT, 'node_modules', '.og-tmp');
mkdirSync(OUT, { recursive: true });
mkdirSync(TMP, { recursive: true });

const CHROME = ['google-chrome', 'google-chrome-stable', 'chromium'].find((bin) => {
  try {
    execFileSync('which', [bin], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
});
if (!CHROME) {
  console.error('og: no Chrome/Chromium on PATH — nothing rendered');
  process.exit(1);
}

const fontPath = (pkg, file) => join(ROOT, 'node_modules', pkg, 'files', file);
const FONTS = {
  serif: fontPath('@fontsource/instrument-serif', 'instrument-serif-latin-400-normal.woff2'),
  sans: fontPath('@fontsource-variable/inter', 'inter-latin-wght-normal.woff2'),
  mono: fontPath('@fontsource-variable/jetbrains-mono', 'jetbrains-mono-latin-wght-normal.woff2')
};

const COLORS = {
  survives: '#7ff0c2',
  'at-risk': '#ff9385',
  emerging: '#9cc0ff',
  mixed: '#c9a8ff',
  possible: '#c9a8ff'
};
const LABELS = {
  survives: 'Survives',
  'at-risk': 'Exposed',
  emerging: 'Emerging',
  mixed: 'Mixed',
  possible: 'Possible'
};

/** One line of frontmatter, quotes and escapes handled the way these files use them. */
function fm(text, key) {
  const m = text.match(new RegExp(`^${key}:\\s*"?(.*?)"?\\s*$`, 'm'));
  return m ? m[1].replace(/\\"/g, '"') : '';
}

function card({ kicker, title, badge, badgeColor, foot }) {
  const size = title.length > 46 ? 62 : title.length > 32 ? 74 : title.length > 20 ? 88 : 104;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><style>
@font-face { font-family: 'Serif'; src: url('file://${FONTS.serif}') format('woff2'); font-weight: 400; }
@font-face { font-family: 'Sans'; src: url('file://${FONTS.sans}') format('woff2'); font-weight: 100 900; }
@font-face { font-family: 'Mono'; src: url('file://${FONTS.mono}') format('woff2'); font-weight: 100 800; }
* { margin: 0; box-sizing: border-box; }
html, body { width: 1200px; height: 630px; background: #08080a; overflow: hidden; }
body {
  padding: 64px 72px 56px;
  display: flex; flex-direction: column; justify-content: space-between;
  background:
    radial-gradient(900px 420px at 88% -10%, rgba(127,240,194,.16), transparent 62%),
    radial-gradient(700px 380px at -8% 108%, rgba(156,192,255,.12), transparent 60%),
    #08080a;
  color: #f2efe9;
}
.top { display: flex; align-items: center; justify-content: space-between; }
.kicker { font-family: 'Mono'; font-size: 34px; letter-spacing: .16em; text-transform: uppercase; color: #9aa0a8; }
.badge {
  font-family: 'Mono'; font-size: 30px; letter-spacing: .12em; text-transform: uppercase;
  color: ${badgeColor}; border: 2px solid ${badgeColor}; border-radius: 999px; padding: 10px 24px;
}
h1 {
  font-family: 'Serif'; font-weight: 400; font-size: ${size}px; line-height: 1.02;
  letter-spacing: -0.02em; color: #f6f3ec; max-width: 18ch;
}
.foot { display: flex; align-items: baseline; justify-content: space-between; border-top: 1px solid #23262b; padding-top: 22px; }
.foot span { font-family: 'Mono'; font-size: 24px; color: #7d828a; }
.foot b { font-family: 'Mono'; font-size: 24px; font-weight: 500; color: #7ff0c2; }
</style></head>
<body>
  <div class="top">
    <span class="kicker">${kicker}</span>
    ${badge ? `<span class="badge">${badge}</span>` : ''}
  </div>
  <h1>${title}</h1>
  <div class="foot"><b>after-ai.browserstay.com</b><span>${foot ? 'after AI · ' + foot : ''}</span></div>
</body></html>`;
}

function render(slug, html) {
  const file = join(TMP, `${slug}.html`);
  writeFileSync(file, html);
  const png = join(OUT, `${slug}.png`);
  execFileSync(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--window-size=1200,630',
      `--screenshot=${png}`,
      `file://${file}`
    ],
    { stdio: 'ignore' }
  );
  return png;
}

let made = 0;

// Job pages: the name and the verdict, nothing else.
const jobsDir = join(ROOT, 'src', 'content', 'jobs');
for (const dir of readdirSync(jobsDir)) {
  const file = join(jobsDir, dir, 'job.json');
  if (!existsSync(file)) continue;
  const job = JSON.parse(readFileSync(file, 'utf8'));
  render(
    `jobs-${dir}`,
    card({
      kicker: 'After AI',
      title: job.short || job.name,
      badge: LABELS[job.verdict] ?? job.verdict,
      badgeColor: COLORS[job.verdict] ?? '#c9a8ff',
      foot: job.category ?? ''
    })
  );
  made++;
}

// Section pages: the page's own title, and its eyebrow number.
const sectionsDir = join(ROOT, 'src', 'content', 'sections');
for (const file of readdirSync(sectionsDir)) {
  if (!/\.mdx?$/.test(file)) continue;
  const text = readFileSync(join(sectionsDir, file), 'utf8');
  const key = file.replace(/\.mdx?$/, '');
  const title = fm(text, 'title');
  if (!title) continue;
  render(
    key,
    card({
      kicker: 'After AI',
      title,
      badge: '',
      badgeColor: '#7ff0c2',
      foot: fm(text, 'eyebrow')
    })
  );
  made++;
}

console.log(`og: ${made} cards written to public/og/`);
