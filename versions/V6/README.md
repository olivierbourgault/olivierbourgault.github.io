# Portfolio Olivier Bourgault — Version 6 (Astro · Tech Canvas)

Code source Astro de la **Version 6 (V6)** du portfolio [`olivierbourgault.github.io`](https://olivierbourgault.github.io/), compilée en statique et déployée directement à la racine (`base: '/'`) tout en préservant **à l’identique** la direction artistique « Tech Canvas » issue de [`versions/V5/`](../V5/index.html).

---

## Architecture & choix techniques

- **Générateur statique : Astro (`^6.4.8`)** — zéro framework JS runtime, typage strict TypeScript, endpoints statiques au build (`sitemap.xml`, `llms.txt`, `resume.md`, `versions.md`) et scripts ESM autonomes.
- **Identité « Tech Canvas » & Pack Ingénierie & IA** :
  - Couleurs : `#FF6600` (Orange Signal), `#38BDF8` (Bleu Circuit), `#121316` (Carbone Studio), `#1A1C20` (Graphite), `#F4F1EA` (Ivoire Papier en mode clair).
  - Polices auto-hébergées via `@fontsource` (sous-ensemble `latin` WOFF2 uniquement, **14 fichiers / 181,7 Ko**, zéro requête Google Fonts) : `Oswald`, `Chakra Petch`, `DM Sans`, `IBM Plex Mono`.
  - Trois emblèmes vectoriels SVG officiels dans `public/assets/images/logos/` (`logo-ob-tech.svg`, `logo-terminal-tech.svg`, `logo-neural-tech.svg`).
- **Zéro bibliothèque front-end superflue** :
  - **Remplacés par du natif :** `bootstrap.min.css` → `src/styles/utilities.css` (~6 Ko) ; `bootstrap-icons` (police 299 Ko) → `src/styles/icons.css` (masques SVG générés via `tools/generate-icons.mjs`) ; `aos` → `src/scripts/reveal.ts` (`IntersectionObserver`) ; `glightbox` → `<dialog id="portfolioLightboxDialog">` natif ; Bootstrap JS / Isotope / Waypoints / jQuery supprimés.
- **Standards Web, Accessibilité (WCAG 2.1 AA), SEO & i18n** :
  - Modales `<dialog closedby="any">` natives (CV PDF FR/EN, aperçu portfolio, plein écran Studio).
  - Thème sombre/clair (`ob_v6_theme`) et langue FR/EN (`ob_v6_lang`) résolus de façon synchrone dans `<head>` (zéro FOUC), avec chargement paresseux du dictionnaire anglais (`src/data/i18n.ts`) uniquement au besoin.
  - Accessibilité clavier : `.skip-link` global, `<h1>` unique par page, filtres portfolio `<button aria-pressed>`, `<label>` explicites sur le formulaire de contact, hiérarchie de titres stricte.
  - SEO & découvrabilité IA : carte Open Graph `assets/images/og-card.png` (`1200×630`), Twitter Card, JSON-LD (`WebSite` + `Person` + `WebPage`), `hreflang` FR/EN, `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`, `*.md`, `.well-known/security.txt`, `humans.txt`, `site.webmanifest`.

---

## Arborescence `versions/V6/`

```text
versions/V6/
├── astro.config.mjs            # Base `/`, build `format: 'file'`, plugin dev archives
├── package.json                # Dépendances & scripts npm portables
├── tsconfig.json               # Configuration TypeScript stricte
├── public/
│   ├── .well-known/security.txt
│   ├── robots.txt, humans.txt, site.webmanifest
│   ├── llms-full.txt, index.md, identity.md
│   └── assets/                 # PDFs (CV FR/EN), presentation-template.html, og-card.png, WebP, logos SVG
├── tools/
│   ├── dev-archives.mjs        # Middleware Vite servant `/versions/V1..V5` pendant `npm run dev`
│   ├── generate-icons.mjs      # Génère `src/styles/icons.css` depuis les icônes `bi-*` utilisées
│   ├── assemble-site.mjs       # Assemble `.site/` (V6 à `/` + `/versions/index.html` + archives V1..V5)
│   ├── check-links.mjs         # Vérifie SHA-256 V1..V5, liens HTML, collisions, standards & URLs sitemap/LLM/MD
│   ├── verify.mjs              # Chaîne portable multi-OS (PowerShell 5.1, bash, CI)
│   └── serve-site.mjs          # Serveur statique Node local pour prévisualiser `.site/`
└── src/
    ├── components/             # Composants partagés (Header, Footer, Logos, Modales, Sections home/versions/identite/cv)
    ├── data/                   # Source unique de vérité typée (site, projets, compétences, CV, versions, logos, i18n)
    ├── layouts/BaseLayout.astro
    ├── pages/                  # `index`, `versions`, `identity`, `resume`, `404`, alias noindex & endpoints (`sitemap.xml.ts`, `llms.txt.ts`, `resume.md.ts`, `versions.md.ts`)
    ├── scripts/                # Contrôleurs TypeScript côté client
    ├── styles/                 # `fonts.css`, `utilities.css`, `icons.css`, `tokens.css`, `main.css`, `components/dialog.css`, `pages/*`
    └── utils/paths.ts          # Helper `withBase()`
```

---

## Commandes locales

Toutes les commandes s’exécutent depuis `versions/V6/` (Node `>= 22.12.0` requis) :

```bash
cd versions/V6
npm install           # Installer les dépendances
npm run dev           # Serveur de dev Astro (avec archives V1..V5 montées à /versions/V1..V5)
npm run check         # Vérification TypeScript + templates Astro (0 erreur, 0 avertissement)
npm run build         # Compile les pages statiques + endpoints dans versions/V6/dist/
npm run site:assemble # Assemble le site déployable complet dans versions/V6/.site/
npm run site:links    # Vérifie SHA-256 V1..V5, liens HTML, standards & URLs sitemap/LLM/MD
npm run verify        # Chaîne complète portable (Windows PowerShell 5.1 / macOS / Linux)
npm run site:serve    # Sert versions/V6/.site/ en local sur http://127.0.0.1:8080/
```

---

## Préservation des archives & évolution vers une V7

- Les dossiers [`versions/V1/`](../V1/index.html) à [`versions/V5/`](../V5/index.html) restent **strictement en lecture seule**. La commande `npm run site:links` contrôle l’empreinte SHA-256 de chaque fichier d’archive copié dans `.site/`.
- Pour créer plus tard une **V7**, conserver `versions/V6/` en archive dans `assemble-site.mjs` et ajouter l’entrée `V7` dans `src/data/versions.ts`.
