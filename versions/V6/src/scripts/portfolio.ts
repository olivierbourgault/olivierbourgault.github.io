import AOS from 'aos';
import GLightbox from 'glightbox';
import { SITE } from '../data/site';
import { withBase } from '../utils/paths';
import { applyDomTranslations, getSiteLang } from './i18n';
import { renderPortfolioVerticalNav } from './vnav';

interface GitTreeEntry {
  path?: string;
  type?: string;
}

interface ResolvedProject {
  name: string;
  path: string;
  parentPath: string;
  filterClass: 'filter-personal' | 'filter-professional' | 'filter-school';
  categoryLabel: string;
  repoUrl: string;
  imageUrl: string;
  description: string;
}

const DEFAULT_VISIBLE_PROJECTS = 5;
const PORTFOLIO_CACHE_KEY = 'ob_v6_portfolio_projects_cache';
const IMAGE_GENERIQUE = withBase('assets/images/logos/logo-ob-tech.svg');

const LOCAL_PROJECT_IMAGES: Record<string, string> = {
  electrolib: withBase('assets/images/projects/electrolib.webp'),
  comparetools: withBase('assets/images/projects/compare-tools.webp'),
  hubai: withBase('assets/images/projects/hub-ai.webp'),
  kaomia: withBase('assets/images/projects/kaomia.webp'),
  evomeal: withBase('assets/images/projects/evomeal.webp'),
  shopro: withBase('assets/images/projects/shopro.webp'),
  phoneword: withBase('assets/images/projects/phoneword.webp')
};

let portfolioShowAll = false;
let currentFilter = '*';
let lightboxInstance: ReturnType<typeof GLightbox> | null = null;

function refreshLightbox(): void {
  try {
    lightboxInstance?.destroy();
  } catch {
    // Ignorer si destroy indisponible
  }
  lightboxInstance = GLightbox({ selector: '.glightbox' });
}

function encodeGitHubPath(repoPath: string): string {
  return repoPath
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

function cleanReadmeDescription(rawMarkdown: string): string {
  if (!rawMarkdown || typeof rawMarkdown !== 'string') return '';
  const withoutCodeBlocks = rawMarkdown.replace(/```[\s\S]*?```/g, '');
  const lines = withoutCodeBlocks.split(/\r?\n/);

  const paragraphLines: string[] = [];
  let collecting = false;

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      if (collecting) break;
      continue;
    }

    if (
      /^\s*#+/.test(trimmed) ||
      /^\s*[-*_]{3,}\s*$/.test(trimmed) ||
      /^\s*\|/.test(trimmed) ||
      /^!\[[^\]]*\]\([^)]*\)$/.test(trimmed) ||
      /^(Prénom|Nom|Matricule|Équipier|Name|Author|Last edit)\s*:/i.test(trimmed) ||
      /^(SHORT DESCRIPTION|LONG DESCRIPTION|NOTES)\s*:/i.test(trimmed)
    ) {
      if (collecting) break;
      continue;
    }

    collecting = true;
    paragraphLines.push(trimmed);
  }

  if (paragraphLines.length === 0) return '';

  let cleaned = paragraphLines.join(' ');
  cleaned = cleaned.replace(/!\[[^\]]*\]\([^)]+\)/g, '');
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  cleaned = cleaned.replace(/<[^>]+>/g, ' ');
  cleaned = cleaned.replace(/(\*{1,3}|`+)/g, '');
  cleaned = cleaned.replace(/(^|[^\w/])_{1,3}|_{1,3}([^\w/]|$)/g, '$1$2');
  cleaned = cleaned.replace(/^>?\s*(?:\d+(?:\.\d+)*[.)]\s*|[-*•]\s*)/, '');
  return cleaned.replace(/\s+/g, ' ').trim();
}

function extractProjectFromParentReadme(parentMarkdown: string, projectName: string): string {
  if (!parentMarkdown || !projectName) return '';
  const escapedName = projectName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const linkLineRegex = new RegExp(`^.*\\]\\(${escapedName}\\/?\\).*$`, 'im');
  const linkMatch = parentMarkdown.match(linkLineRegex);
  if (linkMatch) {
    const cleaned = cleanReadmeDescription(linkMatch[0]);
    if (cleaned) return cleaned;
  }

  const lines = parentMarkdown.split(/\r?\n/);
  const headingRegex = new RegExp(
    `^\\s*(?:>\\s*)?(?:\\d+(?:\\.\\d+)*[.)]|#+)\\s*(?:\\[?[*_]*${escapedName}[*_]*\\]?)\\s*$`,
    'i'
  );
  for (let i = 0; i < lines.length; i++) {
    if (headingRegex.test(lines[i].trim())) {
      const rest = lines.slice(i + 1).join('\n');
      const cleaned = cleanReadmeDescription(rest);
      if (cleaned) return cleaned;
    }
  }
  return '';
}

function findProjectImageInTree(tree: GitTreeEntry[], projectPath: string, projectName: string): string {
  const prefix = `${projectPath}/`;
  const imageRegex = /\.(png|jpe?g|webp|gif|ico)$/i;
  const ignoredDirRegex =
    /\/(node_modules|vendor|obj|bin|\.gradle|build|dist|packages|Assets\.xcassets|res\/mipmap|res\/drawable|flutter_assets)\//i;
  const ignoredFileRegex = /(icon-\d+|app_icon|launch_background)/i;

  const candidates = tree.filter((item) => {
    if (item.type !== 'blob' || !item.path || !item.path.startsWith(prefix)) return false;
    if (!imageRegex.test(item.path)) return false;
    const relativePath = item.path.slice(prefix.length);
    if (ignoredDirRegex.test(`/${relativePath}`)) return false;
    if (ignoredFileRegex.test(relativePath)) return false;
    return true;
  });

  if (candidates.length > 0) {
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

    return `https://raw.githubusercontent.com/${SITE.githubRepoOwner}/${SITE.githubRepoName}/${SITE.githubBranch}/${encodeGitHubPath(candidates[0].path!)}`;
  }

  return LOCAL_PROJECT_IMAGES[projectName.toLowerCase()] || IMAGE_GENERIQUE;
}

function handleImageError(img: HTMLImageElement): void {
  img.onerror = null;
  img.src = IMAGE_GENERIQUE;
  img.classList.add('portfolio-img-generic');
}

function extractProjectsFromTree(tree: GitTreeEntry[]): Omit<ResolvedProject, 'description'>[] {
  const projects: Omit<ResolvedProject, 'description'>[] = [];
  const baseRepo = `https://github.com/${SITE.githubRepoOwner}/${SITE.githubRepoName}/tree/${SITE.githubBranch}`;

  for (const entry of tree) {
    if (entry.type !== 'tree' || !entry.path) continue;
    const parts = entry.path.split('/');

    if (parts[0] === 'Personnels' && parts.length === 2) {
      const name = parts[1];
      projects.push({
        name,
        path: entry.path,
        parentPath: 'Personnels',
        filterClass: 'filter-personal',
        categoryLabel: 'Personnels',
        repoUrl: `${baseRepo}/${encodeGitHubPath(entry.path)}`,
        imageUrl: findProjectImageInTree(tree, entry.path, name)
      });
    } else if (parts[0] === 'Professionnels' && parts.length === 3) {
      const context = parts[1];
      const name = parts[2];
      projects.push({
        name,
        path: entry.path,
        parentPath: `Professionnels/${context}`,
        filterClass: 'filter-professional',
        categoryLabel: `Professionnels • ${context}`,
        repoUrl: `${baseRepo}/${encodeGitHubPath(entry.path)}`,
        imageUrl: findProjectImageInTree(tree, entry.path, name)
      });
    } else if (parts[0] === 'Scolaires' && parts.length === 4) {
      const school = parts[1];
      const course = parts[2];
      const name = parts[3];
      const sessionCode = course.split('-')[0];
      projects.push({
        name,
        path: entry.path,
        parentPath: `Scolaires/${school}/${course}`,
        filterClass: 'filter-school',
        categoryLabel: `Scolaires • ${school} (${sessionCode})`,
        repoUrl: `${baseRepo}/${encodeGitHubPath(entry.path)}`,
        imageUrl: findProjectImageInTree(tree, entry.path, name)
      });
    }
  }

  return projects;
}

async function fetchRawGitHubText(repoPath: string): Promise<string> {
  try {
    const url = `https://raw.githubusercontent.com/${SITE.githubRepoOwner}/${SITE.githubRepoName}/${SITE.githubBranch}/${encodeGitHubPath(repoPath)}`;
    const res = await fetch(url);
    if (!res.ok) return '';
    return await res.text();
  } catch {
    return '';
  }
}

let lastCountedProjects: Array<{ filterClass: string }> = [];

function updateProjectCounters(projects: Array<{ filterClass: string }>): void {
  lastCountedProjects = projects;
  const totalCount = projects.length;
  const schoolCount = projects.filter((p) => p.filterClass === 'filter-school').length;
  const proCount = projects.filter((p) => p.filterClass === 'filter-professional').length;
  const personalCount = projects.filter((p) => p.filterClass === 'filter-personal').length;

  const projectCounterEl = document.getElementById('projectsCount');
  if (projectCounterEl) {
    projectCounterEl.textContent = String(totalCount);
  }

  const isEn = getSiteLang() === 'en';
  const filterLabels: Record<string, string> = isEn
    ? {
        '*': `All (${totalCount})`,
        '.filter-school': `Academic (${schoolCount})`,
        '.filter-professional': `Professional (${proCount})`,
        '.filter-personal': `Personal (${personalCount})`
      }
    : {
        '*': `Tout (${totalCount})`,
        '.filter-school': `Scolaires (${schoolCount})`,
        '.filter-professional': `Professionnels (${proCount})`,
        '.filter-personal': `Personnels (${personalCount})`
      };

  document.querySelectorAll<HTMLElement>('#filters [data-filter]').forEach((btn) => {
    const key = btn.getAttribute('data-filter') || '';
    if (filterLabels[key]) {
      btn.textContent = filterLabels[key];
    }
  });
}

function createPortfolioCardElement(project: ResolvedProject, index: number): HTMLElement {
  const itemCol = document.createElement('div');
  itemCol.id = `portfolio-item-${index}`;
  itemCol.className = `col-lg-6 col-md-6 portfolio-item ${project.filterClass}`;
  itemCol.dataset.projectPath = project.path;

  const card = document.createElement('div');
  card.className = 'portfolio-card';

  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'portfolio-image';

  const img = document.createElement('img');
  img.src = project.imageUrl || IMAGE_GENERIQUE;
  img.alt = `Aperçu du projet ${project.name}`;
  img.className = 'img-fluid';
  if (img.src.endsWith(IMAGE_GENERIQUE) || img.src === IMAGE_GENERIQUE) {
    img.classList.add('portfolio-img-generic');
  }
  img.loading = 'lazy';
  img.addEventListener('error', () => handleImageError(img));

  const overlay = document.createElement('div');
  overlay.className = 'portfolio-overlay';

  const actions = document.createElement('div');
  actions.className = 'portfolio-actions';

  if (project.imageUrl && project.imageUrl !== IMAGE_GENERIQUE) {
    const previewLink = document.createElement('a');
    previewLink.href = project.imageUrl;
    previewLink.className = 'glightbox preview-link';
    previewLink.setAttribute('data-gallery', `portfolio-gallery-${project.filterClass}`);
    previewLink.setAttribute('aria-label', `Agrandir l'aperçu de ${project.name}`);
    previewLink.setAttribute('title', `Agrandir l'aperçu de ${project.name}`);
    const eyeIcon = document.createElement('i');
    eyeIcon.className = 'bi bi-eye';
    eyeIcon.setAttribute('aria-hidden', 'true');
    previewLink.appendChild(eyeIcon);
    actions.appendChild(previewLink);
  }

  const detailsLink = document.createElement('a');
  detailsLink.href = project.repoUrl;
  detailsLink.target = '_blank';
  detailsLink.rel = 'noopener noreferrer';
  detailsLink.className = 'details-link';
  detailsLink.setAttribute('aria-label', `Voir le code source de ${project.name} sur GitHub`);
  detailsLink.setAttribute('title', `Voir le code source de ${project.name} sur GitHub`);
  const arrowIcon = document.createElement('i');
  arrowIcon.className = 'bi bi-arrow-right';
  arrowIcon.setAttribute('aria-hidden', 'true');
  detailsLink.appendChild(arrowIcon);

  actions.appendChild(detailsLink);
  overlay.appendChild(actions);
  imageWrapper.appendChild(img);
  imageWrapper.appendChild(overlay);

  const content = document.createElement('div');
  content.className = 'portfolio-content';

  const categorySpan = document.createElement('span');
  categorySpan.className = 'category';
  categorySpan.textContent = project.categoryLabel;

  const title = document.createElement('h3');
  title.textContent = project.name;

  const descriptionP = document.createElement('p');
  descriptionP.className = 'text-break';
  descriptionP.textContent = project.description;

  content.appendChild(categorySpan);
  content.appendChild(title);
  content.appendChild(descriptionP);

  card.appendChild(imageWrapper);
  card.appendChild(content);
  itemCol.appendChild(card);

  return itemCol;
}

function applyPortfolioFilterWithLimit(): void {
  const container = document.getElementById('portfolioGrid');
  if (!container) return;

  const allItems = Array.from(container.querySelectorAll<HTMLElement>('.portfolio-item'));
  const matching =
    !currentFilter || currentFilter === '*'
      ? allItems
      : allItems.filter((item) => item.matches(currentFilter));

  const visibleItems = portfolioShowAll
    ? matching
    : matching.slice(0, DEFAULT_VISIBLE_PROJECTS);
  const visibleSet = new Set(visibleItems);

  allItems.forEach((item) => {
    item.classList.toggle('d-none', !visibleSet.has(item));
  });

  // Mettre à jour le bouton Voir plus (+N)
  const btnWrap = document.getElementById('portfolioShowMoreWrap');
  const btn = document.getElementById('portfolioShowMoreBtn');
  if (btnWrap && btn) {
    if (matching.length <= DEFAULT_VISIBLE_PROJECTS) {
      btnWrap.classList.add('d-none');
    } else {
      btnWrap.classList.remove('d-none');
      const remaining = matching.length - DEFAULT_VISIBLE_PROJECTS;
      const isEn = getSiteLang() === 'en';
      btn.innerHTML = portfolioShowAll
        ? `<i class="bi bi-chevron-up me-2" aria-hidden="true"></i>${isEn ? 'Show Top 5 Projects' : 'Réduire à 5 projets'}`
        : `<i class="bi bi-grid-3x3-gap-fill me-2" aria-hidden="true"></i>${isEn ? `Show More (+${remaining})` : `Voir plus (+${remaining})`}`;
    }
  }

  renderPortfolioVerticalNav(visibleItems);
  AOS.refreshHard();
}

function renderPortfolioProjects(projects: ResolvedProject[]): void {
  updateProjectCounters(projects);

  const container = document.getElementById('portfolioGrid');
  if (!container) return;

  const existingItems = Array.from(container.querySelectorAll<HTMLElement>('.portfolio-item'));
  const existingPaths = new Set(
    existingItems.map((item) => (item.dataset.projectPath || '').toLowerCase()).filter(Boolean)
  );

  let added = 0;
  let nextIdx = existingItems.length;
  for (const project of projects) {
    if (existingPaths.has(project.path.toLowerCase())) continue;
    container.appendChild(createPortfolioCardElement(project, nextIdx++));
    existingPaths.add(project.path.toLowerCase());
    added++;
  }

  applyPortfolioFilterWithLimit();
  if (added > 0) {
    refreshLightbox();
  }
}

async function loadGitHubPortfolio(): Promise<void> {
  const statusEl = document.getElementById('portfolioSyncStatus');

  try {
    const cachedRaw = sessionStorage.getItem(PORTFOLIO_CACHE_KEY);
    if (cachedRaw) {
      const cached = JSON.parse(cachedRaw) as ResolvedProject[];
      if (Array.isArray(cached) && cached.length > 0) {
        renderPortfolioProjects(cached);
        if (statusEl) statusEl.textContent = '';
        return;
      }
    }
  } catch {
    // Ignorer lecture cache impossible
  }

  const treeApiUrl = `https://api.github.com/repos/${SITE.githubRepoOwner}/${SITE.githubRepoName}/git/trees/${SITE.githubBranch}?recursive=1`;

  try {
    if (statusEl) statusEl.textContent = 'Synchronisation des dépôts GitHub…';
    const response = await fetch(treeApiUrl);
    if (!response.ok) {
      throw new Error(`GitHub Git Trees API error: ${response.status}`);
    }

    const data = (await response.json()) as { tree?: GitTreeEntry[] };
    const tree = Array.isArray(data.tree) ? data.tree : [];
    const blobSet = new Set(
      tree.filter((item) => item.type === 'blob' && item.path).map((item) => item.path!)
    );

    const projects = extractProjectsFromTree(tree);
    updateProjectCounters(projects);

    const parentReadmeCache = new Map<string, string>();
    const uniqueParentPaths = [...new Set(projects.map((p) => p.parentPath))];
    await Promise.all(
      uniqueParentPaths.map(async (parentPath) => {
        const readmePath = `${parentPath}/README.md`;
        if (blobSet.has(readmePath)) {
          parentReadmeCache.set(parentPath, await fetchRawGitHubText(readmePath));
        }
      })
    );

    const resolvedProjects: ResolvedProject[] = await Promise.all(
      projects.map(async (project) => {
        let description = '';
        const projectReadmePath = `${project.path}/README.md`;

        if (blobSet.has(projectReadmePath)) {
          description = cleanReadmeDescription(await fetchRawGitHubText(projectReadmePath));
        }
        if (!description && parentReadmeCache.has(project.parentPath)) {
          description = extractProjectFromParentReadme(
            parentReadmeCache.get(project.parentPath) || '',
            project.name
          );
        }
        if (!description) {
          description = `Projet ${project.categoryLabel.toLowerCase()} réalisé par Olivier Bourgault. Consultez le dépôt GitHub pour explorer le code source.`;
        }
        return { ...project, description };
      })
    );

    try {
      sessionStorage.setItem(PORTFOLIO_CACHE_KEY, JSON.stringify(resolvedProjects));
    } catch {
      // Ignorer quota sessionStorage
    }

    renderPortfolioProjects(resolvedProjects);
    if (statusEl) statusEl.textContent = '';
  } catch {
    if (statusEl) {
      statusEl.textContent = 'Affichage des projets phares hors ligne (API GitHub indisponible).';
    }
  }
}

export function initPortfolio(): void {
  // Fallback erreur image sur les 6 cartes pré-rendues
  document.querySelectorAll<HTMLImageElement>('#portfolioGrid .portfolio-image img').forEach((img) => {
    img.addEventListener('error', () => handleImageError(img));
  });

  // Filtres (Tout / Scolaires / Professionnels / Personnels)
  const filtersList = document.getElementById('filters');
  filtersList?.addEventListener('click', (e) => {
    const li = (e.target as Element | null)?.closest<HTMLElement>('li[data-filter]');
    if (!li) return;
    filtersList.querySelectorAll('.filter-active').forEach((el) => el.classList.remove('filter-active'));
    li.classList.add('filter-active');
    currentFilter = li.getAttribute('data-filter') || '*';
    portfolioShowAll = false;
    applyPortfolioFilterWithLimit();
  });

  // Bouton Voir plus (+N) / Réduire à 5 projets
  const showMoreBtn = document.getElementById('portfolioShowMoreBtn');
  showMoreBtn?.addEventListener('click', () => {
    portfolioShowAll = !portfolioShowAll;
    applyPortfolioFilterWithLimit();
  });

  applyPortfolioFilterWithLimit();
  refreshLightbox();
  void loadGitHubPortfolio();

  window.addEventListener('ob:langchange', () => {
    if (lastCountedProjects.length > 0) {
      updateProjectCounters(lastCountedProjects);
    }
    applyPortfolioFilterWithLimit();
    applyDomTranslations(document.getElementById('portfolio') || document.body);
  });
}
