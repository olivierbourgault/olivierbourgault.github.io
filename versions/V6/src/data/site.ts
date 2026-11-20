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
  cvFrPdf: 'assets/CV_CL-FR.pdf',
  cvEnPdf: 'assets/CV_CL-EN.pdf',
  cvFrFilename: 'CV_Olivier_Bourgault_FR.pdf',
  cvEnFilename: 'Resume_Olivier_Bourgault_EN.pdf',
  themeStorageKey: 'ob_v6_theme'
} as const;
