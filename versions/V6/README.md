# Portfolio Olivier Bourgault — Version 6 (Astro · Tech Canvas)

Code source Astro de la **Version 6 (V6)** du portfolio [`olivierbourgault.github.io`](https://olivierbourgault.github.io/versions/V6/), conçue pour offrir une maintenabilité moderne par composants tout en préservant **à l’identique** la direction artistique « Tech Canvas » issue de [`versions/V5/`](../V5/index.html).

---

## Architecture & choix techniques

- **Générateur statique : Astro (`^6.4.8`)** — zéro JavaScript runtime imposé par le framework, typage strict TypeScript et scripts ESM autonomes.
- **Identité « Tech Canvas » & Pack Ingénierie & IA** :
  - Couleurs : `#FF6600` (Orange Signal), `#38BDF8` (Bleu Circuit), `#121316` (Carbone Studio), `#1A1C20` (Graphite), `#F4F1EA` (Ivoire Papier en mode clair).
  - Polices hébergées localement via `@fontsource` (zéro requête Google Fonts) : `Oswald`, `Chakra Petch`, `DM Sans`, `IBM Plex Mono`.
  - Trois emblèmes vectoriels SVG officiels réutilisés depuis `public/assets/img/logo/` (`logo-ob-tech.svg`, `logo-terminal-tech.svg`, `logo-neural-tech.svg`).
- **Dépendances allégées** (par rapport à la V5) :
  - **Conservés :** Bootstrap 5.3 CSS uniquement (grille et utilitaires), `bootstrap-icons`, `aos` (animations au défilement), `glightbox` (visionneuse portfolio), `@fontsource/*`.
  - **Retirés :** Bootstrap JS (remplacé par un menu dropdown accessible natif + `<dialog>`), Isotope & imagesLoaded (remplacés par filtrage DOM et pagination `5` projets / `Voir plus (+N)`), Waypoints, LinkedIn badge CDN, Google Fonts CDN.
- **Standards Web modernes intégrés** :
  - Modales `<dialog closedby="any">` natives (CV PDF FR/EN et mode Plein écran du Studio) avec fallback `pointerdown`/`pointerup` pour les navigateurs sans `closedby`.
  - Bascule Dark / Light sans FOUC via script synchrone dans `<head>` (`localStorage` clé `ob_v6_theme` + `<meta name="color-scheme">`).
  - Pointeur interactif avec halo radial orange actif en permanence (masqué automatiquement sur écran tactile).

---

## Arborescence `versions/V6/`

```text
versions/V6/
├── astro.config.mjs            # Base `/versions/V6`, build `format: 'file'`, plugin dev archives
├── package.json                # Dépendances & scripts npm
├── tsconfig.json               # Configuration TypeScript stricte
├── public/assets/              # PDFs (CV FR/EN), favicon, logos SVG, visuels portfolio & profil
├── tools/
│   ├── dev-archives.mjs        # Middleware Vite servant `/versions/V1..V5` pendant `npm run dev`
│   ├── assemble-site.mjs       # Assemble `.site/` (racine + archives V1..V5 + dist V6)
│   ├── check-links.mjs         # Vérifie SHA-256 des archives + liens internes HTML
│   └── serve-site.mjs          # Serveur statique Node local pour prévisualiser `.site/`
└── src/
    ├── components/             # Composants partagés (Header, Footer, Logos, Modales, Sections home/versions/identite/cv)
    ├── data/                   # Données typées (projets, compétences, CV, timeline V6→V1, charte SVG)
    ├── layouts/BaseLayout.astro
    ├── pages/                  # `index`, `versions`, `identite`, `logo_proposals` (alias), `cv-apercu`, `404`
    ├── scripts/                # Contrôleurs TypeScript côté client
    ├── styles/                 # `tokens.css`, `main.css`, `components/dialog.css`, `pages/*`
    └── utils/paths.ts          # Helper `withBase()` sécurisé sous `/versions/V6/`
```

---

## Commandes locales

Toutes les commandes s’exécutent depuis `versions/V6/` (Node `>= 22.12.0` requis) :

```bash
cd versions/V6
npm install          # Installer les dépendances
npm run dev          # Serveur de dev Astro (avec archives V1..V5 montées à /versions/V1..V5)
npm run check        # Vérification TypeScript + templates Astro
npm run build        # Compile les pages statiques dans versions/V6/dist/
npm run site:assemble# Assemble le site déployable complet dans versions/V6/.site/
npm run site:links   # Vérifie SHA-256 V1..V5 et tous les liens internes dans .site/
npm run verify       # Chaîne complète : check -> build -> site:assemble -> site:links
npm run site:serve   # Sert versions/V6/.site/ en local sur http://localhost:8080/
```

---

## Préservation des archives & évolution vers une V7

- Les dossiers [`versions/V1/`](../V1/index.html) à [`versions/V5/`](../V5/index.html) restent **strictement en lecture seule**. La commande `npm run site:links` contrôle même l’empreinte SHA-256 de chaque fichier d’archive copié dans `.site/`.
- Pour créer plus tard une **V7** :
  1. Geler le build statique de V6 ou conserver `versions/V6/` tel quel dans `assemble-site.mjs`.
  2. Mettre à jour [`/index.html`](../../index.html) et [`/versions/index.html`](../index.html) vers `versions/V7/`.
  3. Ajouter l’entrée `V7` dans `src/data/versions.ts` et dans la boucle d’assemblage.
