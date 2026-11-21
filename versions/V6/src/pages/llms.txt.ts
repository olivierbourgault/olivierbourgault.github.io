import type { APIRoute } from 'astro';
import { FALLBACK_PROJECTS } from '../data/projects';
import { SITE } from '../data/site';

const SITE_ORIGIN = 'https://olivierbourgault.github.io';

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
}

export const GET: APIRoute = () => {
  const projectLines = FALLBACK_PROJECTS.map(
    (p) => `- [${p.name}](${p.repoUrl}): ${stripHtml(p.descriptionHtml)} (${p.badges.join(', ')}).`
  ).join('\n');

  const content = `# ${SITE.author}

> ${SITE.roleTitle} basé à ${SITE.location} (Canada). Portfolio officiel bilingue (FR / EN) regroupant parcours professionnel, projets GitHub, CV interactif, identité visuelle « Tech Canvas » et historique des versions.

- **Nom / Name**: ${SITE.author}
- **Titre / Role**: ${SITE.roleTitle} (Full-Stack & AI Developer, IT Technician)
- **Localisation / Location**: ${SITE.location}, Canada
- **Courriel / Email**: ${SITE.email}
- **Site Web / Website**: ${SITE_ORIGIN}/
- **Version complète pour LLM / Full LLM Context**: ${SITE_ORIGIN}/llms-full.txt

## Pages principales / Core Pages

- [Accueil / Home](${SITE_ORIGIN}/): Présentation du profil, 3 piliers technologiques (Full-Stack, IA, Systèmes TI), compétences, parcours CV interactif, portfolio GitHub et contact.
- [Aperçu du CV / Resume Preview](${SITE_ORIGIN}/resume): CV complet consultable en ligne en français et en anglais, prêt pour l'impression et le téléchargement PDF.
- [Identité visuelle / Visual Identity](${SITE_ORIGIN}/identity): Charte graphique « Tech Canvas » (Orange Signal #FF6600, Bleu Circuit #38BDF8, Carbone #121316, Ivoire #F4F1EA) et écosystème de logos vectoriels OB Tech.
- [Historique des versions / Version Browser](${SITE_ORIGIN}/versions/): Explorateur des versions V1 à V6 du portfolio et de leur évolution technique.

## Versions Markdown / Markdown Pages

- [index.md](${SITE_ORIGIN}/index.md): Version Markdown de la page d'accueil.
- [resume.md](${SITE_ORIGIN}/resume.md): Version Markdown du CV complet (générée au build depuis \`src/data/resume.ts\`).
- [identity.md](${SITE_ORIGIN}/identity.md): Version Markdown de l'identité visuelle « Tech Canvas ».
- [versions.md](${SITE_ORIGIN}/versions.md): Version Markdown de l'historique des versions V1 à V6 (générée au build depuis \`src/data/versions.ts\`).

## Documents & Profils / Documents & Profiles

- [CV Officiel (FR - PDF)](${SITE_ORIGIN}/${SITE.cvFrPdf}): Curriculum vitae complet en français.
- [Official Resume (EN - PDF)](${SITE_ORIGIN}/${SITE.cvEnPdf}): Complete resume in English.
- [Template de présentation Tech Canvas (HTML)](${SITE_ORIGIN}/assets/docs/presentation-template.html): Gabarit de présentation interactif aligné sur le Design System Tech Canvas.
- [GitHub (@${SITE.githubRepoOwner})](${SITE.githubUrl}): Profil GitHub principal.
- [Dépôt ${SITE.githubRepoName}](${SITE.githubProjectsUrl}): Dépôt centralisant les projets personnels, professionnels et scolaires.
- [LinkedIn](${SITE.linkedinUrl}): Profil professionnel LinkedIn.

## Piliers technologiques / Core Pillars

- **Développement Full-Stack**: Applications Web et logicielles réactives, modulaires et accessibles (WCAG) — C# / .NET MAUI, Angular, Vue.js, React, TypeScript, Symfony, architectures RESTful.
- **Intelligence Artificielle**: Spécialisation en cours (AEC IA, Collège O'Sullivan de Québec, 2026–2027) — Machine Learning, Deep Learning, Python, pipelines de données, intégration LLM / API Gemini et agents intelligents.
- **Systèmes TI & Automatisation**: Expérience à la Chambre des Communes et Élections Canada — PowerShell, Batch, accessibilité WCAG, assurance qualité, Azure DevOps, Active Directory, Docker, Git.

## Projets phares / Featured Projects

${projectLines}

## Fichiers standards / Standard Web Files

- [robots.txt](${SITE_ORIGIN}/robots.txt): Directives d'indexation et lien vers \`sitemap.xml\` et \`llms.txt\`.
- [sitemap.xml](${SITE_ORIGIN}/sitemap.xml): Plan XML des routes principales avec \`hreflang\` FR/EN.
- [security.txt](${SITE_ORIGIN}/.well-known/security.txt): Contact de sécurité RFC 9116.
- [humans.txt](${SITE_ORIGIN}/humans.txt): Crédits, auteur et stack technique.
- [site.webmanifest](${SITE_ORIGIN}/site.webmanifest): Manifeste Web App (\`OB Tech\`, thème \`#FF6600\`).
`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
};
