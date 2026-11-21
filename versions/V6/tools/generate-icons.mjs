import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const v6Root = path.resolve(__dirname, '..');
const srcDir = path.join(v6Root, 'src');
const iconsDir = path.join(v6Root, 'node_modules', 'bootstrap-icons', 'icons');
const outFile = path.join(srcDir, 'styles', 'icons.css');

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/\.(astro|ts|js)$/.test(entry.name)) out.push(full);
  }
  return out;
}

const icons = new Set();
for (const file of walk(srcDir)) {
  const text = fs.readFileSync(file, 'utf8');
  for (const match of text.matchAll(/\bbi-([a-z0-9-]+)\b/g)) {
    icons.add(match[1]);
  }
}

const lines = [
  '/* ==========================================================================',
  '   ICÔNES VECTORIELLES AUTO-SOUS-ENSEMBLÉES (SVG CSS Masks)',
  '   Généré via `node tools/generate-icons.mjs` — remplace bootstrap-icons (~400 Ko)',
  '   ========================================================================== */',
  '.bi {',
  '  display: inline-block;',
  '  width: 1em;',
  '  height: 1em;',
  '  vertical-align: -0.125em;',
  '  background-color: currentColor;',
  '  -webkit-mask-repeat: no-repeat;',
  '  mask-repeat: no-repeat;',
  '  -webkit-mask-position: center;',
  '  mask-position: center;',
  '  -webkit-mask-size: contain;',
  '  mask-size: contain;',
  '  -webkit-mask-image: var(--bi-svg);',
  '  mask-image: var(--bi-svg);',
  '  flex-shrink: 0;',
  '}',
  ''
];

const missing = [];
for (const name of [...icons].sort()) {
  const svgPath = path.join(iconsDir, `${name}.svg`);
  if (!fs.existsSync(svgPath)) {
    missing.push(name);
    continue;
  }
  const svg = fs
    .readFileSync(svgPath, 'utf8')
    .replace(/\r?\n/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/>\s+</g, '><')
    .replace(/\s+class="[^"]*"/g, '')
    .trim();

  const encoded = svg
    .replace(/%/g, '%25')
    .replace(/#/g, '%23')
    .replace(/"/g, "'")
    .replace(/</g, '%3C')
    .replace(/>/g, '%3E');

  lines.push(`.bi-${name} { --bi-svg: url("data:image/svg+xml,${encoded}"); }`);
}

const output = `${lines.join('\n')}\n`;
fs.writeFileSync(outFile, output, 'utf8');
console.log(
  `icons.css généré : ${(Buffer.byteLength(output) / 1024).toFixed(1)} Ko (${icons.size - missing.length} icônes, manquantes: ${missing.length})`
);
if (missing.length > 0) {
  console.warn('Icônes introuvables :', missing.join(', '));
}
