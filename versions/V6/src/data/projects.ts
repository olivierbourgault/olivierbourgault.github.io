export interface FallbackProject {
  name: string;
  path: string;
  filterClass: 'filter-personal' | 'filter-professional' | 'filter-school';
  categoryLabel: string;
  image: string;
  alt: string;
  gallery: string;
  repoUrl: string;
  descriptionHtml: string;
  badges: string[];
}

export const FALLBACK_PROJECTS: FallbackProject[] = [
  {
    name: 'HubAI',
    path: 'Personnels/HubAI',
    filterClass: 'filter-personal',
    categoryLabel: 'Personnels • IA',
    image: 'assets/img/portfolio/hubAI.png',
    alt: 'Aperçu du projet HubAI',
    gallery: 'portfolio-gallery-motion',
    repoUrl: 'https://github.com/RinoShip77/MesProjets/tree/main/Personnels/HubAI',
    descriptionHtml:
      "Plateforme modulaire unifiant quatre applications propulsées par l'intelligence artificielle générative. Intégration de modèles de langage (LLM), conception de prompts structurés, traitement de données en temps réel et interface Web réactive.",
    badges: ['Python', 'API Gemini / LLM', 'JavaScript', 'REST API']
  },
  {
    name: 'CompareTools',
    path: 'Professionnels/HoC-CdC_E23/CompareTools',
    filterClass: 'filter-professional',
    categoryLabel: 'Professionnels • Chambre des Communes (2023)',
    image: 'assets/img/portfolio/compareTools.png',
    alt: 'Aperçu du projet CompareTools',
    gallery: 'portfolio-gallery-graphics',
    repoUrl: 'https://github.com/RinoShip77/MesProjets/tree/main/Professionnels/HoC-CdC_E23/CompareTools',
    descriptionHtml:
      "Outil d'automatisation en <strong>PowerShell</strong> conçu pour comparer finement des fichiers et dossiers ligne par ligne, accélérant le diagnostic des incidents et l'efficacité de l'équipe de support TI.",
    badges: ['PowerShell', 'Automatisation', 'Diagnostic TI']
  },
  {
    name: 'Electrolib',
    path: 'Scolaires/CSTJ/A23-ProjetDeDeveloppement_5C8/Electrolib',
    filterClass: 'filter-school',
    categoryLabel: 'Scolaires • 2023',
    image: 'assets/img/portfolio/electrolib.png',
    alt: 'Aperçu du projet Electrolib',
    gallery: 'portfolio-gallery-web',
    repoUrl: 'https://github.com/RinoShip77/MesProjets/tree/main/Scolaires/CSTJ/A23-ProjetDeDeveloppement_5C8/Electrolib',
    descriptionHtml:
      "Logiciel complet de gestion d'inventaire destiné à une bibliothèque (Projet de développement 420-5C8-JR), reposant sur une application cliente en <strong>Angular</strong> et un serveur back-end en <strong>Symfony</strong>.",
    badges: ['Angular', 'TypeScript', 'Symfony', 'PHP / SQL']
  },
  {
    name: 'Kaomia',
    path: 'Scolaires/CSTJ/A23-SystemesMulticlients_5D4/Kaomia',
    filterClass: 'filter-school',
    categoryLabel: 'Scolaires • 2023',
    image: 'assets/img/portfolio/kaomia.png',
    alt: 'Aperçu du projet Kaomia',
    gallery: 'portfolio-gallery-web',
    repoUrl: 'https://github.com/RinoShip77/MesProjets/tree/main/Scolaires/CSTJ/A23-SystemesMulticlients_5D4/Kaomia',
    descriptionHtml:
      "Portail multi-clients de consultation des statistiques d'un jeu (cours 420-5D4-JR), intégrant un client Web en <strong>Vue.js</strong>, une application mobile en <strong>Kotlin</strong> et un serveur <strong>Node.js</strong>.",
    badges: ['Vue.js', 'Kotlin (Android)', 'Node.js']
  },
  {
    name: 'EVOMEAL',
    path: 'Scolaires/CSTJ/H23-DeveloppementWeb_4D6/EVOMEAL',
    filterClass: 'filter-school',
    categoryLabel: 'Scolaires • 2023',
    image: 'assets/img/portfolio/evomeal.png',
    alt: 'Aperçu du projet EVOMEAL',
    gallery: 'portfolio-gallery-web',
    repoUrl: 'https://github.com/RinoShip77/MesProjets/tree/main/Scolaires/CSTJ/H23-DeveloppementWeb_4D6/EVOMEAL',
    descriptionHtml:
      'Plateforme Web de commerce en ligne développée avec le framework <strong>Symfony</strong>, incluant la gestion dynamique des produits, des commandes et des utilisateurs.',
    badges: ['Symfony', 'Twig', 'PHP', 'MySQL']
  },
  {
    name: 'Shopro',
    path: 'Personnels/Shopro',
    filterClass: 'filter-personal',
    categoryLabel: 'Personnels • E-Commerce',
    image: 'assets/img/portfolio/shopro.png',
    alt: 'Aperçu du projet Shopro',
    gallery: 'portfolio-gallery-motion',
    repoUrl: 'https://github.com/RinoShip77/MesProjets/tree/main/Personnels/Shopro',
    descriptionHtml:
      "Boutique de vente en ligne avec thème personnalisé, catalogue sur mesure et automatisation du parcours d'achat.",
    badges: ['WordPress', 'WooCommerce', 'PHP / CSS']
  }
];
