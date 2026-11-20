import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const v6Root = path.resolve(__dirname, '..');
const repoRoot = path.resolve(v6Root, '..', '..');
const distDir = path.join(v6Root, 'dist');
const siteDir = path.join(v6Root, '.site');

if (!fs.existsSync(distDir)) {
  console.error('Erreur : versions/V6/dist est introuvable. Lancez d’abord `npm run build`.');
  process.exit(1);
}

fs.rmSync(siteDir, { recursive: true, force: true });
fs.mkdirSync(siteDir, { recursive: true });

// 1. Racine : index.html, .nojekyll, et 404.html (depuis dist/404.html)
fs.copyFileSync(path.join(repoRoot, 'index.html'), path.join(siteDir, 'index.html'));
fs.writeFileSync(path.join(siteDir, '.nojekyll'), '', 'utf8');

const built404 = path.join(distDir, '404.html');
if (!fs.existsSync(built404)) {
  console.error('Erreur : dist/404.html est manquant dans le build Astro.');
  process.exit(1);
}
fs.copyFileSync(built404, path.join(siteDir, '404.html'));

// 2. Dossier versions/ + redirection versions/index.html
const siteVersionsDir = path.join(siteDir, 'versions');
fs.mkdirSync(siteVersionsDir, { recursive: true });

const versionsRedirect = path.join(repoRoot, 'versions', 'index.html');
if (!fs.existsSync(versionsRedirect)) {
  console.error('Erreur : versions/index.html est introuvable à la racine du dossier versions/.');
  process.exit(1);
}
fs.copyFileSync(versionsRedirect, path.join(siteVersionsDir, 'index.html'));

// 3. Copie octet par octet des archives V1..V5
for (const ver of ['V1', 'V2', 'V3', 'V4', 'V5']) {
  const src = path.join(repoRoot, 'versions', ver);
  const dest = path.join(siteVersionsDir, ver);
  if (!fs.existsSync(src)) {
    console.error(`Erreur : archive versions/${ver} introuvable.`);
    process.exit(1);
  }
  fs.cpSync(src, dest, { recursive: true, preserveTimestamps: true });
}

// 4. Copie du build Astro dans versions/V6/
const siteV6Dir = path.join(siteVersionsDir, 'V6');
fs.cpSync(distDir, siteV6Dir, { recursive: true });

console.log('Assemblage du site terminé dans versions/V6/.site/');
