import type { APIRoute } from 'astro';
import { RESUME_BLOCKS } from '../data/resume';
import { SITE } from '../data/site';

const SITE_ORIGIN = 'https://olivierbourgault.github.io';

function stripHtml(html: string): string {
  return html
    .replace(/<\/?(?:em|i)>/gi, '*')
    .replace(/<\/?(?:strong|b)>/gi, '**')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export const GET: APIRoute = () => {
  const sections = RESUME_BLOCKS.map((block) => {
    const items = block.items
      .map((item) => {
        const header = `### ${item.company} (${item.period})`;
        const roles = item.roles
          .map((role) => {
            const title = role.period ? `**${role.period} — ${role.position}**` : `**${role.position}**`;
            return `- ${title}\n  ${stripHtml(role.descriptionHtml)}`;
          })
          .join('\n');
        return `${header}\n${roles}`;
      })
      .join('\n\n');

    return `## ${block.title}\n\n${items}`;
  }).join('\n\n');

  const md = `# Curriculum Vitae — ${SITE.author}

> Aperçu complet du CV (\`${SITE_ORIGIN}/resume\`). Disponible en PDF : [CV FR](${SITE_ORIGIN}/${SITE.cvFrPdf}) | [Resume EN](${SITE_ORIGIN}/${SITE.cvEnPdf}).

- **Nom**: ${SITE.author}
- **Titre**: ${SITE.roleTitle}
- **Localisation**: ${SITE.location}, Canada
- **Courriel**: ${SITE.email}
- **GitHub**: ${SITE.githubUrl}
- **LinkedIn**: ${SITE.linkedinUrl}

${sections}
`;

  return new Response(md, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' }
  });
};
