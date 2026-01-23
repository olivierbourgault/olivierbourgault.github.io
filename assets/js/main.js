/**
* Template Name: EasyFolio
* Template URL: https://bootstrapmade.com/easyfolio-bootstrap-portfolio-template/
* Updated: Feb 21 2025 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
/**
 * Initiatialise some constants
 */
const TODAY = new Date();
const BIRTH = new Date("2001-05-08");
const START = new Date("2021-01-25");

/**
 * Initiate glightbox
 */
const glightbox = GLightbox({
  selector: '.glightbox'
});

/**
 * Animation on scroll function and init
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
  * On page load
  */
window.addEventListener('load', function (e) {
  if (window.innerWidth <= 540) {
    document.getElementsByClassName("loading__bar")[0].classList.toggle("d-none");
  }

  setTimeout(() => {
    document.getElementById("spinner").classList.add("d-none");
    document.getElementById("page").classList.remove("d-none");
    // document.getElementById('age').innerHTML = diffDate(BIRTH, TODAY);
    document.getElementById('experience').innerHTML = diffDate(START, TODAY);
    main();

    setTimeout(() => {
      document.getElementsByClassName("filter-active")[0].click();
    }, 750);
  }, 3000);
});

/**
  * On scroll
  */
document.addEventListener('scroll', function (e) {
  navmenuScrollspy();
  toggleScrolled();
  toggleScrollTop();
});

/**
  * On resize
  */
window.addEventListener('resize', function (e) {
  positionSkills();
});

/**
  * Hide the spinner and show the page
  */
function main() {
  if (location.href.includes("https")) {
    document.getElementById("projectsCount").innerHTML = 0;
    getData('https://api.github.com/repos/rinoship77/mesprojets');
  }

  fetchPersonalProjects()

  aosInit();
  positionSkills();
  scrollPosition();
  toggleScrolled();
  navmenuScrollspy();
  adjustSkills("languages");
  adjustSkills("softwares");
}

/**
 * Init isotope layout and filters
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
 * Navmenu Scrollspy
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

/**
 * Hide mobile nav on same-page/hash links
 */
document.querySelectorAll('#navmenu a').forEach(navmenu => {
  navmenu.addEventListener('click', () => {
    if (document.querySelector('.mobile-nav-active')) {
      mobileNavToogle();
    }
  });
});

/**
 * Toggle mobile nav dropdowns
 */
document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
  navmenu.addEventListener('click', function (e) {
    e.preventDefault();
    this.parentNode.classList.toggle('active');
    this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
    e.stopImmediatePropagation();
  });
});

/**
 * Mobile nav toggle
 */
function mobileNavToogle() {
  document.body.classList.toggle('mobile-nav-active');
  document.querySelector('.mobile-nav-toggle').classList.toggle('bi-list');
  document.querySelector('.mobile-nav-toggle').classList.toggle('bi-x');
}
if (document.querySelector('.mobile-nav-toggle')) {
  document.querySelector('.mobile-nav-toggle').addEventListener('click', mobileNavToogle);
}

/**
 * Manage the color modes (light AND dark)
 */
function switchTheme(themeSwitch) {
  if (!themeSwitch) {
    document.getElementById("themeSwitcher").classList.replace("bi-moon-stars-fill", "bi-sun-fill");
    document.body.setAttribute("data-bs-theme", "dark");
    document.getElementById("logo").src = `assets/img/logo/dark.png`;
  } else {
    document.getElementById("themeSwitcher").classList.replace("bi-sun-fill", "bi-moon-stars-fill");
    document.body.removeAttribute("data-bs-theme");
    document.getElementById("logo").src = `assets/img/logo/light.png`;
  }

  document.body.classList.toggle("dark");
}

/**
 * Animate the skills items on reveal
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
 * Correct scrolling position upon page load for URLs containing hash links.
 */
function scrollPosition() {
  if (window.location.hash) {
    if (document.querySelector(window.location.hash)) {
      setTimeout(() => {
        let section = document.querySelector(window.location.hash);
        let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
        window.scrollTo({
          top: section.offsetTop - parseInt(scrollMarginTop),
          behavior: 'smooth'
        });
      }, 100);
    }
  }
};

/**
 * Show the data that was fetch
 */
function displayData(url, data) {
  if (url.includes("rinoship77")) {
    getData(data.contents_url.slice(0, (data.contents_url.lastIndexOf("/") + 1)));
  } else {
    for (let index = 0; index < data.length - 1; index++) {
      getData(data[index].url);
    }
  }
}

/**
 * Set the number of projects
 */
function countProjects(projects) {
  projects.forEach(project => {
    if (project.type === "dir")
      document.getElementById("projectsCount").innerHTML = parseInt(document.getElementById("projectsCount").innerHTML) + 1;
  });
}

/**
 * Apply .scrolled class to the body as the page is scrolled down
 */
function toggleScrolled() {
  if (!document.querySelector('#header').classList.contains('scroll-up-sticky') && !document.querySelector('#header').classList.contains('sticky-top') && !document.querySelector('#header').classList.contains('fixed-top')) return;
  window.scrollY > 100 ? document.body.classList.add('scrolled') : document.body.classList.remove('scrolled');
}

/**
 * Show scroll top button
 */
function toggleScrollTop() {
  if (document.querySelector('.scroll-top')) {
    window.scrollY > 100 ? document.querySelector('.scroll-top').classList.add('active') : document.querySelector('.scroll-top').classList.remove('active');
  }
}

/**
 * Scroll to top button
 */
document.querySelector('.scroll-top').addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

/**
 * Add a margin to each skill
*/
function positionSkills() {
  if (window.innerWidth < 540) {
    document.getElementById("skills-collapsable").children[0].classList.add("flex-column");
  } else {
    document.getElementById("skills-collapsable").children[0].classList.remove("flex-column");
  }
}

/**
 * Add a margin to each skill
*/
function adjustSkills(category) {
  for (let index = 0; index < document.getElementById(category).children[0].children[0].children.length; index++) {
    document.getElementById(category).children[0].children[0].children[index].classList.add("m-1");
  }
}

/**
 * Open the email client with the correct parameters
 */
function sendEmail() {
  if (document.getElementsByName('message')[0].value.length !== 0) {
    window.location.href = `mailto:bourgault.olivier8501@gmail.com&subject=Contact de ${document.getElementsByName('name')[0].value} pour ${document.getElementsByName('subject')[0].value.toLowerCase()}&body=${document.getElementsByName('message')[0].value}`;
  }
}

/**
 * Return the difference between two dates
 */
function diffDate(date1, date2) {
  return Math.abs(Math.round((((date2.getTime() - date1.getTime()) / 1000) / 86400) / 365.25));
}

/**
 * Retrieve the data from Github
 */
async function getData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!url.includes("?")) {
      displayData(url.substring((url.indexOf("github.com/") + 11)), data);
    } else {
      countProjects(data);
    }
  } catch (error) {
    console.error('There was an error!', error);
  }
}

//**********************************************************************
/**
 * FETCH PERSONAL PROJECTS DYNAMICALLY
 * This function adds projects from your GitHub 'Personnel' folder that aren't already in the HTML.
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

    if (newProjects.length === 0) return; // Nothing to add

    // 4. Generate HTML for new projects
    const container = document.querySelector('.isotope-container');
    const newElements = [];

    newProjects.forEach(project => {
      // Extract description from README (Simple parser: looks for ProjectName and grabs the line/paragraph after it)
      // Adjust regex based on your actual README format. This assumes: "- **Project**: Description" or "### Project \n Description"
      let description = "Voir le projet pour plus de détails.";
      
      // 1. Trouver la ligne dans le README
      // On cherche une ligne qui contient le lien vers le dossier du projet: ](NomDuProjet)
      // Le drapeau 'im' permet de chercher ligne par ligne (multiligne) et insensible à la casse
      const lineRegex = new RegExp(`^.*?\\]\\(${project.name}\\).*$`, 'im');
      const match = readmeText.match(lineRegex);

      if (match) {
        description = match[0];

        // 2. Nettoyage du texte (Ordre important)
        
        // A. Remplacer les liens Markdown [Texte](URL) par juste "Texte"
        description = description.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

        // B. Enlever les caractères de formatage (***, **, *, _, `)
        description = description.replace(/[*_`]/g, '');

        // C. Enlever le préfixe de liste et citation (> 1. )
        // Explication: ^ (début) > (citation) \s* (espace optionnel) \d+ (chiffre) \. (point)
        description = description.replace(/^>\s*\d+\.\s*/, '');

        // D. Nettoyer les espaces superflus au début/fin
        description = description.trim();
      }

      // Image URL (Assumes a preview.png exists, otherwise falls back to logo via onerror)
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
    // We need to retrieve the Isotope instance. Since it's local in the existing code, 
    // we re-access it via the data attribute which Isotope automatically stores.
    const iso = Isotope.data(container);
    if (iso) {
      iso.appended(newElements);
      
      // Re-init lightbox for new items
      const newLightbox = GLightbox({ selector: '.glightbox' });
      
      // Wait for images to load (if using real images) or just relayout
      iso.layout();
    }

  } catch (error) {
    console.error("Error loading personal projects:", error);
  }
}