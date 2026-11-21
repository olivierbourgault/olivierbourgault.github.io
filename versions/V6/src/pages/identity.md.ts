import type { APIRoute } from 'astro';
import {
  FAMILY_COMPARISON_ROWS,
  IDENTITY_INVARIANTS,
  PALETTE_COLOR_TOKENS,
  TYPO_SPECIMENS
} from '../data/logos';
import { SITE } from '../data/site';

const SITE_ORIGIN = 'https://olivierbourgault.github.io';

function stripHtml(html: string): string {
  return html
    .replace(/<\/?code>/gi, '`')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export const GET: APIRoute = () => {
  const invariants = IDENTITY_INVARIANTS.map((item, idx) => {
    const label = item.badgeText.replace(/^\d+\s*·\s*/, '');
    return `${idx + 1}. **${label} (${stripHtml(item.title)})** : ${stripHtml(item.descHtml)}`;
  }).join('\n');

  const logos = FAMILY_COMPARISON_ROWS.map(
    (row) => `- **${row.name}** (\`/${row.logoFile}\`) : ${row.seen} — ${row.meaning} (${row.hidden}).`
  ).join('\n');

  const colors = PALETTE_COLOR_TOKENS.map(
    (tok) => `| ${tok.name} | \`${tok.hex}\` | ${tok.role} |`
  ).join('\n');

  const typos = TYPO_SPECIMENS.map(
    (sp) => `- **${sp.role}** : \`${sp.fontCss.split(',')[0].replace(/'/g, '')}\` (${sp.meta})`
  ).join('\n');

  const md = `# Identité visuelle « Tech Canvas » — ${SITE.author}

> Charte graphique et écosystème de logos vectoriels (\`${SITE_ORIGIN}/identity\`).

## Les 6 invariants du système graphique

${invariants}

## Famille des 3 logos vectoriels SVG

${logos}

## Palette de couleurs officielle

| Nom | Code HEX | Rôle |
| --- | --- | --- |
${colors}

## Typographie (Pack Ingénierie & IA)

${typos}
`;

  return new Response(md, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' }
  });
};
