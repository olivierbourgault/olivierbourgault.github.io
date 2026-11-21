import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const v6Root = path.resolve(__dirname, '..');
const outPath = path.join(v6Root, 'public', 'assets', 'data', 'github-projects.json');
const webpOutDir = path.join(v6Root, 'public', 'assets', 'images', 'projects', 'github');

const OWNER = 'RinoShip77';
const REPO = 'MesProjets';
const BRANCH = 'main';

const EXPLICIT_PREVIEW_FILE_RX =
  /^(preview|screenshot|demo|accueil|ecran[-_]?depart|banner|cover|capture)([-_]?\d+)?\.(png|jpe?g|gif|webp)$/i;
const PREVIEW_FOLDER_RX = /(?:^|\/)(screenshots?|previews?|captures?)\/[^/]+\.(png|jpe?g|gif|webp)$/i;

function encodeGitHubPath(p) {
  return p.split('/').map(encodeURIComponent).join('/');
}

function slugifySegment(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function stripMarkdown(mdText) {
  if (!mdText) return '';
  let text = mdText
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s+/gm, '')
    .replace(/[*_~]/g, '')
    .replace(/\|/g, ' ')
    .replace(/\r?\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length > 260) {
    text = `${text.substring(0, 257).trim()}...`;
  }
  return text;
}

function cleanReadmeDescription(rawReadme) {
  if (!rawReadme) return '';
  const lines = rawReadme
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(
      (line) =>
        line.length > 0 &&
        !line.startsWith('#') &&
        !line.startsWith('![') &&
        !line.startsWith('---')
    );

  if (lines.length === 0) return '';
  return stripMarkdown(lines.slice(0, 3).join(' '));
}

function extractProjectFromParentReadme(parentReadme, projectName) {
  if (!parentReadme || !projectName) return '';
  const lines = parentReadme.split(/\r?\n/);
  const escaped = projectName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\b${escaped}\\b`, 'i');

  for (let i = 0; i < lines.length; i++) {
    if (regex.test(lines[i])) {
      let snippet = lines[i].replace(regex, '').replace(/^[\s\-:*•|]+/, '');
      if (snippet.length < 25 && i + 1 < lines.length) {
        snippet += ` ${lines[i + 1]}`;
      }
      const cleaned = stripMarkdown(snippet);
      if (cleaned.length > 15) return cleaned;
    }
  }
  return '';
}

async function fetchRawGitHubText(repoPath) {
  try {
    const url = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${encodeGitHubPath(repoPath)}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'olivierbourgault-portfolio-v6-sync' }
    });
    if (!res.ok) return '';
    return await res.text();
  } catch {
    return '';
  }
}

function previewSortRank(relPath) {
  const fileName = (relPath.split('/').pop() || '').toLowerCase();
  const base = fileName.replace(/\.[a-z0-9]+$/i, '');
  if (base === 'preview') return { group: 0, num: 0, base };
  const previewNumMatch = base.match(/^preview[-_]?(\d+)$/);
  if (previewNumMatch) {
    return { group: 0, num: Number(previewNumMatch[1]), base };
  }
  const otherNumMatch = base.match(
    /^(screenshot|demo|accueil|ecran[-_]?depart|banner|cover|capture)[-_]?(\d+)?$/
  );
  if (otherNumMatch) {
    return { group: 1, num: otherNumMatch[2] ? Number(otherNumMatch[2]) : 0, base };
  }
  return { group: 2, num: 0, base: relPath.toLowerCase() };
}

function findProjectPreviewsInTree(tree, projectPath) {
  const prefix = `${projectPath}/`;
  const candidates = tree.filter((item) => {
    if (item.type !== 'blob' || !item.path) return false;
    if (!item.path.startsWith(prefix)) return false;
    const rel = item.path.slice(prefix.length);
    const fileName = rel.split('/').pop() || '';
    return EXPLICIT_PREVIEW_FILE_RX.test(fileName) || PREVIEW_FOLDER_RX.test(rel);
  });

  candidates.sort((a, b) => {
    const relA = (a.path || '').slice(prefix.length);
    const relB = (b.path || '').slice(prefix.length);
    const rankA = previewSortRank(relA);
    const rankB = previewSortRank(relB);
    if (rankA.group !== rankB.group) return rankA.group - rankB.group;
    if (rankA.num !== rankB.num) return rankA.num - rankB.num;
    return relA.localeCompare(relB, undefined, { numeric: true, sensitivity: 'base' });
  });

  return candidates;
}

async function convertGitHubPreviewToWebp(projectPath, blobItem, index, prevShaMap) {
  const relInProject = blobItem.path.slice(projectPath.length + 1);
  const rawBaseName = (relInProject.split('/').pop() || `preview-${index + 1}`).replace(
    /\.[a-z0-9]+$/i,
    ''
  );
  const projectSlug = slugifySegment(projectPath);
  const fileSlug = slugifySegment(rawBaseName) || `preview-${index + 1}`;
  const outFileName = `${projectSlug}-${fileSlug}.webp`;
  const outFileAbs = path.join(webpOutDir, outFileName);
  const publicRelPath = `assets/images/projects/github/${outFileName}`;

  if (
    blobItem.sha &&
    prevShaMap.get(publicRelPath) === blobItem.sha &&
    fs.existsSync(outFileAbs)
  ) {
    return { publicRelPath, sha: blobItem.sha, cached: true };
  }

  const rawUrl = `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${encodeGitHubPath(blobItem.path)}`;
  const res = await fetch(rawUrl, {
    headers: { 'User-Agent': 'olivierbourgault-portfolio-v6-sync' }
  });
  if (!res.ok) {
    throw new Error(`Échec téléchargement ${rawUrl} (HTTP ${res.status})`);
  }
  const arrayBuffer = await res.arrayBuffer();
  const inputBuffer = Buffer.from(arrayBuffer);

  await sharp(inputBuffer, { animated: false })
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 84, effort: 5 })
    .toFile(outFileAbs);

  return { publicRelPath, sha: blobItem.sha || '', cached: false };
}

function inferTechTags(entryPath, tree) {
  const prefix = `${entryPath}/`;
  const tags = new Set();
  const lowerPath = entryPath.toLowerCase();

  if (lowerPath.includes('5c8') || lowerPath.includes('electrolib')) {
    tags.add('Angular');
    tags.add('Symfony');
  }
  if (lowerPath.includes('5d4') || lowerPath.includes('kaomia')) {
    tags.add('Vue.js');
    tags.add('Kotlin');
    tags.add('Node.js');
  }
  if (lowerPath.includes('4d6') || lowerPath.includes('evomeal')) {
    tags.add('Symfony');
    tags.add('PHP');
  }
  if (lowerPath.includes('hubai')) {
    tags.add('Python');
    tags.add('IA');
  }
  if (lowerPath.includes('comparetools') || lowerPath.includes('hoc-cdc')) {
    tags.add('PowerShell');
  }
  if (lowerPath.includes('shopro')) {
    tags.add('WordPress');
    tags.add('PHP');
  }

  for (const item of tree) {
    if (item.type !== 'blob' || !item.path || !item.path.startsWith(prefix)) continue;
    const f = item.path.toLowerCase();
    if (f.endsWith('.py') || f.endsWith('.ipynb')) tags.add('Python');
    if (f.endsWith('.ps1')) tags.add('PowerShell');
    if (f.endsWith('.cs') || f.endsWith('.csproj') || f.endsWith('.sln') || f.endsWith('.xaml'))
      tags.add('C# / .NET');
    if (f.endsWith('.ts') || f.endsWith('.tsx')) tags.add('TypeScript');
    if (f.endsWith('.vue')) tags.add('Vue.js');
    if (f.endsWith('angular.json')) tags.add('Angular');
    if (f.endsWith('.php') || f.endsWith('.twig')) tags.add('PHP');
    if (f.endsWith('composer.json')) tags.add('Symfony');
    if (f.endsWith('.kt') || f.endsWith('.gradle')) tags.add('Kotlin');
    if (f.endsWith('.dart')) tags.add('Flutter / Dart');
    if (f.endsWith('.cpp') || f.endsWith('.h')) tags.add('C++');
    if (f.endsWith('.sql')) tags.add('SQL');
    if (f.endsWith('.js') || f.endsWith('.jsx')) tags.add('JavaScript');
    if (f.endsWith('.html') || f.endsWith('.css')) tags.add('HTML / CSS');
  }

  return Array.from(tags).slice(0, 5);
}

async function main() {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.mkdirSync(webpOutDir, { recursive: true });

  const prevShaMap = new Map();
  const prevDescMap = new Map();
  if (fs.existsSync(outPath)) {
    try {
      const prev = JSON.parse(fs.readFileSync(outPath, 'utf8'));
      for (const proj of prev.projects || []) {
        if (proj.githubPreviewShas && typeof proj.githubPreviewShas === 'object') {
          for (const [k, v] of Object.entries(proj.githubPreviewShas)) {
            prevShaMap.set(k, v);
          }
        }
        if (proj.path && proj.description && proj.readmeSha) {
          prevDescMap.set(proj.path, {
            description: proj.description,
            readmeSha: proj.readmeSha
          });
        }
      }
    } catch {
      // Ignorer
    }
  }

  const treeApiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${BRANCH}?recursive=1`;

  try {
    const res = await fetch(treeApiUrl, {
      headers: { 'User-Agent': 'olivierbourgault-portfolio-v6-sync' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const tree = Array.isArray(data.tree) ? data.tree : [];
    const blobShaByPath = new Map(
      tree.filter((i) => i.type === 'blob' && i.path).map((i) => [i.path, i.sha || ''])
    );
    const parentReadmeTextCache = new Map();
    const baseRepo = `https://github.com/${OWNER}/${REPO}/tree/${BRANCH}`;

    const projects = [];
    let convertedCount = 0;
    let cachedCount = 0;
    let readmeSyncedCount = 0;

    for (const entry of tree) {
      if (entry.type !== 'tree' || !entry.path) continue;
      const parts = entry.path.split('/');
      let name = '';
      let parentPath = '';
      let filterClass = null;
      let categoryLabel = '';

      if (parts[0] === 'Personnels' && parts.length === 2) {
        name = parts[1];
        parentPath = 'Personnels';
        filterClass = 'filter-personal';
        categoryLabel = 'Personnels';
      } else if (parts[0] === 'Professionnels' && parts.length === 3) {
        const context = parts[1];
        name = parts[2];
        parentPath = `Professionnels/${context}`;
        filterClass = 'filter-professional';
        categoryLabel = `Professionnels • ${context}`;
      } else if (parts[0] === 'Scolaires' && parts.length === 4) {
        const school = parts[1];
        const course = parts[2];
        name = parts[3];
        const sessionCode = course.split('-')[0];
        parentPath = `Scolaires/${school}/${course}`;
        filterClass = 'filter-school';
        categoryLabel = `Scolaires • ${school} (${sessionCode})`;
      }

      if (!filterClass) continue;

      const previewBlobs = findProjectPreviewsInTree(tree, entry.path);
      const githubPreviews = [];
      const githubPreviewShas = {};

      for (let i = 0; i < previewBlobs.length; i++) {
        try {
          const { publicRelPath, sha, cached } = await convertGitHubPreviewToWebp(
            entry.path,
            previewBlobs[i],
            i,
            prevShaMap
          );
          githubPreviews.push(publicRelPath);
          if (sha) githubPreviewShas[publicRelPath] = sha;
          if (cached) cachedCount++;
          else convertedCount++;
        } catch (convErr) {
          console.warn(`Avertissement conversion WebP (${entry.path}): ${convErr.message}`);
        }
      }

      const ownReadmePath = `${entry.path}/README.md`;
      const parentReadmePath = `${parentPath}/README.md`;
      const hasReadme = blobShaByPath.has(ownReadmePath);
      const hasParentReadme = blobShaByPath.has(parentReadmePath);
      const combinedReadmeSha = `${blobShaByPath.get(ownReadmePath) || ''}:${blobShaByPath.get(parentReadmePath) || ''}`;

      let description = '';
      const prevDesc = prevDescMap.get(entry.path);
      if (prevDesc && prevDesc.readmeSha === combinedReadmeSha) {
        description = prevDesc.description;
      } else {
        if (hasReadme) {
          description = cleanReadmeDescription(await fetchRawGitHubText(ownReadmePath));
        }
        if (!description && hasParentReadme) {
          if (!parentReadmeTextCache.has(parentReadmePath)) {
            parentReadmeTextCache.set(
              parentReadmePath,
              await fetchRawGitHubText(parentReadmePath)
            );
          }
          description = extractProjectFromParentReadme(
            parentReadmeTextCache.get(parentReadmePath) || '',
            name
          );
        }
        if (description) readmeSyncedCount++;
      }

      projects.push({
        name,
        path: entry.path,
        parentPath,
        filterClass,
        categoryLabel,
        repoUrl: `${baseRepo}/${encodeGitHubPath(entry.path)}`,
        imageUrl: githubPreviews[0] || '',
        githubPreviews,
        githubPreviewShas,
        hasReadme,
        hasParentReadme,
        description,
        readmeSha: combinedReadmeSha,
        tags: inferTechTags(entry.path, tree)
      });
    }

    const payload = {
      generatedAt: new Date().toISOString(),
      totalCount: projects.length,
      projects
    };
    fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n', 'utf8');
    console.log(
      `Catalogue GitHub synchronisé : ${projects.length} projets, ${convertedCount} previews .webp (${cachedCount} en cache), ${readmeSyncedCount} descriptions README extraites.`
    );
  } catch (err) {
    if (fs.existsSync(outPath)) {
      console.warn(
        `API GitHub indisponible (${err.message}) — conservation du catalogue existant.`
      );
      return;
    }
    throw err;
  }
}

main();
