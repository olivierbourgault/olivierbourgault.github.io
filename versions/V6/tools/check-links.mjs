import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const v6Root = path.resolve(__dirname, '..');
const repoRoot = path.resolve(v6Root, '..', '..');
const siteDir = path.join(v6Root, '.site');

if (!fs.existsSync(siteDir)) {
  console.error('Erreur : versions/V6/.site introuvable. Lancez `npm run site:assemble` d’abord.');
  process.exit(1);
}

const errors = [];
const archiveWarnings = [];

function sha256(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function walkFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(full));
    } else if (entry.isFile()) {
      results.push(full);
    }
  }
  return results;
}

// 1. Vérifier l'intégrité octet par octet de V1..V5
for (const ver of ['V1', 'V2', 'V3', 'V4', 'V5']) {
  const origDir = path.join(repoRoot, 'versions', ver);
  const copyDir = path.join(siteDir, 'versions', ver);
  const origFiles = walkFiles(origDir);
  const copyFiles = walkFiles(copyDir);

  if (origFiles.length !== copyFiles.length) {
    errors.push(`Archive ${ver} : nombre de fichiers différent (${origFiles.length} vs ${copyFiles.length}).`);
    continue;
  }

  for (const orig of origFiles) {
    const rel = path.relative(origDir, orig);
    const copied = path.join(copyDir, rel);
    if (!fs.existsSync(copied) || sha256(orig) !== sha256(copied)) {
      errors.push(`Archive ${ver} altérée pour ${rel}`);
    }
  }
}

// 2. Vérifier tous les liens internes dans le HTML
function resolveSiteTarget(currentHtmlFile, rawRef) {
  const ref = rawRef.trim();
  if (
    !ref ||
    ref === '#' ||
    ref.startsWith('#') ||
    ref.startsWith('http://') ||
    ref.startsWith('https://') ||
    ref.startsWith('mailto:') ||
    ref.startsWith('tel:') ||
    ref.startsWith('data:') ||
    ref.startsWith('javascript:') ||
    ref === 'about:blank'
  ) {
    return null;
  }

  const clean = ref.split('#')[0].split('?')[0];
  if (!clean) return null;

  let candidate;
  if (clean.startsWith('/')) {
    candidate = path.join(siteDir, clean.replace(/^\/+/, ''));
  } else {
    candidate = path.resolve(path.dirname(currentHtmlFile), clean);
  }

  if (!candidate.startsWith(siteDir)) {
    return { target: candidate, exists: false, reason: 'sort du site assemblé' };
  }

  if (fs.existsSync(candidate)) {
    const stat = fs.statSync(candidate);
    if (stat.isFile()) return { target: candidate, exists: true };
    if (stat.isDirectory()) {
      const idx = path.join(candidate, 'index.html');
      return { target: idx, exists: fs.existsSync(idx) };
    }
  }
  return { target: candidate, exists: false };
}

function extractRefs(html) {
  const refs = [];
  const attrRegex = /\b(?:href|src)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
  for (const m of html.matchAll(attrRegex)) {
    refs.push(m[1] ?? m[2] ?? '');
  }
  const metaRefreshRegex = /<meta[^>]+http-equiv=["']?refresh["']?[^>]+content=["'][^"']*url=([^"';\s]+)/gi;
  for (const m of html.matchAll(metaRefreshRegex)) {
    refs.push(m[1]);
  }
  return refs;
}

const htmlFiles = walkFiles(siteDir).filter((f) => f.endsWith('.html'));
let checkedRefs = 0;

for (const htmlFile of htmlFiles) {
  const relFile = path.relative(siteDir, htmlFile).replace(/\\/g, '/');
  const isArchiveFile = /^versions\/V[1-5]\//i.test(relFile);
  const content = fs.readFileSync(htmlFile, 'utf8');
  const refs = extractRefs(content);

  for (const ref of refs) {
    const res = resolveSiteTarget(htmlFile, ref);
    if (!res) continue;
    checkedRefs++;

    if (!res.exists) {
      const isCrossVersionArchiveRef = isArchiveFile && (ref.startsWith('../') || ref.startsWith('/'));
      const msg = `${relFile} -> "${ref}" (introuvable: ${path.relative(siteDir, res.target).replace(/\\/g, '/')})`;
      if (!isArchiveFile || isCrossVersionArchiveRef) {
        errors.push(`Lien cassé : ${msg}`);
      } else {
        archiveWarnings.push(`Interne archive (non modifié) : ${msg}`);
      }
    }
  }
}

// 3. Vérifier l'alias logo_proposals -> identite.html et la présence de toutes les pages V6 attendues
for (const required of [
  'index.html',
  '404.html',
  '.nojekyll',
  'versions/index.html',
  'versions/V6/index.html',
  'versions/V6/versions.html',
  'versions/V6/identite.html',
  'versions/V6/logo_proposals.html',
  'versions/V6/cv-apercu.html',
  'versions/V6/assets/CV_CL-FR.pdf',
  'versions/V6/assets/CV_CL-EN.pdf',
  'versions/V6/assets/img/logo/logo-ob-tech.svg',
  'versions/V6/assets/img/logo/logo-terminal-tech.svg',
  'versions/V6/assets/img/logo/logo-neural-tech.svg'
]) {
  const full = path.join(siteDir, required);
  if (!fs.existsSync(full)) {
    errors.push(`Fichier requis manquant : ${required}`);
  }
}

if (archiveWarnings.length > 0) {
  console.log(`Avertissements internes aux archives V1..V5 (non bloquants) : ${archiveWarnings.length}`);
  for (const w of archiveWarnings.slice(0, 10)) {
    console.log(`  [WARN] ${w}`);
  }
}

if (errors.length > 0) {
  console.error(`\nÉCHEC check-links (${errors.length} erreur(s)) :`);
  for (const err of errors) {
    console.error(`  [ERR] ${err}`);
  }
  process.exit(1);
}

console.log(`OK : ${htmlFiles.length} fichiers HTML vérifiés, ${checkedRefs} références internes valides, intégrité SHA-256 V1..V5 confirmée.`);
