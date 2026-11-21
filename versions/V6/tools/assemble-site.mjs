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

// 1. Copie du build Astro V6 directement à la racine (.site/) pour des URLs propres :
//    / , /versions , /identity , /resume , /404.html
fs.cpSync(distDir, siteDir, { recursive: true });
fs.writeFileSync(path.join(siteDir, '.nojekyll'), '', 'utf8');

// 2. Dossier versions/ + redirection /versions/ -> /versions
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

// 4. Alias /versions/V6/ -> / pour rétrocompatibilité des anciens liens
const legacyV6Dir = path.join(siteVersionsDir, 'V6');
fs.mkdirSync(legacyV6Dir, { recursive: true });
fs.writeFileSync(
  path.join(legacyV6Dir, 'index.html'),
  `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta http-equiv="refresh" content="0; url=/">
  <link rel="canonical" href="https://olivierbourgault.github.io/">
  <title>Redirection vers Olivier Bourgault</title>
  <script>window.location.replace('/' + window.location.search + window.location.hash);</script>
</head>
<body><p><a href="/">Accéder au portfolio</a></p></body>
</html>
`,
  'utf8'
);

console.log('Assemblage du site terminé dans versions/V6/.site/');
