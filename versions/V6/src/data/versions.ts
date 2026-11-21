export interface VersionPalette {
  key: string;
  name: string;
  url: string;
  color: string;
}

export interface PortfolioVersion {
  id: string;
  shortLabel: string;
  title: string;
  path: string;
  date: string;
  status: string;
  statusType: 'live' | 'stable' | 'archive';
  featured: boolean;
  swatches: string[];
  stack: string[];
  description: string;
  highlights: string[];
  palettes: VersionPalette[];
}

export const PORTFOLIO_VERSIONS: PortfolioVersion[] = [
  {
    id: 'V6',
    shortLabel: 'Astro · Tech Canvas',
    title: 'Version 6.0 — Édition Astro · Tech Canvas Componentisée',
    path: '/',
    date: '2026',
    status: 'Actuelle · Recommandée',
    statusType: 'live',
    featured: true,
    swatches: ['#121316', '#FF6600', '#38BDF8', '#F4F1EA'],
    stack: ['Astro 6', 'TypeScript', 'Tech Canvas', 'GitHub Actions', '0 Ko Runtime'],
    description:
      'Refonte architecturale complète sous Astro avec composants réutilisables, polices auto-hébergées (@fontsource), dialogues/menus natifs sans Bootstrap JS ni Isotope, thème unifié zéro-FOUC et déploiement automatisé sur GitHub Pages tout en préservant l’intégrité exacte de V1 à V5.',
    highlights: [
      'Migration vers Astro (build 100 % statique) avec composants partagés : Navbar Shabnam, Boot Loader Fusion, Curseur Aahil Khan, Badges, Cartes néo-brutalistes et Dialogues natifs',
      'Identité visuelle Tech Canvas conservée à 100 % : Orange Signal #FF6600, Bleu Circuit #38BDF8, Carbone #121316, Ivoire #F4F1EA et Pack Ingénierie & IA auto-hébergé',
      'Suppression des bibliothèques superflues (Bootstrap JS, Isotope, imagesLoaded, Waypoints, CDN Google Fonts) au profit des API Web natives (dialog, IntersectionObserver, grilles CSS)',
      'Thème sombre / clair unifié via la clé ob_v6_theme et script synchrone pré-rendu éliminant tout flash visuel (FOUC) sur les 4 pages',
      'Pipeline CI/CD GitHub Actions assemblant la racine, la V6 et les archives intactes V1–V5 avec vérification automatisée des liens internes et des hash SHA-256'
    ],
    palettes: [
      {
        key: 'tech-canvas',
        name: 'Tech Canvas (V6 Astro)',
        url: '/',
        color: 'linear-gradient(135deg, #FF6600, #121316)'
      }
    ]
  },
  {
    id: 'V5',
    shortLabel: 'Tech Canvas',
    title: 'Version 5.0 — Édition Tech Canvas & Studio Interactif',
    path: '/versions/V5/',
    date: '2026',
    status: 'Stable',
    statusType: 'stable',
    featured: false,
    swatches: ['#121316', '#FF6600', '#38BDF8', '#F4F1EA'],
    stack: ['Tech Canvas', 'Vanilla JS', 'GitHub API', 'SVG / CSS3', 'WCAG'],
    description:
      'Direction artistique exclusive « Tech Canvas », fusionnant la rigueur technique Carbone #121316 & Orange #FF6600, l’atelier Figma de Shabnam Raghavan et le néo-brutalisme interactif d’Aahil Khan, enrichie d’un portfolio GitHub en temps réel et d’une ergonomie de lecture complète.',
    highlights: [
      'Direction artistique unifiée Tech Canvas : fond carbone #121316 (ou ivoire #F4F1EA en mode clair), grille 48×48 px, cartes néo-brutalistes à ombre dure #FF6600 et rubans d’atelier translucides',
      'Barre de navigation Shabnam évolutive : en-tête transparent avec soulignement sinusoïdal SVG qui se transforme au défilement en pilule translucide (hystérésis fluide) et tiroir mobile #302F2C',
      'Boot Loader Fusion exclusif : tracé vectoriel du monogramme OB Tech, nœuds neuronaux IA en orbite et terminal OB_TECH_CORE avec progression 00% → 100%',
      'Portfolio dynamique synchronisé avec GitHub (RinoShip77/MesProjets, 59+ projets) : 5 projets phares affichés par défaut et bouton « Voir plus » avec compteur',
      'Navigation avancée : sections collapsibles, barre de navigation verticale collante (CV & Portfolio), curseur Aahil Khan à halo radial orange (touche L) et page CV - Aperçu dédiée'
    ],
    palettes: [
      {
        key: 'tech-canvas',
        name: 'Tech Canvas (Exclusif V5)',
        url: '/versions/V5/',
        color: 'linear-gradient(135deg, #FF6600, #121316)'
      }
    ]
  },
  {
    id: 'V4',
    shortLabel: 'OB Tech',
    title: 'Version 4.0 — Édition OB Tech & Identité Vectorielle',
    path: '/versions/V4/',
    date: '2026',
    status: 'Stable',
    statusType: 'stable',
    featured: false,
    swatches: ['#121316', '#FF6600', '#38BDF8', '#1C1E24'],
    stack: ['SVG Vectoriel', '7 Palettes', 'Bootstrap 5', 'Laser UI'],
    description:
      'Adoption officielle du logo vectoriel « OB Tech » (hexagone orange et circuit bleu ciel), déploiement de l’écosystème des 3 logos thématiques et mise en avant de la palette Tech Présentation avec 7 thèmes commutables.',
    highlights: [
      'Logo principal officiel OB Tech en SVG (hexagone #FF6600 & circuits binaires #38BDF8)',
      'Écosystème des 3 logos thématiques : OB Hexagonal (TI/DevOps), Terminal </> (Full-Stack) et Nœud Neuronal (IA)',
      'Palette Tech Présentation activée par défaut avec grille technique 40×40 px et pointeur laser virtuel (touche L)',
      'Sélecteur multi-styles étendu à 7 palettes commutables à chaud (Tech, Tech Canvas, Obsidian Blaze, Améthyste, Synthwave, Ethiack, Shabnam)',
      'Favicon vectoriel SVG et page de propositions d’identité visuelle associée'
    ],
    palettes: [
      {
        key: 'tech',
        name: 'Tech Présentation',
        url: '/versions/V4/?palette=tech',
        color: 'linear-gradient(135deg, #FF6600, #38BDF8)'
      },
      {
        key: 'tech-canvas',
        name: 'Tech Canvas',
        url: '/versions/V4/?palette=tech-canvas',
        color: 'linear-gradient(135deg, #FF6600, #121316)'
      },
      {
        key: 'obsidian-blaze',
        name: 'Obsidian Blaze',
        url: '/versions/V4/?palette=obsidian-blaze',
        color: 'linear-gradient(135deg, #FF5A1F, #FFBC42)'
      },
      {
        key: 'amethyst',
        name: 'Améthyste',
        url: '/versions/V4/?palette=amethyst',
        color: 'linear-gradient(135deg, #E11484, #A855F7)'
      },
      {
        key: 'synthwave',
        name: 'Active Theory',
        url: '/versions/V4/?palette=synthwave',
        color: 'linear-gradient(135deg, #00F0FF, #C026D3)'
      },
      {
        key: 'ethiack',
        name: 'Ethiack',
        url: '/versions/V4/?palette=ethiack',
        color: 'linear-gradient(135deg, #10B981, #059669)'
      },
      {
        key: 'shabnam',
        name: 'Shabnam',
        url: '/versions/V4/?palette=shabnam',
        color: 'linear-gradient(135deg, #C02D0C, #F2D987)'
      }
    ]
  },
  {
    id: 'V3',
    shortLabel: 'Multi-Styles',
    title: 'Version 3.0 — Édition Multi-Styles (6 Thèmes)',
    path: '/versions/V3/',
    date: '2026',
    status: 'Stable',
    statusType: 'stable',
    featured: false,
    swatches: ['#E11484', '#00F0FF', '#10B981', '#C02D0C'],
    stack: ['Multi-Thèmes', 'CSS Variables', 'URL Params', 'Mode Clair/Sombre'],
    description:
      'Expérimentation visuelle complète introduisant un sélecteur flottant de 6 directions artistiques commutables en temps réel (en mode sombre ou clair) et partageables par paramètre d’URL.',
    highlights: [
      'Original Améthyste & Fuchsia néon (#E11484 / #A855F7) avec halos diffus',
      'Active Theory Cyberpunk Synthwave (cyan #00F0FF & magenta #C026D3)',
      'Ethiack Terminal Matrix Hacker (vert émeraude #10B981, JetBrains Mono et trame binaire)',
      'Tech Présentation Keynote Orange (#FF6600 / #38BDF8) et introduction du pointeur laser',
      'Shabnam Atelier Papier (#CDC9B6 / Vermillon #C02D0C) et déclinaison Néo-Brutaliste Aahil'
    ],
    palettes: [
      {
        key: 'tech',
        name: 'Tech Présentation',
        url: '/versions/V3/?palette=tech',
        color: 'linear-gradient(135deg, #FF6600, #38BDF8)'
      },
      {
        key: 'amethyst',
        name: 'Améthyste',
        url: '/versions/V3/?palette=amethyst',
        color: 'linear-gradient(135deg, #E11484, #A855F7)'
      },
      {
        key: 'synthwave',
        name: 'Active Theory',
        url: '/versions/V3/?palette=synthwave',
        color: 'linear-gradient(135deg, #00F0FF, #C026D3)'
      },
      {
        key: 'ethiack',
        name: 'Ethiack',
        url: '/versions/V3/?palette=ethiack',
        color: 'linear-gradient(135deg, #10B981, #059669)'
      },
      {
        key: 'shabnam',
        name: 'Shabnam',
        url: '/versions/V3/?palette=shabnam',
        color: 'linear-gradient(135deg, #C02D0C, #F2D987)'
      },
      {
        key: 'aahil',
        name: 'Aahil Néo-Brutal',
        url: '/versions/V3/?palette=aahil',
        color: 'linear-gradient(135deg, #FACC15, #18181B)'
      }
    ]
  },
  {
    id: 'V2',
    shortLabel: 'Édition IA',
    title: 'Version 2.0 — Édition IA & Enrichie',
    path: '/versions/V2/',
    date: '2026',
    status: 'Stable',
    statusType: 'stable',
    featured: false,
    swatches: ['#0A0812', '#E11484', '#A855F7', '#FAF7FD'],
    stack: ['Bootstrap 5', 'Isotope', 'AOS', 'GLightbox'],
    description:
      'Refonte éditoriale alignée sur la spécialisation en intelligence artificielle, intégrant les expériences récentes et une présentation technique enrichie des compétences et projets.',
    highlights: [
      'Intégration de l’AEC en Intelligence Artificielle (Collège O’Sullivan)',
      'Ajout des expériences récentes : Élections Canada (2025) et perfectionnement Microsoft Learn',
      'Refonte complète des jauges de compétences (C#, .NET MAUI, Python/IA, Angular, Vue, Symfony)',
      'Fiches projets détaillées avec badges technologiques et formulaire de contact modernisé'
    ],
    palettes: []
  },
  {
    id: 'V1',
    shortLabel: 'Initiale',
    title: 'Version 1.0 — Archive Initiale',
    path: '/versions/V1/',
    date: '2025',
    status: 'Archive',
    statusType: 'archive',
    featured: false,
    swatches: ['#1E293B', '#E87532', '#64748B', '#F8FAFC'],
    stack: ['HTML5', 'CSS3', 'Bootstrap 5', 'GitHub'],
    description:
      'Première version complète publiée sur olivierbourgault.github.io, mettant en lumière le DEC en technique de l’informatique et les premières réalisations professionnelles et scolaires.',
    highlights: [
      'Présentation du parcours au Cégep de Saint-Jérôme, à la Chambre des Communes et chez VIWEB',
      'Galerie de projets filtrable par catégorie (Scolaires, Professionnels, Personnels)',
      'Première intégration dynamique des statistiques et du profil GitHub'
    ],
    palettes: []
  }
];
