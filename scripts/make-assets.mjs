#!/usr/bin/env node
/**
 * Regenerates the social card and the icon set from the two HTML sources in
 * this folder, so the artwork is code and not a binary nobody can edit.
 *
 *   npm run assets
 *
 * - scripts/og-card.html  -> public/og.png            1200x630 (summary_large_image)
 * - scripts/icon.html     -> public/apple-touch-icon.png 180x180
 *                            public/icon-192.png         192x192
 *                            public/icon-512.png         512x512
 *                            public/favicon.ico          16/32/48 (multi-size)
 *
 * Chrome is used at an exact --window-size with --force-device-scale-factor=1;
 * without that flag the output is silently 2x and the og:image:width lies.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC = join(ROOT, 'public');
mkdirSync(PUBLIC, { recursive: true });

const CHROME = process.env.CHROME_PATH || 'google-chrome';

function render(html, out, w, h) {
  execFileSync(
    CHROME,
    [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      '--hide-scrollbars',
      '--allow-file-access-from-files',
      '--force-device-scale-factor=1',
      `--window-size=${w},${h}`,
      '--virtual-time-budget=9000',
      `--screenshot=${out}`,
      `file://${join(ROOT, html)}`,
    ],
    { stdio: 'ignore' }
  );
  if (!existsSync(out)) throw new Error(`Chrome did not write ${out}`);
  console.log(`  ✓ ${out.replace(ROOT + '/', '')} (${w}x${h})`);
}

render('scripts/og-card.html', join(PUBLIC, 'og.png'), 1200, 630);
render('scripts/icon.html', join(PUBLIC, 'apple-touch-icon.png'), 180, 180);

// Bigger app icons and a real multi-size .ico from the 512 render.
render('scripts/icon.html', join(PUBLIC, 'icon-512.png'), 512, 512);

const py = `
from PIL import Image
import sys
pub = sys.argv[1]
big = Image.open(pub + "/icon-512.png").convert("RGBA")
big.resize((192, 192), Image.LANCZOS).save(pub + "/icon-192.png")
big.save(pub + "/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
print("  ✓ public/icon-192.png (192x192)")
print("  ✓ public/favicon.ico (16/32/48)")
`;
execFileSync('python3', ['-c', py, PUBLIC], { stdio: 'inherit' });
