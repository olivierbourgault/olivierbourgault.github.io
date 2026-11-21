# Audit global du site — `olivierbourgault.github.io` (V6 Astro · Tech Canvas)

> Analyse effectuée le 2026-11-20 sur l'ensemble du dépôt (configuration racine, CI/CD GitHub Actions, architecture Astro V6, scripts TypeScript, CSS, accessibilité, SEO, performances, i18n, outils de build et gabarit de présentation). Les archives `versions/V1` à `versions/V5` restent volontairement en lecture seule.

---

## 1. Bugs critiques & problèmes fonctionnels

1. **Boucle de redirection infinie potentielle sur `/versions` en production (GitHub Pages)**
   - `versions/V6/tools/assemble-site.mjs` copie à la fois `versions.html` à la racine de `.site/` et crée le dossier `.site/versions/index.html` qui redirige vers `/versions`.
   - Sur GitHub Pages, un répertoire existant (`/versions/`) prime sur le fichier sans extension (`/versions.html`), ce qui crée une boucle `/versions` → `301 /versions/` → `versions/index.html` → `/versions`.
   - `versions/V6/tools/serve-site.mjs` (L48–50) masque ce problème en local car il teste `${filePath}.html` avant les répertoires.
   - *Piste* : servir la page directement dans `.site/versions/index.html` (via `src/pages/versions/index.astro` ou copie dans `assemble-site.mjs`) au lieu d'une redirection, et aligner `serve-site.mjs` sur le comportement réel de GitHub Pages.

2. **Impression cassée sur `/resume` (FR et EN imprimés ensemble + canvas animé visible)**
   - `versions/V6/src/styles/pages/cv-apercu.css` (L1028–1037) applique `.resume-pages { display: block !important; }` dans `@media print`, ce qui écrase l'attribut HTML `hidden` posé sur la feuille de langue inactive (`ResumeSheets.astro` L13) et imprime 4 pages (FR + EN) au lieu de 2.
   - `#tech-bg-canvas` n'est pas listé dans les éléments masqués de `@media print` (`cv-apercu.css` L985–1000) et peut s'imprimer par-dessus/sous le CV.

3. **Contradiction typographique entre le site V6 et les documents générés**
   - Le site V6 charge et utilise réellement **`Chakra Petch`**, **`DM Sans`**, **`IBM Plex Mono`** et **`Oswald`** (`src/styles/tokens.css` L15–18, `src/layouts/BaseLayout.astro` L2–15, `src/data/logos.ts` L154–182).
   - En contradiction directe, `public/identity.md`, `public/humans.txt` et `public/assets/docs/presentation-template.html` documentent et chargent `Space Grotesk`, `Plus Jakarta Sans` et `JetBrains Mono`.

4. **Page d'accueil totalement invisible sans JavaScript**
   - `src/pages/index.astro` (L38) rend `<div id="page" class="d-none">` sans balise `<noscript>` de repli. Si JavaScript est désactivé ou échoue, l'utilisateur reste bloqué sur `#spinner` à `00%`.

5. **Manifeste Web (`site.webmanifest`) non relié dans le HTML**
   - `public/site.webmanifest` existe bien dans `.site/`, mais `src/layouts/BaseLayout.astro` ne contient ni `<link rel="manifest" href={withBase('site.webmanifest')} />` ni `<meta name="theme-color" ... />`.

6. **Anomalies dans `public/assets/docs/presentation-template.html`**
   - Utilise les mauvaises polices (`Space Grotesk` / `Plus Jakarta Sans` / `JetBrains Mono` au lieu du Pack Ingénierie & IA).
   - La barre `#top-nav` contient un second bouton (`data-index="1"`, `{{SLIDE_2_SHORT_TITLE}}`) qui ne mène à rien puisqu'il n'y a qu'une seule `<section class="slide">`.
   - `SPEAKER_NOTES[0]` conserve encore le placeholder `{{SLIDE_1_SHORT_TITLE}}` alors que la diapositive 1 est devenue la fiche « Design System ».
   - La boucle `requestAnimationFrame` de `initTechCanvas()` ne respecte ni `prefers-reduced-motion` ni `visibilitychange` (onglet en arrière-plan).
   - Le lien CDN FontAwesome 6.5.1 est chargé sans attribut SRI `integrity`.

7. **Types MIME incomplets et crash possible dans `tools/serve-site.mjs`**
   - `.md`, `.xml` et `.webmanifest` sont absents de `MIME_TYPES` (`serve-site.mjs` L12–30) : ils sont servis en `application/octet-stream` (téléchargement forcé au lieu d'affichage en navigateur local).
   - `decodeURIComponent` (L38) est exécuté hors du bloc `try/catch` (une URL avec un `%` malformé fait planter le processus Node) et la vérification `filePath.startsWith(siteDir)` (L41) gagnerait à imposer `siteDir + path.sep`.

8. **Scrollspy incomplet sur la page d'accueil (`src/scripts/navbar.ts`)**
   - Les sections `#expertise` (Piliers) et `#skills` ne sont pas dans `navLinks` ; lors du défilement à travers ces deux sections, `updateScrollspy()` (L30–53) retire `.active` de tous les liens du menu.

9. **Curseur `#laser-dot` affiché au centre de l'écran avant tout mouvement & actif sur tactile (`src/scripts/cursor.ts`)**
   - `cursor.ts` (L34–57) positionne `#laser-dot` au centre du viewport et lui ajoute `.on` immédiatement au chargement (halo orange de 420 px figé au milieu de la page tant que la souris n'a pas bougé).
   - `document.body.style.cursor = 'none'` (L56) et la boucle `requestAnimationFrame` s'exécutent même sur appareils tactiles (`(pointer: coarse)`).

---

## 2. Performance & poids des ressources

10. **Feuille CSS globale très lourde (`399 Ko` non compressé sur chaque page)**
    - `BaseLayout.*.css` pèse **399 Ko** à cause de l'import global de `bootstrap/dist/css/bootstrap.min.css` (~230 Ko), `bootstrap-icons/font/bootstrap-icons.min.css` (~100 Ko) et `main.css` (3 100 lignes monolithiques).
    - `bootstrap-icons.woff2` (127,3 Ko) et `.woff` (171,9 Ko) sont générés pour seulement ~35 icônes utilisées. Remplacer Bootstrap CSS + Bootstrap Icons par des utilitaires légers et des icônes SVG inline réduirait le CSS de >80 %.

11. **Inflation des fichiers de polices dans `_astro/` (~90 fichiers)**
    - Les 14 imports `@fontsource/*` complets dans `BaseLayout.astro` embarquent des sous-ensembles inutiles (`cyrillic`, `cyrillic-ext`, `vietnamese`, `thai`) ainsi que le format legacy `.woff`. Importer uniquement les sous-ensembles `latin` / `latin-ext` (ou des polices variables `@fontsource-variable/*`) allégerait nettement le build.

12. **Poids JavaScript réel en contradiction avec « 0 Ko Runtime » & `i18n.js` chargé en français**
    - La page d'accueil charge plus de 140 Ko de JS client (`index...js` 86,8 Ko avec AOS + GLightbox + `portfolio.ts`, `i18n.js` 41,9 Ko, `BaseLayout...js` 7,2 Ko, etc.), ce qui contredit le badge `0 Ko Runtime` dans `src/data/versions.ts` (L35).
    - `src/data/i18n.ts` (~42 Ko) est téléchargé sur chaque page même lorsque le visiteur reste en français : un import dynamique (`await import('../data/i18n')`) uniquement lors du passage en `en` économiserait ~42 Ko au chargement initial.

13. **Boot Loader pénalisant le LCP d'au moins ~1,12 s**
    - `src/scripts/boot.ts` impose un délai artificiel minimum de `900 ms + 220 ms` à chaque ouverture de `/`, même lors d'une navigation interne depuis `/resume`, `/identity` ou `/versions`. Mémoriser le passage dans `sessionStorage` (ou supprimer le masquage `d-none` du contenu principal) améliorerait nettement le LCP et l'expérience sur visites répétées.

14. **Rafale de 60+ requêtes réseau côté client dans `src/scripts/portfolio.ts` + limite API GitHub**
    - À chaque nouvelle session, `loadGitHubPortfolio()` interroge `api.github.com` (limité à 60 req/h par IP sans authentification) puis lance en parallèle un `fetch()` vers `raw.githubusercontent.com` pour le `README.md` de chaque projet (~60 requêtes simultanées), alors que seuls 5 projets sont affichés par défaut.
    - Générer les métadonnées des projets au **build time** (ou charger les README paresseusement / en cache JSON commité) supprimerait la latence, le risque d'erreur 403 et rendrait les 59+ projets indexables par Google.

15. **Pression mémoire / GC élevée dans `src/scripts/bg-canvas.ts` et boucle infinie dans `src/scripts/cursor.ts`**
    - `bg-canvas.ts` (L99–110) réalloue 3 `Float32Array` et ~900–1 200 tableaux temporaires `[px, py, f]` à chaque frame (60–144 FPS), tout en dessinant chaque arête de particule dans un `beginPath()/stroke()` séparé en $O(n^2)$. Préallouer les buffers dans `resize()` et regrouper les tracés réduirait fortement l'usage CPU/batterie.
    - `cursor.ts` (L40–51) ne s'arrête jamais quand la souris est immobile ou l'onglet caché, et modifie `style.left`/`style.top` au lieu de `transform: translate3d(...)` (qui reste sur le thread compositeur GPU).

16. **Double charge CPU/réseau sur `/versions`**
    - Le Studio prévisualise par défaut la V6 (`/`) dans `#studioIframe`, exécutant en double le Boot Loader, deux canvas animés `#tech-bg-canvas`, deux curseurs `#laser-dot` et les appels API GitHub.

17. **Avatar Hero externe sans dimensions ni `fetchpriority` (`src/components/home/Hero.astro` L56–63)**
    - `#avatar` charge `https://github.com/RinoShip77.png` (requête tierce + redirection + pas de `width`/`height` → risque CLS + pas de `fetchpriority="high"`), alors qu'un `public/assets/images/avatar.webp` optimisé (23,3 Ko) existe déjà localement.

18. **Poids élevé des CV PDF**
    - `public/assets/docs/cv-fr.pdf` (1 148 Ko) et `cv-en.pdf` (1 146 Ko) pèsent plus de 1,1 Mo chacun pour 2 pages ; une recompression (Ghostscript / `qpdf` / sous-ensembles de polices) les réduirait probablement autour de 100–250 Ko.

---

## 3. Accessibilité (WCAG) & sémantique HTML

19. **Absence de `<h1>` sur la page d'accueil et `aria-label` qui masque le nom de l'auteur**
    - `src/components/home/Hero.astro` (L7) utilise `<h2 aria-label="Je suis un développeur">`. La page `/` ne possède aucun `<h1>`, et l'`aria-label` remplace « Olivier Bourgault » dans l'arbre d'accessibilité.

20. **Filtres du Portfolio non accessibles au clavier (`src/components/home/Portfolio.astro` L31–36)**
    - Les filtres (`Tout`, `Scolaires`, `Professionnels`, `Personnels`) sont des `<li>` écoutant `click` au lieu de `<button type="button">` avec `aria-pressed` : ils sont inatteignables à la touche `Tab` (échec WCAG 2.1.1).

21. **Formulaire de contact sans `<label>` ni `aria-label` (`src/components/home/Contact.astro` L14–23)**
    - Les 4 champs (`name`, `email`, `subject`, `message`) s'appuient uniquement sur `placeholder`, qui disparaît à la saisie et ne constitue pas un nom accessible conforme (WCAG 1.3.1 / 3.3.2).

22. **Hiérarchie de titres incohérente dans `src/components/home/Resume.astro`**
    - Les titres de blocs CV (L67) utilisent `<h2>` au même niveau que le titre de section `<h2>CV</h2>`, et chaque entrée de timeline place `<h4 class="company">` (L88) avant `<h3 class="position">` (L96).

23. **Lien d'évitement `.skip-link` non stylé sur `/`, `/versions`, `/identity` et `/404`**
    - Les règles `.skip-link:focus` / `:focus-visible` n'existent que dans `src/styles/pages/cv-apercu.css` (L23–50) et devraient être remontées dans `main.css`.

24. **Badges de compétences stylés comme des boutons (`src/components/home/Skills.astro` L64 & L76)**
    - Utiliser `<span class="btn btn-outline m-1">` sur des éléments non cliquables prête à confusion avec de vrais boutons interactifs.

---

## 4. SEO, métadonnées & découvrabilité

25. **Métadonnées sociales et données structurées manquantes dans `BaseLayout.astro`**
    - Absence d'`og:image` (carte 1200×630 pour LinkedIn / Discord / Slack), `og:locale` (`fr_CA`), `twitter:card` (`summary_large_image`) et de bloc JSON-LD Schema.org (`Person` + `WebSite`).

26. **Directive `noindex` manquante sur les pages techniques (`404.astro` et redirections)**
    - `src/pages/404.astro` (L20) déclare `<link rel="canonical" href="https://olivierbourgault.github.io/404.html" />` sans `<meta name="robots" content="noindex" />`.
    - Les pages alias de redirection (`cv-apercu.astro`, `identite.astro`, `logo_proposals.astro`, `versions/index.html`, `versions/V6/index.html`) gagneraient aussi à porter `noindex`.

27. **Version anglaise invisible pour les moteurs de recherche**
    - La traduction étant exécutée uniquement côté client (`i18n.ts`), les bots indexent uniquement le français et `<title>` / `<meta name="description">` ne sont pas mis à jour en anglais.

---

## 5. Internationalisation (i18n FR / EN)

28. **Flash de texte français (FOUC i18n) pour les visiteurs anglophones**
    - Contrairement au thème sombre/clair (résolu de façon synchrone dans `<head>`), `initSiteLang()` ne s'exécute qu'au `DOMContentLoaded`, provoquant un flash FR → EN sur `?lang=en` ou lors d'un rechargement en EN.

29. **Chaînes encore figées en français en mode EN**
    - `src/scripts/theme.ts` (L36) écrase `aria-label` et `title` de `#themeSwitcherBtn` avec `'Passer au mode clair'` / `'Passer au mode sombre'` (et `i18n.ts` L117 ignore `#themeSwitcherBtn`).
    - `src/scripts/portfolio.ts` (L287, 306, 320, 483) génère les attributs `alt`, `aria-label`, `title` et descriptions de secours en français uniquement.
    - `src/scripts/versions-studio.ts` (L198, 218, 285, 314, 436) conserve des libellés et titres d'iframe en français.
    - `src/scripts/collapsible.ts` (L82–83) injecte `aria-label` / `title` en français et n'écoute pas `ob:langchange` pour mettre à jour les boutons `Afficher`/`Réduire` déjà rendus.
    - `src/scripts/identite.ts` (L7) laisse `Nœud Neuronal · R 42 · dash 8/4` en français, `src/scripts/contact.ts` (L21) laisse `Contact de ...` en français, et `document.title` n'est jamais traduit.

30. **Transition imparfaite de l'effet machine à écrire au changement de langue (`src/scripts/typewriter.ts` L49–56)**
    - Si l'utilisateur change de langue pendant la phase d'écriture (`isDeleting === false`), le texte en cours n'est pas réinitialisé et se mélange à l'index courant du nouveau mot.

31. **Architecture i18n fragile et double clé `localStorage`**
    - Le dictionnaire par correspondance exacte de texte (`EXACT_TEXT_FR_TO_EN` dans `src/data/i18n.ts`) casse silencieusement dès qu'une virgule ou un mot change dans un composant `.astro` ; des clés explicites `data-i18n="..."` ou le routage i18n natif d'Astro (`/en/...`) seraient beaucoup plus robustes.
    - Les deux clés `ob_v6_lang` et `ob_v6_cv_lang` sont maintenues en parallèle (`i18n.ts` + `cv-apercu.ts`) alors qu'une seule suffirait.

---

## 6. UX / UI, contenu & responsive

32. **Formulaire de contact limité à `mailto:` et marge excessive sur mobile**
    - `src/scripts/contact.ts` redirige simplement vers `mailto:`, ce qui échoue ou ouvre un client vide chez la majorité des utilisateurs de webmail, sans message de confirmation ni bouton « Copier le courriel ».
    - `src/components/home/Contact.astro` (L9) applique `mx-5` (`48 px` de chaque côté = `96 px` perdus) même sur mobile 360 px ; `mx-md-5` ou `mx-0 mx-md-5` serait plus adapté.

33. **Contenus et références éditoriales à actualiser**
    - `src/data/resume.ts` (L234 & L372) pointe encore vers l'ancien domaine `https://rinoship77.github.io` au lieu de `https://olivierbourgault.github.io`.
    - `src/components/SiteFooter.astro` (L38–41) crédite toujours `Designed by BootstrapMade` (alors que la V6 est une refonte Astro/Tech Canvas complète) et affiche un copyright sans année.
    - `src/pages/resume.astro` (L89) et `src/scripts/cv-apercu.ts` (L27, L39) exposent le tag interne `(CV_V3)` aux recruteurs.
    - `BootLoader.astro` (L26) et `StudioHero.astro` (L57) affichent un compteur codé en dur `59+`.

---

## 7. Maintenabilité, qualité du code & CI/CD

34. **Code mort et avertissements TypeScript (`astro check`)**
    - `src/scripts/cv-apercu.ts` (L118) : fonction `detectInitialLang()` déclarée mais jamais appelée (`ts(6133)`).
    - `src/scripts/identite.ts` (L159) : appel à `document.execCommand('copy')` déprécié (`ts(6387)`).
    - `src/scripts/skills.ts` (L62–79) : `IntersectionObserver` sur `.skills-animation` / `.progress-bar` inutilisé depuis la suppression des jauges.
    - `src/scripts/collapsible.ts` (L5) : `'skills'` présent dans `sectionIds` alors que `Skills.astro` n'a pas de `.section-title`.
    - `src/styles/main.css` (L2506) : sélecteur mort `.palette-switcher-bar` issu de V4/V5, et fichier global de 3 100 lignes à découper par composant/section.

35. **Fichiers racine et README désynchronisés avec la V6 déployée à `/`**
    - `index.html` à la racine du dépôt redirige toujours vers `versions/V6/` et référence `versions/V6/assets/images/...` (chemin inexistant dans le dépôt source).
    - `README.md` et `versions/V6/README.md` documentent encore `base: '/versions/V6'`, les anciens noms de pages (`identite`, `cv-apercu`) et ne mentionnent pas `llms.txt`, `llms-full.txt`, les pages `*.md`, `robots.txt`, `sitemap.xml`, `.well-known/security.txt`, `humans.txt`, `site.webmanifest` ni `presentation-template.html`.

36. **Risque de dérive sur les fichiers statiques manuels (`llms.txt`, `*.md`, `sitemap.xml`)**
    - Ces fichiers dans `versions/V6/public/` dupliquent manuellement les données de `src/data/*.ts`. Les générer automatiquement au build via des endpoints Astro (ex. `src/pages/llms.txt.ts`, `sitemap.xml.ts`, `resume.md.ts`) ou un script `prebuild` garantirait une source unique de vérité.

37. **Script `npm run verify` non portable sous PowerShell 5.1 & angles morts de `check-links.mjs`**
    - `versions/V6/package.json` (L18) utilise `&&` dans `"verify"`, qui échoue dans Windows PowerShell 5.1.
    - `tools/check-links.mjs` vérifie les `.html` et SHA-256 V1–V5, mais ne vérifie pas : les collisions fichier/dossier pour GitHub Pages (`/versions.html` vs `/versions/`), la validité des URLs dans `sitemap.xml` / `llms.txt` / `*.md`, ni la présence des fichiers standards (`robots.txt`, `sitemap.xml`, `llms.txt`, `.well-known/security.txt`, `site.webmanifest`).

---

## 8. Suggestions d'améliorations à forte valeur ajoutée

38. **Remplacer les librairies lourdes par du natif** : retirer `bootstrap.min.css`, `bootstrap-icons`, `aos` et `glightbox` au profit de CSS Grid/Flex, SVG inline, `IntersectionObserver` et `<dialog>` natif pour diviser par ~5 le poids CSS/JS.
39. **Synchroniser le portfolio GitHub au build (avec cron GitHub Actions hebdomadaire)** : pré-générer un JSON statique des projets de `RinoShip77/MesProjets` afin d'éliminer les 60+ requêtes client, ajouter une barre de recherche/filtre par stack (`Python`, `Angular`, `C#`, `PowerShell`…) et rendre tous les projets indexables.
40. **Connecter le formulaire de contact à un vrai service serverless** (Formspree, Web3Forms ou Cloudflare Worker) avec validation accessible, retour visuel `aria-live` et bouton « Copier l'adresse courriel ».
41. **Créer une image Open Graph dédiée (`1200×630`) + JSON-LD `Person`** pour soigner l'aperçu du portfolio lors des partages aux recruteurs (LinkedIn, courriels, Teams, Slack).
42. **Ajouter des tests E2E & accessibilité en CI** (Playwright + `@axe-core/playwright` + test de non-régression d'impression PDF sur `/resume` et résolution des routes `/`, `/versions`, `/identity`, `/resume`).
