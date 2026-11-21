export type SiteLang = 'fr' | 'en';

export const SITE_LANG_STORAGE_KEY = 'ob_v6_lang';

/**
 * Explicit data-i18n key dictionary (resilient to copy/punctuation edits).
 */
export const KEY_EN: Record<string, string> = {
  'skip.main': 'Skip to main content',
  'hero.cta.projects': 'Projects',
  'hero.cta.contact': 'Contact Me',
  'hero.stats.years': 'Years of Experience',
  'hero.stats.projects': 'Completed Projects',
  'contact.label.name': 'Your Name',
  'contact.label.email': 'Your Email',
  'contact.label.subject': 'Subject',
  'contact.label.message': 'Your Message',
  'contact.submit': 'Send',
  'contact.direct.prefix': 'Or email me directly:',
  'contact.copy.email': 'Copy Email',
  'footer.credits': 'Designed & built with Astro · Tech Canvas Edition'
};

/**
 * Exact trimmed text-node dictionary (FR -> EN).
 * Preserves surrounding whitespace and child/sibling elements (icons, badges, etc.).
 */
export const EXACT_TEXT_FR_TO_EN: Record<string, string> = {
  // Global Navbar, Hub, Skip link & Footer
  'Aller au contenu principal': 'Skip to main content',
  'Votre nom': 'Your Name',
  'Votre courriel': 'Your Email',
  Sujet: 'Subject',
  'Votre message': 'Your Message',
  'Filtrer les projets par catégorie': 'Filter projects by category',
  Accueil: 'Home',
  'À propos': 'About',
  CV: 'Resume',
  Portfolio: 'Portfolio',
  Contact: 'Contact',
  Studio: 'Studio',
  Évolution: 'Timeline',
  Identité: 'Identity',
  Origine: 'Origin',
  Famille: 'Family',
  Logos: 'Logos',
  Charte: 'Guidelines',
  Versions: 'Versions',
  'CV - Aperçu': 'Resume Preview',
  'Navigateur de versions': 'Version Browser',
  'Identité visuelle & Logos': 'Visual Identity & Logos',
  'Identité visuelle': 'Visual Identity',
  'Tous droits réservés': 'All rights reserved',
  'Retour à l’accueil (V6)': 'Back to Home (V6)',
  'OB TECH • IDENTITÉ VISUELLE': 'OB TECH • VISUAL IDENTITY',
  'OB TECH • CV APERÇU': 'OB TECH • RESUME PREVIEW',

  // CV Download Dialog
  'Télécharger mon CV / Resume': 'Download my Resume / CV',
  'Format PDF • Français ou Anglais': 'PDF Format • French or English',
  FRANÇAIS: 'FRENCH',
  'Curriculum Vitae': 'Curriculum Vitae (FR)',
  'Version française complète incluant le résumé de compétences, les réalisations en TI & IA et la lettre de présentation.':
    'Complete French version including skills summary, IT & AI achievements, and cover letter.',
  'Télécharger (FR)': 'Download (FR)',
  'Aperçu PDF': 'Open PDF Preview',
  'Consulter le CV Web interactif': 'View Interactive Web Resume',
  Fermer: 'Close',

  // Home — Hero
  Réalisations: 'Projects',
  'Me contacter': 'Contact Me',
  "Années d'expérience": 'Years of Experience',
  'Projets complétés': 'Completed Projects',

  // Home — Tech Pillars
  'Architectures & Expertises': 'Architectures & Expertise',
  'Piliers Technologiques & Logos Tech': 'Technology Pillars & Tech Logos',
  'Une identité visuelle unifiée où chaque symbole incarne une facette de mes compétences en ingénierie logicielle, intelligence artificielle et systèmes TI.':
    'A unified visual identity where each emblem embodies a facet of my skills in software engineering, artificial intelligence, and IT systems.',
  'Développement Full-Stack': 'Full-Stack Development',
  "Conception d'applications Web et logicielles réactives, modulaires et accessibles (WCAG). Maîtrise des écosystèmes modernes : C# / .NET MAUI, Angular, Vue, React, Symfony et architectures RESTful.":
    'Design of responsive, modular, and accessible (WCAG) web and software applications. Mastery of modern ecosystems: C# / .NET MAUI, Angular, Vue, React, Symfony, and RESTful architectures.',
  'Intelligence Artificielle': 'Artificial Intelligence',
  "Spécialisation avancée (AEC IA Collège O'Sullivan). Entraînement et déploiement de modèles de Machine Learning, Deep Learning, pipelines de traitement de données (Python, Pandas, Scikit-Learn) et agents intelligents.":
    "Advanced specialization (AI ACS at O'Sullivan College). Training and deployment of Machine Learning & Deep Learning models, data processing pipelines (Python, Pandas, Scikit-Learn), and intelligent agents.",
  'Systèmes TI & Automatisation': 'IT Systems & Automation',
  "Rigueur issue d'expériences concrètes (Chambre des communes, Élections Canada). Automatisation de tâches complexes via PowerShell / Batch, gestion d'infrastructures réseaux, Active Directory et contrôle de versions Git.":
    'Precision forged through hands-on experience (House of Commons, Elections Canada). Complex task automation via PowerShell / Batch, network infrastructure management, Active Directory, and Git version control.',
  'Réseaux Neuronaux': 'Neural Networks',
  'Agents IA': 'AI Agents',

  // Home — About
  "Diplômé en technique de l'informatique et poursuivant une attestation d'études collégiales en intelligence artificielle, je suis fiable, rigoureux, organisé, autonome et responsable dans toutes les réalisations que j'entreprends.":
    'A Computer Technology graduate currently pursuing an Attestation of College Studies in Artificial Intelligence, I am reliable, rigorous, organized, autonomous, and accountable in every project I undertake.',
  'À propos de moi': 'About Me',
  'Développeur Full-Stack, IA & Technicien en informatique': 'Full-Stack & AI Developer · IT Technician',
  "Spécialisé dans la création de nouvelles applications Web, mobiles et logicielles ainsi que dans l'optimisation de systèmes existants. J'ai un fort intérêt pour l'automatisation des processus, l'intelligence artificielle et la conformité aux normes d'accessibilité (WCAG). Je parle couramment le français et je communique aisément en anglais.":
    'Specialized in building new web, mobile, and desktop applications as well as optimizing existing systems. I have a strong interest in process automation, artificial intelligence, and web accessibility (WCAG) compliance. Fluent in French and proficient in English.',
  Nom: 'Name',
  Spécialisation: 'Specialization',
  'Développement, TI & IA': 'Development, IT & AI',
  Courriel: 'Email',
  Région: 'Location',
  'Formation actuelle': 'Current Program',
  'AEC en Intelligence Artificielle': 'ACS in Artificial Intelligence',

  // Home — Skills
  'STACK TECH EN CONTINU': 'CONTINUOUS TECH STACK',
  'Python & IA': 'Python & AI',
  'Antigravity IA': 'Antigravity AI',
  'Tout afficher (Tous)': 'Show All Skills',
  'Masquer tout': 'Hide All Skills',

  // Home — Resume
  'Parcours CV': 'Resume Sections',
  'Expériences professionnelles en informatique': 'IT Professional Experience',
  'Formation académique': 'Academic Education',
  'Autres expériences professionnelles': 'Other Professional Experience',
  'Perfectionnement & Certifications': 'Training & Certifications',
  Afficher: 'Expand',
  Réduire: 'Collapse',
  'Été 2024': 'Summer 2024',
  'Été 2023': 'Summer 2023',
  'Technicien informatique (Accessibilité & Assurance qualité)': 'IT Technician (Accessibility & Quality Assurance)',
  "Tester des sites et des applications afin d'assurer leur conformité aux directives pour l'accessibilité du contenu Web (WCAG). Consigner les résultats dans Azure DevOps et produire des rapports Excel détaillés pour guider les équipes de développement.":
    'Tested websites and applications to ensure compliance with Web Content Accessibility Guidelines (WCAG). Logged findings in Azure DevOps and produced detailed Excel reports to guide development teams.',
  'Technicien informatique (Support & Automatisation)': 'IT Technician (User Support & Automation)',
  'Développeur Web': 'Web Developer',
  "Développer mon propre thème sur mesure pour un site WordPress de vente en ligne avec l'extension WooCommerce. Personnaliser le catalogue de produits et automatiser le processus d'achat.":
    'Developed a custom WordPress e-commerce theme powered by WooCommerce. Customized the product catalog and automated the checkout workflow.',
  'Agent de soutien aux utilisateurs (Tuteur TIC)': 'User Support Agent (ICT Tutor)',
  "Accueillir et soutenir techniquement les étudiants et usagers du cégep, incluant l'assistance à l'impression, l'accès aux services en ligne du collège et l'utilisation de la suite Microsoft 365.":
    'Welcomed and provided technical support to college students and staff, including printing assistance, access to online college services, and Microsoft 365 support.',
  "Collège O'Sullivan de Québec": "O'Sullivan College of Quebec",
  'Québec | 2026 - 2027 (en cours)': 'Quebec City | 2026 - 2027 (ongoing)',
  "Attestation d'études collégiales (AEC) en intelligence artificielle":
    'Attestation of College Studies (ACS) in Artificial Intelligence',
  "Spécialisation dans le développement de solutions d'intelligence artificielle, l'apprentissage automatique, l'analyse de données et l'intégration de modèles IA au sein d'applications modernes.":
    'Specialization in artificial intelligence solutions, machine learning, data analysis, and integrating AI models into modern applications.',
  "Diplôme d'études collégiales (DEC) en technique de l'informatique":
    'Diploma of College Studies (DCS) in Computer Technology',
  "Formation approfondie en développement d'applications Web, mobiles et logicielles, gestion de bases de données, architecture client-serveur et méthodologies agiles.":
    'Comprehensive training in web, mobile, and software application development, database management, client-server architecture, and Agile methodologies.',
  'École secondaire Hormisdas-Gamelin': 'Hormisdas-Gamelin High School',
  "Diplôme d'études secondaires": 'High School Diploma',
  'Parcours réalisé au sein du programme profil sportif.': 'Completed within the athletics profile program.',
  'Élections Canada': 'Elections Canada',
  "Préposé à l'information": 'Information Officer',
  "Accueillir et orienter les électeurs, incluant la validation des pièces d'identité et la gestion des flux. Participer à la logistique du site de vote (installation, signalisation, démantèlement), à la gestion des documents électoraux et au dépouillement, tout en appliquant les protocoles d'assistance aux personnes à mobilité réduite.":
    'Welcomed and guided voters, including ID verification and crowd flow management. Assisted with polling site logistics (setup, signage, teardown), electoral document handling, and ballot counting while applying accessibility protocols.',
  'Sportmax & Club de Tennis de Buckingham': 'Sportmax & Buckingham Tennis Club',
  'Animateur et Aide-instructeur': 'Camp Facilitator & Assistant Instructor',
  "Planifier, organiser et animer des activités pour des groupes d'enfants tout en assurant leur sécurité. Être responsable de l'accueil et des départs, superviser les collègues animateurs et assister les entraîneurs.":
    'Planned, organized, and led activities for groups of children while ensuring their safety. Managed camp check-in/check-out, supervised fellow facilitators, and assisted coaches.',
  Concierge: 'Custodian',
  "Nettoyer et désinfecter rigoureusement les aires communes des résidences étudiantes afin d'assurer un environnement sécuritaire et sanitaire.":
    'Thoroughly cleaned and disinfected common areas in student residences to maintain a safe and sanitary environment.',
  'Modules de formation continue': 'Continuing Education Modules',
  'Autoformation continue via les parcours techniques Microsoft Learn (.NET, C#, Azure DevOps, développement Web et outils infonuagiques).':
    'Continuous self-paced training through Microsoft Learn technical paths (.NET, C#, Azure DevOps, Web Development, and cloud tools).',
  'Formations complémentaires': 'Additional Certifications',
  'Secourisme, SIMDUT & Mobilité': 'First Aid, WHMIS & Mobility',
  'Cours en premiers soins (2022), Formation SIMDUT (2020), Cours de secourisme (2020) et Permis de conduire Classe 5.':
    'First Aid Course (2022), WHMIS Training (2020), Emergency First Aid (2020), and Class 5 Driver’s License.',

  // Home — Portfolio & Contact
  'Projets (Accès rapide)': 'Projects (Quick Access)',
  Tout: 'All',
  Scolaires: 'Academic',
  Professionnels: 'Professional',
  Personnels: 'Personal',
  'Personnels • IA': 'Personal • AI',
  'Professionnels • Chambre des Communes (2023)': 'Professional • House of Commons (2023)',
  'Scolaires • 2023': 'Academic • 2023',
  'Personnels • E-Commerce': 'Personal • E-Commerce',
  "Plateforme modulaire unifiant quatre applications propulsées par l'intelligence artificielle générative. Intégration de modèles de langage (LLM), conception de prompts structurés, traitement de données en temps réel et interface Web réactive.":
    'Modular platform unifying four applications powered by generative AI. Large Language Model (LLM) integration, structured prompt engineering, real-time data processing, and responsive web UI.',
  "Boutique de vente en ligne avec thème personnalisé, catalogue sur mesure et automatisation du parcours d'achat.":
    'Online store featuring a custom theme, tailored product catalog, and automated checkout flow.',
  Automatisation: 'Automation',
  'Diagnostic TI': 'IT Diagnostics',
  'Un simple courriel et je pourrai contribuer au succès de vos projets.':
    'A quick email is all it takes for me to help make your projects a success.',
  Envoyer: 'Send Message',

  // Versions Page — Hero, Studio & Timeline
  'Explorer le Studio live': 'Explore Live Studio',
  'Portfolio actuel (V6)': 'Current Portfolio (V6)',
  'CV (PDF)': 'Resume (PDF)',
  'Générations live': 'Live Generations',
  'Palettes & Styles': 'Palettes & Styles',
  'V3 à V6': 'V3 to V6',
  'Formats d’écran': 'Screen Formats',
  'Projets GitHub': 'GitHub Projects',
  'Synchronisés en V6': 'Synced in V6',
  'Prévisualisation en direct': 'Live Preview',
  'Studio Interactif': 'Interactive Studio',
  'Sélectionnez une génération ci-dessous pour la manipuler en temps réel, changer de format d’appareil ou basculer instantanément entre les palettes historiques des versions V3 et V4.':
    'Select any generation below to interact with it in real time, switch device viewports, or hot-swap historical V3 and V4 color palettes.',
  Actuelle: 'Current',
  Initiale: 'Initial',
  'Édition IA': 'AI Edition',
  'Multi-Styles': 'Multi-Style',
  Tablette: 'Tablet',
  'Plein écran': 'Fullscreen',
  Ouvrir: 'Open',
  'Initialisation du Studio…': 'Initializing Studio…',
  'Fiche détaillée': 'Detailed Specs',
  'Aperçu plein écran': 'Fullscreen Preview',
  'Historique complet': 'Complete History',
  'Frise d’évolution (V6 → V1)': 'Evolution Timeline (V6 → V1)',
  'Chaque génération documente les choix architecturaux, la progression de l’identité visuelle et les technologies adoptées au fil du temps.':
    'Each generation documents the architectural decisions, visual identity progression, and technologies adopted over time.',
  '6 générations archivées · V6 active': '6 archived generations · V6 active',
  'Tout déplier les notes': 'Expand All Notes',
  'Tout replier les notes': 'Collapse All Notes',
  Chronologie: 'Timeline',
  'V7+ · À venir': 'V7+ · Upcoming',
  'Feuille de route': 'Roadmap',
  'Actuelle · Recommandée • 2026': 'Current · Recommended • 2026',
  'Actuelle · Recommandée · 2026': 'Current · Recommended · 2026',
  'Tester un style historique dans le Studio :': 'Test a historical style in the Studio:',
  'Prévisualiser dans le Studio': 'Preview in Studio',
  'Ouvrir la V6': 'Open V6',
  'Ouvrir la V5': 'Open V5',
  'Ouvrir la V4': 'Open V4',
  'Ouvrir la V3': 'Open V3',
  'Ouvrir la V2': 'Open V2',
  'Ouvrir la V1': 'Open V1',
  'Feuille de route • À venir': 'Roadmap • Upcoming',
  'Prochaines générations (V7, V8…)': 'Future Generations (V7, V8…)',
  'Cet espace est prêt pour accueillir les futures itérations du portfolio : nouvelles expériences IA, démos interactives et évolutions de design.':
    'This space is ready for future portfolio iterations: new AI experiments, interactive demos, and design evolutions.',
  'Notes de version & nouveautés (5)': 'Release Notes & Highlights (5)',
  'Notes de version & nouveautés (4)': 'Release Notes & Highlights (4)',
  'Notes de version & nouveautés (3)': 'Release Notes & Highlights (3)',

  // Versions V6..V1 titles, descriptions & highlights
  'Version 6.0 — Édition Astro · Tech Canvas Componentisée':
    'Version 6.0 — Componentized Astro · Tech Canvas Edition',
  'Refonte architecturale complète sous Astro avec composants réutilisables, polices auto-hébergées (@fontsource), dialogues/menus natifs sans Bootstrap JS ni Isotope, thème unifié zéro-FOUC et déploiement automatisé sur GitHub Pages tout en préservant l’intégrité exacte de V1 à V5.':
    'Complete architectural rebuild powered by Astro with reusable components, self-hosted fonts (@fontsource), native dialogs/menus without Bootstrap JS or Isotope, unified zero-FOUC theme, and automated GitHub Pages deployment while preserving V1–V5 intact.',
  'Migration vers Astro (build 100 % statique) avec composants partagés : Navbar Shabnam, Boot Loader Fusion, Curseur Aahil Khan, Badges, Cartes néo-brutalistes et Dialogues natifs':
    'Migrated to Astro (100% static build) with shared components: Shabnam Navbar, Fusion Boot Loader, Aahil Khan Cursor, Badges, Neo-Brutalist Cards, and Native Dialogs',
  'Identité visuelle Tech Canvas conservée à 100 % : Orange Signal #FF6600, Bleu Circuit #38BDF8, Carbone #121316, Ivoire #F4F1EA et Pack Ingénierie & IA auto-hébergé':
    '100% Tech Canvas visual fidelity preserved: Signal Orange #FF6600, Circuit Blue #38BDF8, Studio Carbon #121316, Paper Ivory #F4F1EA, and self-hosted Engineering & AI font pack',
  'Suppression des bibliothèques superflues (Bootstrap JS, Isotope, imagesLoaded, Waypoints, CDN Google Fonts) au profit des API Web natives (dialog, IntersectionObserver, grilles CSS)':
    'Removed superfluous libraries (Bootstrap JS, Isotope, imagesLoaded, Waypoints, Google Fonts CDN) in favor of native Web APIs (dialog, IntersectionObserver, CSS Grid)',
  'Thème sombre / clair unifié via la clé ob_v6_theme et script synchrone pré-rendu éliminant tout flash visuel (FOUC) sur les 4 pages':
    'Unified dark / light theme via ob_v6_theme key and pre-paint synchronous script eliminating any FOUC across all pages',
  'Pipeline CI/CD GitHub Actions assemblant la racine, la V6 et les archives intactes V1–V5 avec vérification automatisée des liens internes et des hash SHA-256':
    'GitHub Actions CI/CD pipeline assembling root redirects, V6 build, and untouched V1–V5 archives with automated link and SHA-256 integrity checks',

  'Version 5.0 — Édition Tech Canvas & Studio Interactif':
    'Version 5.0 — Tech Canvas Edition & Interactive Studio',
  'Direction artistique exclusive « Tech Canvas », fusionnant la rigueur technique Carbone #121316 & Orange #FF6600, l’atelier Figma de Shabnam Raghavan et le néo-brutalisme interactif d’Aahil Khan, enrichie d’un portfolio GitHub en temps réel et d’une ergonomie de lecture complète.':
    'Exclusive "Tech Canvas" art direction blending Carbon #121316 & Orange #FF6600 technical precision, Shabnam Raghavan’s Figma workshop aesthetic, and Aahil Khan’s interactive neo-brutalism, enhanced with live GitHub portfolio sync.',
  'Direction artistique unifiée Tech Canvas : fond carbone #121316 (ou ivoire #F4F1EA en mode clair), grille 48×48 px, cartes néo-brutalistes à ombre dure #FF6600 et rubans d’atelier translucides':
    'Unified Tech Canvas art direction: carbon #121316 canvas (or ivory #F4F1EA in light mode), 48×48 px grid, neo-brutalist cards with hard #FF6600 shadows, and translucent workshop tape',
  'Barre de navigation Shabnam évolutive : en-tête transparent avec soulignement sinusoïdal SVG qui se transforme au défilement en pilule translucide (hystérésis fluide) et tiroir mobile #302F2C':
    'Adaptive Shabnam navbar: transparent header with SVG sine-wave underline morphing on scroll into a translucent pill with smooth hysteresis and #302F2C mobile drawer',
  'Boot Loader Fusion exclusif : tracé vectoriel du monogramme OB Tech, nœuds neuronaux IA en orbite et terminal OB_TECH_CORE avec progression 00% → 100%':
    'Exclusive Fusion Boot Loader: vector stroke animation of the OB Tech monogram, orbiting AI neural nodes, and OB_TECH_CORE terminal progression 00% → 100%',
  'Portfolio dynamique synchronisé avec GitHub (RinoShip77/MesProjets, 59+ projets) : 5 projets phares affichés par défaut et bouton « Voir plus » avec compteur':
    'Dynamic portfolio synchronized with GitHub (RinoShip77/MesProjets, 59+ projects): 5 featured projects shown by default and "Show More" button with counter',
  'Navigation avancée : sections collapsibles, barre de navigation verticale collante (CV & Portfolio), curseur Aahil Khan à halo radial orange (touche L) et page CV - Aperçu dédiée':
    'Advanced navigation: collapsible sections, sticky vertical navbars (Resume & Portfolio), Aahil Khan radial orange halo cursor, and dedicated Resume Preview page',

  'Version 4.0 — Édition OB Tech & Identité Vectorielle': 'Version 4.0 — OB Tech Edition & Vector Identity',
  'Adoption officielle du logo vectoriel « OB Tech » (hexagone orange et circuit bleu ciel), déploiement de l’écosystème des 3 logos thématiques et mise en avant de la palette Tech Présentation avec 7 thèmes commutables.':
    'Official adoption of the "OB Tech" vector logo (orange hexagon and sky-blue circuit), deployment of the 3-logo thematic ecosystem, and Tech Presentation default palette with 7 switchable themes.',
  'Logo principal officiel OB Tech en SVG (hexagone #FF6600 & circuits binaires #38BDF8)':
    'Official primary OB Tech SVG logo (#FF6600 hexagon & #38BDF8 binary circuit tracks)',
  'Écosystème des 3 logos thématiques : OB Hexagonal (TI/DevOps), Terminal </> (Full-Stack) et Nœud Neuronal (IA)':
    '3-logo thematic ecosystem: OB Hexagonal (IT/DevOps), Terminal </> (Full-Stack), and Neural Node (AI)',
  'Palette Tech Présentation activée par défaut avec grille technique 40×40 px et pointeur laser virtuel (touche L)':
    'Tech Presentation palette enabled by default with 40×40 px technical grid and virtual laser pointer',
  'Sélecteur multi-styles étendu à 7 palettes commutables à chaud (Tech, Tech Canvas, Obsidian Blaze, Améthyste, Synthwave, Ethiack, Shabnam)':
    'Multi-style switcher expanded to 7 hot-swappable palettes (Tech, Tech Canvas, Obsidian Blaze, Amethyst, Synthwave, Ethiack, Shabnam)',
  'Favicon vectoriel SVG et page de propositions d’identité visuelle associée':
    'SVG vector favicon and dedicated visual identity proposals page',

  'Version 3.0 — Édition Multi-Styles (6 Thèmes)': 'Version 3.0 — Multi-Style Edition (6 Themes)',
  'Expérimentation visuelle complète introduisant un sélecteur flottant de 6 directions artistiques commutables en temps réel (en mode sombre ou clair) et partageables par paramètre d’URL.':
    'Comprehensive visual exploration introducing a floating switcher with 6 real-time switchable art directions (dark and light modes) shareable via URL parameters.',
  'Original Améthyste & Fuchsia néon (#E11484 / #A855F7) avec halos diffus':
    'Original Amethyst & Neon Fuchsia (#E11484 / #A855F7) with ambient glow halos',
  'Active Theory Cyberpunk Synthwave (cyan #00F0FF & magenta #C026D3)':
    'Active Theory Cyberpunk Synthwave (cyan #00F0FF & magenta #C026D3)',
  'Ethiack Terminal Matrix Hacker (vert émeraude #10B981, JetBrains Mono et trame binaire)':
    'Ethiack Terminal Matrix Hacker (emerald green #10B981, JetBrains Mono, and binary grid)',
  'Tech Présentation Keynote Orange (#FF6600 / #38BDF8) et introduction du pointeur laser':
    'Tech Presentation Keynote Orange (#FF6600 / #38BDF8) and introduction of the laser pointer',
  'Shabnam Atelier Papier (#CDC9B6 / Vermillon #C02D0C) et déclinaison Néo-Brutaliste Aahil':
    'Shabnam Paper Workshop (#CDC9B6 / Vermilion #C02D0C) and Aahil Neo-Brutalist variant',

  'Version 2.0 — Édition IA & Enrichie': 'Version 2.0 — AI & Enhanced Edition',
  'Refonte éditoriale alignée sur la spécialisation en intelligence artificielle, intégrant les expériences récentes et une présentation technique enrichie des compétences et projets.':
    'Editorial update aligned with my artificial intelligence specialization, integrating recent work experience and an expanded technical presentation of skills and projects.',
  'Intégration de l’AEC en Intelligence Artificielle (Collège O’Sullivan)':
    'Added the ACS in Artificial Intelligence (O’Sullivan College)',
  'Ajout des expériences récentes : Élections Canada (2025) et perfectionnement Microsoft Learn':
    'Added recent experience: Elections Canada (2025) and Microsoft Learn continuing education',
  'Refonte complète des jauges de compétences (C#, .NET MAUI, Python/IA, Angular, Vue, Symfony)':
    'Redesigned skill gauges (C#, .NET MAUI, Python/AI, Angular, Vue, Symfony)',
  'Fiches projets détaillées avec badges technologiques et formulaire de contact modernisé':
    'Detailed project cards with technology badges and modernized contact form',

  'Version 1.0 — Archive Initiale': 'Version 1.0 — Initial Archive',
  'Première version complète publiée sur olivierbourgault.github.io, mettant en lumière le DEC en technique de l’informatique et les premières réalisations professionnelles et scolaires.':
    'First complete release published on olivierbourgault.github.io, highlighting the Computer Technology diploma and initial academic and professional achievements.',
  'Présentation du parcours au Cégep de Saint-Jérôme, à la Chambre des Communes et chez VIWEB':
    'Showcased academic and professional path at Cégep de Saint-Jérôme, House of Commons, and VIWEB',
  'Galerie de projets filtrable par catégorie (Scolaires, Professionnels, Personnels)':
    'Filterable project gallery by category (Academic, Professional, Personal)',
  'Première intégration dynamique des statistiques et du profil GitHub':
    'First dynamic integration of GitHub profile and repository statistics',

  // Identité Page — Hero, Sidebar & Chapters
  'IDENTITÉ OB TECH • 3 LOGOS • 2026': 'OB TECH IDENTITY • 3 LOGOS • 2026',
  'Ce qu’on y voit': 'What You See',
  'Comment ils sont nés': 'How They Were Born',
  'Ce qu’ils cachent': 'What They Hide',
  'Décoder les 3 logos': 'Decode the 3 Logos',
  'Charte Tech Canvas': 'Tech Canvas Guidelines',
  'Voir sur l’accueil': 'View on Home',
  'Planche vectorielle': 'Vector Blueprint',
  'Neuronal IA': 'Neural AI',
  'Histoire & Sens': 'Story & Meaning',
  '01 · L’origine': '01 · The Origin',
  'Le système & 6 invariants': 'The system & 6 invariants',
  '02 · La famille': '02 · The Family',
  '3 piliers, 1 signature': '3 pillars, 1 signature',
  '03 · OB Hexagonal': '03 · OB Hexagonal',
  'Logo officiel V4 → V6': 'Official logo V4 → V6',
  '04 · Terminal </>': '04 · Terminal </>',
  '05 · Nœud Neuronal': '05 · Neural Node',
  '06 · Code & Charte': '06 · System & Guidelines',
  'Couleurs, typos & banc SVG': 'Colors, fonts & SVG bench',

  // Identité — Chapter 01
  '01 · L’origine du système': '01 · Origin of the System',
  'Tout part du O d’Olivier et d’un double trait de circuit':
    'Everything Starts with Olivier’s O and a Dual Circuit Trace',
  'Étape 01 · L’enceinte « O »': 'Step 01 · The "O" Enclosure',
  'Un contour orange protecteur': 'A Protective Orange Perimeter',
  'Étape 02 · Le cœur bleu #38BDF8': 'Step 02 · The #38BDF8 Blue Core',
  'La logique au centre du cadre': 'Logic at the Heart of the Frame',
  'Étape 03 · Synthèse OB Tech': 'Step 03 · OB Tech Synthesis',
  'Une identité modulaire par pilier': 'A Modular Identity per Pillar',
  'Chaque signe garde exactement le même couple chromatique et les mêmes extrémités arrondies pour rester reconnaissable instantanément d’un pilier à l’autre.':
    'Each emblem keeps the exact same color pairing and rounded stroke caps so it remains instantly recognizable across every pillar.',
  'Ce qui ne change jamais — Les 6 invariants OB Tech': 'What Never Changes — The 6 OB Tech Invariants',
  '01 · Grille fixe': '01 · Fixed Grid',
  'Canevas 100 × 100 centré': 'Centered 100 × 100 Canvas',
  '02 · Signal orange': '02 · Orange Signal',
  'Le #FF6600 comme signature': '#FF6600 as Signature Accent',
  '03 · Polarité bleue': '03 · Blue Polarity',
  'Le #38BDF8 pour la logique': '#38BDF8 for Software Logic',
  '04 · Même arrondi': '04 · Unified Caps',
  '05 · Bivalent': '05 · Dual-Mode',
  'Lisible sur Carbone & Ivoire': 'Crisp on Carbon & Ivory',
  '06 · Multi-échelles': '06 · Multi-Scale',
  'Net dès 16 × 16 px': 'Sharp Down to 16 × 16 px',

  // Identité — Chapter 02
  '02 · La famille des 3 logos': '02 · The 3-Logo Family',
  'Trois emblèmes choisis, un même ADN': 'Three Chosen Emblems, One Shared DNA',
  'Chaque logo porte directement l’un des trois piliers de mon portfolio sur la page d’accueil. Cliquez sur une carte pour ouvrir immédiatement son plan de construction et sa lecture complète.':
    'Each logo directly represents one of the three pillars featured on my portfolio home page. Click any card to jump straight to its construction blueprint and full breakdown.',
  'Pilier 01 · Code': 'Pillar 01 · Code',
  'Voir construction 04': 'See Blueprint 04',
  'Pilier 02 · IA': 'Pillar 02 · AI',
  'Voir construction 05': 'See Blueprint 05',
  'Logo Officiel': 'Official Logo',
  'Systèmes TI & Monogramme OB': 'IT Systems & OB Monogram',
  'Monogramme OB': 'OB Monogram',
  'Voir construction 03': 'See Blueprint 03',

  // Identité — Chapters 03, 04, 05 & Inspectors
  'Le logo': 'The Logo',
  'La construction': 'Construction',
  'La lecture': 'Meaning',
  Carbone: 'Carbon',
  Ivoire: 'Ivory',
  Grille: 'Grid',
  'Échelles :': 'Scales:',
  '03 · Le monogramme fondateur': '03 · The Founding Monogram',
  'OB Hexagonal Tech — Identité principale': 'OB Hexagonal Tech — Primary Identity',
  'Le sceau officiel d’Olivier Bourgault depuis la V4 : mes initiales assemblées en bouclier d’infrastructure et de circuit imprimé.':
    'Olivier Bourgault’s official emblem since V4: my initials assembled into an infrastructure shield and printed circuit track.',
  'Logo Officiel · Navbar & Favicon': 'Official Logo · Navbar & Favicon',
  'Adopté en V4 · Actif en V6': 'Adopted in V4 · Active in V6',
  'Ce qu’on voit': 'What You See',
  'Comment il est né': 'How It Was Born',
  'Ce qu’il cache': 'What It Hides',
  'L’hexagone': 'The Hexagon',
  'Le B double-flux': 'The Dual-Bus B',
  'Le point pivot': 'The Pivot Node',
  'Systèmes TI': 'IT Systems',
  'Voir pilier TI': 'View IT Pillar',

  '04 · La syntaxe du bâtisseur': '04 · The Builder’s Syntax',
  'Terminal Code </> — Développement Full-Stack': 'Terminal Code </> — Full-Stack Development',
  'La balise universelle du développeur logiciel, épurée et recentrée dans le disque signature de la famille.':
    'The universal software developer tag, streamlined and centered inside the family’s signature ring.',
  'Pilier 01 · Développement Full-Stack': 'Pillar 01 · Full-Stack Development',
  'Miroir < et >': 'Mirrored < and >',
  'Le slash / à 74°': 'The 74° Slash /',
  'L’halo subtil': 'The Subtle Halo',
  'Accessibilité WCAG': 'WCAG Accessibility',
  'Voir mes projets': 'View My Projects',

  '05 · La constellation synaptique': '05 · The Synaptic Constellation',
  'Nœud Neuronal — Intelligence Artificielle': 'Neural Node — Artificial Intelligence',
  'Une orbite de données en pointillés qui entoure un graphe triangulaire de neurones et son point focal d’inférence.':
    'A dashed data orbit surrounding a triangular neural graph and its central inference focal point.',
  'Pilier 02 · Intelligence Artificielle': 'Pillar 02 · Artificial Intelligence',
  'AEC IA · HubAI': 'AI ACS · HubAI',
  'L’orbite 8/4': 'The 8/4 Orbit',
  'Les 3 sommets': 'The 3 Vertices',
  'Le noyau (50;53)': 'The Core (50;53)',
  'Parcours IA': 'AI Background',

  // Identité — Chapter 06 (Table, Palette, Typography, Bench)
  '06 · Le code de la famille & Charte Tech Canvas': '06 · Family Code & Tech Canvas Guidelines',
  'Un cadre qui tient, une polarité qui parle': 'A Frame That Holds, a Polarity That Speaks',
  Logo: 'Logo',
  'Ce que ça dit': 'What It Means',
  'Ce que ça cache': 'What It Hides',
  'OB Hexagonal Tech': 'OB Hexagonal Tech',
  'Hexagone orange + monogramme B bleu + pivot central': 'Orange hexagon + blue B monogram + central pivot',
  'Mon identité officielle & mes systèmes TI': 'My official identity & IT systems',
  'Initiales O·B réunies en bouclier matériel et bus de données':
    'Initials O·B united as a hardware shield and data bus',
  'Terminal Code </>': 'Terminal Code </>',
  'Disque orange + chevrons bleus + slash orange à 74°': 'Orange ring + blue chevrons + 74° orange slash',
  'Le langage du développement Full-Stack': 'The language of Full-Stack development',
  'Dialogue Front / Back symétrique autour de l’impulsion /':
    'Symmetrical Front / Back dialogue around the / impulse',
  'Nœud Neuronal IA': 'AI Neural Node',
  'Orbite pointillée orange + triangle de 3 disques bleus': 'Dashed orange orbit + triangle of 3 blue nodes',
  'Intelligence Artificielle & Agents': 'Artificial Intelligence & Agents',
  'Flux de paquets vers un modèle à 3 synapses et noyau d’inférence':
    'Packet stream converging on a 3-synapse model and inference core',
  'Palette officielle Tech Canvas (cliquer pour copier le code HEX)':
    'Official Tech Canvas Palette (click to copy HEX code)',
  'Orange Signal': 'Signal Orange',
  'Signature, sélection Figma, ombres dures et cadre OB.': 'Signature accent, Figma selection, hard shadows, and OB frame.',
  'Bleu Circuit': 'Circuit Blue',
  'Logique logicielle, flux binaires et synapses IA.': 'Software logic, binary streams, and AI synapses.',
  'Carbone Studio': 'Studio Carbon',
  'Planche sombre principale pour contraste maximal.': 'Primary dark cutting-mat canvas for maximum contrast.',
  'Graphite Surface': 'Surface Graphite',
  'Cartes néo-brutalistes, panneaux et fenêtres OS.': 'Neo-brutalist cards, panels, and OS windows.',
  'Ivoire Papier': 'Paper Ivory',
  'Planche d’atelier claire avec traits d’encre #161616.': 'Light workshop canvas paired with #161616 ink lines.',
  'Système typographique': 'Typography System',
  'Titres & UI': 'Headings & UI',
  'Poids 600 / 700 · Géométrie technique': 'Weights 600 / 700 · Technical geometry',
  'Signature Navbar': 'Navbar Wordmark',
  'Oswald · Capitales condensées': 'Oswald · Condensed uppercase',
  'Corps éditorial': 'Body Copy',
  'Clarté de lecture sur grilles et cartes.': 'High readability across grids and cards.',
  'Code & Cotation': 'Code & Blueprints',
  'IBM Plex Mono · Terminal & cotes': 'IBM Plex Mono · Terminal & dimensions',
  'Banc d’essai multi-surfaces': 'Multi-Surface Test Bench',
  'Comparez les 3 logos choisis simultanément sur vos fonds réels ou en taille favicon':
    'Compare all 3 emblems simultaneously on actual surfaces or at favicon scale',
  'Carbone #121316': 'Carbon #121316',
  'Ivoire #F4F1EA': 'Ivory #F4F1EA',
  'Orange #FF6600': 'Orange #FF6600',
  'Favicons 16/32/48': 'Favicons 16/32/48',
  'Télécharger SVG': 'Download SVG',

  // 404 Page
  'Page introuvable': 'Page Not Found',
  'L’adresse demandée n’existe pas ou a été déplacée vers la nouvelle architecture Astro V6. Utilisez les raccourcis ci-dessous pour reprendre votre visite.':
    'The requested URL does not exist or has moved to the new Astro V6 architecture. Use the shortcuts below to continue exploring.',
  'Accueil V6': 'V6 Home'
};

/**
 * Rich HTML innerHTML translations keyed by CSS selector (for elements with inline tags like <strong>, <em>, <code>).
 */
export const SELECTOR_HTML_FR_TO_EN: Array<{ selector: string; enHtml: string }> = [
  {
    selector: '#bio',
    enHtml:
      "A Computer Technology graduate currently specializing in <strong>artificial intelligence</strong>, I design new applications and optimize existing systems. Passionate about automation, technical problem-solving, and Web accessibility (WCAG), I bring rigor and autonomy to innovative projects."
  },
  {
    selector: '#portfolio .portfolio-text',
    enHtml:
      'Explore a selection of my academic, professional, and personal projects.<br />To browse all of my source code, visit my <a href="https://github.com/RinoShip77/MesProjets" target="_blank" rel="noopener noreferrer">GitHub</a> repository.'
  },
  {
    selector: '#versionsHeroTitle',
    enHtml:
      '<span class="hero-layer-tag"><i class="bi bi-layers-half" aria-hidden="true"></i> OB TECH &bull; ARCHIVE STUDIO</span> Version <span class="hero-title-highlight">Browser</span>'
  },
  {
    selector: '.versions-hero-lead',
    enHtml:
      'Explore the complete live evolution of <strong>olivierbourgault.github.io</strong>, from the initial V1 release to the new <strong>V6 Astro · Tech Canvas</strong> architecture. Test every generation and its historical palettes across Desktop, Tablet, and Mobile without leaving the page.'
  },
  {
    selector: '#identiteHeroTitle',
    enHtml:
      '<span class="hero-layer-tag"><i class="bi bi-vector-pen" aria-hidden="true"></i> OB TECH IDENTITY &bull; 3 LOGOS &bull; 2026</span> Three logos, one unified <span class="hero-title-highlight">architecture.</span>'
  },
  {
    selector: '.identite-hero-lead',
    enHtml:
      'Everything starts from my initials <strong>O</strong> and <strong>B</strong>, a protective hexagon, and a constant dialogue between <strong>Signal Orange #FF6600</strong> (action trigger) and <strong>Circuit Blue #38BDF8</strong> (logical flow). From one pillar to the next, the same geometry traces my personal brand, Full-Stack code, and artificial intelligence.'
  },
  {
    selector: '#origine .chapter-lead',
    enHtml:
      'Instead of drawing three isolated logos, I designed a single geometric vocabulary on a <strong>100 × 100</strong> grid: a closed or rhythmic <strong>#FF6600 orange</strong> enclosure framing the system, and an internal <strong>#38BDF8 circuit blue</strong> signal expressing the technical specialty.'
  },
  {
    selector: '#code-famille .chapter-lead',
    enHtml:
      'The entire graphic system follows two rules: keep <strong>#FF6600 orange</strong> as the structural frame, and let <strong>#38BDF8 circuit blue</strong> express the craft at the core of each emblem.'
  },
  {
    selector: '#ob-panel-logo .inspector-caption-inner',
    enHtml:
      '<strong>The official emblem:</strong> as featured in the navigation bar, SVG favicon, Fusion Boot Loader, and site footer.'
  },
  {
    selector: '#ob-panel-construction .inspector-caption-inner',
    enHtml:
      '<strong>Construction:</strong> hexagon inscribed in <code>R 46</code> with <code>60°</code> faces, B spine aligned on <code>x 38</code>, and two symmetrical loops between <code>y 30</code>, <code>y 50</code>, and <code>y 70</code>.'
  },
  {
    selector: '#ob-panel-lecture .inspector-caption-inner',
    enHtml:
      '<strong>Meaning:</strong> three ideas in a single mark — the protective <strong>O</strong> shield, the digital <strong>B</strong> bus track, and the central junction node at <code>(50;50)</code>.'
  },
  {
    selector: '#term-panel-logo .inspector-caption-inner',
    enHtml:
      '<strong>The emblem:</strong> orange ring with a translucent core framing circuit-blue code chevrons and a dynamic central slash.'
  },
  {
    selector: '#term-panel-construction .inspector-caption-inner',
    enHtml:
      '<strong>Construction:</strong> symmetrical chevrons spanning <code>x 24</code> to <code>x 76</code> over vertical range <code>y 36 → y 64</code>, crossed by a slash tilted at <code>74°</code>.'
  },
  {
    selector: '#term-panel-lecture .inspector-caption-inner',
    enHtml:
      '<strong>Meaning:</strong> Front-End and Back-End mirrored (<code>&lt;</code> and <code>&gt;</code>) connected by the execution impulse <code>/</code>.'
  },
  {
    selector: '#neural-panel-logo .inspector-caption-inner',
    enHtml:
      '<strong>The emblem:</strong> dashed orbital ring <code>dash 8/4</code>, 3-vertex synaptic graph in circuit blue, and white activation barycenter.'
  },
  {
    selector: '#neural-panel-construction .inspector-caption-inner',
    enHtml:
      '<strong>Construction:</strong> balanced isosceles triangle at coordinates <code>(50;30)</code>, <code>(32;65)</code>, and <code>(68;65)</code> with radius-<code>8</code> nodes and core centered at <code>(50;53)</code>.'
  },
  {
    selector: '#neural-panel-lecture .inspector-caption-inner',
    enHtml:
      '<strong>Meaning:</strong> discrete data stream on the perimeter converging toward a balanced model uniting <em>Data</em>, <em>Learning</em>, and <em>Decision</em>.'
  }
];

/**
 * Attribute translations (placeholder, title, aria-label).
 */
export const ATTR_FR_TO_EN: Record<string, string> = {
  'Votre nom': 'Your Name',
  'Votre courriel': 'Your Email',
  Sujet: 'Subject',
  'Votre message': 'Your Message',
  'Filtrer les projets par catégorie': 'Filter projects by category',
  'Télécharger mon CV (PDF — Français ou Anglais)': 'Download my Resume (PDF — French or English)',
  'Télécharger mon CV (Français ou Anglais)': 'Download my Resume (French or English)',
  'Afficher ou masquer toutes les compétences': 'Show or hide all skills',
  'Versions et identité visuelle': 'Versions and Visual Identity',
  'Versions & Identité visuelle': 'Versions & Visual Identity',
  'Ouvrir le menu': 'Open menu',
  'Fermer le menu': 'Close menu',
  'Retour en haut': 'Back to top',
  'Retour en haut de page': 'Back to top of page',
  'Fermer la fenêtre CV': 'Close Resume dialog',
  'Quitter le mode plein écran': 'Exit fullscreen preview',
  "Recharger l'aperçu": 'Reload preview',
  "Ouvrir l'aperçu en plein écran": 'Open fullscreen preview',
  'Ouvrir dans un nouvel onglet': 'Open in new tab',
  'Accueil — Olivier Bourgault': 'Home — Olivier Bourgault',
  'Accueil (V6)': 'Home (V6)',
  'Accueil du portfolio': 'Portfolio Home',
  'Profil GitHub': 'GitHub Profile',
  'Profil Github': 'GitHub Profile',
  'Profil LinkedIn': 'LinkedIn Profile',
  'Profil Linkedin': 'LinkedIn Profile',
  Recharger: 'Reload'
};

/**
 * English metadata for versions V6..V1 used dynamically by versions-studio.ts
 */
export const VERSION_META_EN: Record<string, { title: string; description: string }> = {
  V6: {
    title: 'Version 6.0 — Componentized Astro · Tech Canvas Edition',
    description:
      'Complete architectural rebuild powered by Astro with reusable components, self-hosted fonts (@fontsource), native dialogs/menus without Bootstrap JS or Isotope, unified zero-FOUC theme, and automated GitHub Pages deployment while preserving V1–V5 intact.'
  },
  V5: {
    title: 'Version 5.0 — Tech Canvas Edition & Interactive Studio',
    description:
      'Exclusive "Tech Canvas" art direction blending Carbon #121316 & Orange #FF6600 technical precision, Shabnam Raghavan’s Figma workshop aesthetic, and Aahil Khan’s interactive neo-brutalism, enhanced with live GitHub portfolio sync.'
  },
  V4: {
    title: 'Version 4.0 — OB Tech Edition & Vector Identity',
    description:
      'Official adoption of the "OB Tech" vector logo (orange hexagon and sky-blue circuit), deployment of the 3-logo thematic ecosystem, and Tech Presentation default palette with 7 switchable themes.'
  },
  V3: {
    title: 'Version 3.0 — Multi-Style Edition (6 Themes)',
    description:
      'Comprehensive visual exploration introducing a floating switcher with 6 real-time switchable art directions (dark and light modes) shareable via URL parameters.'
  },
  V2: {
    title: 'Version 2.0 — AI & Enhanced Edition',
    description:
      'Editorial update aligned with my artificial intelligence specialization, integrating recent work experience and an expanded technical presentation of skills and projects.'
  },
  V1: {
    title: 'Version 1.0 — Initial Archive',
    description:
      'First complete release published on olivierbourgault.github.io, highlighting the Computer Technology diploma and initial academic and professional achievements.'
  }
};
