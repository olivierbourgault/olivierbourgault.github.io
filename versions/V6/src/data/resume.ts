export interface ResumeRole {
  period?: string;
  position: string;
  descriptionHtml: string;
}

export interface ResumeTimelineEntry {
  company: string;
  period: string;
  delay: number;
  roles: ResumeRole[];
}

export interface ResumeBlockData {
  id: string;
  title: string;
  delay?: number;
  startCollapsed: boolean;
  items: ResumeTimelineEntry[];
}

export const RESUME_BLOCKS: ResumeBlockData[] = [
  {
    id: 'it-experiences',
    title: 'Expériences professionnelles en informatique',
    startCollapsed: false,
    items: [
      {
        company: 'Chambre des Communes - House of Commons',
        period: 'Ottawa | 2023 - 2024',
        delay: 200,
        roles: [
          {
            period: 'Été 2024',
            position: 'Technicien informatique (Accessibilité & Assurance qualité)',
            descriptionHtml:
              "Tester des sites et des applications afin d'assurer leur conformité aux directives pour l'accessibilité du contenu Web (WCAG). Consigner les résultats dans Azure DevOps et produire des rapports Excel détaillés pour guider les équipes de développement."
          },
          {
            period: 'Été 2023',
            position: 'Technicien informatique (Support & Automatisation)',
            descriptionHtml:
              "Assister les utilisateurs via un système de billets, incluant l'analyse de la base de données pour identifier les causes profondes des incidents. Concevoir et mettre en œuvre le script PowerShell <em>CompareTools</em> pour automatiser la comparaison de fichiers et accélérer le dépannage par l'équipe de support."
          }
        ]
      },
      {
        company: 'VIWEB',
        period: 'Saint-Jérôme | 2024',
        delay: 300,
        roles: [
          {
            position: 'Développeur Web',
            descriptionHtml:
              "Développer mon propre thème sur mesure pour un site WordPress de vente en ligne avec l'extension WooCommerce. Personnaliser le catalogue de produits et automatiser le processus d'achat."
          }
        ]
      },
      {
        company: 'Cégep de Saint-Jérôme',
        period: 'Saint-Jérôme | 2023 - 2024',
        delay: 400,
        roles: [
          {
            position: 'Agent de soutien aux utilisateurs (Tuteur TIC)',
            descriptionHtml:
              "Accueillir et soutenir techniquement les étudiants et usagers du cégep, incluant l'assistance à l'impression, l'accès aux services en ligne du collège et l'utilisation de la suite Microsoft 365."
          }
        ]
      }
    ]
  },
  {
    id: 'education',
    title: 'Formation académique',
    delay: 100,
    startCollapsed: false,
    items: [
      {
        company: "Collège O'Sullivan de Québec",
        period: 'Québec | 2026 - 2027 (en cours)',
        delay: 150,
        roles: [
          {
            position: "Attestation d'études collégiales (AEC) en intelligence artificielle",
            descriptionHtml:
              "Spécialisation dans le développement de solutions d'intelligence artificielle, l'apprentissage automatique, l'analyse de données et l'intégration de modèles IA au sein d'applications modernes."
          }
        ]
      },
      {
        company: 'Cégep de Saint-Jérôme',
        period: 'Saint-Jérôme | 2024',
        delay: 200,
        roles: [
          {
            position: "Diplôme d'études collégiales (DEC) en technique de l'informatique",
            descriptionHtml:
              "Formation approfondie en développement d'applications Web, mobiles et logicielles, gestion de bases de données, architecture client-serveur et méthodologies agiles."
          }
        ]
      },
      {
        company: 'École secondaire Hormisdas-Gamelin',
        period: 'Gatineau | 2018',
        delay: 300,
        roles: [
          {
            position: "Diplôme d'études secondaires",
            descriptionHtml: 'Parcours réalisé au sein du programme profil sportif.'
          }
        ]
      }
    ]
  },
  {
    id: 'other-experiences',
    title: 'Autres expériences professionnelles',
    delay: 150,
    startCollapsed: true,
    items: [
      {
        company: 'Élections Canada',
        period: 'Gatineau | 2025',
        delay: 200,
        roles: [
          {
            position: "Préposé à l'information",
            descriptionHtml:
              "Accueillir et orienter les électeurs, incluant la validation des pièces d'identité et la gestion des flux. Participer à la logistique du site de vote (installation, signalisation, démantèlement), à la gestion des documents électoraux et au dépouillement, tout en appliquant les protocoles d'assistance aux personnes à mobilité réduite."
          }
        ]
      },
      {
        company: 'Sportmax & Club de Tennis de Buckingham',
        period: 'Gatineau | 2016 - 2022',
        delay: 250,
        roles: [
          {
            position: 'Animateur et Aide-instructeur',
            descriptionHtml:
              "Planifier, organiser et animer des activités pour des groupes d'enfants tout en assurant leur sécurité. Être responsable de l'accueil et des départs, superviser les collègues animateurs et assister les entraîneurs."
          }
        ]
      },
      {
        company: 'Cégep de Saint-Jérôme',
        period: 'Saint-Jérôme | 2020 - 2022',
        delay: 300,
        roles: [
          {
            position: 'Concierge',
            descriptionHtml:
              "Nettoyer et désinfecter rigoureusement les aires communes des résidences étudiantes afin d'assurer un environnement sécuritaire et sanitaire."
          }
        ]
      }
    ]
  },
  {
    id: 'certifications',
    title: 'Perfectionnement & Certifications',
    delay: 200,
    startCollapsed: true,
    items: [
      {
        company: 'Microsoft Learn',
        period: 'Gatineau / Ottawa',
        delay: 200,
        roles: [
          {
            position: 'Modules de formation continue',
            descriptionHtml:
              'Autoformation continue via les parcours techniques Microsoft Learn (.NET, C#, Azure DevOps, développement Web et outils infonuagiques).'
          }
        ]
      },
      {
        company: 'Formations complémentaires',
        period: '2020 - 2022',
        delay: 250,
        roles: [
          {
            position: 'Secourisme, SIMDUT & Mobilité',
            descriptionHtml:
              'Cours en premiers soins (2022), Formation SIMDUT (2020), Cours de secourisme (2020) et Permis de conduire Classe 5.'
          }
        ]
      }
    ]
  }
];

export interface CvSheetLocaleData {
  lang: 'fr' | 'en';
  sheet1Aria: string;
  sheet2Aria: string;
  name: string;
  roleLead: string;
  postalCity: string;
  email: string;
  links: Array<{ label: string; href: string }>;
  headings: {
    summary: string;
    skills: string;
    skillsCaption: string;
    work: string;
    workCaption: string;
    workCols: { name: string; desc: string; ctx: string };
    exp: string;
    otherExp: string;
    edu: string;
    cert: string;
  };
  summary: string[];
  skillsRows: Array<{ category: string; items: string }>;
  workRows: Array<{ title: string; description: string; context: string }>;
  experiences: Array<{ role: string; org: string; dates: string; desc: string }>;
  otherExperiences: Array<{ role: string; org: string; dates: string; desc: string }>;
  education: Array<{ degree: string; meta: string }>;
  certifications: Array<{ name: string; meta: string }>;
  footerNote: string;
}

export const CV_SHEET_DATA: CvSheetLocaleData = {
  lang: 'fr',
  sheet1Aria: 'Page 1 du CV (Français)',
  sheet2Aria: 'Page 2 du CV (Français)',
  name: 'OLIVIER BOURGAULT',
  roleLead: 'Diplômé en technique de l’informatique',
  postalCity: 'J8L 1Y3 | Gatineau',
  email: 'bourgault.olivier8501@gmail.com',
  links: [
    { label: 'Mon site web', href: 'https://olivierbourgault.github.io' },
    { label: 'Mon profil Linkedin', href: 'https://www.linkedin.com/in/olivier-bourgault-5b950428a' },
    { label: 'Mon dépôt de code', href: 'https://github.com/RinoShip77/MesProjets' }
  ],
  headings: {
    summary: 'SOMMAIRE',
    skills: 'INFORMATIQUE',
    skillsCaption: 'Compétences en informatique par catégorie',
    work: 'RÉALISATIONS',
    workCaption: 'Réalisations techniques et projets',
    workCols: { name: 'Réalisation', desc: 'Description', ctx: 'Contexte' },
    exp: 'EXPÉRIENCES PROFESSIONNELLES',
    otherExp: 'AUTRES EXPÉRIENCES PROFESSIONNELLES',
    edu: 'FORMATION',
    cert: 'PERFECTIONNEMENT'
  },
  summary: [
    'Diplômé en technique de l’informatique',
    'Spécialisé dans la création de nouvelles applications et en optimisation de systèmes existants',
    'Fiable, rigoureux, organisé, autonome et responsable',
    'Fort intérêt pour l’automatisation et la résolution de problématiques techniques.'
  ],
  skillsRows: [
    {
      category: 'Langages',
      items:
        'HTML, CSS, JavaScript, Batch/PowerShell, C++, C#, TypeScript, PHP, Kotlin, SQL (MySQL/MariaDB/MongoDB), YAML/JSON, Python, Dart, XAML, etc.'
    },
    {
      category: 'Frameworks & Outils',
      items:
        'Bootstrap, jQuery, Angular, NodeJS, Docker/Kubernetes, Symfony, Twig, Electron, Vite (Vue/React), NPM/YARN, Flutter, .NET/.NET MAUI/WPF, Expo, etc.'
    },
    {
      category: 'Logiciels & Environnements',
      items:
        'Microsoft Office Suite (Word/Excel/PowerPoint/OneDrive/Outlook/Visio/Teams), OS (Windows/Linux/Android), GitHub/Azure DevOps, Arduino, Visual Studio/VS Code, WampServer, phpMyAdmin, MongoDB Compas, SQL Developer, WordPress/cPanel, Postman, Mockoon, Android Studio, Antigravity, Node-RED, etc.'
    }
  ],
  workRows: [
    {
      title: 'Electrolib',
      description:
        'Réalisation d’un logiciel de gestion d’inventaire destiné à une bibliothèque, dans le cadre du cours Projet de développement (420-5C8-JR). Le projet comprend une application cliente en Angular et en serveur Symfony.',
      context: '2023 — Cégep de Saint-Jérôme, Saint-Jérôme'
    },
    {
      title: 'CompareTools',
      description:
        'Développement et mise en œuvre d’un script PowerShell pour automatiser la comparaison de fichiers et permettre d’accélérer le dépannage et d’améliorer l’efficacité de l’équipe de support dans le traitement des requêtes clients.',
      context: '2023 — Chambre des Communes – House of Commons, Ottawa'
    },
    {
      title: 'Kaomia',
      description:
        'Réalisation d’un portail de consultation des statistiques d’un jeu, dans le cadre du cours Projet de systèmes multi-clients (420-5D4-JR). Le projet comprend un client web en Vue, une application mobile en Kotlin et un serveur en Node.',
      context: '2023 — Cégep de Saint-Jérôme, Saint-Jérôme'
    }
  ],
  experiences: [
    {
      role: 'Technicien informatique',
      org: 'Chambre des Communes – House of Commons, Ottawa',
      dates: '2023-2024',
      desc:
        'Assister les utilisateurs via un système de billets, incluant l’analyse de la base de données pour identifier les causes des incidents. Tester des sites et des applications afin d’assurer leur conformité aux directives WCAG, avec consignation des résultats dans Azure DevOps et production de rapports Excel détaillés.'
    },
    {
      role: 'Développeur web',
      org: 'VIWEB, Saint-Jérôme',
      dates: '2024',
      desc:
        'Développer mon propre thème pour un site Wordpress de ventes en ligne avec l’aide de l’extension WooCommerce. Personnaliser le catalogue et automatiser le processus d’achat.'
    },
    {
      role: 'Agents de soutien aux utilisateurs',
      org: 'Cégep de Saint-Jérôme, Saint-Jérôme',
      dates: '2023-2024',
      desc:
        'Accueillir et soutenir techniquement les cégépiens, incluant l’assistance à l’impression, l’accès aux services en ligne du collège et l’utilisation de base de la suite Microsoft 365.'
    }
  ],
  otherExperiences: [
    {
      role: 'Préposé à l’information',
      org: 'Élection Canada, Gatineau',
      dates: '2025',
      desc:
        'Accueillir et orienter les électeurs, incluant la validation des pièces d’identité et la gestion des flux. Participer à la logistique du site de vote (installation, signalisation, démantèlement), à la gestion des documents électoraux et au dépouillement. Appliquer des protocoles de santé et d’assistance aux personnes à mobilité réduite.'
    },
    {
      role: 'Animateur et Aide instructeur',
      org: 'Sportmax, Gatineau | 2019-2022 & Club de Tennis de Buckingham, Gatineau | 2016-2019',
      dates: '',
      desc:
        "Planifier, organiser et animer des activités pour un groupe d'enfants et en assurer la sécurité. Être responsable de l’accueil et des départs du camp. Superviser mes collègues animateurs et assister les entraîneurs le matin et le soir. Nettoyer et désinfecter le matériel du camp durant toute la journée pour limiter la propagation du coronavirus."
    },
    {
      role: 'Concierge',
      org: 'Cégep de Saint-Jérôme, Saint-Jérôme',
      dates: '2020-2022',
      desc:
        'Nettoyer et désinfecter les aires communes des résidences afin de limiter la propagation du coronavirus.'
    }
  ],
  education: [
    {
      degree: 'Attestation d’études collégiales en intelligence artificielle',
      meta: ' | 2026-2027 (en cours) — Collège O’Sullivan de Québec, Québec'
    },
    {
      degree: 'Diplôme d’études collégiales en technique de l’informatique',
      meta: ' | 2024 — Cégep de Saint-Jérôme, Saint-Jérôme'
    },
    {
      degree: 'Diplôme d’études secondaires',
      meta: ' | 2018 — École secondaire Hormisdas-Gamelin, Gatineau'
    }
  ],
  certifications: [
    { name: 'Cours en premiers soins', meta: ' | 2022 — Sportmax, Gatineau' },
    { name: 'Formation SIMDUT', meta: ' | 2020 — Sportmax, Gatineau' },
    { name: 'Cours de secourismes', meta: ' | 2020 — Sportmax, Gatineau' },
    { name: 'Permis de conduire', meta: ' | Classe 5 — SAAQ, Saint-Jérôme' },
    { name: 'Learn Modules', meta: ' — Microsoft Learn, Gatineau/Ottawa' }
  ],
  footerNote: 'Références disponibles sur demande'
};

export const CV_SHEET_DATA_EN: CvSheetLocaleData = {
  lang: 'en',
  sheet1Aria: 'Resume Page 1 (English)',
  sheet2Aria: 'Resume Page 2 (English)',
  name: 'OLIVIER BOURGAULT',
  roleLead: 'Graduate in Computer Technology',
  postalCity: 'J8L 1Y3 | Gatineau',
  email: 'bourgault.olivier8501@gmail.com',
  links: [
    { label: 'My website', href: 'https://olivierbourgault.github.io' },
    { label: 'My Linkedin profile', href: 'https://www.linkedin.com/in/olivier-bourgault-5b950428a' },
    { label: 'My code repository', href: 'https://github.com/RinoShip77/MesProjets' }
  ],
  headings: {
    summary: 'CONTENTS',
    skills: 'IT',
    skillsCaption: 'IT skills by category',
    work: 'ACHIEVEMENTS',
    workCaption: 'Technical achievements and projects',
    workCols: { name: 'Achievement', desc: 'Description', ctx: 'Context' },
    exp: 'PROFESSIONAL EXPERIENCE',
    otherExp: 'OTHER PROFESSIONAL EXPERIENCE',
    edu: 'EDUCATION',
    cert: 'ADVANCED'
  },
  summary: [
    'Graduate in Computer Technology',
    'Specialized in the creation of new applications and the optimization of existing systems',
    'Reliable, rigorous, organized, autonomous and responsible',
    'Strong interest in automation and solving technical problems.'
  ],
  skillsRows: [
    {
      category: 'Languages',
      items:
        'HTML, CSS, JavaScript, Batch/PowerShell, C++, C#, TypeScript, PHP, Kotlin, SQL (MySQL/MariaDB/MongoDB), YAML/JSON, Python, Dart, XAML, etc.'
    },
    {
      category: 'Frameworks & Tools',
      items:
        'Bootstrap, jQuery, Angular, NodeJS, Docker/Kubernetes, Symfony, Twig, Electron, Vite (Vue/React), NPM/YARN, Flutter, .NET/.NET MAUI/WPF, Expo, etc.'
    },
    {
      category: 'Software & Environments',
      items:
        'Microsoft Office Suite (Word/Excel/PowerPoint/OneDrive/Outlook/Visio/Teams), OS (Windows/Linux/Android), GitHub/Azure DevOps, Arduino, Visual Studio/VS Code, WampServer, phpMyAdmin, MongoDB Compass, SQL Developer, WordPress/cPanel, Postman, Mockoon, Android Studio, Antigravity, Node-RED, etc.'
    }
  ],
  workRows: [
    {
      title: 'Electrolib',
      description:
        'Development of an inventory management software for a library, as part of the Development Project course (420-5C8-JR). The project includes a client application in Angular and in Symfony server.',
      context: '2023 — Cégep de Saint-Jérôme, Saint-Jérôme'
    },
    {
      title: 'CompareTools',
      description:
        'Developed and implemented a PowerShell script to automate file comparison and help speed up troubleshooting and improve the efficiency of the support team in handling customer queries.',
      context: '2023 — House of Commons – Chambre des Communes, Ottawa'
    },
    {
      title: 'Kaomia',
      description:
        'Creation of a portal for consulting the statistics of a game, as part of the course Multi-client systems project (420-5D4-JR). The project includes a web client in Vue, a mobile application in Kotlin and a server in Node.',
      context: '2023 — Cégep de Saint-Jérôme, Saint-Jérôme'
    }
  ],
  experiences: [
    {
      role: 'Computer Technician',
      org: 'House of Commons – Chambre des Communes, Ottawa',
      dates: '2023-2024',
      desc:
        'Assist users through a ticketing system, including database analysis to identify the causes of incidents. Test sites and applications to ensure compliance with WCAG guidelines, logging results in Azure DevOps and producing detailed Excel reports.'
    },
    {
      role: 'Web Developer',
      org: 'VIWEB, Saint-Jérôme',
      dates: '2024',
      desc:
        'Develop my own theme for an online sales Wordpress site with the help of the WooCommerce extension. Customize the catalog and automate the purchasing process.'
    },
    {
      role: 'User Support Agents',
      org: 'Cégep de Saint-Jérôme, Saint-Jérôme',
      dates: '2023-2024',
      desc:
        "Welcome and provide technical support to CEGEP students, including printing assistance, access to the college's online services and basic use of the Microsoft 365 suite."
    }
  ],
  otherExperiences: [
    {
      role: 'Information Officer',
      org: 'Elections Canada, Gatineau',
      dates: '2025',
      desc:
        'Welcoming and guiding voters, including the validation of identity documents and the management of flows. Participate in the logistics of the voting site (installation, signage, dismantling), the management of electoral documents and the counting. Apply health and assistance protocols for people with reduced mobility.'
    },
    {
      role: 'Facilitator and Assistant Instructor',
      org: 'Sportmax, Gatineau | 2019-2022 & Buckingham Tennis Club, Gatineau | 2016-2019',
      dates: '',
      desc:
        'Plan, organize, and facilitate activities for a group of children and ensure their safety. Be responsible for the reception and departures of the camp. Supervise my fellow facilitators and assist the coaches in the morning and evening. Clean and disinfect camp equipment throughout the day to limit the spread of the coronavirus.'
    },
    {
      role: 'Concierge',
      org: 'Cégep de Saint-Jérôme, Saint-Jérôme',
      dates: '2020-2022',
      desc:
        'Clean and disinfect common areas of residences to limit the spread of the coronavirus.'
    }
  ],
  education: [
    {
      degree: 'Attestation of College Studies in Artificial Intelligence',
      meta: " | 2026-2027 (ongoing) — O'Sullivan College in Quebec City, Quebec"
    },
    {
      degree: 'Diploma of College Studies in Computer Technology',
      meta: ' | 2024 — Cégep de Saint-Jérôme, Saint-Jérôme'
    },
    {
      degree: 'High School Diploma',
      meta: ' | 2018 — Hormisdas-Gamelin High School, Gatineau'
    }
  ],
  certifications: [
    { name: 'First Aid Courses', meta: ' | 2022 — Sportmax, Gatineau' },
    { name: 'WHMIS Training', meta: ' | 2020 — Sportmax, Gatineau' },
    { name: 'First Aid Courses', meta: ' | 2020 — Sportmax, Gatineau' },
    { name: "Driver's License", meta: ' | Class 5 — SAAQ, Saint-Jérôme' },
    { name: 'Learn Modules', meta: ' — Microsoft Learn, Gatineau/Ottawa' }
  ],
  footerNote: 'References available on request'
};

export const CV_SHEETS_BY_LANG = [CV_SHEET_DATA, CV_SHEET_DATA_EN] as const;
