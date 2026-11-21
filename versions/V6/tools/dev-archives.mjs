import fs from 'node:fs';
import path from 'node:path';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8'
};

/**
 * Vite plugin serving `/versions/V1..V5` and `/versions/index.html` during `astro dev`
 * so the Versions Studio and cross-version archive links work seamlessly in dev mode.
 */
export default function devArchivesPlugin({ root = '../..' } = {}) {
  const repoRoot = path.resolve(process.cwd(), root);

  return {
    name: 'ob-dev-archives',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) return next();
        const urlPath = req.url.split('?')[0].split('#')[0];

        const archiveMatch = /^\/versions\/V[1-5](?:\/.*)?$/i.exec(urlPath);
        if (!archiveMatch) return next();

        let rel = urlPath.replace(/^\/+/, '');
        let targetPath = path.resolve(repoRoot, rel);

        if (!targetPath.startsWith(repoRoot + path.sep)) {
          return next();
        }

        try {
          if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
            if (!urlPath.endsWith('/')) {
              res.writeHead(301, { Location: `${urlPath}/` });
              res.end();
              return;
            }
            targetPath = path.join(targetPath, 'index.html');
          }

          if (!fs.existsSync(targetPath) || !fs.statSync(targetPath).isFile()) {
            return next();
          }

          const ext = path.extname(targetPath).toLowerCase();
          res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
          fs.createReadStream(targetPath).pipe(res);
        } catch {
          next();
        }
      });
    }
  };
}
