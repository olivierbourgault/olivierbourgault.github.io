import type { APIRoute } from 'astro';
import { FALLBACK_PROJECTS } from '../data/projects';
import { SITE } from '../data/site';
import { LANGUAGES_AND_FRAMEWORKS, SOFTWARES_AND_ENVS } from '../data/skills';

const SITE_ORIGIN = 'https://olivierbourgault.github.io';

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

export const GET: APIRoute = () => {
  const projects = FALLBACK_PROJECTS.map(
    (p) =>
      `- **${p.name}** (\`${p.path}\`) : ${stripHtml(p.descriptionHtml)} (${p.badges.map((b) => `\`${b}\``).join(', ')}). — ${p.repoUrl}`
  ).join('\n');

  const md = `# ${SITE.author} — ${SITE.roleTitle}

> Page d'accueil officielle du portfolio (\`${SITE_ORIGIN}/\`). Basé à ${SITE.location} (Canada).

## Profil & Coordonnées

- **Nom**: ${SITE.author}
- **Titre**: ${SITE.roleTitle}
- **Localisation**: ${SITE.location}, Canada
- **Courriel**: ${SITE.email}
- **Début de parcours en informatique**: ${SITE.careerStartDate}
- **GitHub**: ${SITE.githubUrl}
- **Dépôt projets**: ${SITE.githubProjectsUrl}
- **LinkedIn**: ${SITE.linkedinUrl}

## 3 Piliers technologiques

1. **Développement Full-Stack**
   Conception d'applications Web et logicielles réactives, modulaires et accessibles (WCAG). Écosystèmes : C# / .NET MAUI, Angular, Vue, React, Symfony et architectures RESTful.
2. **Intelligence Artificielle**
   Spécialisation avancée (AEC IA, Collège O'Sullivan de Québec, 2026–2027). Machine Learning, Deep Learning, pipelines de traitement de données (Python, Pandas, Scikit-Learn) et agents intelligents.
3. **Systèmes TI & Automatisation**
   Rigueur issue d'expériences à la Chambre des communes et à Élections Canada. Automatisation PowerShell / Batch, infrastructures réseaux, Active Directory et contrôle de versions Git.

## Compétences techniques

- **Langages & Frameworks**: ${LANGUAGES_AND_FRAMEWORKS.join(', ')}.
- **Logiciels & Environnements**: ${SOFTWARES_AND_ENVS.join(', ')}.

## Projets phares

${projects}

## Liens associés

- Version Markdown du CV : ${SITE_ORIGIN}/resume.md
- Version Markdown de l'identité visuelle : ${SITE_ORIGIN}/identity.md
- Version Markdown de l'historique des versions : ${SITE_ORIGIN}/versions.md
`;

  return new Response(md, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' }
  });
};
