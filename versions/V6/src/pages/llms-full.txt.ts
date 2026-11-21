import type { APIRoute } from 'astro';
import { FAMILY_COMPARISON_ROWS, PALETTE_COLOR_TOKENS } from '../data/logos';
import { FALLBACK_PROJECTS } from '../data/projects';
import { RESUME_BLOCKS } from '../data/resume';
import { SITE } from '../data/site';
import { LANGUAGES_AND_FRAMEWORKS, SOFTWARES_AND_ENVS } from '../data/skills';
import { PORTFOLIO_VERSIONS } from '../data/versions';

const SITE_ORIGIN = 'https://olivierbourgault.github.io';

function stripHtml(html: string): string {
  return html
    .replace(/<\/?(?:em|i)>/gi, '*')
    .replace(/<\/?(?:strong|b)>/gi, '**')
    .replace(/<\/?code>/gi, '`')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export const GET: APIRoute = () => {
  const resumeSections = RESUME_BLOCKS.map((block, bIdx) => {
    const items = block.items
      .map((item) => {
        const roles = item.roles
          .map((r) => {
            const label = r.period ? `**${r.period} — ${r.position}**` : `**${r.position}**`;
            return `- ${label}\n  ${stripHtml(r.descriptionHtml)}`;
          })
          .join('\n');
        return `### ${item.company} (${item.period})\n${roles}`;
      })
      .join('\n\n');
    return `## ${bIdx + 4}. ${block.title}\n\n${items}`;
  }).join('\n\n---\n\n');

  const projectsList = FALLBACK_PROJECTS.map(
    (p, idx) =>
      `${idx + 1}. **${p.name}** (\`${p.path}\` — ${p.categoryLabel})\n` +
      `   - URL: ${p.repoUrl}\n` +
      `   - Description: ${stripHtml(p.descriptionHtml)}\n` +
      `   - Technologies: ${p.badges.join(', ')}.`
  ).join('\n\n');

  const paletteLines = PALETTE_COLOR_TOKENS.map(
    (c) => `  - ${c.name}: \`${c.hex}\` (${c.role})`
  ).join('\n');

  const logoLines = FAMILY_COMPARISON_ROWS.map(
    (l) => `  - **${l.name}** (\`/${l.logoFile}\`): ${l.meaning} — ${l.seen}`
  ).join('\n');

  const versionLines = PORTFOLIO_VERSIONS.map((v) => {
    const url = v.path === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${v.path}`;
    return `- **${v.id} (${v.date} — ${v.status})**: ${v.title} (\`${url}\`) — ${v.description}`;
  }).join('\n');

  const content = `# ${SITE.author} — Contexte complet du portfolio (llms-full.txt)

> ${SITE.roleTitle} basé à ${SITE.location} (Canada). Ce document est généré automatiquement au build depuis \`src/data/*.ts\` et rassemble l'intégralité du contenu structuré du portfolio officiel (Version 6 — Astro · Tech Canvas) pour les LLM et agents IA.

---

## 1. Coordonnées et liens officiels

- **Nom**: ${SITE.author}
- **Rôle**: ${SITE.roleTitle}
- **Localisation**: ${SITE.location}, Canada
- **Courriel**: ${SITE.email}
- **Début de parcours en informatique**: ${SITE.careerStartDate}
- **Portfolio**: ${SITE_ORIGIN}/
- **Aperçu du CV (Web)**: ${SITE_ORIGIN}/resume
- **Identité visuelle**: ${SITE_ORIGIN}/identity
- **Navigateur de versions**: ${SITE_ORIGIN}/versions/
- **Versions Markdown**: ${SITE_ORIGIN}/index.md, \`/resume.md\`, \`/identity.md\`, \`/versions.md\`
- **CV PDF (FR)**: ${SITE_ORIGIN}/${SITE.cvFrPdf}
- **Resume PDF (EN)**: ${SITE_ORIGIN}/${SITE.cvEnPdf}
- **Template de présentation Tech Canvas**: ${SITE_ORIGIN}/assets/docs/presentation-template.html
- **GitHub**: ${SITE.githubUrl}
- **Dépôt projets**: ${SITE.githubProjectsUrl}
- **LinkedIn**: ${SITE.linkedinUrl}

---

## 2. Piliers technologiques

### Développement Full-Stack
Conception d'applications Web et logicielles réactives, modulaires et accessibles (WCAG). Maîtrise des écosystèmes modernes : C# / .NET MAUI, Angular, Vue, React, Symfony et architectures RESTful.

### Intelligence Artificielle
Spécialisation avancée (AEC IA au Collège O'Sullivan de Québec). Entraînement et déploiement de modèles de Machine Learning, Deep Learning, pipelines de traitement de données (Python, Pandas, Scikit-Learn) et agents intelligents.

### Systèmes TI & Automatisation
Rigueur issue d'expériences concrètes (Chambre des communes, Élections Canada). Automatisation de tâches complexes via PowerShell / Batch, gestion d'infrastructures réseaux, Active Directory et contrôle de versions Git.

---

## 3. Compétences techniques

### Langages & Frameworks
${LANGUAGES_AND_FRAMEWORKS.join(', ')}.

### Logiciels & Environnements
${SOFTWARES_AND_ENVS.join(', ')}.

---

${resumeSections}

---

## 8. Projets phares (Dépôt GitHub ${SITE.githubRepoOwner}/${SITE.githubRepoName})

${projectsList}

---

## 9. Identité visuelle « Tech Canvas »

- **Palette principale**:
${paletteLines}
- **Logos vectoriels OB Tech**:
${logoLines}

---

## 10. Historique des versions du portfolio

${versionLines}

---

## 11. Fichiers standards & Ressources complémentaires

- **Index LLM**: \`/llms.txt\` et \`/llms-full.txt\`
- **Versions Markdown des pages**: \`/index.md\`, \`/resume.md\`, \`/identity.md\`, \`/versions.md\`
- **Template de présentation Tech Canvas**: \`/assets/docs/presentation-template.html\`
- **Métadonnées & découverte Web**: \`/robots.txt\`, \`/sitemap.xml\`, \`/.well-known/security.txt\`, \`/humans.txt\`, \`/site.webmanifest\`
`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
};
