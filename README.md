# olivierbourgault.github.io

Bienvenue sur le dépôt officiel de mon portfolio Web bilingue (FR / EN), accessible en ligne à l’adresse :
👉 **[https://olivierbourgault.github.io](https://olivierbourgault.github.io)**
*(L’ancienne adresse `https://rinoship77.github.io` redirige automatiquement vers ce domaine).*

---

## Structure du dépôt

Le dépôt conserve l’historique complet du portfolio sans jamais altérer les archives précédentes :

```text
olivierbourgault.github.io/
├── .github/workflows/
│   └── deploy-pages.yml   # Pipeline GitHub Actions (build Astro V6 + assemblage .site/)
├── index.html             # Page de repère source (la production est servie à / via .site/)
├── README.md              # Documentation générale du dépôt
└── versions/
    ├── V1/                # Archive figée — V1.0 HTML/CSS/JS initiale
    ├── V2/                # Archive figée — V2.0 (AEC IA, Élections Canada)
    ├── V3/                # Archive figée — V3.0 Multi-Styles (5 palettes)
    ├── V4/                # Archive figée — V4.0 Tech Edition & SVG OB Tech
    ├── V5/                # Archive figée — V5.0 Tech Canvas statique (référence DA)
    └── V6/                # Portfolio actif — V6.0 (Astro · Tech Canvas · base: '/')
```

---

## Historique des versions

| Version | Technologies principales | Points marquants | État |
| :--- | :--- | :--- | :--- |
| **[V6](versions/V6/README.md)** | Astro 6, TypeScript, `@fontsource` (`latin` WOFF2), CSS Grid/Utilitaires natifs, masques SVG, `IntersectionObserver`, `<dialog>` natifs | Déployée à `/`, bilingue FR/EN zéro-FOUC, ~484 Ko d’assets `_astro/` (-76 %), SEO/OG/JSON-LD, accessibilité WCAG 2.1 AA, fichiers LLM/Markdown générés au build | **Active (défaut)** |
| **[V5](versions/V5/index.html)** | HTML5, CSS3, JavaScript Vanilla, Bootstrap 5, Isotope | Création de la direction artistique « Tech Canvas » (`#FF6600` / `#38BDF8` / `#121316` / `#F4F1EA`), Boot Loader Fusion, barre Shabnam, identité 3 logos | Archive intacte |
| **[V4](versions/V4/index.html)** | HTML5, CSS3, JS | Apparition de l’identité vectorielle OB Tech et des badges techniques | Archive intacte |
| **[V3](versions/V3/index.html)** | HTML5, CSS3, JS | 5 directions artistiques commutables en temps réel + curseur interactif | Archive intacte |
| **[V2](versions/V2/index.html)** | HTML5, Bootstrap | Ajout AEC en Intelligence Artificielle, Élections Canada, Microsoft Learn | Archive intacte |
| **[V1](versions/V1/index.html)** | HTML5, Bootstrap | Première mise en ligne du portfolio (DEC en informatique) | Archive intacte |

---

## Pages publiées & fichiers standards (V6 active)

### Pages Web
- **Accueil Portfolio :** [https://olivierbourgault.github.io/](https://olivierbourgault.github.io/)
- **Navigateur de versions (Studio live + Frise V6 → V1) :** [https://olivierbourgault.github.io/versions/](https://olivierbourgault.github.io/versions/)
- **Identité visuelle & Charte des 3 logos :** [https://olivierbourgault.github.io/identity](https://olivierbourgault.github.io/identity) *(alias `noindex` conservés : `identite.html`, `logo_proposals.html`)*
- **CV - Aperçu imprimable (FR / EN) :** [https://olivierbourgault.github.io/resume](https://olivierbourgault.github.io/resume) *(alias `noindex` conservé : `cv-apercu.html`)*
- **Template de présentation Tech Canvas :** [https://olivierbourgault.github.io/assets/docs/presentation-template.html](https://olivierbourgault.github.io/assets/docs/presentation-template.html)

### Standards Web, SEO & Découvrabilité IA (LLM)
- **Indexation & SEO :** `robots.txt`, `sitemap.xml` (généré au build avec `hreflang` FR/EN), carte Open Graph `assets/images/og-card.png` (`1200×630`), données structurées JSON-LD (`WebSite` + `Person` + `WebPage`).
- **Contexte LLM & Markdown :** `llms.txt` (généré au build), `llms-full.txt`, `index.md`, `resume.md` (généré au build), `identity.md`, `versions.md` (généré au build).
- **Métadonnées standards :** `.well-known/security.txt` (RFC 9116), `humans.txt`, `site.webmanifest`.

---

## Déploiement GitHub Pages (GitHub Actions)

La V6 est compilée automatiquement à chaque `git push` sur `main` via [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) :

1. Vérification TypeScript / Astro (`npm run check`), build statique (`npm run build`), assemblage à la racine de `versions/V6/.site/` (`npm run site:assemble`) incluant `.nojekyll`, `versions/index.html`, l’alias `versions/V6/index.html` et la copie octet par octet de `versions/V1..V5`.
2. Audit complet (`npm run site:links`) : intégrité SHA-256 des archives V1–V5, liens internes HTML, collisions fichier/dossier GitHub Pages, présence des fichiers standards et validation des URLs dans `sitemap.xml`, `llms.txt` et `*.md`.
3. Publication de l’artefact complet vers GitHub Pages via `actions/deploy-pages@v4`.

Pour les commandes locales (dev, build, tests et prévisualisation), consultez [`versions/V6/README.md`](versions/V6/README.md).
