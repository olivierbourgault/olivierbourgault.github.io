import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const v6Root = path.resolve(__dirname, '..');
const siteDir = path.join(v6Root, '.site');

const BUDGETS = {
  maxAstroDirTotalKb: 600,
  maxAstroFileCount: 40,
  maxFontFileCount: 16,
  maxSingleCssKb: 165,
  maxInitialJsKb: 65,
  maxLazyI18nJsKb: 55,
  maxPdfKb: 150,
  maxProjectImageKb: 200
};

function walkFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
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

function kb(bytes) {
  return bytes / 1024;
}

function main() {
  if (!fs.existsSync(siteDir)) {
    throw new Error('Le dossier .site/ est introuvable. Exécutez `npm run site:assemble` avant `npm run site:budgets`.');
  }

  const errors = [];

  // 1. Audit du bundle _astro/ (CSS, JS, Polices WOFF2)
  const astroDir = path.join(siteDir, '_astro');
  const astroFiles = walkFiles(astroDir);
  const astroTotalBytes = astroFiles.reduce((sum, f) => sum + fs.statSync(f).size, 0);
  const astroTotalKb = kb(astroTotalBytes);

  if (astroFiles.length > BUDGETS.maxAstroFileCount) {
    errors.push(
      `Nombre de fichiers _astro/ trop élevé : ${astroFiles.length} (budget max : ${BUDGETS.maxAstroFileCount})`
    );
  }
  if (astroTotalKb > BUDGETS.maxAstroDirTotalKb) {
    errors.push(
      `Poids total _astro/ dépassé : ${astroTotalKb.toFixed(1)} Ko (budget max : ${BUDGETS.maxAstroDirTotalKb} Ko)`
    );
  }

  let fontCount = 0;
  let maxCssKb = 0;
  let maxInitialJsKb = 0;

  for (const f of astroFiles) {
    const name = path.basename(f);
    const sizeKb = kb(fs.statSync(f).size);
    const ext = path.extname(name).toLowerCase();

    if (ext === '.woff' || ext === '.ttf' || ext === '.eot') {
      errors.push(`Format de police legacy interdit dans _astro/ : ${name} (utiliser .woff2 uniquement)`);
    }
    if (ext === '.woff2') {
      fontCount++;
    } else if (ext === '.css') {
      if (sizeKb > maxCssKb) maxCssKb = sizeKb;
      if (sizeKb > BUDGETS.maxSingleCssKb) {
        errors.push(
          `Feuille CSS trop lourde : ${name} (${sizeKb.toFixed(1)} Ko > budget ${BUDGETS.maxSingleCssKb} Ko)`
        );
      }
    } else if (ext === '.js') {
      const isLazyI18n = /^i18n\..+\.js$/i.test(name) && sizeKb > 20;
      if (isLazyI18n) {
        if (sizeKb > BUDGETS.maxLazyI18nJsKb) {
          errors.push(
            `Dictionnaire lazy i18n trop lourd : ${name} (${sizeKb.toFixed(1)} Ko > budget ${BUDGETS.maxLazyI18nJsKb} Ko)`
          );
        }
      } else {
        if (sizeKb > maxInitialJsKb) maxInitialJsKb = sizeKb;
        if (sizeKb > BUDGETS.maxInitialJsKb) {
          errors.push(
            `Bundle JS initial trop lourd : ${name} (${sizeKb.toFixed(1)} Ko > budget ${BUDGETS.maxInitialJsKb} Ko)`
          );
        }
      }
    }
  }

  if (fontCount > BUDGETS.maxFontFileCount) {
    errors.push(
      `Nombre de polices .woff2 trop élevé : ${fontCount} (budget max : ${BUDGETS.maxFontFileCount})`
    );
  }

  // 2. Audit du poids des CV PDF (cv-fr.pdf & cv-en.pdf)
  for (const pdfName of ['cv-fr.pdf', 'cv-en.pdf']) {
    const pdfPath = path.join(siteDir, 'assets', 'docs', pdfName);
    if (!fs.existsSync(pdfPath)) {
      errors.push(`Fichier PDF manquant : assets/docs/${pdfName}`);
    } else {
      const sizeKb = kb(fs.statSync(pdfPath).size);
      if (sizeKb > BUDGETS.maxPdfKb) {
        errors.push(
          `CV PDF trop lourd : ${pdfName} (${sizeKb.toFixed(1)} Ko > budget ${BUDGETS.maxPdfKb} Ko)`
        );
      }
    }
  }

  // 3. Audit des images de projets (100 % .webp/.svg et <= 200 Ko)
  const projectsImgDir = path.join(siteDir, 'assets', 'images', 'projects');
  const projectImages = walkFiles(projectsImgDir);
  for (const imgPath of projectImages) {
    const rel = path.relative(siteDir, imgPath).replace(/\\/g, '/');
    const ext = path.extname(imgPath).toLowerCase();
    const sizeKb = kb(fs.statSync(imgPath).size);
    if (ext !== '.webp' && ext !== '.svg') {
      errors.push(`Image de projet non convertie en .webp/.svg : ${rel}`);
    }
    if (sizeKb > BUDGETS.maxProjectImageKb) {
      errors.push(
        `Image de projet trop lourde : ${rel} (${sizeKb.toFixed(1)} Ko > budget ${BUDGETS.maxProjectImageKb} Ko)`
      );
    }
  }

  // 4. Audit Lighthouse-style SEO, Accessibilité structurelle & Bonnes pratiques sur les 4 routes principales
  const coreHtmlRoutes = ['index.html', 'resume.html', 'identity.html', 'versions/index.html'];
  for (const relHtml of coreHtmlRoutes) {
    const fullPath = path.join(siteDir, relHtml);
    if (!fs.existsSync(fullPath)) {
      errors.push(`Page principale manquante : ${relHtml}`);
      continue;
    }
    const html = fs.readFileSync(fullPath, 'utf8');
    const checks = [
      { test: /<!DOCTYPE html>/i.test(html), msg: 'DOCTYPE html manquant' },
      { test: /<html[^>]+lang="fr"/i.test(html), msg: 'Attribut lang="fr" manquant sur <html>' },
      { test: /<meta[^>]+name="viewport"/i.test(html), msg: 'Meta viewport manquante' },
      { test: /<title>[^<]{10,}<\/title>/i.test(html), msg: 'Balise <title> absente ou trop courte' },
      { test: /<meta[^>]+name="description"[^>]+content="[^"]{30,}"/i.test(html), msg: 'Meta description absente ou trop courte' },
      { test: /<link[^>]+rel="canonical"/i.test(html), msg: 'Lien canonical manquant' },
      { test: /<link[^>]+rel="manifest"/i.test(html), msg: 'Lien site.webmanifest manquant' },
      { test: /<meta[^>]+property="og:image"/i.test(html), msg: 'Meta og:image manquante' },
      { test: /<script[^>]+type="application\/ld\+json"/i.test(html), msg: 'Données structurées JSON-LD manquantes' },
      { test: /class="skip-link\b/i.test(html), msg: 'Lien d’évitement .skip-link manquant' },
      { test: /<main[^>]+id="main-content"/i.test(html), msg: 'Landmark <main id="main-content"> manquant' },
      { test: /<h1[\s>]/i.test(html), msg: 'Titre principal <h1> manquant' }
    ];
    for (const c of checks) {
      if (!c.test) {
        errors.push(`[${relHtml}] ${c.msg}`);
      }
    }
  }

  if (errors.length > 0) {
    console.error('ÉCHEC de l’audit des budgets de performance & qualité :');
    for (const err of errors) {
      console.error(` - ${err}`);
    }
    process.exit(1);
  }

  console.log(
    `OK : budgets respectés (_astro: ${astroFiles.length} fichiers / ${astroTotalKb.toFixed(1)} Ko <= ${BUDGETS.maxAstroDirTotalKb} Ko, CSS max: ${maxCssKb.toFixed(1)} Ko, JS initial max: ${maxInitialJsKb.toFixed(1)} Ko, Polices WOFF2: ${fontCount}, Images projets .webp: ${projectImages.length}, SEO/Lighthouse 4/4 routes validées).`
  );
}

main();
