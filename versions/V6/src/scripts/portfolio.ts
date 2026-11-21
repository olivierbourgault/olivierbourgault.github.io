import { SITE } from '../data/site';
import { withBase } from '../utils/paths';
import { promoteCursorToTopLayer } from './cursor';
import { applyDomTranslations, getSiteLang } from './i18n';
import { refreshScrollReveal } from './reveal';
import { renderPortfolioVerticalNav } from './vnav';

interface GitTreeEntry {
  path?: string;
  type?: string;
}

interface RawProjectMeta {
  name: string;
  path: string;
  parentPath: string;
  filterClass: 'filter-personal' | 'filter-professional' | 'filter-school';
  categoryLabel: string;
  repoUrl: string;
  imageUrl: string;
  hasReadme: boolean;
  hasParentReadme: boolean;
  description?: string;
}

interface CachedPortfolioPayload {
  ts: number;
  projects: RawProjectMeta[];
}

const DEFAULT_VISIBLE_PROJECTS = 5;
const PORTFOLIO_CACHE_KEY = 'ob_v6_portfolio_tree_v2';
const PORTFOLIO_CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 heures
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
let extraProjects: RawProjectMeta[] = [];
const renderedPaths = new Set<string>();
const parentReadmeCache = new Map<string, string>();
let lastCountedProjects: Array<{ filterClass: string }> = [];

function isEmbeddedPreview(): boolean {
  try {
    if (new URLSearchParams(window.location.search).get('embed') === '1') return true;
    return window.self !== window.top;
  } catch {
    return true;
  }
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
  const local = LOCAL_PROJECT_IMAGES[projectName.toLowerCase()];
  if (local) return local;

  const prefix = `${projectPath}/`;
  const imageRegex = /\.(png|jpe?g|webp)$/i;
  const ignoredDirRegex =
    /\/(node_modules|vendor|obj|bin|\.gradle|build|dist|packages|Assets\.xcassets|res\/mipmap|res\/drawable|flutter_assets)\//i;
  const ignoredFileRegex =
    /(favicon|dotnet_bot|ic_launcher|adaptive[-_]?icon|app[-_]?icon|icon[-_]\d+|launch_background|splash)/i;

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

  return IMAGE_GENERIQUE;
}

function handleImageError(img: HTMLImageElement): void {
  img.onerror = null;
  img.src = IMAGE_GENERIQUE;
  img.classList.add('portfolio-img-generic');
}

function extractProjectsFromTree(tree: GitTreeEntry[], blobSet: Set<string>): RawProjectMeta[] {
  const projects: RawProjectMeta[] = [];
  const baseRepo = `https://github.com/${SITE.githubRepoOwner}/${SITE.githubRepoName}/tree/${SITE.githubBranch}`;

  for (const entry of tree) {
    if (entry.type !== 'tree' || !entry.path) continue;
    const parts = entry.path.split('/');

    let name = '';
    let parentPath = '';
    let filterClass: RawProjectMeta['filterClass'] | null = null;
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
      imageUrl: findProjectImageInTree(tree, entry.path, name),
      hasReadme: blobSet.has(`${entry.path}/README.md`),
      hasParentReadme: blobSet.has(`${parentPath}/README.md`)
    });
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

async function hydrateProjectDescription(project: RawProjectMeta, descEl: HTMLElement): Promise<void> {
  if (project.description) {
    descEl.textContent = project.description;
    return;
  }

  let description = '';
  if (project.hasReadme) {
    description = cleanReadmeDescription(await fetchRawGitHubText(`${project.path}/README.md`));
  }
  if (!description && project.hasParentReadme) {
    if (!parentReadmeCache.has(project.parentPath)) {
      parentReadmeCache.set(
        project.parentPath,
        await fetchRawGitHubText(`${project.parentPath}/README.md`)
      );
    }
    description = extractProjectFromParentReadme(
      parentReadmeCache.get(project.parentPath) || '',
      project.name
    );
  }
  if (!description) {
    const isEn = getSiteLang() === 'en';
    description = isEn
      ? `Project (${project.categoryLabel}) built by Olivier Bourgault. Visit the GitHub repository to explore the source code.`
      : `Projet ${project.categoryLabel.toLowerCase()} réalisé par Olivier Bourgault. Consultez le dépôt GitHub pour explorer le code source.`;
  }

  project.description = description;
  descEl.textContent = description;
}

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

function localizeCategoryLabel(frLabel: string, isEn: boolean): string {
  if (!isEn) return frLabel;
  return frLabel
    .replace(/^Personnels\b/, 'Personal')
    .replace(/^Professionnels\b/, 'Professional')
    .replace(/^Scolaires\b/, 'Academic')
    .replace(/• IA\b/, '• AI')
    .replace(/Chambre des Communes/g, 'House of Commons');
}

function syncPortfolioCardsLocale(): void {
  const isEn = getSiteLang() === 'en';
  document.querySelectorAll<HTMLElement>('#portfolioGrid .portfolio-item').forEach((item) => {
    const titleEl = item.querySelector<HTMLElement>('h3');
    const name = titleEl?.textContent?.trim();
    if (!name) return;

    const img = item.querySelector<HTMLImageElement>('.portfolio-image img');
    if (img) {
      img.alt = isEn ? `${name} project preview` : `Aperçu du projet ${name}`;
    }

    const previewLink = item.querySelector<HTMLAnchorElement>('a.preview-link');
    if (previewLink) {
      const previewLabel = isEn ? `Enlarge preview of ${name}` : `Agrandir l'aperçu de ${name}`;
      previewLink.setAttribute('aria-label', previewLabel);
      previewLink.setAttribute('title', previewLabel);
    }

    const detailsLink = item.querySelector<HTMLAnchorElement>('a.details-link');
    if (detailsLink) {
      const detailsLabel = isEn
        ? `View ${name} source code on GitHub`
        : `Voir le code source de ${name} sur GitHub`;
      detailsLink.setAttribute('aria-label', detailsLabel);
      detailsLink.setAttribute('title', detailsLabel);
    }

    const catEl = item.querySelector<HTMLElement>('.category');
    if (catEl) {
      if (!catEl.dataset.frCategory) {
        catEl.dataset.frCategory = catEl.textContent?.trim() || '';
      }
      if (catEl.dataset.frCategory) {
        catEl.textContent = localizeCategoryLabel(catEl.dataset.frCategory, isEn);
      }
    }
  });
}

function createPortfolioCardElement(project: RawProjectMeta, index: number): HTMLElement {
  const isEn = getSiteLang() === 'en';
  const displayCategory = localizeCategoryLabel(project.categoryLabel, isEn);
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
  img.alt = isEn ? `${project.name} project preview` : `Aperçu du projet ${project.name}`;
  img.className = 'img-fluid';
  if (img.src.endsWith(IMAGE_GENERIQUE) || img.src === IMAGE_GENERIQUE) {
    img.classList.add('portfolio-img-generic');
  }
  img.loading = 'lazy';
  img.decoding = 'async';
  img.addEventListener('error', () => handleImageError(img));

  const overlay = document.createElement('div');
  overlay.className = 'portfolio-overlay';

  const actions = document.createElement('div');
  actions.className = 'portfolio-actions';

  if (project.imageUrl && project.imageUrl !== IMAGE_GENERIQUE) {
    const previewLink = document.createElement('a');
    previewLink.href = project.imageUrl;
    previewLink.className = 'glightbox preview-link';
    previewLink.setAttribute('data-project-title', project.name);
    previewLink.setAttribute('data-project-category', displayCategory);
    const previewLabel = isEn
      ? `Enlarge preview of ${project.name}`
      : `Agrandir l'aperçu de ${project.name}`;
    previewLink.setAttribute('aria-label', previewLabel);
    previewLink.setAttribute('title', previewLabel);
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
  const detailsLabel = isEn
    ? `View ${project.name} source code on GitHub`
    : `Voir le code source de ${project.name} sur GitHub`;
  detailsLink.setAttribute('aria-label', detailsLabel);
  detailsLink.setAttribute('title', detailsLabel);
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
  categorySpan.dataset.frCategory = project.categoryLabel;
  categorySpan.textContent = displayCategory;

  const title = document.createElement('h3');
  title.textContent = project.name;

  const descriptionP = document.createElement('p');
  descriptionP.className = 'text-break';
  descriptionP.textContent =
    project.description ||
    (isEn
      ? `Project (${project.categoryLabel}) by Olivier Bourgault.`
      : `Projet ${project.categoryLabel.toLowerCase()} réalisé par Olivier Bourgault.`);

  content.appendChild(categorySpan);
  content.appendChild(title);
  content.appendChild(descriptionP);

  card.appendChild(imageWrapper);
  card.appendChild(content);
  itemCol.appendChild(card);

  void hydrateProjectDescription(project, descriptionP);

  return itemCol;
}

function projectMatchesFilter(filterClass: string): boolean {
  if (!currentFilter || currentFilter === '*') return true;
  return `.${filterClass}` === currentFilter;
}

function materializeNeededCards(container: HTMLElement): void {
  const existingMatching = Array.from(
    container.querySelectorAll<HTMLElement>('.portfolio-item')
  ).filter((item) => !currentFilter || currentFilter === '*' || item.matches(currentFilter));

  const neededCount = portfolioShowAll
    ? Infinity
    : Math.max(0, DEFAULT_VISIBLE_PROJECTS - existingMatching.length);

  if (neededCount <= 0) return;

  let nextIdx = container.querySelectorAll('.portfolio-item').length;
  let appended = 0;

  for (const project of extraProjects) {
    if (appended >= neededCount) break;
    const key = project.path.toLowerCase();
    if (renderedPaths.has(key)) continue;
    if (!projectMatchesFilter(project.filterClass)) continue;

    container.appendChild(createPortfolioCardElement(project, nextIdx++));
    renderedPaths.add(key);
    appended++;
  }
}

function applyPortfolioFilterWithLimit(): void {
  const container = document.getElementById('portfolioGrid');
  if (!container) return;

  materializeNeededCards(container);

  const allItems = Array.from(container.querySelectorAll<HTMLElement>('.portfolio-item'));
  const matchingDom =
    !currentFilter || currentFilter === '*'
      ? allItems
      : allItems.filter((item) => item.matches(currentFilter));

  const unrenderedMatchingCount = extraProjects.filter(
    (p) => !renderedPaths.has(p.path.toLowerCase()) && projectMatchesFilter(p.filterClass)
  ).length;
  const totalMatching = matchingDom.length + unrenderedMatchingCount;

  const visibleItems = portfolioShowAll
    ? matchingDom
    : matchingDom.slice(0, DEFAULT_VISIBLE_PROJECTS);
  const visibleSet = new Set(visibleItems);

  allItems.forEach((item) => {
    item.classList.toggle('d-none', !visibleSet.has(item));
  });

  const btnWrap = document.getElementById('portfolioShowMoreWrap');
  const btn = document.getElementById('portfolioShowMoreBtn');
  if (btnWrap && btn) {
    if (totalMatching <= DEFAULT_VISIBLE_PROJECTS) {
      btnWrap.classList.add('d-none');
    } else {
      btnWrap.classList.remove('d-none');
      const remaining = totalMatching - DEFAULT_VISIBLE_PROJECTS;
      const isEn = getSiteLang() === 'en';
      btn.innerHTML = portfolioShowAll
        ? `<i class="bi bi-chevron-up me-2" aria-hidden="true"></i>${isEn ? 'Show Top 5 Projects' : 'Réduire à 5 projets'}`
        : `<i class="bi bi-grid-3x3-gap-fill me-2" aria-hidden="true"></i>${isEn ? `Show More (+${remaining})` : `Voir plus (+${remaining})`}`;
    }
  }

  renderPortfolioVerticalNav(visibleItems);
  refreshScrollReveal();
}

function initNativeLightbox(): void {
  const dialog = document.getElementById('portfolioLightboxDialog') as HTMLDialogElement | null;
  const imgEl = document.getElementById('lightboxDialogImg') as HTMLImageElement | null;
  const titleEl = document.getElementById('lightboxDialogTitle');
  const subEl = document.getElementById('lightboxDialogSub');
  const grid = document.getElementById('portfolioGrid');
  if (!dialog || !imgEl || !grid) return;

  grid.addEventListener('click', (e) => {
    const link = (e.target as Element | null)?.closest<HTMLAnchorElement>('a.glightbox.preview-link');
    if (!link) return;
    e.preventDefault();

    const isEn = getSiteLang() === 'en';
    const card = link.closest('.portfolio-card');
    const title =
      link.getAttribute('data-project-title') ||
      card?.querySelector('h3')?.textContent?.trim() ||
      (isEn ? 'Project Preview' : 'Aperçu du projet');
    const category =
      card?.querySelector('.category')?.textContent?.trim() ||
      link.getAttribute('data-project-category') ||
      'Portfolio';

    imgEl.src = link.href;
    imgEl.alt = title;
    if (titleEl) titleEl.textContent = title;
    if (subEl) subEl.textContent = category;

    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
      promoteCursorToTopLayer();
    }
  });
}

function registerGitHubProjects(projects: RawProjectMeta[]): void {
  const container = document.getElementById('portfolioGrid');
  if (!container) return;

  // Fusionner les projets pré-rendus + les projets GitHub pour un comptage exact sans doublons
  const mergedForCount: Array<{ filterClass: string }> = [];
  const countedPaths = new Set<string>();

  container.querySelectorAll<HTMLElement>('.portfolio-item').forEach((item) => {
    const key = (item.dataset.projectPath || '').toLowerCase();
    if (key) {
      renderedPaths.add(key);
      countedPaths.add(key);
    }
    const cls = item.classList.contains('filter-personal')
      ? 'filter-personal'
      : item.classList.contains('filter-professional')
        ? 'filter-professional'
        : 'filter-school';
    mergedForCount.push({ filterClass: cls });
  });

  extraProjects = [];
  for (const p of projects) {
    const key = p.path.toLowerCase();
    if (countedPaths.has(key)) continue;
    countedPaths.add(key);
    mergedForCount.push({ filterClass: p.filterClass });
    extraProjects.push(p);
  }

  updateProjectCounters(mergedForCount);
  applyPortfolioFilterWithLimit();
}

async function loadGitHubPortfolio(): Promise<void> {
  if (isEmbeddedPreview()) return;

  const statusEl = document.getElementById('portfolioSyncStatus');

  try {
    const cachedRaw = localStorage.getItem(PORTFOLIO_CACHE_KEY);
    if (cachedRaw) {
      const parsed = JSON.parse(cachedRaw) as CachedPortfolioPayload;
      if (
        parsed &&
        Array.isArray(parsed.projects) &&
        parsed.projects.length > 0 &&
        Date.now() - parsed.ts < PORTFOLIO_CACHE_TTL_MS
      ) {
        registerGitHubProjects(parsed.projects);
        if (statusEl) statusEl.textContent = '';
        return;
      }
    }
  } catch {
    // Ignorer lecture cache impossible
  }

  const treeApiUrl = `https://api.github.com/repos/${SITE.githubRepoOwner}/${SITE.githubRepoName}/git/trees/${SITE.githubBranch}?recursive=1`;

  try {
    if (statusEl) {
      statusEl.textContent =
        getSiteLang() === 'en'
          ? 'Syncing GitHub repositories…'
          : 'Synchronisation des dépôts GitHub…';
    }
    const response = await fetch(treeApiUrl);
    if (!response.ok) {
      throw new Error(`GitHub Git Trees API error: ${response.status}`);
    }

    const data = (await response.json()) as { tree?: GitTreeEntry[] };
    const tree = Array.isArray(data.tree) ? data.tree : [];
    const blobSet = new Set(
      tree.filter((item) => item.type === 'blob' && item.path).map((item) => item.path!)
    );

    const projects = extractProjectsFromTree(tree, blobSet);

    try {
      const payload: CachedPortfolioPayload = { ts: Date.now(), projects };
      localStorage.setItem(PORTFOLIO_CACHE_KEY, JSON.stringify(payload));
    } catch {
      // Ignorer quota localStorage
    }

    registerGitHubProjects(projects);
    if (statusEl) statusEl.textContent = '';
  } catch {
    if (statusEl) {
      statusEl.textContent =
        getSiteLang() === 'en'
          ? 'Showing featured projects offline (GitHub API unavailable).'
          : 'Affichage des projets phares hors ligne (API GitHub indisponible).';
    }
  }
}

export function initPortfolio(): void {
  document.querySelectorAll<HTMLImageElement>('#portfolioGrid .portfolio-image img').forEach((img) => {
    img.addEventListener('error', () => handleImageError(img));
  });

  const filtersList = document.getElementById('filters');
  filtersList?.addEventListener('click', (e) => {
    const btn = (e.target as Element | null)?.closest<HTMLButtonElement>('button[data-filter]');
    if (!btn) return;
    filtersList.querySelectorAll<HTMLButtonElement>('button[data-filter]').forEach((el) => {
      const isCurrent = el === btn;
      el.classList.toggle('filter-active', isCurrent);
      el.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
    });
    currentFilter = btn.getAttribute('data-filter') || '*';
    portfolioShowAll = false;
    applyPortfolioFilterWithLimit();
  });

  const showMoreBtn = document.getElementById('portfolioShowMoreBtn');
  showMoreBtn?.addEventListener('click', () => {
    portfolioShowAll = !portfolioShowAll;
    applyPortfolioFilterWithLimit();
  });

  initNativeLightbox();
  syncPortfolioCardsLocale();
  applyPortfolioFilterWithLimit();
  void loadGitHubPortfolio();

  window.addEventListener('ob:langchange', () => {
    if (lastCountedProjects.length > 0) {
      updateProjectCounters(lastCountedProjects);
    }
    syncPortfolioCardsLocale();
    applyPortfolioFilterWithLimit();
    applyDomTranslations(document.getElementById('portfolio') || document.body);
  });
}
