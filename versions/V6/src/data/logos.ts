export interface IdentityChapterNav {
  targetId: string;
  title: string;
  sub: string;
}

export interface IdentityInvariant {
  badgeIcon: string;
  badgeText: string;
  title: string;
  descHtml: string;
}

export interface PaletteColorToken {
  id: string;
  name: string;
  role: string;
  hex: string;
  ariaLabel: string;
}

export interface TypoSpecimen {
  role: string;
  sample: string;
  meta: string;
  fontCss: string;
  extraStyle?: string;
}

export interface FamilyTableRow {
  logoFile: string;
  name: string;
  seen: string;
  meaning: string;
  hidden: string;
}

export const IDENTITY_CHAPTERS: IdentityChapterNav[] = [
  { targetId: 'origine', title: '01 · L’origine', sub: 'Le système & 6 invariants' },
  { targetId: 'famille', title: '02 · La famille', sub: '3 piliers, 1 signature' },
  { targetId: 'logo-ob-tech', title: '03 · OB Hexagonal', sub: 'Logo officiel V4 → V6' },
  { targetId: 'logo-terminal', title: '04 · Terminal </>', sub: 'Développement Full-Stack' },
  { targetId: 'logo-neural', title: '05 · Nœud Neuronal', sub: 'Intelligence Artificielle' },
  { targetId: 'code-famille', title: '06 · Code & Charte', sub: 'Couleurs, typos & banc SVG' }
];

export const IDENTITY_INVARIANTS: IdentityInvariant[] = [
  {
    badgeIcon: 'bi-grid-3x3',
    badgeText: '01 · Grille fixe',
    title: 'Canevas 100 × 100 centré',
    descHtml:
      'Chaque tracé est centré en <code>50;50</code> dans un carré strict pour assurer l’alignement parfait entre la barre de navigation, le favicon et les cartes.'
  },
  {
    badgeIcon: 'bi-lightning-charge',
    badgeText: '02 · Signal orange',
    title: 'Le #FF6600 comme signature',
    descHtml:
      'L’orange vif incarne le déclenchement, l’automatisation et la sélection active dans toute l’interface Tech Canvas.'
  },
  {
    badgeIcon: 'bi-cpu',
    badgeText: '03 · Polarité bleue',
    title: 'Le #38BDF8 pour la logique',
    descHtml:
      'Le bleu circuit représente le flux logiciel, les chevrons du terminal et l’intelligence des nœuds neuronaux.'
  },
  {
    badgeIcon: 'bi-bezier2',
    badgeText: '04 · Même arrondi',
    title: 'Terminaisons <code>round</code> unifiées',
    descHtml:
      'Toutes les extrémités de tracés et sommets partagent des jonctions et embouts arrondis (5–7 px) qui signent la même famille visuelle.'
  },
  {
    badgeIcon: 'bi-brightness-high',
    badgeText: '05 · Bivalent',
    title: 'Lisible sur Carbone & Ivoire',
    descHtml:
      'Conçus pour rester nets aussi bien sur fond carbone sombre <code>#121316</code> que sur papier atelier clair <code>#F4F1EA</code>.'
  },
  {
    badgeIcon: 'bi-app-indicator',
    badgeText: '06 · Multi-échelles',
    title: 'Net dès 16 × 16 px',
    descHtml:
      'Aucun dégradé complexe ni micro-détail fragile : chaque logo tient en favicon 16 px comme en illustration pleine largeur.'
  }
];

export const FAMILY_COMPARISON_ROWS: FamilyTableRow[] = [
  {
    logoFile: 'assets/img/logo/logo-ob-tech.svg',
    name: 'OB Hexagonal Tech',
    seen: 'Hexagone orange + monogramme B bleu + pivot central',
    meaning: 'Mon identité officielle & mes systèmes TI',
    hidden: 'Initiales O·B réunies en bouclier matériel et bus de données'
  },
  {
    logoFile: 'assets/img/logo/logo-terminal-tech.svg',
    name: 'Terminal Code </>',
    seen: 'Disque orange + chevrons bleus + slash orange à 74°',
    meaning: 'Le langage du développement Full-Stack',
    hidden: 'Dialogue Front / Back symétrique autour de l’impulsion /'
  },
  {
    logoFile: 'assets/img/logo/logo-neural-tech.svg',
    name: 'Nœud Neuronal IA',
    seen: 'Orbite pointillée orange + triangle de 3 disques bleus',
    meaning: 'Intelligence Artificielle & Agents',
    hidden: 'Flux de paquets vers un modèle à 3 synapses et noyau d’inférence'
  }
];

export const PALETTE_COLOR_TOKENS: PaletteColorToken[] = [
  {
    id: 'hex-orange',
    name: 'Orange Signal',
    role: 'Signature, sélection Figma, ombres dures et cadre OB.',
    hex: '#FF6600',
    ariaLabel: 'Copier le code couleur Orange Signal #FF6600'
  },
  {
    id: 'hex-sky',
    name: 'Bleu Circuit',
    role: 'Logique logicielle, flux binaires et synapses IA.',
    hex: '#38BDF8',
    ariaLabel: 'Copier le code couleur Bleu Circuit #38BDF8'
  },
  {
    id: 'hex-carbon',
    name: 'Carbone Studio',
    role: 'Planche sombre principale pour contraste maximal.',
    hex: '#121316',
    ariaLabel: 'Copier le code couleur Carbone Studio #121316'
  },
  {
    id: 'hex-graphite',
    name: 'Graphite Surface',
    role: 'Cartes néo-brutalistes, panneaux et fenêtres OS.',
    hex: '#1A1C20',
    ariaLabel: 'Copier le code couleur Graphite Surface #1A1C20'
  },
  {
    id: 'hex-ivory',
    name: 'Ivoire Papier',
    role: 'Planche d’atelier claire avec traits d’encre #161616.',
    hex: '#F4F1EA',
    ariaLabel: 'Copier le code couleur Ivoire Papier #F4F1EA'
  }
];

export const TYPO_SPECIMENS: TypoSpecimen[] = [
  {
    role: 'Titres & UI',
    sample: 'Chakra Petch',
    meta: 'Poids 600 / 700 · Géométrie technique',
    fontCss: "'Chakra Petch', sans-serif",
    extraStyle: 'font-weight: 700;'
  },
  {
    role: 'Signature Navbar',
    sample: 'OLIVIER BOURGAULT',
    meta: 'Oswald · Capitales condensées',
    fontCss: "'Oswald', sans-serif",
    extraStyle: 'font-weight: 700; letter-spacing: 0.05em;'
  },
  {
    role: 'Corps éditorial',
    sample: 'Clarté de lecture sur grilles et cartes.',
    meta: 'DM Sans · 400 / 500 / 700',
    fontCss: "'DM Sans', sans-serif",
    extraStyle: 'font-weight: 500; font-size: 1.15rem;'
  },
  {
    role: 'Code & Cotation',
    sample: 'R 46 · 60° · #FF6600',
    meta: 'IBM Plex Mono · Terminal & cotes',
    fontCss: "'IBM Plex Mono', monospace",
    extraStyle: 'font-weight: 700; font-size: 1.12rem; color: #38BDF8;'
  }
];
