import type { APIRoute } from 'astro';

const SITE_ORIGIN = 'https://olivierbourgault.github.io';

const ROUTES = [
  { path: '/', priority: '1.0' },
  { path: '/resume', priority: '0.9' },
  { path: '/identity', priority: '0.8' },
  { path: '/versions/', priority: '0.8' }
] as const;

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().slice(0, 10);

  const entries = ROUTES.map(({ path, priority }) => {
    const loc = `${SITE_ORIGIN}${path}`;
    const enLoc = `${loc}?lang=en`;
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <xhtml:link rel="alternate" hreflang="fr-CA" href="${loc}" />`,
      `    <xhtml:link rel="alternate" hreflang="en-CA" href="${enLoc}" />`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}" />`,
      `    <lastmod>${lastmod}</lastmod>`,
      `    <priority>${priority}</priority>`,
      '  </url>'
    ].join('\n');
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
>
${entries}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' }
  });
};
