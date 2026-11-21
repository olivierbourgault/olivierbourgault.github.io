import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const v6Root = path.resolve(__dirname, '..');
const outPath = path.join(v6Root, 'public', 'assets', 'data', 'github-projects.json');

const OWNER = 'RinoShip77';
const REPO = 'MesProjets';
const BRANCH = 'main';

const IGNORED_IMAGE_PATTERNS = [
  /(?:^|\/)favicon[^/]*$/i,
  /(?:^|\/)dotnet_bot[^/]*$/i,
  /(?:^|\/)ic_launcher[^/]*$/i,
  /(?:^|\/)adaptive-icon[^/]*$/i,
  /(?:^|\/)appicon[^/]*$/i,
  /(?:^|\/)splash[^/]*$/i,
  /(?:^|\/)logo-?react[^/]*$/i,
  /(?:^|\/)vite\.svg$/i
];

function encodeGitHubPath(p) {
  return p.split('/').map(encodeURIComponent).join('/');
}

function findProjectImageInTree(tree, projectPath) {
  const prefix = `${projectPath}/`;
  const imageRegex = /\.(png|jpe?g|gif|webp)$/i;
  const candidates = tree.filter((item) => {
    if (item.type !== 'blob' || !item.path) return false;
    if (!item.path.startsWith(prefix) || !imageRegex.test(item.path)) return false;
    const rel = item.path.slice(prefix.length);
    return !IGNORED_IMAGE_PATTERNS.some((rx) => rx.test(rel));
  });

  if (candidates.length === 0) return '';

  candidates.sort((a, b) => {
    const relA = (a.path || '').slice(prefix.length);
    const relB = (b.path || '').slice(prefix.length);
    const fileA = (relA.split('/').pop() || '').toLowerCase();
    const fileB = (relB.split('/').pop() || '').toLowerCase();
    const priorityRegex = /^(preview|screenshot|demo|accueil|ecran-depart|banner|cover)\./;
    const prioA = priorityRegex.test(fileA) ? 0 : 1;
    const prioB = priorityRegex.test(fileB) ? 0 : 1;
    if (prioA !== prioB) return prioA - prioB;
    const depthA = relA.split('/').length;
    const depthB = relB.split('/').length;
    if (depthA !== depthB) return depthA - depthB;
    return relA.localeCompare(relB);
  });

  return `https://raw.githubusercontent.com/${OWNER}/${REPO}/${BRANCH}/${encodeGitHubPath(candidates[0].path)}`;
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
    if (f.endsWith('.cs') || f.endsWith('.csproj') || f.endsWith('.sln') || f.endsWith('.xaml')) tags.add('C# / .NET');
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
  const treeApiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/git/trees/${BRANCH}?recursive=1`;

  try {
    const res = await fetch(treeApiUrl, {
      headers: { 'User-Agent': 'olivierbourgault-portfolio-v6-sync' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const tree = Array.isArray(data.tree) ? data.tree : [];
    const blobSet = new Set(tree.filter((i) => i.type === 'blob' && i.path).map((i) => i.path));
    const baseRepo = `https://github.com/${OWNER}/${REPO}/tree/${BRANCH}`;

    const projects = [];
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

      projects.push({
        name,
        path: entry.path,
        parentPath,
        filterClass,
        categoryLabel,
        repoUrl: `${baseRepo}/${encodeGitHubPath(entry.path)}`,
        imageUrl: findProjectImageInTree(tree, entry.path),
        hasReadme: blobSet.has(`${entry.path}/README.md`),
        hasParentReadme: blobSet.has(`${parentPath}/README.md`),
        tags: inferTechTags(entry.path, tree)
      });
    }

    const payload = {
      generatedAt: new Date().toISOString(),
      totalCount: projects.length,
      projects
    };
    fs.writeFileSync(outPath, JSON.stringify(payload, null, 2) + '\n', 'utf8');
    console.log(`Catalogue GitHub synchronisé : ${projects.length} projets écrits dans public/assets/data/github-projects.json`);
  } catch (err) {
    if (fs.existsSync(outPath)) {
      console.warn(`API GitHub indisponible (${err.message}) — conservation du catalogue existant.`);
      return;
    }
    throw err;
  }
}

main();
