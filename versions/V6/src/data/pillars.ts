export interface TechPillar {
  id: string;
  logoType: 'terminal' | 'neural' | 'ob';
  logoAriaLabel: string;
  title: string;
  description: string;
  delay: number;
  badges: Array<{ label: string; variant: 'sky' | 'orange' }>;
}

export const TECH_PILLARS: TechPillar[] = [
  {
    id: 'fullstack',
    logoType: 'terminal',
    logoAriaLabel: 'Logo Terminal Code Tech',
    title: 'Développement Full-Stack',
    description:
      "Conception d'applications Web et logicielles réactives, modulaires et accessibles (WCAG). Maîtrise des écosystèmes modernes : C# / .NET MAUI, Angular, Vue, React, Symfony et architectures RESTful.",
    delay: 100,
    badges: [
      { label: 'C# .NET', variant: 'sky' },
      { label: 'Angular / Vue', variant: 'sky' },
      { label: 'Symfony', variant: 'sky' },
      { label: 'Terminal </>', variant: 'orange' }
    ]
  },
  {
    id: 'ia',
    logoType: 'neural',
    logoAriaLabel: 'Logo Nœud Neuronal IA Tech',
    title: 'Intelligence Artificielle',
    description:
      "Spécialisation avancée (AEC IA Collège O'Sullivan). Entraînement et déploiement de modèles de Machine Learning, Deep Learning, pipelines de traitement de données (Python, Pandas, Scikit-Learn) et agents intelligents.",
    delay: 200,
    badges: [
      { label: 'Python & ML', variant: 'orange' },
      { label: 'Réseaux Neuronaux', variant: 'sky' },
      { label: 'Agents IA', variant: 'orange' }
    ]
  },
  {
    id: 'infra',
    logoType: 'ob',
    logoAriaLabel: 'Logo Monogramme OB Hexagonal Tech',
    title: 'Systèmes TI & Automatisation',
    description:
      "Rigueur issue d'expériences concrètes (Chambre des communes, Élections Canada). Automatisation de tâches complexes via PowerShell / Batch, gestion d'infrastructures réseaux, Active Directory et contrôle de versions Git.",
    delay: 300,
    badges: [
      { label: 'PowerShell', variant: 'sky' },
      { label: 'Active Directory', variant: 'sky' },
      { label: 'DevOps / Git', variant: 'orange' }
    ]
  }
];
