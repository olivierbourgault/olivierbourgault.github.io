/**
* Template Name: EasyFolio
* Template URL: https://bootstrapmade.com/easyfolio-bootstrap-portfolio-template/
* Updated: Feb 21 2025 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
* * OPTIMIZED BY: Gemini AI
* CHANGES: Integrated dynamic GitHub fetching, cleaned logic, added comments.
*/

/* -------------------------------------------------------------------------- */
/* CONSTANTS                                 */
/* -------------------------------------------------------------------------- */
const TODAY = new Date();
const START = new Date("2021-01-25");
const IMAGE_GENERIQUE = "assets/img/logo/dark.png";
const GITHUB_REPO_OWNER = "RinoShip77";
const GITHUB_REPO_NAME = "MesProjets";
const GITHUB_BRANCH = "main";
const PORTFOLIO_CACHE_KEY = "ob_portfolio_projects_cache";

const LOCAL_PROJECT_IMAGES = {
  electrolib: "assets/img/portfolio/electrolib.png",
  comparetools: "assets/img/portfolio/compareTools.png",
  hubai: "assets/img/portfolio/hubAI.png",
  kaomia: "assets/img/portfolio/kaomia.png",
  evomeal: "assets/img/portfolio/evomeal.png",
  shopro: "assets/img/portfolio/shopro.png",
  phoneword: "assets/img/portfolio/phoneword.png"
};

/* -------------------------------------------------------------------------- */
/* INITIALIZATION                               */
/* -------------------------------------------------------------------------- */

/**
 * Initiate GLightbox (Lightweight Lightbox for portfolio images)
 */
const glightbox = GLightbox({
  selector: '.glightbox'
});

/**
 * Initialize AOS (Animate On Scroll)
 */
function aosInit() {
  AOS.init({
    duration: 600,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });
}

/**
 * Main Initialization on Page Load
 */
window.addEventListener('load', function (e) {
  // Show loading bar on mobile immediately
  if (window.innerWidth <= 540) {
    document.querySelector(".loading__bar").classList.remove("d-none");
  }

  // Simulate loading delay
  setTimeout(() => {
    // Hide spinner, show page
    document.getElementById("spinner").classList.add("d-none");
    document.getElementById("page").classList.remove("d-none");

    // Display years of experience
    document.getElementById('experience').innerHTML = diffDate(START, TODAY);

    // Initialize main logic
    main();

    // Trigger default portfolio filter (All)
    setTimeout(() => {
      const activeFilter = document.querySelector(".filter-active");
      if (activeFilter) activeFilter.click();
    }, 750);
  }, 3000);
});

/* -------------------------------------------------------------------------- */
/* EVENT LISTENERS                                */
/* -------------------------------------------------------------------------- */

/**
 * Handle Scroll Events
 */
document.addEventListener('scroll', function (e) {
  navmenuScrollspy();
  toggleScrolled();
  toggleScrollTop();
});

/**
 * Handle Resize Events
 */
window.addEventListener('resize', function (e) {
  positionSkills();
});

/**
 * Scroll to top button click handler
 */
const scrollTopBtn = document.querySelector('.scroll-top');
if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* -------------------------------------------------------------------------- */
/* CORE FUNCTIONS                               */
/* -------------------------------------------------------------------------- */

/**
 * Main Logic Driver
 */
function main() {
  // Chargement dynamique des projets depuis GitHub (Git Trees API + cache sessionStorage)
  loadGitHubPortfolio();

  aosInit();
  positionSkills();
  scrollPosition();
  toggleScrolled();
  navmenuScrollspy();
  
  // Add margins to skill badges
  adjustSkills("languages");
  adjustSkills("softwares");
}

/**
 * Initialize Isotope Layout and Filters
 */
document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
  let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
  let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
  let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';
  let container = isotopeItem.querySelector('.isotope-container');
  let initIsotope;

  imagesLoaded(container, function () {
    initIsotope = Isotope.data(container) || new Isotope(container, {
      itemSelector: '.isotope-item',
      layoutMode: layout,
      filter: filter,
      sortBy: sort
    });
  });

  isotopeItem.querySelectorAll('.isotope-filters li').forEach(function (filters) {
    filters.addEventListener('click', function () {
      const activeEl = isotopeItem.querySelector('.isotope-filters .filter-active');
      if (activeEl) activeEl.classList.remove('filter-active');
      this.classList.add('filter-active');
      const isoInstance = initIsotope || Isotope.data(container);
      if (isoInstance) {
        isoInstance.arrange({
          filter: this.getAttribute('data-filter')
        });
        isoInstance.layout();
      }
      if (typeof aosInit === 'function') {
        aosInit();
      }
    }, false);
  });
});

/**
 * Update Active Link in Nav Menu on Scroll
 */
function navmenuScrollspy() {
  document.querySelectorAll('.navmenu a').forEach(navmenulink => {
    if (!navmenulink.hash) return;
    let section = document.querySelector(navmenulink.hash);
    if (!section) return;
    let position = window.scrollY + 200;
    if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
      document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
      navmenulink.classList.add('active');
    } else {
      navmenulink.classList.remove('active');
    }
  })
}

/* -------------------------------------------------------------------------- */
/* UI & ANIMATION                                */
/* -------------------------------------------------------------------------- */

/**
 * Mobile Navigation Toggle
 */
document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
  navmenu.addEventListener('click', function (e) {
    e.preventDefault();
    this.parentNode.classList.toggle('active');
    this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
    e.stopImmediatePropagation();
  });
});

const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
function mobileNavToogle() {
  document.body.classList.toggle('mobile-nav-active');
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
}

if (mobileNavToggleBtn) {
  mobileNavToggleBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    mobileNavToogle();
  });
}

// Fermeture au clic sur un lien du menu
document.querySelectorAll('#navmenu a').forEach(navmenulink => {
  navmenulink.addEventListener('click', () => {
    if (document.body.classList.contains('mobile-nav-active')) {
      mobileNavToogle();
    }
  });
});

// Fermeture au clic sur l'arrière-plan du menu mobile
const navmenuElement = document.querySelector('#navmenu');
if (navmenuElement) {
  navmenuElement.addEventListener('click', function (e) {
    if (document.body.classList.contains('mobile-nav-active')) {
      if (e.target === navmenuElement) {
        mobileNavToogle();
      }
    }
  });
}

// Fermeture avec la touche Échap
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && document.body.classList.contains('mobile-nav-active')) {
    mobileNavToogle();
  }
});

/**
 * Dark/Light Theme Switcher
 */
function switchTheme(isDark) {
  const themeIcon = document.getElementById("themeSwitcher");
  const logo = document.getElementById("logo");
  
  if (!isDark) {
    themeIcon.classList.replace("bi-moon-stars-fill", "bi-sun-fill");
    document.body.setAttribute("data-bs-theme", "dark");
    logo.src = `assets/img/logo/dark.png`;
  } else {
    themeIcon.classList.replace("bi-sun-fill", "bi-moon-stars-fill");
    document.body.removeAttribute("data-bs-theme");
    logo.src = `assets/img/logo/light.png`;
  }
  document.body.classList.toggle("dark");
}

/**
 * Animate Skill Bars
 */
let skillsAnimation = document.querySelectorAll('.skills-animation');
skillsAnimation.forEach((item) => {
  new Waypoint({
    element: item,
    offset: '80%',
    handler: function (direction) {
      let progress = item.querySelectorAll('.progress .progress-bar');
      progress.forEach(el => {
        el.style.width = el.getAttribute('aria-valuenow') + '%';
      });
    }
  });
});

/**
 * Scroll Position helper
 */
function scrollPosition() {
  if (window.location.hash && document.querySelector(window.location.hash)) {
    setTimeout(() => {
      let section = document.querySelector(window.location.hash);
      let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
      window.scrollTo({
        top: section.offsetTop - parseInt(scrollMarginTop),
        behavior: 'smooth'
      });
    }, 100);
  }
};

function toggleScrolled() {
  const header = document.querySelector('#header');
  if (!header.classList.contains('scroll-up-sticky') && 
      !header.classList.contains('sticky-top') && 
      !header.classList.contains('fixed-top')) return;
  window.scrollY > 100 ? document.body.classList.add('scrolled') : document.body.classList.remove('scrolled');
}

function toggleScrollTop() {
  const scrollTop = document.querySelector('.scroll-top');
  if (scrollTop) {
    window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
  }
}

/**
 * Adjust layout for skills section on mobile
 */
function positionSkills() {
  const container = document.getElementById("skills-collapsable").children[0];
  if (window.innerWidth < 540) {
    container.classList.add("flex-column");
  } else {
    container.classList.remove("flex-column");
  }
}

/**
 * Add margins to badges in the skills collapse section
 */
function adjustSkills(categoryId) {
  const container = document.getElementById(categoryId).children[0].children[0]; 
  for (let i = 0; i < container.children.length; i++) {
    container.children[i].classList.add("m-1");
  }
}

/* -------------------------------------------------------------------------- */
/* DATA & API FUNCTIONS                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Encode chaque segment d'un chemin GitHub pour supporter espaces, accents et caractères spéciaux.
 * @param {string} path
 * @returns {string}
 */
function encodeGitHubPath(path) {
  return path
    .split('/')
    .map(segment => encodeURIComponent(segment))
    .join('/');
}

/**
 * Nettoie le contenu brut d'un fichier README.md :
 * - Ignore les lignes de titres (#), séparateurs, tableaux et métadonnées administratives
 * - Extrait uniquement le premier paragraphe descriptif
 * - Supprime les balises Markdown (**, *, `, [texte](lien), images) et HTML inline
 * @param {string} rawMarkdown
 * @returns {string}
 */
function cleanReadmeDescription(rawMarkdown) {
  if (!rawMarkdown || typeof rawMarkdown !== 'string') return '';

  // Supprimer les blocs de code clôturés (```...```)
  const withoutCodeBlocks = rawMarkdown.replace(/```[\s\S]*?```/g, '');
  const lines = withoutCodeBlocks.split(/\r?\n/);

  const paragraphLines = [];
  let collecting = false;

  for (const rawLine of lines) {
    const trimmed = rawLine.trim();

    if (!trimmed) {
      if (collecting) break;
      continue;
    }

    // Ignorer titres (#), séparateurs (--- / ***), tableaux (|...) et lignes purement HTML/images
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
  // Retirer les images Markdown ![alt](url)
  cleaned = cleaned.replace(/!\[[^\]]*\]\([^)]+\)/g, '');
  // Remplacer les liens Markdown [texte](lien) par texte
  cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  // Supprimer les balises HTML inline (<br>, <a>, <font>, etc.)
  cleaned = cleaned.replace(/<[^>]+>/g, ' ');
  // Retirer les balises de formatage Markdown (**, *, `) et _ délimitant des mots
  cleaned = cleaned.replace(/(\*{1,3}|`+)/g, '');
  cleaned = cleaned.replace(/(^|[^\w/])_{1,3}|_{1,3}([^\w/]|$)/g, '$1$2');
  // Retirer les préfixes de citation ou de liste (> 1., 1., -, *)
  cleaned = cleaned.replace(/^>?\s*(?:\d+(?:\.\d+)*[.)]\s*|[-*•]\s*)/, '');
  // Normaliser les espaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
}

/**
 * Extrait la description d'un projet à partir du README.md du dossier parent lorsque
 * le projet n'a pas son propre README.md exploitable.
 * @param {string} parentMarkdown
 * @param {string} projectName
 * @returns {string}
 */
function extractProjectFromParentReadme(parentMarkdown, projectName) {
  if (!parentMarkdown || !projectName) return '';

  const escapedName = projectName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Cas 1 : Liste avec lien vers le dossier du projet (ex: >1. [***HubAI***](HubAI) est...)
  const linkLineRegex = new RegExp(`^.*\\]\\(${escapedName}\\/?\\).*$`, 'im');
  const linkMatch = parentMarkdown.match(linkLineRegex);
  if (linkMatch) {
    const cleaned = cleanReadmeDescription(linkMatch[0]);
    if (cleaned) return cleaned;
  }

  // Cas 2 : Section numérotée (ex: "1. PowerFitness\n\nPowerFitness est...")
  const lines = parentMarkdown.split(/\r?\n/);
  const headingRegex = new RegExp(`^\\s*(?:>\\s*)?(?:\\d+(?:\\.\\d+)*[.)]|#+)\\s*(?:\\[?[*_]*${escapedName}[*_]*\\]?)\\s*$`, 'i');
  for (let i = 0; i < lines.length; i++) {
    if (headingRegex.test(lines[i].trim())) {
      const rest = lines.slice(i + 1).join('\n');
      const cleaned = cleanReadmeDescription(rest);
      if (cleaned) return cleaned;
    }
  }

  return '';
}

/**
 * Recherche une image représentative d'un projet dans l'arborescence GitHub.
 * @param {Array} tree
 * @param {string} projectPath
 * @param {string} projectName
 * @returns {string}
 */
function findProjectImageInTree(tree, projectPath, projectName) {
  const prefix = `${projectPath}/`;
  const imageRegex = /\.(png|jpe?g|webp|gif|ico)$/i;
  const ignoredDirRegex = /\/(node_modules|vendor|obj|bin|\.gradle|build|dist|packages|Assets\.xcassets|res\/mipmap|res\/drawable|flutter_assets)\//i;
  const ignoredFileRegex = /(icon-\d+|app_icon|launch_background)/i;

  const candidates = tree.filter(item => {
    if (item.type !== 'blob' || !item.path.startsWith(prefix)) return false;
    if (!imageRegex.test(item.path)) return false;
    const relativePath = item.path.slice(prefix.length);
    if (ignoredDirRegex.test('/' + relativePath)) return false;
    if (ignoredFileRegex.test(relativePath)) return false;
    return true;
  });

  if (candidates.length > 0) {
    candidates.sort((a, b) => {
      const relA = a.path.slice(prefix.length);
      const relB = b.path.slice(prefix.length);
      const fileA = relA.split('/').pop().toLowerCase();
      const fileB = relB.split('/').pop().toLowerCase();

      const priorityRegex = /^(preview|screenshot|demo|accueil|ecran-depart|banner|cover)\./;
      const prioA = priorityRegex.test(fileA) ? 0 : 1;
      const prioB = priorityRegex.test(fileB) ? 0 : 1;
      if (prioA !== prioB) return prioA - prioB;

      const depthA = relA.split('/').length;
      const depthB = relB.split('/').length;
      if (depthA !== depthB) return depthA - depthB;

      return relA.localeCompare(relB);
    });

    return `https://raw.githubusercontent.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/${GITHUB_BRANCH}/${encodeGitHubPath(candidates[0].path)}`;
  }

  return LOCAL_PROJECT_IMAGES[projectName.toLowerCase()] || IMAGE_GENERIQUE;
}

/**
 * Retourne un gestionnaire d'erreur uniforme pour basculer vers IMAGE_GENERIQUE.
 * @param {HTMLImageElement} imgElement
 */
function handleImageError(imgElement) {
  if (!imgElement) return;
  imgElement.onerror = null;
  imgElement.src = IMAGE_GENERIQUE;
  imgElement.classList.add('portfolio-img-generic');
}

/**
 * Met à jour le compteur global #projectsCount et les compteurs sur les boutons de filtre.
 * @param {Array} projects
 */
function updateProjectCounters(projects) {
  const totalCount = projects.length;
  const schoolCount = projects.filter(p => p.filterClass === 'filter-school').length;
  const proCount = projects.filter(p => p.filterClass === 'filter-professional').length;
  const personalCount = projects.filter(p => p.filterClass === 'filter-personal').length;

  const projectCounterEl = document.getElementById('projectsCount');
  if (projectCounterEl) {
    projectCounterEl.textContent = String(totalCount);
  }

  const filterLabels = {
    '*': `Tout (${totalCount})`,
    '.filter-school': `Scolaires (${schoolCount})`,
    '.filter-professional': `Professionnels (${proCount})`,
    '.filter-personal': `Personnels (${personalCount})`
  };

  document.querySelectorAll('#filters li[data-filter]').forEach(li => {
    const key = li.getAttribute('data-filter');
    if (filterLabels[key]) {
      li.textContent = filterLabels[key];
    }
  });
}

/**
 * Construit proprement une carte de projet via createElement (DOM sécurisé).
 * @param {Object} project
 * @returns {HTMLElement}
 */
function createPortfolioCardElement(project) {
  const itemCol = document.createElement('div');
  itemCol.className = `col-lg-6 col-md-6 portfolio-item isotope-item ${project.filterClass}`;
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
  img.onerror = function () {
    handleImageError(this);
  };

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
    const eyeIcon = document.createElement('i');
    eyeIcon.className = 'bi bi-eye';
    previewLink.appendChild(eyeIcon);
    actions.appendChild(previewLink);
  }

  const detailsLink = document.createElement('a');
  detailsLink.href = project.repoUrl;
  detailsLink.target = '_blank';
  detailsLink.rel = 'noopener noreferrer';
  detailsLink.className = 'details-link';
  detailsLink.setAttribute('aria-label', `Voir le code source de ${project.name} sur GitHub`);
  const arrowIcon = document.createElement('i');
  arrowIcon.className = 'bi bi-arrow-right';
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

/**
 * Rendu des projets détectés dans la grille Portfolio sans dupliquer les cartes déjà présentes.
 * @param {Array} projects
 */
function renderPortfolioProjects(projects) {
  updateProjectCounters(projects);

  const container = document.querySelector('.isotope-container');
  if (!container) return;

  const existingItems = Array.from(container.querySelectorAll('.portfolio-item'));
  const existingPaths = new Set();

  existingItems.forEach(item => {
    const pathAttr = item.dataset.projectPath;
    if (pathAttr) {
      existingPaths.add(pathAttr.toLowerCase());
    }
  });

  const newElements = [];
  projects.forEach(project => {
    if (existingPaths.has(project.path.toLowerCase())) return;
    const cardEl = createPortfolioCardElement(project);
    container.appendChild(cardEl);
    newElements.push(cardEl);
    existingPaths.add(project.path.toLowerCase());
  });

  if (newElements.length > 0) {
    const iso = Isotope.data(container);
    if (iso) {
      iso.appended(newElements);
      const activeFilterBtn = document.querySelector('#filters .filter-active');
      const currentFilter = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : '*';
      iso.arrange({ filter: currentFilter });
      imagesLoaded(container, () => {
        iso.layout();
      });
    }
    GLightbox({ selector: '.glightbox' });
  }
}

/**
 * Extrait la liste structurée des projets à partir de la réponse Git Trees API
 * selon les profondeurs par catégorie :
 * - Personnels (profondeur 2 : Personnels/[Projet])
 * - Professionnels (profondeur 3 : Professionnels/[Employeur]/[Projet])
 * - Scolaires (profondeur 4 : Scolaires/[Etablissement]/[Cours]/[Projet])
 * @param {Array} tree
 * @returns {Array}
 */
function extractProjectsFromTree(tree) {
  const projects = [];

  tree.forEach(entry => {
    if (entry.type !== 'tree' || !entry.path) return;
    const parts = entry.path.split('/');

    if (parts[0] === 'Personnels' && parts.length === 2) {
      const name = parts[1];
      projects.push({
        name,
        path: entry.path,
        parentPath: 'Personnels',
        filterClass: 'filter-personal',
        categoryLabel: 'Personnels',
        repoUrl: `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/tree/${GITHUB_BRANCH}/${encodeGitHubPath(entry.path)}`,
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
        repoUrl: `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/tree/${GITHUB_BRANCH}/${encodeGitHubPath(entry.path)}`,
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
        repoUrl: `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/tree/${GITHUB_BRANCH}/${encodeGitHubPath(entry.path)}`,
        imageUrl: findProjectImageInTree(tree, entry.path, name)
      });
    }
  });

  return projects;
}

/**
 * Récupère un fichier texte brut sur raw.githubusercontent.com en gérant les erreurs silencieusement.
 * @param {string} repoPath
 * @returns {Promise<string>}
 */
async function fetchRawGitHubText(repoPath) {
  try {
    const url = `https://raw.githubusercontent.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/${GITHUB_BRANCH}/${encodeGitHubPath(repoPath)}`;
    const res = await fetch(url);
    if (!res.ok) return '';
    return await res.text();
  } catch (e) {
    return '';
  }
}

/**
 * Charge l'arborescence complète de RinoShip77/MesProjets via un appel unique à l'API Git Trees
 * avec mise en cache dans sessionStorage et extraction des descriptions README.md.
 */
async function loadGitHubPortfolio() {
  try {
    const cachedRaw = sessionStorage.getItem(PORTFOLIO_CACHE_KEY);
    if (cachedRaw) {
      const cachedProjects = JSON.parse(cachedRaw);
      if (Array.isArray(cachedProjects) && cachedProjects.length > 0) {
        renderPortfolioProjects(cachedProjects);
        return;
      }
    }
  } catch (e) {
    // Ignorer une erreur éventuelle de lecture du sessionStorage
  }

  const treeApiUrl = `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/git/trees/${GITHUB_BRANCH}?recursive=1`;

  try {
    const response = await fetch(treeApiUrl);
    if (!response.ok) {
      throw new Error(`GitHub Git Trees API error: ${response.status}`);
    }

    const data = await response.json();
    const tree = Array.isArray(data.tree) ? data.tree : [];
    const blobSet = new Set(tree.filter(item => item.type === 'blob').map(item => item.path));

    const projects = extractProjectsFromTree(tree);
    updateProjectCounters(projects);

    // Pré-charger les README.md des dossiers parents existants dans l'arbre (cache en mémoire)
    const parentReadmeCache = new Map();
    const uniqueParentPaths = [...new Set(projects.map(p => p.parentPath))];
    await Promise.all(
      uniqueParentPaths.map(async parentPath => {
        const readmePath = `${parentPath}/README.md`;
        if (blobSet.has(readmePath)) {
          const text = await fetchRawGitHubText(readmePath);
          parentReadmeCache.set(parentPath, text);
        }
      })
    );

    // Récupérer et nettoyer la description de chaque projet depuis son README.md (ou fallback parent)
    const resolvedProjects = await Promise.all(
      projects.map(async project => {
        let description = '';
        const projectReadmePath = `${project.path}/README.md`;

        if (blobSet.has(projectReadmePath)) {
          const rawProjectReadme = await fetchRawGitHubText(projectReadmePath);
          description = cleanReadmeDescription(rawProjectReadme);
        }

        if (!description && parentReadmeCache.has(project.parentPath)) {
          description = extractProjectFromParentReadme(parentReadmeCache.get(project.parentPath), project.name);
        }

        if (!description) {
          description = `Projet ${project.categoryLabel.toLowerCase()} réalisé par Olivier Bourgault. Consultez le dépôt GitHub pour explorer le code source.`;
        }

        return {
          ...project,
          description
        };
      })
    );

    try {
      sessionStorage.setItem(PORTFOLIO_CACHE_KEY, JSON.stringify(resolvedProjects));
    } catch (e) {
      // Ignorer si quota sessionStorage atteint
    }

    renderPortfolioProjects(resolvedProjects);
  } catch (error) {
    console.error('Erreur lors du chargement dynamique des projets GitHub :', error);
  }
}

/**
 * Open Email Client
 */
function sendEmail() {
  const name = document.getElementsByName('name')[0].value;
  const subject = document.getElementsByName('subject')[0].value;
  const message = document.getElementsByName('message')[0].value;

  if (message.length !== 0) {
    const email = document.getElementsByName('email')[0]?.value || '';
    window.location.href = `mailto:bourgault.olivier8501@gmail.com?subject=${encodeURIComponent(`Contact de ${name} (${email}) : ${subject}`)}&body=${encodeURIComponent(message)}`;
  }
}

/**
 * Calculate difference in years between two dates
 */
function diffDate(date1, date2) {
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return Math.round(diffDays / 365.25);
}


/**
 * DIRECTION ARTISTIQUE — STYLE UNIQUE : TECH CANVAS
 * Le portfolio adopte exclusivement l'identité visuelle Tech Canvas.
 */
const DEFAULT_PALETTE = 'tech-canvas';

function setPalette(palette = DEFAULT_PALETTE) {
  document.body.setAttribute('data-palette', DEFAULT_PALETTE);
}

/**
 * POINTEUR / CURSEUR INTERACTIF (Inspiré de Aahil Khan & Tech Canvas)
 * Physique fluide par interpolation (LERP) avec morphing contextuel (.big, .precise)
 * Raccourci clavier : Touche 'L' (hors champs de saisie) pour activer/désactiver
 */
let isLaserActive = true;
let cursorCurrentX = window.innerWidth / 2;
let cursorCurrentY = window.innerHeight / 2;
let cursorTargetX = cursorCurrentX;
let cursorTargetY = cursorCurrentY;
let cursorRafId = null;

function updateCursorPhysics() {
  if (!isLaserActive) return;
  const cursorDot = document.getElementById('laser-dot') || document.getElementById('cursor');
  if (cursorDot) {
    cursorCurrentX += (cursorTargetX - cursorCurrentX) * 0.35;
    cursorCurrentY += (cursorTargetY - cursorCurrentY) * 0.35;
    cursorDot.style.left = `${cursorCurrentX}px`;
    cursorDot.style.top = `${cursorCurrentY}px`;
  }
  cursorRafId = requestAnimationFrame(updateCursorPhysics);
}

function toggleLaser(forceState) {
  const cursorDot = document.getElementById('laser-dot') || document.getElementById('cursor');
  const laserBtn = document.getElementById('laser-btn');
  if (!cursorDot) return;

  if (typeof forceState === 'boolean') {
    isLaserActive = forceState;
  } else {
    isLaserActive = !isLaserActive;
  }

  try {
    localStorage.setItem('laser_active', isLaserActive ? '1' : '0');
  } catch (e) {}

  if (isLaserActive) {
    cursorDot.style.display = 'block';
    cursorDot.classList.add('on');
    document.body.style.cursor = 'none';
    if (laserBtn) laserBtn.classList.add('laser-active');
    if (!cursorRafId) {
      cursorRafId = requestAnimationFrame(updateCursorPhysics);
    }
  } else {
    cursorDot.style.display = 'none';
    cursorDot.classList.remove('on');
    document.body.style.cursor = 'default';
    if (laserBtn) laserBtn.classList.remove('laser-active');
    if (cursorRafId) {
      cancelAnimationFrame(cursorRafId);
      cursorRafId = null;
    }
  }
}

document.addEventListener('pointermove', (e) => {
  if (e.pointerType === 'touch' || !isLaserActive) return;
  const cursorDot = document.getElementById('laser-dot') || document.getElementById('cursor');
  if (!cursorDot) return;

  cursorTargetX = e.clientX;
  cursorTargetY = e.clientY;
  cursorDot.classList.add('on');

  const target = e.target;
  // Détection des états contextuels :
  // État Precise : liens, badges, tags, chips, icônes, champs texte
  const isPrecise = Boolean(
    target && target.closest('a, .badge, .btn-outline, .social-links a, .header-social-links a, input, textarea, select, .chip, .tech-marquee-item, [role="button"]')
  );
  // État Big Ring : boutons principaux, cartes de projets, header cartes, accordéons
  const isBig = Boolean(
    !isPrecise && target && target.closest('.btn, button, .portfolio-card, .tech-pillar-card, .hero-stats .stat-item, .modal-content, .logo')
  );

  cursorDot.classList.toggle('precise', isPrecise);
  cursorDot.classList.toggle('big', isBig);
});

document.addEventListener('pointerleave', () => {
  const cursorDot = document.getElementById('laser-dot') || document.getElementById('cursor');
  if (cursorDot) cursorDot.classList.remove('on');
});

document.addEventListener('keydown', (e) => {
  const tag = (e.target && e.target.tagName) ? e.target.tagName.toUpperCase() : '';
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (e.target && e.target.isContentEditable)) {
    return;
  }
  if (e.key === 'l' || e.key === 'L') {
    toggleLaser();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  setPalette(DEFAULT_PALETTE);

  // Initialisation du pointeur laser (activé par défaut)
  let savedLaser = '1';
  try {
    const item = localStorage.getItem('laser_active');
    if (item !== null) savedLaser = item;
  } catch (e) {}
  if (savedLaser !== '0') {
    toggleLaser(true);
  }

  // Synchronisation automatique de l'état du bouton "Tout afficher"
  const langEl = document.getElementById('languages');
  const softEl = document.getElementById('softwares');
  const toggleBtn = document.getElementById('btn-toggle-all-skills');
  const toggleBtnText = document.getElementById('toggle-all-text');

  function syncToggleAllState() {
    if (!langEl || !softEl || !toggleBtn || !toggleBtnText) return;
    setTimeout(() => {
      const bothOpen = langEl.classList.contains('show') && softEl.classList.contains('show');
      if (bothOpen) {
        toggleBtnText.textContent = 'Masquer tout';
        toggleBtn.classList.add('active-all');
        const icon = toggleBtn.querySelector('i');
        if (icon) icon.className = 'bi bi-chevron-up me-2';
      } else {
        toggleBtnText.textContent = 'Tout afficher (Tous)';
        toggleBtn.classList.remove('active-all');
        const icon = toggleBtn.querySelector('i');
        if (icon) icon.className = 'bi bi-grid-3x3-gap-fill me-2';
      }
    }, 150);
  }

  if (langEl) {
    langEl.addEventListener('shown.bs.collapse', syncToggleAllState);
    langEl.addEventListener('hidden.bs.collapse', syncToggleAllState);
  }
  if (softEl) {
    softEl.addEventListener('shown.bs.collapse', syncToggleAllState);
    softEl.addEventListener('hidden.bs.collapse', syncToggleAllState);
  }
});

/**
 * AFFICHAGE MANUEL DE TOUTES LES COMPÉTENCES (TOUT AFFICHER / MASQUER)
 */
function toggleAllSkills() {
  const langEl = document.getElementById('languages');
  const softEl = document.getElementById('softwares');
  const toggleBtn = document.getElementById('btn-toggle-all-skills');
  const toggleBtnText = document.getElementById('toggle-all-text');
  if (!langEl || !softEl) return;

  const langOpen = langEl.classList.contains('show');
  const softOpen = softEl.classList.contains('show');
  const shouldOpen = !(langOpen && softOpen);

  const langCollapse = bootstrap.Collapse.getOrCreateInstance(langEl, { toggle: false });
  const softCollapse = bootstrap.Collapse.getOrCreateInstance(softEl, { toggle: false });

  if (shouldOpen) {
    langCollapse.show();
    softCollapse.show();
    if (toggleBtnText) toggleBtnText.textContent = 'Masquer tout';
    if (toggleBtn) {
      toggleBtn.classList.add('active-all');
      const icon = toggleBtn.querySelector('i');
      if (icon) icon.className = 'bi bi-chevron-up me-2';
    }
  } else {
    langCollapse.hide();
    softCollapse.hide();
    if (toggleBtnText) toggleBtnText.textContent = 'Tout afficher (Tous)';
    if (toggleBtn) {
      toggleBtn.classList.remove('active-all');
      const icon = toggleBtn.querySelector('i');
      if (icon) icon.className = 'bi bi-grid-3x3-gap-fill me-2';
    }
  }
}
