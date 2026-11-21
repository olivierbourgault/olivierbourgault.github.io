export interface NavLinkItem {
  label: string;
  href: string;
  active?: boolean;
}

export const SITE = {
  author: 'Olivier Bourgault',
  roleTitle: "Développeur Full-Stack, IA & Technicien TI",
  email: 'bourgault.olivier8501@gmail.com',
  githubUrl: 'https://github.com/RinoShip77',
  githubAvatarUrl: 'https://github.com/RinoShip77.png',
  githubRepoOwner: 'RinoShip77',
  githubRepoName: 'MesProjets',
  githubBranch: 'main',
  githubProjectsUrl: 'https://github.com/RinoShip77/MesProjets',
  linkedinUrl: 'https://www.linkedin.com/in/olivier-bourgault-5b950428a',
  location: 'Gatineau / Ottawa, QC',
  careerStartDate: '2021-01-25',
  cvFrPdf: 'assets/docs/cv-fr.pdf',
  cvEnPdf: 'assets/docs/cv-en.pdf',
  cvFrFilename: 'CV_Olivier_Bourgault_FR.pdf',
  cvEnFilename: 'Resume_Olivier_Bourgault_EN.pdf',
  themeStorageKey: 'ob_v6_theme',
  motionStorageKey: 'ob_v6_reduced_motion',
  availability: {
    enabled: true,
    statusFr: 'Ouvert aux opportunités — Stage / Poste TI · Full-Stack · IA',
    statusEn: 'Open to opportunities — IT · Full-Stack · AI Internship / Role',
    metaFr: 'Gatineau / Ottawa · Hybride ou Télétravail',
    metaEn: 'Gatineau / Ottawa · Hybrid or Remote'
  },
  contact: {
    // Clé publique Web3Forms (https://web3forms.com) ou URL endpoint Formspree optionnelle
    web3formsAccessKey: '',
    formspreeEndpoint: ''
  },
  analytics: {
    // Analytics sans cookies optionnels (ex: code GoatCounter "olivierbourgault" ou token Cloudflare)
    goatcounterCode: '',
    cloudflareToken: ''
  }
} as const;
