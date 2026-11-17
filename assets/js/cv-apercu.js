/**
 * CV - Aperçu Page Controller
 * Self-contained, guarded script (does NOT load main.js or vendor plugins).
 */
(function () {
  'use strict';

  const VERSION_KEY_STORAGE = 'cv_portfolio_theme';
  const LASER_KEY_STORAGE = 'laser_active';

  let portfolioThemeDark = true;
  try {
    portfolioThemeDark = localStorage.getItem(VERSION_KEY_STORAGE) !== 'light';
  } catch (e) {
    portfolioThemeDark = true;
  }

  function getVersionFromUrl() {
    try {
      const params = new URLSearchParams(window.location.search);
      const raw = (params.get('version') || params.get('style') || '').toLowerCase();
      const hash = (window.location.hash || '').replace(/^#/, '').toLowerCase();
      if (
        raw === 'portfolio' ||
        raw === 'tech' ||
        raw === 'tech-canvas' ||
        (!raw && (hash === 'portfolio' || hash === 'tech' || hash === 'tech-canvas'))
      ) {
        return 'portfolio';
      }
    } catch (e) {
      // Fallback to reference
    }
    return 'reference';
  }

  /* ------------------------------------------------------------------------
     Optional Portfolio-Only Virtual Laser Pointer (#laser-dot, key 'L')
     ------------------------------------------------------------------------ */
  let laserInitialized = false;
  let isLaserActive = false;
  let laserRafId = null;
  let laserDotEl = null;
  let laserMouseX = 0;
  let laserMouseY = 0;
  let laserDotX = 0;
  let laserDotY = 0;
  let hasFinePointer = false;

  try {
    hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  } catch (e) {
    hasFinePointer = false;
  }

  function stopLaserLoop() {
    if (laserRafId !== null) {
      cancelAnimationFrame(laserRafId);
      laserRafId = null;
    }
    if (laserDotEl) {
      laserDotEl.classList.remove('on', 'precise', 'big');
    }
    document.body.style.cursor = '';
  }

  function startLaserLoop() {
    if (!laserDotEl || !hasFinePointer || !isLaserActive) return;
    document.body.style.cursor = 'none';
    if (laserRafId !== null) return;

    function tick() {
      if (!isLaserActive || document.documentElement.getAttribute('data-cv-version') !== 'portfolio') {
        stopLaserLoop();
        return;
      }
      laserDotX += (laserMouseX - laserDotX) * 0.35;
      laserDotY += (laserMouseY - laserDotY) * 0.35;
      laserDotEl.style.left = laserDotX + 'px';
      laserDotEl.style.top = laserDotY + 'px';
      laserRafId = requestAnimationFrame(tick);
    }

    laserRafId = requestAnimationFrame(tick);
  }

  function initLaserPointer() {
    if (laserInitialized) return;
    laserDotEl = document.getElementById('laser-dot');
    if (!laserDotEl) return;
    laserInitialized = true;

    try {
      const saved = localStorage.getItem(LASER_KEY_STORAGE);
      isLaserActive = saved === '1';
    } catch (e) {
      isLaserActive = false;
    }

    document.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      laserMouseX = e.clientX;
      laserMouseY = e.clientY;
      if (!isLaserActive || document.documentElement.getAttribute('data-cv-version') !== 'portfolio') return;
      laserDotEl.classList.add('on');
      const target = e.target;
      const isInteractive = target && typeof target.closest === 'function' &&
        target.closest('a, button, input, textarea, select, [role="button"]');
      laserDotEl.classList.toggle('precise', Boolean(isInteractive));
      laserDotEl.classList.toggle('big', !isInteractive);
    }, { passive: true });

    document.addEventListener('pointerleave', () => {
      if (laserDotEl) laserDotEl.classList.remove('on');
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'l' && e.key !== 'L') return;
      const active = document.activeElement;
      if (active && (
        active.tagName === 'INPUT' ||
        active.tagName === 'TEXTAREA' ||
        active.tagName === 'SELECT' ||
        active.isContentEditable
      )) {
        return;
      }
      if (document.documentElement.getAttribute('data-cv-version') !== 'portfolio') return;
      isLaserActive = !isLaserActive;
      try {
        localStorage.setItem(LASER_KEY_STORAGE, isLaserActive ? '1' : '0');
      } catch (err) {
        // Ignore storage errors
      }
      if (isLaserActive) {
        startLaserLoop();
      } else {
        stopLaserLoop();
      }
    });
  }

  function syncLaserForVersion(version) {
    initLaserPointer();
    if (version === 'portfolio' && isLaserActive && hasFinePointer) {
      startLaserLoop();
    } else {
      stopLaserLoop();
    }
  }

  /* ------------------------------------------------------------------------
     Version & Theme Switcher
     ------------------------------------------------------------------------ */
  function syncThemeSwitcherUI(version) {
    const icon = document.getElementById('themeSwitcher');
    const btn = document.getElementById('themeSwitcherBtn') || (icon ? icon.closest('button, a') : null);
    if (!icon || !btn) return;

    if (version === 'reference') {
      icon.classList.remove('bi-sun-fill');
      icon.classList.add('bi-moon-stars-fill');
      btn.setAttribute('aria-label', 'Activer le thème Portfolio sombre');
      btn.setAttribute('title', 'Passer à la version Portfolio (mode sombre)');
      btn.setAttribute('aria-pressed', 'false');
    } else if (portfolioThemeDark) {
      icon.classList.remove('bi-moon-stars-fill');
      icon.classList.add('bi-sun-fill');
      btn.setAttribute('aria-label', 'Passer au thème Portfolio clair');
      btn.setAttribute('title', 'Passer au mode clair (Tech Canvas)');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      icon.classList.remove('bi-sun-fill');
      icon.classList.add('bi-moon-stars-fill');
      btn.setAttribute('aria-label', 'Passer au thème Portfolio sombre');
      btn.setAttribute('title', 'Passer au mode sombre (Tech Canvas)');
      btn.setAttribute('aria-pressed', 'false');
    }
  }

  function applyVersion(version, options) {
    const opts = options || {};
    const next = version === 'portfolio' ? 'portfolio' : 'reference';

    document.documentElement.setAttribute('data-cv-version', next);
    document.body.setAttribute('data-cv-version', next);

    if (next === 'portfolio') {
      document.body.setAttribute('data-palette', 'tech-canvas');
      document.body.classList.toggle('dark', portfolioThemeDark);
      if (portfolioThemeDark) {
        document.body.setAttribute('data-bs-theme', 'dark');
      } else {
        document.body.removeAttribute('data-bs-theme');
      }
    } else {
      document.body.removeAttribute('data-palette');
      document.body.classList.remove('dark');
      document.body.removeAttribute('data-bs-theme');
    }

    document.querySelectorAll('[data-cv-version-btn]').forEach((btn) => {
      const isMatch = btn.getAttribute('data-version') === next;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
    });

    const statusEl = document.getElementById('cvVersionStatus');
    if (statusEl) {
      if (next === 'reference') {
        statusEl.textContent = 'Style Référence';
      } else {
        statusEl.textContent = portfolioThemeDark
          ? 'Thème Portfolio (Sombre)'
          : 'Thème Portfolio (Clair)';
      }
    }

    syncThemeSwitcherUI(next);
    syncLaserForVersion(next);

    if (opts.updateHistory) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('version', next);
        url.hash = '';
        window.history.replaceState({ version: next }, '', url.toString());
      } catch (e) {
        // Ignore history errors in restricted contexts
      }
    }
  }

  function handleThemeSwitch() {
    const current = document.documentElement.getAttribute('data-cv-version') === 'portfolio'
      ? 'portfolio'
      : 'reference';

    if (current === 'reference') {
      portfolioThemeDark = true;
      try {
        localStorage.setItem(VERSION_KEY_STORAGE, 'dark');
      } catch (e) {
        // Ignore storage errors
      }
      applyVersion('portfolio', { updateHistory: true });
      return;
    }

    portfolioThemeDark = !portfolioThemeDark;
    try {
      localStorage.setItem(VERSION_KEY_STORAGE, portfolioThemeDark ? 'dark' : 'light');
    } catch (e) {
      // Ignore storage errors
    }
    applyVersion('portfolio', { updateHistory: false });
  }

  window.switchTheme = handleThemeSwitch;

  /* ------------------------------------------------------------------------
     Navbar Scroll Morph & Scroll-Top Button
     ------------------------------------------------------------------------ */
  function toggleScrolled() {
    const header = document.getElementById('header');
    if (!header) return;
    if (
      !header.classList.contains('scroll-up-sticky') &&
      !header.classList.contains('sticky-top') &&
      !header.classList.contains('fixed-top')
    ) {
      return;
    }
    const isScrolled = window.scrollY > 24;
    document.body.classList.toggle('scrolled', isScrolled);
    header.classList.toggle('solid', isScrolled);
  }

  function toggleScrollTop() {
    const scrollTopBtn = document.getElementById('scroll-top');
    if (!scrollTopBtn) return;
    scrollTopBtn.classList.toggle('active', window.scrollY > 100);
  }

  /* ------------------------------------------------------------------------
     Accessible Mobile Slide-Out Drawer (Focus Trap, Esc, Scrim, >=1200px Reset)
     ------------------------------------------------------------------------ */
  function initMobileDrawer() {
    const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
    const navmenu = document.getElementById('navmenu');
    const menuCloseBtn = document.getElementById('menuCloseBtn');
    const menuScrim = document.getElementById('menuScrim');
    const mainEl = document.getElementById('main-content');
    const footerEl = document.getElementById('footer');

    if (!navmenu) return;

    function getFocusableInDrawer() {
      return Array.from(
        navmenu.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')
      ).filter((el) => el.offsetParent !== null);
    }

    function setMobileNavOpen(shouldOpen, restoreFocus) {
      const open = Boolean(shouldOpen);
      document.body.classList.toggle('mobile-nav-active', open);

      if (mobileNavToggleBtn) {
        mobileNavToggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
      if (menuScrim) {
        menuScrim.setAttribute('aria-hidden', open ? 'false' : 'true');
      }
      if (mainEl) {
        mainEl.inert = open;
      }
      if (footerEl) {
        footerEl.inert = open;
      }

      if (open && menuCloseBtn) {
        requestAnimationFrame(() => menuCloseBtn.focus());
      } else if (!open && restoreFocus && mobileNavToggleBtn) {
        mobileNavToggleBtn.focus();
      }
    }

    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = document.body.classList.contains('mobile-nav-active');
        setMobileNavOpen(!isOpen, false);
      });
    }

    if (menuCloseBtn) {
      menuCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setMobileNavOpen(false, true);
      });
    }

    if (menuScrim) {
      menuScrim.addEventListener('click', () => {
        setMobileNavOpen(false, true);
      });
    }

    navmenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (document.body.classList.contains('mobile-nav-active')) {
          setMobileNavOpen(false, false);
        }
      });
    });

    document.addEventListener('keydown', (e) => {
      if (!document.body.classList.contains('mobile-nav-active')) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        setMobileNavOpen(false, true);
        return;
      }

      if (e.key === 'Tab' && window.innerWidth < 1200) {
        const focusable = getFocusableInDrawer();
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1200 && document.body.classList.contains('mobile-nav-active')) {
        setMobileNavOpen(false, false);
      }
    }, { passive: true });
  }

  /* ------------------------------------------------------------------------
     Bootstrap on DOMContentLoaded
     ------------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    const initialVersion = getVersionFromUrl();
    const hasVersionHash = /^#(reference|portfolio|tech|tech-canvas)$/i.test(window.location.hash || '');
    applyVersion(initialVersion, { updateHistory: hasVersionHash });
    toggleScrolled();
    toggleScrollTop();
    initMobileDrawer();

    document.querySelectorAll('[data-cv-version-btn]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetVersion = btn.getAttribute('data-version');
        applyVersion(targetVersion, { updateHistory: true });
      });
    });

    const themeSwitcherBtn = document.getElementById('themeSwitcherBtn');
    if (themeSwitcherBtn) {
      themeSwitcherBtn.addEventListener('click', handleThemeSwitch);
    }

    document.querySelectorAll('[data-print-cv]').forEach((btn) => {
      btn.addEventListener('click', () => {
        window.print();
      });
    });

    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    window.addEventListener('scroll', () => {
      toggleScrolled();
      toggleScrollTop();
    }, { passive: true });

    window.addEventListener('popstate', () => {
      applyVersion(getVersionFromUrl(), { updateHistory: false });
    });
  });
})();
