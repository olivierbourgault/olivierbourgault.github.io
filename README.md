# olivierbourgault.github.io

Bienvenue sur le dépôt officiel de mon portfolio Web, accessible en ligne à l’adresse :
👉 **[https://olivierbourgault.github.io](https://olivierbourgault.github.io)**
*(L’ancienne adresse `https://rinoship77.github.io` redirige automatiquement vers ce domaine).*

---

## Structure du dépôt

Le dépôt conserve l’historique complet du portfolio sans jamais altérer les archives précédentes :

```text
olivierbourgault.github.io/
├── .github/workflows/
│   └── deploy-pages.yml   # Pipeline GitHub Actions (build Astro V6 + assemblage .site/)
├── index.html             # Redirection racine vers versions/V6/
├── README.md              # Documentation générale du dépôt
└── versions/
    ├── index.html         # Redirection de secours vers V6/ (corrige les liens ../index.html)
    ├── V1/                # Archive figée — V1.0 HTML/CSS/JS initiale
    ├── V2/                # Archive figée — V2.0 (AEC IA, Élections Canada)
    ├── V3/                # Archive figée — V3.0 Multi-Styles (5 palettes)
    ├── V4/                # Archive figée — V4.0 Tech Edition & SVG OB Tech
    ├── V5/                # Archive figée — V5.0 Tech Canvas statique (référence DA)
    └── V6/                # Portfolio actif — V6.0 (Astro · Tech Canvas · Documentation locale)
```

---

## Historique des versions

| Version | Technologies principales | Points marquants | État |
| :--- | :--- | :--- | :--- |
| **[V6](versions/V6/README.md)** | Astro 6, TypeScript, `@fontsource`, Bootstrap 5.3 CSS, Bootstrap Icons, AOS, GLightbox | Architecture modulaire Astro, zéro CDN de polices, `<dialog>` natifs, suppression de Bootstrap JS / Isotope / Waypoints / jQuery, identité Tech Canvas V5 fidèle à 100 % | **Active (défaut)** |
| **[V5](versions/V5/index.html)** | HTML5, CSS3, JavaScript Vanilla, Bootstrap 5, Isotope | Création de la direction artistique « Tech Canvas » (`#FF6600` / `#38BDF8` / `#121316` / `#F4F1EA`), Boot Loader Fusion, barre Shabnam, identité 3 logos | Archive intacte |
| **[V4](versions/V4/index.html)** | HTML5, CSS3, JS | Apparition de l’identité vectorielle OB Tech et des badges techniques | Archive intacte |
| **[V3](versions/V3/index.html)** | HTML5, CSS3, JS | 5 directions artistiques commutables en temps réel + curseur interactif | Archive intacte |
| **[V2](versions/V2/index.html)** | HTML5, Bootstrap | Ajout AEC en Intelligence Artificielle, Élections Canada, Microsoft Learn | Archive intacte |
| **[V1](versions/V1/index.html)** | HTML5, Bootstrap | Première mise en ligne du portfolio (DEC en informatique) | Archive intacte |

---

## Pages publiées (V6 active)

- **Accueil Portfolio :** [https://olivierbourgault.github.io](https://olivierbourgault.github.io)
- **Navigateur de versions (Studio live + Frise V6 → V1) :** [https://olivierbourgault.github.io/versions](https://olivierbourgault.github.io/versions)
- **Identité visuelle & Charte des 3 logos :** [https://olivierbourgault.github.io/identity](https://olivierbourgault.github.io/identity) *(alias conservés : [`identite.html`](https://olivierbourgault.github.io/identite.html), [`logo_proposals.html`](https://olivierbourgault.github.io/logo_proposals.html))*
- **CV - Aperçu imprimable (FR / EN) :** [https://olivierbourgault.github.io/resume](https://olivierbourgault.github.io/resume) *(alias conservé : [`cv-apercu.html`](https://olivierbourgault.github.io/cv-apercu.html))*

---

## Déploiement GitHub Pages (GitHub Actions)

La V6 est compilée automatiquement à chaque `git push` sur `main` via [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml) :

1. Vérification TypeScript / Astro (`npm run check`), build statique (`npm run build`), assemblage dans `versions/V6/.site/` (`npm run site:assemble`) incluant `index.html`, `.nojekyll`, `404.html`, `versions/index.html`, la copie octet par octet de `versions/V1..V5` et le build `versions/V6/`.
2. Audit d’intégrité SHA-256 des archives et vérification des liens internes (`npm run site:links`).
3. Publication de l’artefact complet vers GitHub Pages via `actions/deploy-pages@v4`.

> **Configuration requise sur GitHub (une seule fois) :**
> Dans le dépôt GitHub, ouvrir **Settings → Pages → Build and deployment → Source** et sélectionner **GitHub Actions**.

Pour les commandes locales (dev, build, tests et prévisualisation), consultez [`versions/V6/README.md`](versions/V6/README.md).
