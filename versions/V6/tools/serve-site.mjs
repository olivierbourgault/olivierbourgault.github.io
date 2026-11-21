import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const siteDir = path.resolve(__dirname, '..', '.site');

const portArgIdx = process.argv.indexOf('--port');
const port = portArgIdx !== -1 && process.argv[portArgIdx + 1] ? Number(process.argv[portArgIdx + 1]) : 8080;

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
  '.txt': 'text/plain; charset=utf-8'
};

if (!fs.existsSync(siteDir)) {
  console.error('Erreur : versions/V6/.site est introuvable. Exécutez `npm run site:assemble` d’abord.');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  let filePath = path.join(siteDir, urlPath.replace(/^\/+/, ''));

  if (!filePath.startsWith(siteDir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  try {
    if (!urlPath.endsWith('/') && fs.existsSync(`${filePath}.html`) && fs.statSync(`${filePath}.html`).isFile()) {
      filePath = `${filePath}.html`;
    } else if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      if (!urlPath.endsWith('/')) {
        res.writeHead(301, { Location: `${urlPath}/` });
        res.end();
        return;
      }
      filePath = path.join(filePath, 'index.html');
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    const page404 = path.join(siteDir, '404.html');
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    if (fs.existsSync(page404)) {
      fs.createReadStream(page404).pipe(res);
    } else {
      res.end('404 Not Found');
    }
  } catch (err) {
    res.writeHead(500);
    res.end(String(err));
  }
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Serveur statique prêt sur http://127.0.0.1:${port}/ (racine: ${siteDir})`);
});
