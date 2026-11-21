export interface CaseStudyLocale {
  tagline: string;
  challenge: string;
  architecture: string;
  highlights: string[];
  impact: string;
}

export interface FallbackProject {
  name: string;
  path: string;
  filterClass: 'filter-personal' | 'filter-professional' | 'filter-school';
  categoryLabel: string;
  image: string;
  width: number;
  height: number;
  alt: string;
  gallery: string;
  repoUrl: string;
  descriptionHtml: string;
  badges: string[];
  caseStudy?: {
    fr: CaseStudyLocale;
    en: CaseStudyLocale;
  };
}

export const PORTFOLIO_TECH_TAGS = [
  '*',
  'Python',
  'C# / .NET',
  'PowerShell',
  'TypeScript',
  'Angular',
  'Vue.js',
  'Symfony',
  'PHP',
  'Kotlin'
] as const;

export const FALLBACK_PROJECTS: FallbackProject[] = [
  {
    name: 'HubAI',
    path: 'Personnels/HubAI',
    filterClass: 'filter-personal',
    categoryLabel: 'Personnels • IA',
    image: 'assets/images/projects/hub-ai.webp',
    width: 1280,
    height: 636,
    alt: 'Aperçu du projet HubAI',
    gallery: 'portfolio-gallery-motion',
    repoUrl: 'https://github.com/RinoShip77/MesProjets/tree/main/Personnels/HubAI',
    descriptionHtml:
      "Plateforme modulaire unifiant quatre applications propulsées par l'intelligence artificielle générative. Intégration de modèles de langage (LLM), conception de prompts structurés, traitement de données en temps réel et interface Web réactive.",
    badges: ['Python', 'API Gemini / LLM', 'JavaScript', 'REST API'],
    caseStudy: {
      fr: {
        tagline: 'Suite modulaire de 4 micro-applications propulsées par des LLM et une architecture Web réactive',
        challenge:
          "Unifier dans un même portail quatre expériences IA distinctes (génération de quiz dynamiques, recommandation musicale contextuelle, synthèse météo intelligente et gestionnaire de tâches assisté) sans dupliquer la logique d'appel aux modèles ni exposer les clés API côté client.",
        architecture:
          'Service dorsal en Python orchestrant la validation des entrées, le formatage des prompts système structurés (JSON Schema) et la gestion des erreurs/quotas LLM, couplé à un front-end modulaire JavaScript/CSS avec thème adaptatif.',
        highlights: [
          'Conception de prompts système déterministes avec validation stricte des réponses JSON générées par le LLM',
          'Isolation des appels API et mise en cache locale pour réduire la latence et éviter les dépassements de quota',
          'Interface unifiée à retour instantané (états de chargement, dégradation gracieuse hors ligne et navigation clavier)'
        ],
        impact:
          'Réduction de ~70 % du code redondant entre les 4 modules grâce au socle Python/REST partagé et temps de réponse perçu fluide grâce au pré-formatage structuré.'
      },
      en: {
        tagline: 'Modular suite of 4 LLM-powered micro-applications with a reactive Web architecture',
        challenge:
          'Unify four distinct AI experiences (dynamic quiz generation, contextual music discovery, smart weather synthesis, and AI-assisted task management) within a single portal without duplicating model invocation logic or exposing API keys client-side.',
        architecture:
          'Python back-end service orchestrating input validation, structured system prompt formatting (JSON Schema), and LLM rate-limit/error handling, paired with a modular JavaScript/CSS front-end featuring adaptive theming.',
        highlights: [
          'Engineered deterministic system prompts with strict schema validation on LLM JSON outputs',
          'Isolated API calls with local response caching to cut latency and prevent quota exhaustion',
          'Unified responsive UI with clear loading states, graceful offline fallback, and keyboard accessibility'
        ],
        impact:
          'Cut redundant integration code by ~70% across all 4 modules via the shared Python/REST core while delivering predictable, structured AI responses.'
      }
    }
  },
  {
    name: 'CompareTools',
    path: 'Professionnels/HoC-CdC_E23/CompareTools',
    filterClass: 'filter-professional',
    categoryLabel: 'Professionnels • Chambre des Communes (2023)',
    image: 'assets/images/projects/compare-tools.webp',
    width: 1280,
    height: 437,
    alt: 'Aperçu du projet CompareTools',
    gallery: 'portfolio-gallery-graphics',
    repoUrl: 'https://github.com/RinoShip77/MesProjets/tree/main/Professionnels/HoC-CdC_E23/CompareTools',
    descriptionHtml:
      "Outil d'automatisation en <strong>PowerShell</strong> conçu pour comparer finement des fichiers et dossiers ligne par ligne, accélérant le diagnostic des incidents et l'efficacité de l'équipe de support TI.",
    badges: ['PowerShell', 'Automatisation', 'Diagnostic TI'],
    caseStudy: {
      fr: {
        tagline: 'Outil PowerShell d’audit et de comparaison différentielle développé à la Chambre des Communes',
        challenge:
          "Lors du diagnostic d'incidents sur les postes et serveurs à la Chambre des Communes, la comparaison manuelle de fichiers de configuration, journaux et arborescences de déploiement prenait de longues minutes par billet et comportait un risque d'erreur humaine.",
        architecture:
          'Pipeline PowerShell autonome exploitant le hachage cryptographique rapide (pré-filtrage par empreinte), l’analyse différentielle ligne par ligne avec numérotation exacte et l’export de rapports synthétiques.',
        highlights: [
          'Comparaison récursive de dossiers et fichiers de configuration avec détection instantanée des lignes ajoutées, modifiées ou supprimées',
          'Pré-filtrage par taille et empreinte pour ignorer immédiatement les fichiers identiques sur de grands répertoires réseau',
          'Sortie formatée claire et exploitable directement dans les billets d’incidents par toute l’équipe de support TI'
        ],
        impact:
          'Adopté par l’équipe de support TI pour transformer des vérifications manuelles de 15–20 minutes en un diagnostic automatisé exécuté en quelques secondes.'
      },
      en: {
        tagline: 'PowerShell differential auditing and comparison utility built at the House of Commons',
        challenge:
          'During incident troubleshooting across workstations and servers at the House of Commons, manually comparing configuration files, logs, and deployment trees took significant time per ticket and risked human oversight.',
        architecture:
          'Standalone PowerShell pipeline combining fast cryptographic hash pre-filtering, line-by-line differential analysis with exact line numbering, and structured diagnostic report generation.',
        highlights: [
          'Recursive directory and configuration file comparison pinpointing added, modified, and removed lines immediately',
          'Size and hash pre-filtering to skip identical files across large network directories instantaneously',
          'Clean, actionable output ready to paste directly into incident tickets by the entire IT support team'
        ],
        impact:
          'Adopted by the IT support team, turning 15–20 minute manual configuration checks into an automated diagnosis completed in seconds.'
      }
    }
  },
  {
    name: 'Electrolib',
    path: 'Scolaires/CSTJ/A23-ProjetDeDeveloppement_5C8/Electrolib',
    filterClass: 'filter-school',
    categoryLabel: 'Scolaires • 2023',
    image: 'assets/images/projects/electrolib.webp',
    width: 1280,
    height: 827,
    alt: 'Aperçu du projet Electrolib',
    gallery: 'portfolio-gallery-web',
    repoUrl: 'https://github.com/RinoShip77/MesProjets/tree/main/Scolaires/CSTJ/A23-ProjetDeDeveloppement_5C8/Electrolib',
    descriptionHtml:
      "Logiciel complet de gestion d'inventaire destiné à une bibliothèque (Projet de développement 420-5C8-JR), reposant sur une application cliente en <strong>Angular</strong> et un serveur back-end en <strong>Symfony</strong>.",
    badges: ['Angular', 'TypeScript', 'Symfony', 'PHP / SQL'],
    caseStudy: {
      fr: {
        tagline: 'Système complet de gestion de bibliothèque découplé (SPA Angular + API REST Symfony/MySQL)',
        challenge:
          'Concevoir en méthodologie agile une plateforme complète gérant le catalogue, les emprunts, les réservations, les pénalités et les rôles (membres vs bibliothécaires) avec une séparation stricte entre le client Web et le serveur métier.',
        architecture:
          'Front-end SPA en Angular / TypeScript consommant une API RESTful Symfony (PHP / Doctrine ORM / MySQL), avec authentification par jetons, gardes de routes par rôle et filtrage multicritère temps réel.',
        highlights: [
          'Architecture REST découplée entre Angular (services typés, composants réactifs RxJS) et Symfony (contrôleurs API, Doctrine ORM)',
          'Moteur de recherche et de filtrage multicritère (genre, auteur, disponibilité, statut d’emprunt) sans rechargement de page',
          'Gestion complète du cycle de vie des prêts, réservations et permissions administrateur développée en sprints agiles'
        ],
        impact:
          'Livraison d’une application Full-Stack clé en main couvrant l’ensemble des requis fonctionnels et validant la maîtrise des architectures client-serveur d’entreprise.'
      },
      en: {
        tagline: 'Decoupled full-stack library management system (Angular SPA + Symfony/MySQL REST API)',
        challenge:
          'Design and build in an Agile team a complete platform managing catalog inventory, loans, reservations, late fees, and role-based access (members vs. librarians) with strict front-end / back-end decoupling.',
        architecture:
          'Angular / TypeScript SPA consuming a Symfony RESTful API (PHP / Doctrine ORM / MySQL), featuring token authentication, role-based route guards, and real-time multi-criteria catalog filtering.',
        highlights: [
          'Decoupled REST architecture bridging Angular (typed services, reactive RxJS state) and Symfony (API controllers, Doctrine ORM)',
          'Real-time multi-criteria catalog search and filtering (genre, author, availability, loan status) with zero page reloads',
          'End-to-end loan lifecycle, reservation queue, and admin permission workflows delivered across Agile sprints'
        ],
        impact:
          'Delivered a production-style full-stack application fulfilling all business requirements and demonstrating enterprise client-server architecture mastery.'
      }
    }
  },
  {
    name: 'Kaomia',
    path: 'Scolaires/CSTJ/A23-SystemesMulticlients_5D4/Kaomia',
    filterClass: 'filter-school',
    categoryLabel: 'Scolaires • 2023',
    image: 'assets/images/projects/kaomia.webp',
    width: 1280,
    height: 482,
    alt: 'Aperçu du projet Kaomia',
    gallery: 'portfolio-gallery-web',
    repoUrl: 'https://github.com/RinoShip77/MesProjets/tree/main/Scolaires/CSTJ/A23-SystemesMulticlients_5D4/Kaomia',
    descriptionHtml:
      "Portail multi-clients de consultation des statistiques d'un jeu (cours 420-5D4-JR), intégrant un client Web en <strong>Vue.js</strong>, une application mobile en <strong>Kotlin</strong> et un serveur <strong>Node.js</strong>.",
    badges: ['Vue.js', 'Kotlin (Android)', 'Node.js'],
    caseStudy: {
      fr: {
        tagline: 'Écosystème multi-clients (Web Vue.js, desktop Electron & mobile Android Kotlin) propulsé par Node.js',
        challenge:
          'Permettre aux joueurs de consulter leur inventaire, leurs statistiques d’exploration et leurs créatures en temps réel depuis un navigateur Web, un client lourd Electron ou un téléphone Android sans désynchronisation des données.',
        architecture:
          'API REST centrale en Node.js / Express avec persistance MongoDB, consommée simultanément par une SPA Vue.js / Electron et une application mobile native Android écrite en Kotlin.',
        highlights: [
          'Contrat d’API RESTful unifié garantissant une parité fonctionnelle entre le portail Vue.js et le client Android Kotlin',
          'Authentification par jetons JWT et synchronisation de la progression des joueurs entre mobile et ordinateur',
          'Tableaux de bord visuels des affinités élémentaires, inventaires et statistiques de jeu temps réel'
        ],
        impact:
          'Démonstration complète d’une architecture distribuée multi-plateformes (Web, Desktop, Mobile) reposant sur un socle dorsal unique.'
      },
      en: {
        tagline: 'Multi-client ecosystem (Vue.js Web, Electron Desktop & Kotlin Android) powered by a unified Node.js API',
        challenge:
          'Enable players to inspect their inventory, exploration metrics, and creatures seamlessly across a Web browser, an Electron desktop client, and a native Android phone without data desynchronization.',
        architecture:
          'Central Node.js / Express REST API backed by MongoDB, consumed concurrently by a Vue.js / Electron SPA and a native Android application built in Kotlin.',
        highlights: [
          'Unified RESTful API contract ensuring feature parity across the Vue.js Web portal and Kotlin Android client',
          'JWT token authentication and cross-device player progression synchronization between mobile and desktop',
          'Interactive dashboards visualizing elemental affinities, inventories, and real-time game statistics'
        ],
        impact:
          'Delivered a complete cross-platform distributed architecture (Web, Desktop, Mobile) sharing a single back-end service.'
      }
    }
  },
  {
    name: 'EVOMEAL',
    path: 'Scolaires/CSTJ/H23-DeveloppementWeb_4D6/EVOMEAL',
    filterClass: 'filter-school',
    categoryLabel: 'Scolaires • 2023',
    image: 'assets/images/projects/evomeal.webp',
    width: 1280,
    height: 809,
    alt: 'Aperçu du projet EVOMEAL',
    gallery: 'portfolio-gallery-web',
    repoUrl: 'https://github.com/RinoShip77/MesProjets/tree/main/Scolaires/CSTJ/H23-DeveloppementWeb_4D6/EVOMEAL',
    descriptionHtml:
      'Plateforme Web de commerce en ligne développée avec le framework <strong>Symfony</strong>, incluant la gestion dynamique des produits, des commandes et des utilisateurs.',
    badges: ['Symfony', 'Twig', 'PHP', 'MySQL'],
    caseStudy: {
      fr: {
        tagline: 'Plateforme e-commerce MVC en Symfony / MySQL avec panier dynamique et panneau d’administration',
        challenge:
          'Bâtir une boutique en ligne de prêt-à-manger fiable gérant les catégories, les stocks, le panier transactionnel, les profils clients et le suivi des commandes avec validation stricte côté serveur.',
        architecture:
          'Architecture MVC Symfony (PHP 8 / Twig / Doctrine ORM) adossée à une base relationnelle MySQL, avec gestion des sessions sécurisées, contrôle d’accès par rôle (`ROLE_USER`, `ROLE_ADMIN`) et requêtes AJAX.',
        highlights: [
          'Modélisation relationnelle complète (produits, catégories, commandes, lignes de commande, utilisateurs) via Doctrine ORM',
          'Panier interactif avec mise à jour dynamique des quantités, calcul des taxes et validation transactionnelle des stocks',
          'Back-office d’administration sécurisé permettant la gestion du catalogue et le suivi de l’état des commandes'
        ],
        impact:
          'Conception d’un flux e-commerce complet de bout en bout illustrant la sécurité serveur, l’intégrité relationnelle SQL et l’ergonomie Web.'
      },
      en: {
        tagline: 'Symfony / MySQL MVC e-commerce platform with transactional cart and admin back-office',
        challenge:
          'Build a reliable meal-delivery online store handling product categories, inventory levels, transactional shopping carts, customer profiles, and order tracking with strict server-side validation.',
        architecture:
          'Symfony MVC architecture (PHP 8 / Twig / Doctrine ORM) backed by a MySQL relational database, featuring secure session management, role-based access control (`ROLE_USER`, `ROLE_ADMIN`), and AJAX updates.',
        highlights: [
          'Complete relational schema (products, categories, orders, order items, users) managed through Doctrine ORM',
          'Interactive shopping cart with live quantity updates, tax calculation, and transactional stock validation',
          'Secured administrative back-office for catalog CRUD operations and real-time order status management'
        ],
        impact:
          'Engineered an end-to-end e-commerce workflow demonstrating server-side security, SQL relational integrity, and clean Web UX.'
      }
    }
  },
  {
    name: 'Shopro',
    path: 'Personnels/Shopro',
    filterClass: 'filter-personal',
    categoryLabel: 'Personnels • E-Commerce',
    image: 'assets/images/projects/shopro.webp',
    width: 1280,
    height: 1392,
    alt: 'Aperçu du projet Shopro',
    gallery: 'portfolio-gallery-motion',
    repoUrl: 'https://github.com/RinoShip77/MesProjets/tree/main/Personnels/Shopro',
    descriptionHtml:
      "Boutique de vente en ligne avec thème personnalisé, catalogue sur mesure et automatisation du parcours d'achat.",
    badges: ['WordPress', 'WooCommerce', 'PHP / CSS'],
    caseStudy: {
      fr: {
        tagline: 'Thème e-commerce WordPress / WooCommerce sur mesure et automatisation du tunnel de commande',
        challenge:
          'Remplacer un gabarit générique lourd par un thème WordPress / WooCommerce développé sur mesure offrant une identité visuelle distinctive, un catalogue filtrable rapide et un tunnel d’achat simplifié.',
        architecture:
          'Thème PHP WordPress sur mesure intégrant les hooks/filtres natifs WooCommerce, des gabarits de fiches produits personnalisés et une feuille de style CSS modulaire optimisée pour le mobile.',
        highlights: [
          'Développement d’un thème WordPress de zéro en PHP/CSS sans surcharge de constructeurs de pages tiers',
          'Personnalisation des hooks WooCommerce pour automatiser et raccourcir les étapes du panier au paiement',
          'Mise en page responsive soignée mettant en valeur les visuels produits, les promotions et la navigation par catégorie'
        ],
        impact:
          'Expérience d’achat fluide et temps de chargement réduit grâce à un thème léger maîtrisé de bout en bout.'
      },
      en: {
        tagline: 'Custom-built WordPress / WooCommerce theme and automated checkout funnel',
        challenge:
          'Replace a bloated generic template with a custom-engineered WordPress / WooCommerce theme delivering a distinct brand identity, fast catalog browsing, and a streamlined checkout flow.',
        architecture:
          'Custom PHP WordPress theme leveraging native WooCommerce hooks and filters, tailored product page templates, and a modular mobile-first CSS stylesheet.',
        highlights: [
          'Developed a bespoke WordPress theme from scratch in PHP/CSS without heavy third-party page-builder overhead',
          'Customized WooCommerce hooks to automate and shorten the journey from cart to checkout',
          'Responsive storefront layout highlighting product imagery, promotions, and category navigation'
        ],
        impact:
          'Delivered a fast, cohesive shopping experience powered by a lightweight custom theme built end to end.'
      }
    }
  }
];
