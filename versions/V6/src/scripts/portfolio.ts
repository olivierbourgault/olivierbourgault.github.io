import { FALLBACK_PROJECTS, type FallbackProject } from '../data/projects';
import { SITE } from '../data/site';
import { withBase } from '../utils/paths';
import { copyTextToClipboard } from './clipboard';
import { promoteCursorToTopLayer } from './cursor';
import { applyDomTranslations, getSiteLang } from './i18n';
import { refreshScrollReveal } from './reveal';
import { renderPortfolioVerticalNav } from './vnav';

const DEFAULT_VISIBLE_PROJECTS = 5;
const IMAGE_GENERIQUE = withBase('assets/images/logos/logo-ob-tech.svg');
const STATIC_CATALOG_URL = withBase('assets/data/github-projects.json');
const PORTFOLIO_CACHE_KEY = 'ob_v6_portfolio_tree_v4';
const PORTFOLIO_CACHE_TTL_MS = 1000 * 60 * 60 * 12; // 12 heures

let portfolioShowAll = false;
let currentFilter = '*';
let currentTechTag = '*';
let currentSearchQuery = '';
let activeCaseStudyProject: FallbackProject | null = null;
let lastCountedProjects: Array<{ filterClass: string }> = [];

const LOCAL_IMAGE_BY_PATH = new Map<string, string>(
  FALLBACK_PROJECTS.map((p): [string, string] => [p.path.toLowerCase(), withBase(p.image)])
);

const webpBlobCache = new Map<string, string>();

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
  githubPreviews?: string[];
  hasReadme: boolean;
  hasParentReadme: boolean;
  tags?: string[];
  description?: string;
}

interface CachedPortfolioPayload {
  ts: number;
  projects: RawProjectMeta[];
}

interface StaticCatalogPayload {
  generatedAt?: string;
  totalCount?: number;
  projects?: RawProjectMeta[];
}

interface CarouselState {
  title: string;
  category: string;
  slides: string[];
  activeIndex: number;
}

let extraProjects: RawProjectMeta[] = [];
const renderedPaths = new Set<string>();
const parentReadmeCache = new Map<string, string>();
let activeCarouselState: CarouselState | null = null;

const EXPLICIT_PREVIEW_FILE_RX =
  /^(preview|screenshot|demo|accueil|ecran[-_]?depart|banner|cover|capture)([-_]?\d+)?\.(png|jpe?g|gif|webp)$/i;
const PREVIEW_FOLDER_RX = /(?:^|\/)(screenshots?|previews?|captures?)\/[^/]+\.(png|jpe?g|gif|webp)$/i;

function isEmbeddedPreview(): boolean {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('embed') === '1') return true;
    return window.self !== window.top;
  } catch {
    return true;
  }
}

function encodeGitHubPath(pathStr: string): string {
  return pathStr.split('/').map(encodeURIComponent).join('/');
}

function resolveAssetUrl(urlOrPath: string): string {
  if (!urlOrPath) return '';
  if (
    urlOrPath.startsWith('http://') ||
    urlOrPath.startsWith('https://') ||
    urlOrPath.startsWith('blob:') ||
    urlOrPath.startsWith('data:') ||
    urlOrPath.startsWith('/')
  ) {
    return urlOrPath;
  }
  return withBase(urlOrPath);
}

/**
 * Convertit à la volée toute image distante non-.webp (ex. preview GitHub .png/.jpg)
 * en blob URL image/webp via un canvas hors écran, avec mise en cache mémoire.
 */
async function ensureWebpImageUrl(url: string): Promise<string> {
  if (!url) return '';
  const cleanUrl = url.split('?')[0].toLowerCase();
  if (cleanUrl.endsWith('.webp') || url.startsWith('blob:') || url.startsWith('data:image/webp')) {
    return url;
  }
  const cached = webpBlobCache.get(url);
  if (cached) return cached;

  return new Promise<string>((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width || 1280;
        canvas.height = img.naturalHeight || img.height || 720;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(url);
          return;
        }
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (blob && blob.type === 'image/webp') {
              const blobUrl = URL.createObjectURL(blob);
              webpBlobCache.set(url, blobUrl);
              resolve(blobUrl);
            } else {
              resolve(url);
            }
          },
          'image/webp',
          0.86
        );
      } catch {
        resolve(url);
      }
    };
    img.onerror = () => resolve(url);
    img.src = url;
  });
}

/**
 * Construit la liste ordonnée des images du carrousel d'un projet :
 * 1. Toutes les previews GitHub (preview, preview1, preview2, preview3...) en premier
 * 2. Suivies de l'image locale (.webp) du projet s'il en possède une
 */
function buildProjectCarouselImages(
  projectPath: string,
  githubPreviews?: string[],
  fallbackImageUrl?: string
): string[] {
  const result: string[] = [];
  const pushUnique = (rawUrl?: string) => {
    if (!rawUrl) return;
    const resolved = resolveAssetUrl(rawUrl);
    if (resolved && !result.includes(resolved)) {
      result.push(resolved);
    }
  };

  if (Array.isArray(githubPreviews)) {
    for (const ghImg of githubPreviews) {
      pushUnique(ghImg);
    }
  }
  if (result.length === 0 && fallbackImageUrl && fallbackImageUrl !== IMAGE_GENERIQUE) {
    pushUnique(fallbackImageUrl);
  }

  const localImg = LOCAL_IMAGE_BY_PATH.get(projectPath.toLowerCase());
  if (localImg) {
    pushUnique(localImg);
  }

  return result;
}

function stripMarkdown(mdText: string): string {
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

function cleanReadmeDescription(rawReadme: string): string {
  if (!rawReadme) return '';
  const lines = rawReadme
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('#') && !line.startsWith('![') && !line.startsWith('---'));

  if (lines.length === 0) return '';
  return stripMarkdown(lines.slice(0, 3).join(' '));
}

function extractProjectFromParentReadme(parentReadme: string, projectName: string): string {
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

function findProjectPreviewsInTree(tree: GitTreeEntry[], projectPath: string): string[] {
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
    const fileA = (relA.split('/').pop() || '').toLowerCase().replace(/\.[a-z0-9]+$/i, '');
    const fileB = (relB.split('/').pop() || '').toLowerCase().replace(/\.[a-z0-9]+$/i, '');
    if (fileA === 'preview' && fileB !== 'preview') return -1;
    if (fileB === 'preview' && fileA !== 'preview') return 1;
    return relA.localeCompare(relB, undefined, { numeric: true, sensitivity: 'base' });
  });

  return candidates.map(
    (c) =>
      `https://raw.githubusercontent.com/${SITE.githubRepoOwner}/${SITE.githubRepoName}/${SITE.githubBranch}/${encodeGitHubPath(c.path!)}`
  );
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

    const githubPreviews = findProjectPreviewsInTree(tree, entry.path);

    projects.push({
      name,
      path: entry.path,
      parentPath,
      filterClass,
      categoryLabel,
      repoUrl: `${baseRepo}/${encodeGitHubPath(entry.path)}`,
      imageUrl: githubPreviews[0] || IMAGE_GENERIQUE,
      githubPreviews,
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

  const searchInput = document.getElementById('portfolioSearchInput') as HTMLInputElement | null;
  if (searchInput) {
    searchInput.placeholder = isEn
      ? 'Search a project or tech stack (e.g. Python, PowerShell, C#, Angular…)'
      : 'Rechercher un projet ou une techno (ex. Python, PowerShell, C#, Angular…)';
    searchInput.setAttribute(
      'aria-label',
      isEn
        ? 'Search a project by name, description, or technology'
        : 'Rechercher un projet par nom, description ou technologie'
    );
  }

  const emptyText = document.getElementById('portfolioEmptyText');
  if (emptyText) {
    emptyText.textContent = isEn
      ? 'No project matches these search criteria.'
      : 'Aucun projet ne correspond à ces critères de recherche.';
  }
}

function updateCardCarouselData(itemEl: HTMLElement, carouselImages: string[]): void {
  const serialized = JSON.stringify(carouselImages);
  itemEl.dataset.previewImages = serialized;
  const previewLink = itemEl.querySelector<HTMLAnchorElement>('a.preview-link');
  if (previewLink && carouselImages.length > 0) {
    previewLink.dataset.previewImages = serialized;
    previewLink.href = carouselImages[0];
  }

  const imgWrap = itemEl.querySelector<HTMLElement>('.portfolio-image');
  if (!imgWrap) return;

  let badge = imgWrap.querySelector<HTMLElement>('.portfolio-carousel-badge');
  if (carouselImages.length > 1) {
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'portfolio-carousel-badge';
      badge.innerHTML = `<i class="bi bi-images" aria-hidden="true"></i><span data-carousel-count>${carouselImages.length}</span>`;
      imgWrap.appendChild(badge);
    } else {
      const countEl = badge.querySelector('[data-carousel-count]');
      if (countEl) countEl.textContent = String(carouselImages.length);
    }
    badge.title =
      getSiteLang() === 'en'
        ? `${carouselImages.length} WebP previews in carousel`
        : `${carouselImages.length} aperçus (.webp) dans le carrousel`;
  } else if (badge) {
    badge.remove();
  }
}

function createPortfolioCardElement(project: RawProjectMeta, index: number): HTMLElement {
  const isEn = getSiteLang() === 'en';
  const displayCategory = localizeCategoryLabel(project.categoryLabel, isEn);
  const carouselImages = buildProjectCarouselImages(
    project.path,
    project.githubPreviews,
    project.imageUrl
  );

  const itemCol = document.createElement('div');
  itemCol.id = `portfolio-item-${index}`;
  itemCol.className = `col-lg-6 col-md-6 portfolio-item ${project.filterClass}`;
  itemCol.dataset.projectPath = project.path;
  itemCol.dataset.projectTags = (project.tags || []).join('|');
  itemCol.dataset.previewImages = JSON.stringify(carouselImages);

  const card = document.createElement('div');
  card.className = 'portfolio-card';

  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'portfolio-image';

  const img = document.createElement('img');
  const primaryPreview = carouselImages[0] || resolveAssetUrl(project.imageUrl) || IMAGE_GENERIQUE;
  img.src = primaryPreview;
  img.alt = isEn ? `${project.name} project preview` : `Aperçu du projet ${project.name}`;
  img.className = 'img-fluid';
  if (primaryPreview.endsWith(IMAGE_GENERIQUE) || primaryPreview === IMAGE_GENERIQUE) {
    img.classList.add('portfolio-img-generic');
  } else if (!primaryPreview.toLowerCase().endsWith('.webp')) {
    void ensureWebpImageUrl(primaryPreview).then((webpUrl) => {
      img.src = webpUrl;
    });
  }
  img.loading = 'lazy';
  img.decoding = 'async';
  img.addEventListener('error', () => handleImageError(img));

  if (carouselImages.length > 1) {
    const badge = document.createElement('span');
    badge.className = 'portfolio-carousel-badge';
    badge.title = isEn
      ? `${carouselImages.length} WebP previews in carousel`
      : `${carouselImages.length} aperçus (.webp) dans le carrousel`;
    badge.innerHTML = `<i class="bi bi-images" aria-hidden="true"></i><span data-carousel-count>${carouselImages.length}</span>`;
    imageWrapper.appendChild(badge);
  }

  const overlay = document.createElement('div');
  overlay.className = 'portfolio-overlay';

  const actions = document.createElement('div');
  actions.className = 'portfolio-actions';

  if (carouselImages.length > 0) {
    const previewLink = document.createElement('a');
    previewLink.href = carouselImages[0];
    previewLink.className = 'glightbox preview-link';
    previewLink.setAttribute('data-project-title', project.name);
    previewLink.setAttribute('data-project-category', displayCategory);
    previewLink.setAttribute('data-preview-images', JSON.stringify(carouselImages));
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
      ? `Project (${displayCategory}) by Olivier Bourgault.`
      : `Projet ${project.categoryLabel.toLowerCase()} réalisé par Olivier Bourgault.`);

  content.appendChild(categorySpan);
  content.appendChild(title);
  content.appendChild(descriptionP);

  if (project.tags && project.tags.length > 0) {
    const badgesWrap = document.createElement('div');
    badgesWrap.className = 'd-flex flex-wrap gap-1 mt-2';
    for (const tag of project.tags) {
      const badge = document.createElement('span');
      badge.className = 'badge badge-tech';
      badge.textContent = tag;
      badgesWrap.appendChild(badge);
    }
    content.appendChild(badgesWrap);
  }

  card.appendChild(imageWrapper);
  card.appendChild(content);
  itemCol.appendChild(card);

  void hydrateProjectDescription(project, descriptionP);

  return itemCol;
}

function projectMatchesCategory(filterClass: string): boolean {
  if (!currentFilter || currentFilter === '*') return true;
  return `.${filterClass}` === currentFilter;
}

function tagsMatchSelectedTech(tagsList: string[], textHint = ''): boolean {
  if (!currentTechTag || currentTechTag === '*') return true;
  const needle = currentTechTag.toLowerCase();
  for (const t of tagsList) {
    const lower = t.toLowerCase();
    if (lower.includes(needle) || needle.includes(lower)) return true;
  }
  return textHint.toLowerCase().includes(needle);
}

function rawProjectMatchesCriteria(project: RawProjectMeta): boolean {
  if (!projectMatchesCategory(project.filterClass)) return false;
  const tags = project.tags || [];
  const combinedText = `${project.name} ${project.categoryLabel} ${project.path} ${tags.join(' ')} ${project.description || ''}`;
  if (!tagsMatchSelectedTech(tags, combinedText)) return false;
  if (currentSearchQuery) {
    if (!combinedText.toLowerCase().includes(currentSearchQuery)) return false;
  }
  return true;
}

function domCardMatchesCriteria(item: HTMLElement): boolean {
  if (currentFilter && currentFilter !== '*' && !item.matches(currentFilter)) {
    return false;
  }
  const tags = (item.dataset.projectTags || '').split('|').filter(Boolean);
  const text = (item.textContent || '').replace(/\s+/g, ' ');
  if (!tagsMatchSelectedTech(tags, text)) return false;
  if (currentSearchQuery) {
    if (!text.toLowerCase().includes(currentSearchQuery) && !(item.dataset.projectPath || '').toLowerCase().includes(currentSearchQuery)) {
      return false;
    }
  }
  return true;
}

function materializeNeededCards(container: HTMLElement): void {
  const hasDiscoveryFilter = currentTechTag !== '*' || currentSearchQuery.length > 0;
  const existingMatching = Array.from(
    container.querySelectorAll<HTMLElement>('.portfolio-item')
  ).filter((item) => domCardMatchesCriteria(item));

  const neededCount =
    portfolioShowAll || hasDiscoveryFilter
      ? Infinity
      : Math.max(0, DEFAULT_VISIBLE_PROJECTS - existingMatching.length);

  if (neededCount <= 0) return;

  let nextIdx = container.querySelectorAll('.portfolio-item').length;
  let appended = 0;

  for (const project of extraProjects) {
    if (appended >= neededCount) break;
    const key = project.path.toLowerCase();
    if (renderedPaths.has(key)) continue;
    if (!rawProjectMatchesCriteria(project)) continue;

    container.appendChild(createPortfolioCardElement(project, nextIdx++));
    renderedPaths.add(key);
    appended++;
  }
}

function applyPortfolioFilterWithLimit(): void {
  const container = document.getElementById('portfolioGrid');
  if (!container) return;

  const hasDiscoveryFilter = currentTechTag !== '*' || currentSearchQuery.length > 0;
  materializeNeededCards(container);

  const allItems = Array.from(container.querySelectorAll<HTMLElement>('.portfolio-item'));
  const matchingDom = allItems.filter((item) => domCardMatchesCriteria(item));

  const unrenderedMatchingCount = extraProjects.filter(
    (p) => !renderedPaths.has(p.path.toLowerCase()) && rawProjectMatchesCriteria(p)
  ).length;
  const totalMatching = matchingDom.length + unrenderedMatchingCount;

  const visibleItems =
    portfolioShowAll || hasDiscoveryFilter
      ? matchingDom
      : matchingDom.slice(0, DEFAULT_VISIBLE_PROJECTS);
  const visibleSet = new Set(visibleItems);

  allItems.forEach((item) => {
    item.classList.toggle('d-none', !visibleSet.has(item));
  });

  const emptyState = document.getElementById('portfolioEmptyState');
  if (emptyState) {
    emptyState.classList.toggle('d-none', totalMatching > 0);
  }

  const btnWrap = document.getElementById('portfolioShowMoreWrap');
  const btn = document.getElementById('portfolioShowMoreBtn');
  if (btnWrap && btn) {
    if (totalMatching <= DEFAULT_VISIBLE_PROJECTS || hasDiscoveryFilter) {
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

function getCaseStudyProjectSlides(project: FallbackProject): string[] {
  const domCard = document.querySelector<HTMLElement>(
    `#portfolioGrid .portfolio-item[data-project-path="${project.path}"]`
  );
  const rawJson = domCard?.dataset.previewImages;
  if (rawJson) {
    try {
      const parsed = JSON.parse(rawJson);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.filter((u): u is string => typeof u === 'string' && u.length > 0);
      }
    } catch {
      // Ignorer
    }
  }
  return [withBase(project.image)];
}

function renderCaseStudyModalContent(project: FallbackProject, activeSlideIdx = 0): void {
  const isEn = getSiteLang() === 'en';
  const cs = isEn ? project.caseStudy?.en : project.caseStudy?.fr;
  if (!cs) return;

  const titleEl = document.getElementById('caseStudyDialogTitle');
  const subEl = document.getElementById('caseStudyDialogSub');
  const bodyEl = document.getElementById('caseStudyDialogBody');
  const badgesEl = document.getElementById('caseStudyDialogBadges');
  const repoLink = document.getElementById('caseStudyDialogRepoLink') as HTMLAnchorElement | null;
  const copyLinkLabel = document.getElementById('caseStudyCopyLinkLabel');

  if (titleEl) {
    titleEl.textContent = isEn ? `Case Study — ${project.name}` : `Étude de cas — ${project.name}`;
  }
  if (subEl) {
    subEl.textContent = localizeCategoryLabel(project.categoryLabel, isEn);
  }
  if (repoLink) {
    repoLink.href = project.repoUrl;
  }
  if (copyLinkLabel) {
    copyLinkLabel.textContent = isEn ? 'Copy Link' : 'Copier le lien';
  }
  if (badgesEl) {
    badgesEl.innerHTML = project.badges
      .map((b) => `<span class="badge badge-tech">${b}</span>`)
      .join('');
  }
  if (bodyEl) {
    const slides = getCaseStudyProjectSlides(project);
    const safeIdx = Math.max(0, Math.min(activeSlideIdx, slides.length - 1));
    const currentImg = slides[safeIdx] || withBase(project.image);

    const lblChallenge = isEn ? '1. Context & Problem' : '1. Contexte & Problématique';
    const lblArch = isEn ? '2. Architecture & Stack' : '2. Architecture & Stack technique';
    const lblHighlights = isEn ? '3. Key Engineering Decisions' : '3. Défis & Solutions d’ingénierie';
    const lblImpact = isEn ? '4. Measurable Results & Impact' : '4. Résultats & Impact mesurable';

    const thumbsHtml =
      slides.length > 1
        ? `<div class="cs-hero-thumbs" role="group" aria-label="${isEn ? 'Case study images' : 'Images de l’étude de cas'}">
            ${slides
              .map((sUrl, idx) => {
                const isGh =
                  sUrl.includes('/projects/github/') || sUrl.includes('githubusercontent.com');
                const tag = isGh ? 'GH · WEBP' : 'LOCAL · WEBP';
                const activeCls = idx === safeIdx ? ' is-active' : '';
                return `<button type="button" class="cs-hero-thumb${activeCls}" data-cs-slide-idx="${idx}" aria-pressed="${idx === safeIdx ? 'true' : 'false'}">
                  <i class="bi bi-image" aria-hidden="true"></i>
                  <span>${idx + 1}/${slides.length} · ${tag}</span>
                </button>`;
              })
              .join('')}
          </div>`
        : '';

    bodyEl.innerHTML = `
      <div class="cs-hero-banner">
        <div class="cs-hero-media">
          <img id="caseStudyHeroImg" src="${currentImg}" alt="${project.alt}" class="cs-hero-img" loading="lazy" />
          ${thumbsHtml}
        </div>
        <p class="cs-tagline">${cs.tagline}</p>
      </div>
      <div class="cs-grid">
        <section class="cs-card">
          <h3 class="cs-card-title"><i class="bi bi-bullseye" aria-hidden="true"></i> ${lblChallenge}</h3>
          <p>${cs.challenge}</p>
        </section>
        <section class="cs-card">
          <h3 class="cs-card-title"><i class="bi bi-diagram-3" aria-hidden="true"></i> ${lblArch}</h3>
          <p>${cs.architecture}</p>
        </section>
        <section class="cs-card cs-card-wide">
          <h3 class="cs-card-title"><i class="bi bi-cpu" aria-hidden="true"></i> ${lblHighlights}</h3>
          <ul class="cs-list">
            ${cs.highlights.map((h) => `<li>${h}</li>`).join('')}
          </ul>
        </section>
        <section class="cs-card cs-card-wide cs-card-impact">
          <h3 class="cs-card-title"><i class="bi bi-lightning-charge-fill" aria-hidden="true"></i> ${lblImpact}</h3>
          <p>${cs.impact}</p>
        </section>
      </div>
    `;
  }
}

export function openCaseStudyByName(projectName: string, updateUrlHash = true): boolean {
  const project = FALLBACK_PROJECTS.find(
    (p) => p.name.toLowerCase() === projectName.toLowerCase() && p.caseStudy
  );
  const dialog = document.getElementById('caseStudyDialog') as HTMLDialogElement | null;
  if (!project || !dialog) return false;

  activeCaseStudyProject = project;
  renderCaseStudyModalContent(project, 0);
  if (typeof dialog.showModal === 'function') {
    if (!dialog.open) dialog.showModal();
    promoteCursorToTopLayer();
    if (updateUrlHash) {
      try {
        history.replaceState(null, '', `#case-study=${encodeURIComponent(project.name)}`);
      } catch {
        // Ignorer
      }
    }
    return true;
  }
  return false;
}

function checkCaseStudyUrlParam(): void {
  try {
    const hash = window.location.hash || '';
    const hashMatch = hash.match(/^#case-study=(.+)$/i);
    if (hashMatch && hashMatch[1]) {
      openCaseStudyByName(decodeURIComponent(hashMatch[1]), false);
      return;
    }
    const qParam = new URLSearchParams(window.location.search).get('case-study');
    if (qParam) {
      openCaseStudyByName(qParam, false);
    }
  } catch {
    // Ignorer
  }
}

function initCaseStudyDialog(): void {
  const dialog = document.getElementById('caseStudyDialog') as HTMLDialogElement | null;
  const bodyEl = document.getElementById('caseStudyDialogBody');
  const copyLinkBtn = document.getElementById('caseStudyCopyLinkBtn');
  const copyLinkLabel = document.getElementById('caseStudyCopyLinkLabel');

  document.addEventListener('click', (e) => {
    const btn = (e.target as Element | null)?.closest<HTMLElement>('[data-case-study]');
    if (!btn) return;
    const name = btn.getAttribute('data-case-study');
    if (name) {
      e.preventDefault();
      openCaseStudyByName(name, true);
    }
  });

  bodyEl?.addEventListener('click', (e) => {
    const thumbBtn = (e.target as Element | null)?.closest<HTMLButtonElement>('[data-cs-slide-idx]');
    if (!thumbBtn || !activeCaseStudyProject) return;
    const idx = Number(thumbBtn.getAttribute('data-cs-slide-idx'));
    if (!Number.isNaN(idx)) {
      renderCaseStudyModalContent(activeCaseStudyProject, idx);
    }
  });

  copyLinkBtn?.addEventListener('click', async () => {
    if (!activeCaseStudyProject) return;
    const isEn = getSiteLang() === 'en';
    const shareUrl = `${window.location.origin}${withBase('')}#case-study=${encodeURIComponent(
      activeCaseStudyProject.name
    )}`;
    const ok = await copyTextToClipboard(shareUrl);
    if (ok && copyLinkLabel) {
      copyLinkLabel.textContent = isEn ? 'Link Copied!' : 'Lien copié !';
      window.setTimeout(() => {
        if (copyLinkLabel) {
          copyLinkLabel.textContent = getSiteLang() === 'en' ? 'Copy Link' : 'Copier le lien';
        }
      }, 2000);
    }
  });

  dialog?.addEventListener('close', () => {
    if (window.location.hash.toLowerCase().startsWith('#case-study=')) {
      try {
        history.replaceState(null, '', `${window.location.pathname}${window.location.search}#portfolio`);
      } catch {
        // Ignorer
      }
    }
  });

  window.addEventListener('hashchange', checkCaseStudyUrlParam);
  checkCaseStudyUrlParam();
}

function getSlideCaptionLabel(slideUrl: string, index: number, total: number, isEn: boolean): string {
  const isGitHubPreview =
    slideUrl.includes('/projects/github/') || slideUrl.includes('githubusercontent.com');
  if (isGitHubPreview) {
    return isEn
      ? `GitHub Preview (${index + 1}/${total}) · WebP`
      : `Aperçu GitHub (${index + 1}/${total}) · WebP`;
  }
  return isEn
    ? `Local Curated Preview (${index + 1}/${total}) · WebP`
    : `Aperçu local (${index + 1}/${total}) · WebP`;
}

function renderActiveCarouselSlide(): void {
  if (!activeCarouselState) return;
  const { title, category, slides, activeIndex } = activeCarouselState;
  const isEn = getSiteLang() === 'en';

  const imgEl = document.getElementById('lightboxDialogImg') as HTMLImageElement | null;
  const titleEl = document.getElementById('lightboxDialogTitle');
  const subEl = document.getElementById('lightboxDialogSub');
  const counterEl = document.getElementById('lightboxSlideCounter');
  const captionEl = document.getElementById('lightboxSlideCaption');
  const prevBtn = document.getElementById('lightboxPrevBtn');
  const nextBtn = document.getElementById('lightboxNextBtn');
  const footerEl = document.getElementById('lightboxCarouselFooter');
  const thumbsEl = document.getElementById('lightboxCarouselThumbs');
  const headerIconEl = document.getElementById('lightboxHeaderIcon');

  if (!imgEl || slides.length === 0) return;

  const currentUrl = slides[activeIndex] || slides[0];
  const pad = (n: number) => String(n).padStart(2, '0');

  if (titleEl) titleEl.textContent = title;
  if (subEl) subEl.textContent = category;
  if (counterEl) counterEl.textContent = `${pad(activeIndex + 1)} / ${pad(slides.length)}`;
  if (headerIconEl) {
    headerIconEl.className = slides.length > 1 ? 'bi bi-images' : 'bi bi-eye';
  }

  const captionText = getSlideCaptionLabel(currentUrl, activeIndex, slides.length, isEn);
  if (captionEl) captionEl.textContent = captionText;

  imgEl.alt = `${title} — ${captionText}`;
  if (currentUrl.toLowerCase().endsWith('.webp') || currentUrl.startsWith('blob:')) {
    imgEl.src = currentUrl;
  } else {
    imgEl.src = currentUrl;
    void ensureWebpImageUrl(currentUrl).then((webpUrl) => {
      if (activeCarouselState && activeCarouselState.slides[activeCarouselState.activeIndex] === currentUrl) {
        activeCarouselState.slides[activeCarouselState.activeIndex] = webpUrl;
        imgEl.src = webpUrl;
      }
    });
  }

  const hasMultiple = slides.length > 1;
  prevBtn?.classList.toggle('d-none', !hasMultiple);
  nextBtn?.classList.toggle('d-none', !hasMultiple);
  footerEl?.classList.toggle('d-none', !hasMultiple);

  if (prevBtn) {
    const lbl = isEn ? 'Previous image' : 'Image précédente';
    prevBtn.setAttribute('aria-label', lbl);
    prevBtn.setAttribute('title', `${lbl} (←)`);
  }
  if (nextBtn) {
    const lbl = isEn ? 'Next image' : 'Image suivante';
    nextBtn.setAttribute('aria-label', lbl);
    nextBtn.setAttribute('title', `${lbl} (→)`);
  }

  if (thumbsEl && hasMultiple) {
    thumbsEl.innerHTML = slides
      .map((sUrl, idx) => {
        const isCurrent = idx === activeIndex;
        const isGh = sUrl.includes('/projects/github/') || sUrl.includes('githubusercontent.com');
        const badgeText = isGh ? 'GH' : 'LOCAL';
        const thumbLabel = isEn
          ? `View image ${idx + 1} of ${slides.length} (${badgeText})`
          : `Afficher l'image ${idx + 1} sur ${slides.length} (${badgeText})`;
        return `
          <button
            type="button"
            class="ob-carousel-thumb${isCurrent ? ' is-active' : ''}"
            data-carousel-idx="${idx}"
            aria-label="${thumbLabel}"
            aria-current="${isCurrent ? 'true' : 'false'}"
            title="${thumbLabel}"
          >
            <img src="${sUrl}" alt="" loading="lazy" decoding="async" />
            <span class="ob-carousel-thumb-tag">${idx + 1} · ${badgeText}</span>
          </button>
        `;
      })
      .join('');
  } else if (thumbsEl) {
    thumbsEl.innerHTML = '';
  }
}

function stepCarousel(delta: number): void {
  if (!activeCarouselState || activeCarouselState.slides.length <= 1) return;
  const len = activeCarouselState.slides.length;
  activeCarouselState.activeIndex = (activeCarouselState.activeIndex + delta + len) % len;
  renderActiveCarouselSlide();
}

function initNativeLightbox(): void {
  const dialog = document.getElementById('portfolioLightboxDialog') as HTMLDialogElement | null;
  const grid = document.getElementById('portfolioGrid');
  const prevBtn = document.getElementById('lightboxPrevBtn');
  const nextBtn = document.getElementById('lightboxNextBtn');
  const thumbsEl = document.getElementById('lightboxCarouselThumbs');
  const stageEl = document.getElementById('lightboxCarouselStage');
  if (!dialog || !grid) return;

  prevBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    stepCarousel(-1);
  });

  nextBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    stepCarousel(1);
  });

  thumbsEl?.addEventListener('click', (e) => {
    const btn = (e.target as Element | null)?.closest<HTMLButtonElement>('[data-carousel-idx]');
    if (!btn || !activeCarouselState) return;
    const idx = Number(btn.getAttribute('data-carousel-idx'));
    if (!Number.isNaN(idx) && idx >= 0 && idx < activeCarouselState.slides.length) {
      activeCarouselState.activeIndex = idx;
      renderActiveCarouselSlide();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (!dialog.open || !activeCarouselState || activeCarouselState.slides.length <= 1) return;
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      stepCarousel(-1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      stepCarousel(1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      activeCarouselState.activeIndex = 0;
      renderActiveCarouselSlide();
    } else if (e.key === 'End') {
      e.preventDefault();
      activeCarouselState.activeIndex = activeCarouselState.slides.length - 1;
      renderActiveCarouselSlide();
    }
  });

  let touchStartX = 0;
  stageEl?.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
      }
    },
    { passive: true }
  );
  stageEl?.addEventListener(
    'touchend',
    (e) => {
      if (!touchStartX || e.changedTouches.length === 0) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      touchStartX = 0;
      if (Math.abs(dx) > 40) {
        stepCarousel(dx < 0 ? 1 : -1);
      }
    },
    { passive: true }
  );

  grid.addEventListener('click', (e) => {
    const target = e.target as Element | null;
    if (target?.closest('a.details-link, [data-case-study]')) return;
    const link =
      target?.closest<HTMLAnchorElement>('a.glightbox.preview-link') ||
      target
        ?.closest<HTMLElement>('.portfolio-image')
        ?.querySelector<HTMLAnchorElement>('a.glightbox.preview-link');
    if (!link) return;
    e.preventDefault();

    const isEn = getSiteLang() === 'en';
    const itemCol = link.closest<HTMLElement>('.portfolio-item');
    const card = link.closest('.portfolio-card');
    const title =
      link.getAttribute('data-project-title') ||
      card?.querySelector('h3')?.textContent?.trim() ||
      (isEn ? 'Project Preview' : 'Aperçu du projet');
    const category =
      card?.querySelector('.category')?.textContent?.trim() ||
      link.getAttribute('data-project-category') ||
      'Portfolio';

    let slides: string[] = [];
    const rawJson = link.dataset.previewImages || itemCol?.dataset.previewImages;
    if (rawJson) {
      try {
        const parsed = JSON.parse(rawJson);
        if (Array.isArray(parsed)) {
          slides = parsed.filter((u): u is string => typeof u === 'string' && u.length > 0);
        }
      } catch {
        // Ignorer
      }
    }
    if (slides.length === 0 && link.href) {
      slides = [link.href];
    }

    activeCarouselState = {
      title,
      category,
      slides,
      activeIndex: 0
    };
    renderActiveCarouselSlide();

    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) dialog.showModal();
      promoteCursorToTopLayer();
    }
  });
}

function registerGitHubProjects(projects: RawProjectMeta[]): void {
  const container = document.getElementById('portfolioGrid');
  if (!container) return;

  const ghByPath = new Map<string, RawProjectMeta>();
  for (const p of projects) {
    ghByPath.set(p.path.toLowerCase(), p);
  }

  const mergedForCount: Array<{ filterClass: string }> = [];
  const countedPaths = new Set<string>();

  container.querySelectorAll<HTMLElement>('.portfolio-item').forEach((item) => {
    const key = (item.dataset.projectPath || '').toLowerCase();
    if (key) {
      renderedPaths.add(key);
      countedPaths.add(key);
      const ghMatch = ghByPath.get(key);
      if (ghMatch) {
        const carouselImages = buildProjectCarouselImages(
          ghMatch.path,
          ghMatch.githubPreviews,
          ghMatch.imageUrl
        );
        if (carouselImages.length > 0) {
          updateCardCarouselData(item, carouselImages);
        }
      }
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

  // 1. Priorité au catalogue statique pré-généré au build (0 appel API tiers, 0 quota GitHub)
  try {
    const staticRes = await fetch(STATIC_CATALOG_URL);
    if (staticRes.ok) {
      const data = (await staticRes.json()) as StaticCatalogPayload;
      if (Array.isArray(data?.projects) && data.projects.length > 0) {
        try {
          localStorage.setItem(
            PORTFOLIO_CACHE_KEY,
            JSON.stringify({ ts: Date.now(), projects: data.projects })
          );
        } catch {
          // Ignorer
        }
        registerGitHubProjects(data.projects);
        if (statusEl) statusEl.textContent = '';
        return;
      }
    }
  } catch {
    // Poursuivre vers le cache localStorage / API GitHub
  }

  // 2. Cache localStorage
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
    // Ignorer
  }

  // 3. Fallback API GitHub
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
      // Ignorer
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

  const techTagsGroup = document.getElementById('portfolioTechTags');
  techTagsGroup?.addEventListener('click', (e) => {
    const chip = (e.target as Element | null)?.closest<HTMLButtonElement>('button[data-tech-tag]');
    if (!chip) return;
    techTagsGroup.querySelectorAll<HTMLButtonElement>('button[data-tech-tag]').forEach((el) => {
      const isCurrent = el === chip;
      el.classList.toggle('is-active', isCurrent);
      el.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
    });
    currentTechTag = chip.getAttribute('data-tech-tag') || '*';
    applyPortfolioFilterWithLimit();
  });

  const searchInput = document.getElementById('portfolioSearchInput') as HTMLInputElement | null;
  const searchClear = document.getElementById('portfolioSearchClear');

  function updateSearch(val: string): void {
    currentSearchQuery = val.trim().toLowerCase();
    searchClear?.classList.toggle('d-none', currentSearchQuery.length === 0);
    applyPortfolioFilterWithLimit();
  }

  searchInput?.addEventListener('input', () => {
    updateSearch(searchInput.value);
  });

  searchClear?.addEventListener('click', () => {
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }
    updateSearch('');
  });

  document.getElementById('portfolioResetFiltersBtn')?.addEventListener('click', () => {
    currentFilter = '*';
    currentTechTag = '*';
    currentSearchQuery = '';
    portfolioShowAll = false;
    if (searchInput) searchInput.value = '';
    searchClear?.classList.add('d-none');

    filtersList?.querySelectorAll<HTMLButtonElement>('button[data-filter]').forEach((el) => {
      const isAll = el.getAttribute('data-filter') === '*';
      el.classList.toggle('filter-active', isAll);
      el.setAttribute('aria-pressed', isAll ? 'true' : 'false');
    });

    techTagsGroup?.querySelectorAll<HTMLButtonElement>('button[data-tech-tag]').forEach((el) => {
      const isAll = el.getAttribute('data-tech-tag') === '*';
      el.classList.toggle('is-active', isAll);
      el.setAttribute('aria-pressed', isAll ? 'true' : 'false');
    });

    applyPortfolioFilterWithLimit();
  });

  const showMoreBtn = document.getElementById('portfolioShowMoreBtn');
  showMoreBtn?.addEventListener('click', () => {
    portfolioShowAll = !portfolioShowAll;
    applyPortfolioFilterWithLimit();
  });

  initNativeLightbox();
  initCaseStudyDialog();
  syncPortfolioCardsLocale();
  applyPortfolioFilterWithLimit();
  void loadGitHubPortfolio();

  window.addEventListener('ob:langchange', () => {
    if (lastCountedProjects.length > 0) {
      updateProjectCounters(lastCountedProjects);
    }
    syncPortfolioCardsLocale();
    if (activeCaseStudyProject) {
      renderCaseStudyModalContent(activeCaseStudyProject);
    }
    if (activeCarouselState) {
      renderActiveCarouselSlide();
    }
    applyPortfolioFilterWithLimit();
    applyDomTranslations(document.getElementById('portfolio') || document.body);
  });
}
