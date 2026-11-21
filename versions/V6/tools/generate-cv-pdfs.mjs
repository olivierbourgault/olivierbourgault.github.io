import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const v6Root = path.resolve(__dirname, '..');
const siteDir = path.join(v6Root, '.site');
const docsOutDir = path.join(v6Root, 'public', 'assets', 'docs');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf'
};

function startEphemeralServer(rootDir) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const urlObj = new URL(req.url || '/', 'http://127.0.0.1');
        let rel = decodeURIComponent(urlObj.pathname).replace(/^\/+/, '');
        let filePath = path.join(rootDir, rel);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
          filePath = path.join(filePath, 'index.html');
        } else if (!fs.existsSync(filePath) && fs.existsSync(`${filePath}.html`)) {
          filePath = `${filePath}.html`;
        }
        if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
          res.writeHead(404);
          res.end('Not Found');
          return;
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
      } catch {
        res.writeHead(500);
        res.end('Server Error');
      }
    });
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      resolve({ server, port: addr.port });
    });
  });
}

async function main() {
  if (!fs.existsSync(path.join(siteDir, 'resume.html'))) {
    throw new Error(
      'Le dossier .site/ est introuvable. Exécutez `npm run build && npm run site:assemble` avant `npm run cv:pdf`.'
    );
  }

  fs.mkdirSync(docsOutDir, { recursive: true });
  const { server, port } = await startEphemeralServer(siteDir);
  const baseUrl = `http://127.0.0.1:${port}`;

  const hasBundledChromium = (() => {
    try {
      return fs.existsSync(chromium.executablePath());
    } catch {
      return false;
    }
  })();

  const browser = await chromium.launch({
    headless: true,
    ...(hasBundledChromium
      ? {}
      : { channel: process.platform === 'win32' ? 'msedge' : 'chrome' })
  });

  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    for (const lang of ['fr', 'en']) {
      const outFile = path.join(docsOutDir, `cv-${lang}.pdf`);
      await page.goto(`${baseUrl}/resume?lang=${lang}`, { waitUntil: 'networkidle' });
      await page.pdf({
        path: outFile,
        format: 'Letter',
        printBackground: true,
        margin: { top: '12mm', right: '14mm', bottom: '12mm', left: '14mm' }
      });

      const siteCopy = path.join(siteDir, 'assets', 'docs', `cv-${lang}.pdf`);
      if (fs.existsSync(path.dirname(siteCopy))) {
        fs.copyFileSync(outFile, siteCopy);
      }

      const sizeKb = (fs.statSync(outFile).size / 1024).toFixed(1);
      console.log(`CV PDF (${lang.toUpperCase()}) généré depuis /resume?lang=${lang} : ${sizeKb} Ko`);
    }
  } finally {
    await browser.close();
    server.close();
  }
}

main();
