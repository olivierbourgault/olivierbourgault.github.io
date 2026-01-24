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
const BIRTH = new Date("2001-05-08");
const START = new Date("2021-01-25");

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
  // Only fetch GitHub data if running on the live site (HTTPS)
  if (location.href.includes("https")) {
    document.getElementById("projectsCount").innerHTML = 0;
    
    // 1. Fetch general repo data (counts projects)
    getData('https://api.github.com/repos/rinoship77/mesprojets');

    // 2. Fetch specific personal projects from "Personnel" folder
    fetchPersonalProjects();
  }

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
  let initIsotope;

  imagesLoaded(isotopeItem.querySelector('.isotope-container'), function () {
    initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
      itemSelector: '.isotope-item',
      layoutMode: layout,
      filter: filter,
      sortBy: sort
    });
  });

  isotopeItem.querySelectorAll('.isotope-filters li').forEach(function (filters) {
    filters.addEventListener('click', function () {
      isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
      this.classList.add('filter-active');
      initIsotope.arrange({
        filter: this.getAttribute('data-filter')
      });
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
  mobileNavToggleBtn.classList.toggle('bi-list');
  mobileNavToggleBtn.classList.toggle('bi-x');
}
if (mobileNavToggleBtn) {
  mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
}

document.querySelectorAll('#navmenu a').forEach(navmenu => {
  navmenu.addEventListener('click', () => {
    if (document.querySelector('.mobile-nav-active')) {
      mobileNavToogle();
    }
  });
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
/* DATA & API FUNCTIONS                            */
/* -------------------------------------------------------------------------- */

/**
 * Fetch Data from GitHub API recursively (Project Counters)
 */
async function getData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    if (!url.includes("?")) {
      const subPath = url.substring(url.indexOf("github.com/") + 11);
      displayData(subPath, data);
    } else {
      countProjects(data);
    }
  } catch (error) {
    console.error('There was an error fetching GitHub data:', error);
  }
}

function displayData(url, data) {
  if (url.includes("rinoship77")) {
    getData(data.contents_url.slice(0, (data.contents_url.lastIndexOf("/") + 1)));
  } else {
    for (let index = 0; index < data.length; index++) {
       getData(data[index].url);
    }
  }
}

function countProjects(projects) {
  const projectCounter = document.getElementById("projectsCount");
  projects.forEach(project => {
    if (project.type === "dir") {
      projectCounter.innerHTML = parseInt(projectCounter.innerHTML) + 1;
    }
  });
}

/**
 * FETCH PERSONAL PROJECTS DYNAMICALLY
 * Reads the 'Personnel' folder and the 'README.md' to create cards automatically.
 */
async function fetchPersonalProjects() {
  const repoOwner = "RinoShip77";
  const repoName = "MesProjets";
  const path = "Personnel";
  const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${path}`;
  const readmeUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${path}/README.md`;

  try {
    // 1. Get existing projects to prevent duplicates
    const existingProjects = Array.from(document.querySelectorAll('.portfolio-item h3'))
      .map(el => el.innerText.trim().toLowerCase());

    // 2. Fetch Repository Contents and README in parallel
    const [contentsRes, readmeRes] = await Promise.all([
      fetch(apiUrl),
      fetch(readmeUrl)
    ]);

    if (!contentsRes.ok) throw new Error("Could not fetch projects");

    const items = await contentsRes.json();
    const readmeText = await readmeRes.text();

    // 3. Filter for directories (projects) that don't exist in the HTML
    const newProjects = items.filter(item =>
      item.type === 'dir' && !existingProjects.includes(item.name.toLowerCase())
    );

    if (newProjects.length === 0) return;

    // 4. Generate HTML for new projects
    const container = document.querySelector('.isotope-container');
    const newElements = [];

    newProjects.forEach(project => {
      // Logic: Find regex match for >1. [Name](Name) ... description
      let description = "Voir le projet pour plus de détails.";
      const lineRegex = new RegExp(`^.*?\\]\\(${project.name}\\).*$`, 'im');
      const match = readmeText.match(lineRegex);

      if (match) {
        description = match[0];
        // Clean markdown: remove links, bold/italic, list numbers
        description = description.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
        description = description.replace(/[*_`]/g, '');
        description = description.replace(/^>\s*\d+\.\s*/, '');
        description = description.trim();
      }

      // Image URL (Assumes a preview.png exists, fallback to logo)
      const imgUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/main/${path}/${project.name}/preview.png`;
      const projectUrl = `https://github.com/${repoOwner}/${repoName}/tree/main/${path}/${project.name}`;

      const div = document.createElement('div');
      div.className = 'col-lg-6 col-md-6 portfolio-item isotope-item filter-personal';
      div.innerHTML = `
        <div class="portfolio-card">
          <div class="portfolio-image">
            <img src="${imgUrl}" class="img-fluid" alt="${project.name}" loading="lazy" 
                 onerror="this.onerror=null; this.src='assets/img/logo/light.png';">
            <div class="portfolio-overlay">
              <div class="portfolio-actions">
                <a href="${imgUrl}" class="glightbox preview-link" data-gallery="portfolio-gallery-new" 
                   onerror="this.href='assets/img/logo/light.png'"><i class="bi bi-eye"></i></a>
                <a href="${projectUrl}" target="_blank" class="details-link"><i class="bi bi-arrow-right"></i></a>
              </div>
            </div>
          </div>
          <div class="portfolio-content">
            <span class="category">Personnels</span>
            <h3>${project.name}</h3>
            <p class="text-break">${description}</p>
          </div>
        </div>
      `;
      container.appendChild(div);
      newElements.push(div);
    });

    // 5. Update Isotope layout
    const iso = Isotope.data(container);
    if (iso) {
      iso.appended(newElements);
      const newLightbox = GLightbox({ selector: '.glightbox' });
      iso.layout();
    }

  } catch (error) {
    console.error("Error loading personal projects:", error);
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
    window.location.href = `mailto:bourgault.olivier8501@gmail.com&subject=Contact de ${name} pour ${subject.toLowerCase()}&body=${message}`;
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