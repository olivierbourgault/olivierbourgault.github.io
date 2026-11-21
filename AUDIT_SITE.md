# Audit global du site — `olivierbourgault.github.io` (V6 Astro · Tech Canvas)

> Analyse initiale effectuée le 2026-11-20 et **résolution complète validée le 2026-11-21** sur l'ensemble du dépôt (configuration racine, CI/CD GitHub Actions, architecture Astro V6, scripts TypeScript, CSS modulaire, accessibilité WCAG 2.1 AA, SEO, performances, i18n FR/EN, outils de build, études de cas, palette de commandes `Ctrl+K`, optimisation PDF et tests E2E Playwright/axe-core). Les archives `versions/V1` à `versions/V5` demeurent 100 % intactes (vérifiées par empreintes SHA-256).

---

## Bilan synthétique Avant / Après

| Indicateur | Avant (Audit initial) | Après (Post-correctifs Points 1–42) |
| :--- | :--- | :--- |
| **Bundle `_astro/` (CSS + JS + Polices)** | `124 fichiers` / `2 040,7 Ko` | **`30 fichiers` / `483,7 Ko` (`-76,3 %`)** |
| **Feuille CSS globale (`BaseLayout.*.css`)** | `399 Ko` (Bootstrap 5 + Bootstrap Icons + `main.css` monolithique) | **`~71 Ko`** (CSS natif découpé en 5 modules + 96 icônes SVG `icons.css` sans police d'icônes) |
| **Dictionnaire i18n (`i18n.ts`) en français** | `41,9 Ko` téléchargés systématiquement au chargement | **`0 Ko` en FR** (chargement dynamique `import('../data/i18n')` uniquement en mode `EN`) |
| **Requêtes `api.github.com` côté visiteur** | Jusqu'à `60+` requêtes client (soumises à la limite de 60 req/h) | **`0 requête`** (catalogue pré-généré `/assets/data/github-projects.json` de 59 projets + cron hebdomadaire CI) |
| **Poids des CV PDF (`cv-fr.pdf` / `cv-en.pdf`)** | `1 148,0 Ko` / `1 146,3 Ko` (`2 294,3 Ko` au total) | **`350,9 Ko` / `350,0 Ko` (`700,9 Ko` au total, `-69,5 %` sans perte vectorielle)** |
| **Diagnostics `astro check`** | Erreurs et avertissements (`ts(6133)`, `ts(6387)`) | **`0 error, 0 warning, 0 hint` (91 fichiers vérifiés)** |
| **Audit automatisé WCAG 2.1 AA (`@axe-core/playwright`)** | Violations de contraste, `<h1>`, formulaires, filtres `<li>` et noms accessibles | **`0 violation WCAG 2.1 AA`** (sombre & clair) sur `/`, `/resume`, `/identity`, `/versions/` (7 tests E2E Playwright en CI) |

---

## 1. Bugs critiques & problèmes fonctionnels — ✅ 100 % Résolu

- [x] **1. Boucle de redirection infinie potentielle sur `/versions` en production (GitHub Pages)**
  - *Résolution* : `src/pages/versions/index.astro` génère désormais directement `.site/versions/index.html` sans fichier `.site/versions.html` concurrent ; `tools/serve-site.mjs` reproduit la résolution de répertoires de GitHub Pages et `tools/check-links.mjs` bloque toute collision fichier/dossier.
- [x] **2. Impression cassée sur `/resume` (FR et EN imprimés ensemble + canvas animé visible)**
  - *Résolution* : `src/styles/pages/cv-apercu.css` respecte `.resume-pages[hidden] { display: none !important; }` et masque `#tech-bg-canvas`, `#header`, `.cv-version-bar`, `.resume-head`, `.resume-foot` et `#laser-dot` dans `@media print` (vérifié automatiquement par test E2E Playwright).
- [x] **3. Contradiction typographique entre le site V6 et les documents générés**
  - *Résolution* : `identity.md`, `humans.txt` et `public/assets/docs/presentation-template.html` sont alignés sur le Pack Ingénierie & IA (**`Chakra Petch`**, **`DM Sans`**, **`IBM Plex Mono`**, **`Oswald`**).
- [x] **4. Page d'accueil totalement invisible sans JavaScript**
  - *Résolution* : Suppression de `class="d-none"` sur `<div id="page">` et ajout d'un repli `<noscript>` dans `BaseLayout.astro` masquant `#spinner` et affichant immédiatement tout le contenu.
- [x] **5. Manifeste Web (`site.webmanifest`) non relié dans le HTML**
  - *Résolution* : Ajout de `<link rel="manifest" href="/site.webmanifest">` et `<meta name="theme-color">` dans `BaseLayout.astro`.
- [x] **6. Anomalies dans `public/assets/docs/presentation-template.html`**
  - *Résolution* : Polices corrigées, bouton orphelin retiré, notes de présentation nettoyées, respect de `prefers-reduced-motion` et `visibilitychange` sur le canvas, et attribut `integrity` SRI ajouté sur FontAwesome.
- [x] **7. Types MIME incomplets et crash possible dans `tools/serve-site.mjs`**
  - *Résolution* : Ajout des types MIME `.md`, `.xml`, `.webmanifest`, `.txt`, protection `try/catch` autour de `decodeURIComponent` et durcissement contre la traversée de répertoires.
- [x] **8. Scrollspy incomplet sur la page d'accueil (`src/scripts/navbar.ts`)**
  - *Résolution* : `#expertise` et `#skills` sont rattachés à `#about` dans le scrollspy afin que l'état actif de la barre de navigation reste continu.
- [x] **9. Curseur `#laser-dot` affiché au centre de l'écran avant tout mouvement & actif sur tactile (`src/scripts/cursor.ts`)**
  - *Résolution* : Désactivation complète sur `(pointer: coarse)`, apparition uniquement au premier `mousemove`, positionnement GPU `translate3d(...)` et arrêt automatique de la boucle `requestAnimationFrame` à l'immobilité ou lorsque l'onglet est masqué.

---

## 2. Performance & poids des ressources — ✅ 100 % Résolu

- [x] **10. Feuille CSS globale très lourde (`399 Ko` non compressé sur chaque page)**
  - *Résolution* : Suppression de `bootstrap` et de la police `bootstrap-icons.woff/.woff2` au profit de `src/styles/utilities.css` et de `src/styles/icons.css` (96 masques SVG inline générés par `tools/generate-icons.mjs`).
- [x] **11. Inflation des fichiers de polices dans `_astro/` (~90 fichiers)**
  - *Résolution* : `src/styles/fonts.css` n'importe plus que les 14 fichiers `.woff2` `latin` nécessaires (`90` fichiers de polices → `14` fichiers `.woff2`).
- [x] **12. Poids JavaScript réel & `i18n.js` chargé en français**
  - *Résolution* : Suppression de `aos` et `glightbox` au profit de `src/scripts/reveal.ts` (`IntersectionObserver` natif) et de `<dialog>` natif ; chargement paresseux (`import('../data/i18n')`) du dictionnaire anglais (`0 Ko` en FR).
- [x] **13. Boot Loader pénalisant le LCP d'au moins ~1,12 s**
  - *Résolution* : Le contenu `#page` est rendu immédiatement sous l'overlay fixe `#spinner`, et `sessionStorage` (`ob_v6_boot_done`) court-circuite l'animation lors des navigations internes.
- [x] **14. Rafale de 60+ requêtes réseau côté client dans `src/scripts/portfolio.ts` + limite API GitHub**
  - *Résolution* : `tools/sync-portfolio.mjs` pré-génère `public/assets/data/github-projects.json` (59 projets) au build et via un cron GitHub Actions hebdomadaire (`0` appel à `api.github.com` côté visiteur) ; les README ne sont récupérés qu'à la demande avec mise en cache `sessionStorage`.
- [x] **15. Pression mémoire / GC élevée dans `src/scripts/bg-canvas.ts` et boucle infinie dans `src/scripts/cursor.ts`**
  - *Résolution* : Préallocation des buffers `Float32Array` dans `resize()` (`0` allocation par frame) et regroupement des tracés canvas par paliers d'opacité.
- [x] **16. Double charge CPU/réseau sur `/versions`**
  - *Résolution* : L'aperçu `#studioIframe` utilise `/?embed=1`, qui désactive le Boot Loader, le canvas d'arrière-plan `#tech-bg-canvas` et le curseur `#laser-dot` dans l'iframe.
- [x] **17. Avatar Hero externe sans dimensions ni `fetchpriority` (`src/components/home/Hero.astro`)**
  - *Résolution* : Utilisation de l'image locale `/assets/images/hero-avatar.webp` avec `width="230" height="230"`, `fetchpriority="high"` et `decoding="async"`.
- [x] **18. Poids élevé des CV PDF**
  - *Résolution* : Suppression sans perte des tables OpenType non utilisées par les moteurs PDF (`GPOS`, `GSUB`, `GDEF`, `hdmx`, `VDMX`, `DSIG`) et troncature des glyphes vides de fin dans les flux `FontFile2` : `cv-fr.pdf` passe de `1 148,0 Ko` à **`350,9 Ko` (`-69,4 %`)** et `cv-en.pdf` de `1 146,3 Ko` à **`350,0 Ko` (`-69,5 %`)**.

---

## 3. Accessibilité (WCAG) & sémantique HTML — ✅ 100 % Résolu

- [x] **19. Absence de `<h1>` sur la page d'accueil et `aria-label` qui masque le nom de l'auteur**
  - *Résolution* : `Hero.astro` utilise désormais un véritable `<h1>` exposant le nom d'Olivier Bourgault et sa spécialisation aux lecteurs d'écran.
- [x] **20. Filtres du Portfolio non accessibles au clavier**
  - *Résolution* : Remplacement des `<li>` cliquables par des `<button type="button" aria-pressed="...">` accessibles au clavier pour les catégories et les 10 puces technologiques.
- [x] **21. Formulaire de contact sans `<label>` ni `aria-label`**
  - *Résolution* : Ajout de `<label class="visually-hidden" for="...">` et `autocomplete` explicites sur les 4 champs de `Contact.astro`.
- [x] **22. Hiérarchie de titres incohérente dans `src/components/home/Resume.astro`**
  - *Résolution* : Hiérarchie stricte `h2` (titre de section) → `h3` (catégorie de parcours) → `h4` (poste / diplôme).
- [x] **23. Lien d'évitement `.skip-link` non stylé globalement**
  - *Résolution* : Styles `.skip-link` et `.skip-link:focus-visible` remontés dans la feuille globale `src/styles/sections/base.css`.
- [x] **24. Badges de compétences stylés comme des boutons**
  - *Résolution* : Remplacement de `.btn.btn-outline` par `.skill-pill` non interactif (`cursor: default`) et correction du contraste de `#btn-toggle-all-skills` (`#0b0c0e` sur `#FF6600`, ratio `6,85:1`).

---

## 4. SEO, métadonnées & découvrabilité — ✅ 100 % Résolu

- [x] **25. Métadonnées sociales et données structurées manquantes dans `BaseLayout.astro`**
  - *Résolution* : Génération de la carte sociale `/assets/images/og-card.png` (`1200×630`), ajout des balises Open Graph / Twitter Card complètes et du graphe JSON-LD Schema.org (`WebSite`, `Person`, `WebPage`).
- [x] **26. Directive `noindex` manquante sur les pages techniques (`404.astro` et redirections)**
  - *Résolution* : `noindex: true` appliqué sur `404.astro`, `cv-apercu.astro`, `identite.astro`, `logo_proposals.astro`, `/index.html` racine et `.site/versions/V6/index.html`.
- [x] **27. Version anglaise invisible pour les moteurs de recherche**
  - *Résolution* : Balises `<link rel="alternate" hreflang="fr" | "en" | "x-default">` ajoutées dans `BaseLayout.astro` et synchronisation dynamique de `document.title`, `<meta name="description">`, `og:title`, `og:description` et `og:locale` (`fr_CA` / `en_CA`).

---

## 5. Internationalisation (i18n FR / EN) — ✅ 100 % Résolu

- [x] **28. Flash de texte français (FOUC i18n) pour les visiteurs anglophones**
  - *Résolution* : Détection synchrone de la langue dans `<head>` avec garde `data-i18n-pending` levée dès l'application du dictionnaire EN.
- [x] **29. Chaînes encore figées en français en mode EN**
  - *Résolution* : Internationalisation complète des libellés et attributs ARIA dans `theme.ts`, `portfolio.ts`, `versions-studio.ts`, `collapsible.ts`, `identite.ts`, `contact.ts` et `cmd-palette.ts`.
- [x] **30. Transition imparfaite de l'effet machine à écrire au changement de langue**
  - *Résolution* : `typewriter.ts` annule proprement son timer actif et réinitialise le mot lors de l'événement `ob:langchange`.
- [x] **31. Architecture i18n fragile et double clé `localStorage`**
  - *Résolution* : Unification sur l'unique clé `ob_v6_lang` (avec migration transparente de `ob_v6_cv_lang`) et support prioritaire des attributs déclaratifs `data-i18n="..."` (`KEY_EN`).

---

## 6. UX / UI, contenu & responsive — ✅ 100 % Résolu

- [x] **32. Formulaire de contact limité à `mailto:` et marge excessive sur mobile**
  - *Résolution* : Correction des marges mobiles (`mx-0 mx-md-5`), barre d'action directe avec bouton « Copier le courriel » (`#contactCopyEmailBtn`), zone de statut `aria-live="polite"`, champ honeypot anti-spam `_gotcha` et copie automatique du message formaté dans le presse-papiers lors de l'envoi.
- [x] **33. Contenus et références éditoriales à actualiser**
  - *Résolution* : Mise à jour des liens du CV Web vers `https://olivierbourgault.github.io` et LinkedIn en HTTPS, copyright dynamique `2026` + signature Astro / Tech Canvas dans `SiteFooter.astro`, retrait du tag interne `(CV_V3)` et synchronisation dynamique du compteur de projets (`59`).

---

## 7. Maintenabilité, qualité du code & CI/CD — ✅ 100 % Résolu

- [x] **34. Code mort et avertissements TypeScript (`astro check`)**
  - *Résolution* : Création de `src/scripts/clipboard.ts`, nettoyage du code mort et découpage du fichier monolithique `main.css` (3 262 lignes) en 5 modules sous `src/styles/sections/{base,navigation,layout,home,tech-canvas}.css` (145 lignes de CSS mort purgées).
- [x] **35. Fichiers racine et README désynchronisés avec la V6 déployée à `/`**
  - *Résolution* : Synchronisation complète de `/index.html`, `/README.md` et `versions/V6/README.md`.
- [x] **36. Risque de dérive sur les fichiers statiques manuels (`llms.txt`, `llms-full.txt`, `*.md`, `sitemap.xml`)**
  - *Résolution* : Conversion des 7 fichiers (`sitemap.xml.ts`, `llms.txt.ts`, `llms-full.txt.ts`, `index.md.ts`, `resume.md.ts`, `identity.md.ts`, `versions.md.ts`) en endpoints Astro générés automatiquement au build depuis `src/data/*.ts`.
- [x] **37. Script `npm run verify` non portable sous PowerShell 5.1 & angles morts de `check-links.mjs`**
  - *Résolution* : Orchestrateur Node multiplateforme `tools/verify.mjs` et vérification par `tools/check-links.mjs` des 19 fichiers HTML (445 références), des 64 URLs sitemap/LLM/Markdown, du catalogue JSON GitHub et des empreintes SHA-256 `V1..V5`.

---

## 8. Améliorations à forte valeur ajoutée — ✅ 100 % Résolu

- [x] **38. Remplacement complet des librairies lourdes par du natif & nettoyage de `package.json`**
  - *Résolution* : Désinstallation effective de `bootstrap`, `aos` et `glightbox` de `package.json` / `package-lock.json` et passage de `bootstrap-icons` en `devDependencies`.
- [x] **39. Synchronisation du portfolio GitHub au build + cron hebdomadaire + filtres par technologie & recherche**
  - *Résolution* : Script `tools/sync-portfolio.mjs` (`npm run portfolio:sync`), cron hebdomadaire `0 8 * * 1` dans `.github/workflows/deploy-pages.yml`, barre de recherche instantanée `#portfolioSearchInput` et 10 filtres technologiques `#portfolioTechTags`.
- [x] **40. Études de cas interactives bilingues (`<dialog id="caseStudyDialog">`) & Palette de commandes `Ctrl + K` (`<dialog id="cmdPaletteDialog">`)**
  - *Résolution* : Études de cas détaillées en 4 volets (Contexte, Architecture, Défis & Solutions, Impact mesurable) pour `HubAI`, `CompareTools` et `Electrolib` ; palette de commandes rapide `Ctrl + K` avec 14 actions bilingues.
- [x] **41. Carte Open Graph dédiée (`1200×630`) + JSON-LD `Person` / `WebSite` / `WebPage`**
  - *Résolution* : Génération de `/assets/images/og-card.png` via `tools/generate-og-card.mjs` et intégration dans `BaseLayout.astro`.
- [x] **42. Tests E2E & accessibilité WCAG 2.1 AA en CI (`Playwright` + `@axe-core/playwright`)**
  - *Résolution* : Suite `tests/e2e.spec.ts` (`npm run test:e2e`) configurée dans `playwright.config.mjs` et exécutée dans `.github/workflows/deploy-pages.yml` (audit WCAG 2.1 AA sombre & clair sur `/`, `/resume`, `/identity`, `/versions/`, catalogue GitHub & études de cas, palette `Ctrl+K` & bascule live FR/EN, mode impression `@media print` sur `/resume`).
