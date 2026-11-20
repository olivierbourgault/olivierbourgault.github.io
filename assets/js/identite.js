/**
 * Identité visuelle & Logos — OB Tech Canvas Story & Chart
 * Script autonome (sans dépendance à main.js), conforme à Modern Web Guidance.
 */
(function () {
  'use strict';

  const THEME_STORAGE_KEY = 'ob_identite_theme';
  const FALLBACK_THEME_KEY = 'ob_versions_theme';
  const LASER_STORAGE_KEY = 'laser_active';

  const HERO_EMBLEM_META = {
    'ob-tech': 'OB Hexagonal · R 46 · 60°',
    terminal: 'Terminal </> · R 44 · 74°',
    neural: 'Nœud Neuronal · R 42 · dash 8/4'
  };

  /* ------------------------------------------------------------------------
     1. Theme Switcher (Sombre Carbone / Clair Ivoire)
     ------------------------------------------------------------------------ */
  function applyTheme(isDark, persist = true) {
    document.documentElement.classList.toggle('theme-light', !isDark);
    document.body.classList.toggle('dark', isDark);
    document.body.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');

    const icon = document.getElementById('themeSwitcher');
    const btn = document.getElementById('themeSwitcherBtn');
    if (icon) {
      icon.classList.toggle('bi-sun-fill', isDark);
      icon.classList.toggle('bi-moon-stars-fill', !isDark);
    }
    if (btn) {
      btn.setAttribute('aria-label', isDark ? 'Passer au mode clair' : 'Passer au mode sombre');
      btn.setAttribute('title', isDark ? 'Passer au mode clair' : 'Passer au mode sombre');
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    }

    if (persist) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
      } catch (e) {
        // Ignore storage errors
      }
    }
  }

  function initTheme() {
    let isDark = true;
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        isDark = saved === 'dark';
      } else {
        const fallback = localStorage.getItem(FALLBACK_THEME_KEY);
        if (fallback === 'light') isDark = false;
      }
    } catch (e) {
      isDark = true;
    }
    applyTheme(isDark, false);

    const btn = document.getElementById('themeSwitcherBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        applyTheme(!document.body.classList.contains('dark'), true);
      });
    }
  }

  /* ------------------------------------------------------------------------
     2. Navbar Scroll Hysteresis, Mobile Drawer & Scroll Top
     ------------------------------------------------------------------------ */
  function toggleScrolled() {
    const header = document.getElementById('header');
    if (!header) return;
    const y = window.scrollY;
    const currentlyScrolled = document.body.classList.contains('scrolled');
    const shouldBeScrolled = currentlyScrolled ? y > 50 : y > 110;
    if (shouldBeScrolled !== currentlyScrolled) {
      document.body.classList.toggle('scrolled', shouldBeScrolled);
      header.classList.toggle('solid', shouldBeScrolled);
    }
  }

  function toggleScrollTop() {
    const scrollTop = document.getElementById('scroll-top');
    if (scrollTop) {
      scrollTop.classList.toggle('active', window.scrollY > 160);
    }
  }

  function initMobileNav() {
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const closeBtn = document.getElementById('menuCloseBtn');
    const scrim = document.getElementById('menuScrim');

    function setOpen(forceState, restoreFocus = false) {
      const isOpen = document.body.classList.contains('mobile-nav-active');
      const shouldOpen = typeof forceState === 'boolean' ? forceState : !isOpen;
      document.body.classList.toggle('mobile-nav-active', shouldOpen);
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
      if (shouldOpen && closeBtn) {
        requestAnimationFrame(() => closeBtn.focus());
      } else if (!shouldOpen && restoreFocus && toggleBtn) {
        toggleBtn.focus();
      }
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setOpen();
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setOpen(false, true);
      });
    }
    if (scrim) {
      scrim.addEventListener('click', () => setOpen(false, true));
    }
    document.querySelectorAll('#navmenu a').forEach((link) => {
      link.addEventListener('click', () => {
        if (document.body.classList.contains('mobile-nav-active')) {
          setOpen(false, false);
        }
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('mobile-nav-active')) {
        setOpen(false, true);
      }
    });
  }

  /* ------------------------------------------------------------------------
     3. Aahil Khan Cursor + Orange Radial Halo (#laser-dot, key 'L')
     ------------------------------------------------------------------------ */
  function initInteractiveCursor() {
    const cursorDot = document.getElementById('laser-dot');
    if (!cursorDot) return;

    let hasFinePointer = false;
    try {
      hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    } catch (e) {
      hasFinePointer = false;
    }
    if (!hasFinePointer) return;

    let isActive = true;
    try {
      const saved = localStorage.getItem(LASER_STORAGE_KEY);
      if (saved === '0') isActive = false;
    } catch (e) {
      isActive = true;
    }

    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let targetX = currentX;
    let targetY = currentY;
    let rafId = null;

    function tick() {
      if (!isActive) {
        rafId = null;
        return;
      }
      currentX += (targetX - currentX) * 0.35;
      currentY += (targetY - currentY) * 0.35;
      cursorDot.style.left = `${currentX}px`;
      cursorDot.style.top = `${currentY}px`;
      rafId = requestAnimationFrame(tick);
    }

    function setCursorState(enabled) {
      isActive = enabled;
      try {
        localStorage.setItem(LASER_STORAGE_KEY, isActive ? '1' : '0');
      } catch (e) {}

      if (isActive) {
        cursorDot.style.display = 'block';
        cursorDot.classList.add('on');
        document.body.style.cursor = 'none';
        if (!rafId) rafId = requestAnimationFrame(tick);
      } else {
        cursorDot.style.display = 'none';
        cursorDot.classList.remove('on', 'big', 'precise');
        document.body.style.cursor = '';
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    }

    document.addEventListener(
      'pointermove',
      (e) => {
        if (e.pointerType === 'touch' || !isActive) return;
        targetX = e.clientX;
        targetY = e.clientY;
        cursorDot.classList.add('on');

        const target = e.target;
        const isPrecise = Boolean(
          target &&
            target.closest(
              'a, .inspector-tab, .surface-btn, .hero-emblem-btn, .bench-btn, .copy-button, .vnav-item-btn, .svg-dl-btn, .hero-anchor-pill, input, [role="button"]'
            )
        );
        const isBig = Boolean(
          !isPrecise &&
            target &&
            target.closest(
              'button, .identite-btn-primary, .identite-btn-secondary, .identite-btn-outline, .tech-pillar-card, .origin-step-card, .logo-chapter-card, .palette-token-card, .logo'
            )
        );
        cursorDot.classList.toggle('precise', isPrecise);
        cursorDot.classList.toggle('big', isBig);
      },
      { passive: true }
    );

    document.addEventListener('pointerleave', () => {
      cursorDot.classList.remove('on');
    });

    document.addEventListener('keydown', (e) => {
      const tag = e.target && e.target.tagName ? e.target.tagName.toUpperCase() : '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (e.target && e.target.isContentEditable)) {
        return;
      }
      if (e.key === 'l' || e.key === 'L') {
        setCursorState(!isActive);
      }
    });

    if (isActive) {
      setCursorState(true);
    }
  }

  /* ------------------------------------------------------------------------
     4. Hero Blueprint Emblem Switcher
     ------------------------------------------------------------------------ */
  function initHeroBlueprintSwitcher() {
    const switcher = document.getElementById('heroEmblemSwitcher');
    const svg = document.getElementById('heroBlueprintSvg');
    const readout = document.getElementById('heroBlueprintReadout');
    if (!switcher || !svg) return;

    const buttons = Array.from(switcher.querySelectorAll('[data-hero-emblem]'));
    const groups = Array.from(svg.querySelectorAll('[data-hero-svg]'));

    function selectEmblem(key) {
      buttons.forEach((btn) => {
        btn.setAttribute('aria-pressed', btn.getAttribute('data-hero-emblem') === key ? 'true' : 'false');
      });
      groups.forEach((g) => {
        g.classList.toggle('is-active', g.getAttribute('data-hero-svg') === key);
      });
      if (readout && HERO_EMBLEM_META[key]) {
        readout.textContent = HERO_EMBLEM_META[key];
      }
    }

    switcher.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-hero-emblem]');
      if (!btn) return;
      selectEmblem(btn.getAttribute('data-hero-emblem'));
    });
  }

  /* ------------------------------------------------------------------------
     5. Interactive 3-Mode SVG Inspectors (Modern Web Guidance: tabs)
     ------------------------------------------------------------------------ */
  function initLogoInspectors() {
    const hasNativeFocusgroup = Object.hasOwn(HTMLElement.prototype, 'focusGroup');
    const inspectors = Array.from(document.querySelectorAll('.logo-inspector'));

    inspectors.forEach((inspector) => {
      const tablist = inspector.querySelector('[role="tablist"]');
      const stage = inspector.querySelector('.inspector-stage');
      if (!tablist || !stage) return;

      const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
      const panels = Array.from(inspector.querySelectorAll('[role="tabpanel"]'));

      function activateTab(selectedTab, shouldFocus = false) {
        const mode = selectedTab.getAttribute('data-inspector-mode') || 'logo';
        stage.setAttribute('data-mode', mode);

        tabs.forEach((tab) => {
          const isCurrent = tab === selectedTab;
          tab.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
          tab.toggleAttribute('focusgroupstart', isCurrent);
          tab.tabIndex = isCurrent ? 0 : -1;
        });

        panels.forEach((panel) => {
          const isCurrent = panel.getAttribute('aria-labelledby') === selectedTab.id;
          panel.hidden = isCurrent ? false : 'until-found';
          if (isCurrent) {
            panel.setAttribute('tabindex', '0');
          } else {
            panel.removeAttribute('tabindex');
          }
        });

        if (shouldFocus) {
          selectedTab.focus();
        }
      }

      // Mouse & Enter/Space click activation
      tablist.addEventListener('click', (e) => {
        const tab = e.target.closest('[role="tab"]');
        if (!tab) return;
        activateTab(tab, false);
      });

      // Selection follows focus when native focusgroup handles arrow keys
      tablist.addEventListener('focusin', (e) => {
        const tab = e.target.closest('[role="tab"]');
        if (tab && tab.getAttribute('aria-selected') !== 'true') {
          activateTab(tab, false);
        }
      });

      // Keyboard fallback when native focusgroup is unavailable
      if (!hasNativeFocusgroup) {
        tablist.addEventListener('keydown', (e) => {
          const currentIdx = tabs.indexOf(document.activeElement);
          if (currentIdx === -1) return;

          let nextIdx = null;
          if (e.key === 'ArrowRight') nextIdx = (currentIdx + 1) % tabs.length;
          else if (e.key === 'ArrowLeft') nextIdx = (currentIdx - 1 + tabs.length) % tabs.length;
          else if (e.key === 'Home') nextIdx = 0;
          else if (e.key === 'End') nextIdx = tabs.length - 1;

          if (nextIdx !== null) {
            e.preventDefault();
            activateTab(tabs[nextIdx], true);
          }
        });
      }

      // Sync tab selection when Find-in-Page matches hidden="until-found" caption
      panels.forEach((panel) => {
        panel.addEventListener('beforematch', () => {
          const tabId = panel.getAttribute('aria-labelledby');
          const matchingTab = tabId ? document.getElementById(tabId) : null;
          if (matchingTab) activateTab(matchingTab, false);
        });
      });

      // Stage Surface Toggle (Carbone / Ivoire / Grille)
      const surfaceBtns = Array.from(stage.querySelectorAll('[data-stage-surface]'));
      stage.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-stage-surface]');
        if (!btn) return;
        const chosenSurface = btn.getAttribute('data-stage-surface');
        stage.setAttribute('data-surface', chosenSurface);
        surfaceBtns.forEach((b) => {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        });
      });
    });
  }

  /* ------------------------------------------------------------------------
     6. Multi-Surface Test Bench Switcher
     ------------------------------------------------------------------------ */
  function initTestBench() {
    const controls = document.getElementById('benchControls');
    const stage = document.getElementById('benchStage');
    if (!controls || !stage) return;

    const buttons = Array.from(controls.querySelectorAll('[data-bench-mode]'));
    controls.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-bench-mode]');
      if (!btn) return;
      const mode = btn.getAttribute('data-bench-mode');
      stage.setAttribute('data-bench-surface', mode);
      buttons.forEach((b) => {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
    });
  }

  /* ------------------------------------------------------------------------
     7. Sticky Vertical Sidebar Scroll-Spy (#vnavIdentiteList)
     ------------------------------------------------------------------------ */
  function initChapterSidebar() {
    const sidebarList = document.getElementById('vnavIdentiteList');
    if (!sidebarList) return;

    const buttons = Array.from(sidebarList.querySelectorAll('.vnav-item-btn[data-vnav-target]'));
    const targets = buttons
      .map((btn) => document.getElementById(btn.getAttribute('data-vnav-target')))
      .filter(Boolean);

    function setActive(targetId) {
      buttons.forEach((btn) => {
        btn.classList.toggle('is-active', btn.getAttribute('data-vnav-target') === targetId);
      });
    }

    sidebarList.addEventListener('click', (e) => {
      const btn = e.target.closest('.vnav-item-btn[data-vnav-target]');
      if (!btn) return;
      const targetId = btn.getAttribute('data-vnav-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        setActive(targetId);
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    if ('IntersectionObserver' in window && targets.length > 0) {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          if (visible.length > 0) {
            setActive(visible[0].target.id);
          }
        },
        { rootMargin: '-18% 0px -62% 0px', threshold: 0 }
      );
      targets.forEach((el) => observer.observe(el));
    }
  }

  /* ------------------------------------------------------------------------
     8. Accessible Copy-to-Clipboard (Modern Web Guidance: copy-button)
     ------------------------------------------------------------------------ */
  const copyTimers = new WeakMap();
  let lastCopyMessage = '';

  function legacyCopy(text) {
    const field = Object.assign(document.createElement('textarea'), { value: text });
    field.setAttribute('readonly', '');
    field.style.cssText = 'position:fixed;inset-block-start:0;opacity:0';
    document.body.append(field);
    field.select();
    try {
      return document.execCommand('copy');
    } finally {
      field.remove();
    }
  }

  function reportCopy(button, ok) {
    const tip = button.nextElementSibling;
    clearTimeout(copyTimers.get(button));
    button.removeAttribute('data-copied');
    button.removeAttribute('data-failed');

    let message = ok ? 'Copié !' : 'Échec';
    if (message === lastCopyMessage) message += '\u00A0';
    lastCopyMessage = message;

    if (tip) tip.textContent = '';
    void button.offsetWidth;
    button.setAttribute(ok ? 'data-copied' : 'data-failed', '');
    if (tip) requestAnimationFrame(() => (tip.textContent = message));

    copyTimers.set(
      button,
      setTimeout(() => {
        button.removeAttribute('data-copied');
        button.removeAttribute('data-failed');
        if (tip) tip.textContent = '';
      }, 2000)
    );
  }

  async function copyFromTarget(button, target) {
    if (!button || !target) return;
    const text = target.matches('input, textarea') ? target.value : target.innerText.trim();
    if (!text) return;

    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(text);
      } else if (!legacyCopy(text)) {
        throw new Error('Clipboard unavailable');
      }
      reportCopy(button, true);
    } catch (e) {
      try {
        if (legacyCopy(text)) {
          reportCopy(button, true);
          return;
        }
      } catch (err) {}
      reportCopy(button, false);
    }
  }

  function initCopyButtons() {
    // Single-path registration (Invoker Commands or click fallback, never both)
    if ('CommandEvent' in window) {
      document.addEventListener(
        'command',
        (event) => {
          if (event.command === '--copy') {
            copyFromTarget(event.source, event.target);
          }
        },
        true
      );
    } else {
      document.addEventListener('click', (event) => {
        const button = event.target.closest('button[command="--copy"]');
        if (!button) return;
        const targetId = button.getAttribute('commandfor');
        const target = targetId ? document.getElementById(targetId) : null;
        if (target) copyFromTarget(button, target);
      });
    }
  }

  /* ------------------------------------------------------------------------
     9. Init
     ------------------------------------------------------------------------ */
  function init() {
    initTheme();
    initMobileNav();
    initInteractiveCursor();
    initHeroBlueprintSwitcher();
    initLogoInspectors();
    initTestBench();
    initChapterSidebar();
    initCopyButtons();

    toggleScrolled();
    toggleScrollTop();

    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    window.addEventListener(
      'scroll',
      () => {
        toggleScrolled();
        toggleScrollTop();
      },
      { passive: true }
    );
  }

  document.addEventListener('DOMContentLoaded', init);
})();
