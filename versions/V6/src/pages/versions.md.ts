import type { APIRoute } from 'astro';
import { SITE } from '../data/site';
import { PORTFOLIO_VERSIONS } from '../data/versions';

const SITE_ORIGIN = 'https://olivierbourgault.github.io';

export const GET: APIRoute = () => {
  const blocks = PORTFOLIO_VERSIONS.map((v) => {
    const url = v.path === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${v.path}`;
    const highlights = v.highlights.map((h) => `  - ${h}`).join('\n');
    return [
      `## ${v.id} — ${v.title}`,
      `- **Date** : ${v.date} | **Statut** : ${v.status}`,
      `- **URL** : ${url}`,
      `- **Stack** : ${v.stack.join(', ')}`,
      `- **Description** : ${v.description}`,
      `- **Points clés** :\n${highlights}`
    ].join('\n');
  }).join('\n\n');

  const md = `# Historique des versions — ${SITE.author}

> Studio interactif V1 → V${PORTFOLIO_VERSIONS.length} : [\`${SITE_ORIGIN}/versions/\`](${SITE_ORIGIN}/versions/)

Chaque archive V1 à V5 est préservée octet par octet (intégrité vérifiée par SHA-256 à chaque build) tandis que la V6 Astro constitue le portfolio actif déployé à la racine.

${blocks}
`;

  return new Response(md, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' }
  });
};
