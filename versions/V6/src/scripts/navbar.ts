export function initNavbar(): void {
  const header = document.getElementById('header');
  const navmenu = document.getElementById('navmenu');
  const scrollTopBtn = document.getElementById('scroll-top');
  const isCvPage = document.body.classList.contains('cv-apercu-page');
  const isHomePage = document.body.classList.contains('index-page');

  function toggleScrolled(): void {
    if (!header) return;
    const y = window.scrollY;
    if (isCvPage) {
      const isScrolled = y > 24;
      document.body.classList.toggle('scrolled', isScrolled);
      header.classList.toggle('solid', isScrolled);
      return;
    }
    const currentlyScrolled = document.body.classList.contains('scrolled');
    const shouldBeScrolled = currentlyScrolled ? y > 50 : y > 110;
    if (shouldBeScrolled !== currentlyScrolled) {
      document.body.classList.toggle('scrolled', shouldBeScrolled);
      header.classList.toggle('solid', shouldBeScrolled);
    }
  }

  function toggleScrollTop(): void {
    if (!scrollTopBtn) return;
    scrollTopBtn.classList.toggle('active', window.scrollY > 140);
  }

  function updateScrollspy(): void {
    if (!isHomePage || !navmenu) return;
    const links = Array.from(navmenu.querySelectorAll<HTMLAnchorElement>('ul > li > a'));
    const position = window.scrollY + 200;

    for (const link of links) {
      if (!link.hash) continue;
      const section = document.querySelector<HTMLElement>(link.hash);
      if (!section) continue;
      const inBounds =
        position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight;
      if (inBounds) {
        for (const active of links) {
          active.classList.remove('active');
          active.removeAttribute('aria-current');
        }
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    }
  }

  // Mobile Slide-Out Drawer (Focus Trap, Esc, Scrim, inert)
  const toggleBtn = document.querySelector<HTMLButtonElement>('.mobile-nav-toggle');
  const closeBtn = document.getElementById('menuCloseBtn') as HTMLButtonElement | null;
  const scrim = document.getElementById('menuScrim');
  const mainEl = document.querySelector<HTMLElement>('main');
  const footerEl = document.getElementById('footer');

  function getFocusableInDrawer(): HTMLElement[] {
    if (!navmenu) return [];
    return Array.from(
      navmenu.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => el.offsetParent !== null);
  }

  function setMobileNavOpen(forceState?: boolean, restoreFocus = false): void {
    const isOpen = document.body.classList.contains('mobile-nav-active');
    const shouldOpen = typeof forceState === 'boolean' ? forceState : !isOpen;
    document.body.classList.toggle('mobile-nav-active', shouldOpen);

    if (toggleBtn) toggleBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    if (scrim) scrim.setAttribute('aria-hidden', shouldOpen ? 'false' : 'true');
    if (mainEl) mainEl.inert = shouldOpen;
    if (footerEl) footerEl.inert = shouldOpen;

    if (shouldOpen && closeBtn) {
      requestAnimationFrame(() => closeBtn.focus());
    } else if (!shouldOpen && restoreFocus && toggleBtn) {
      toggleBtn.focus();
    }
  }

  toggleBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    setMobileNavOpen();
  });

  closeBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    setMobileNavOpen(false, true);
  });

  scrim?.addEventListener('click', () => {
    setMobileNavOpen(false, true);
  });

  navmenu?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (document.body.classList.contains('mobile-nav-active')) {
        setMobileNavOpen(false, false);
      }
    });
  });

  // Hub Dropdown Menu (Versions / Identité / CV) — natif sans Bootstrap JS
  const hubBtn = document.getElementById('headerHubBtn') as HTMLButtonElement | null;
  const hubMenu = document.getElementById('headerHubMenu');

  function setHubOpen(open: boolean, restoreFocus = false): void {
    if (!hubBtn || !hubMenu) return;
    hubMenu.classList.toggle('show', open);
    hubBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (!open && restoreFocus) {
      hubBtn.focus();
    }
  }

  hubBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = hubMenu?.classList.contains('show') ?? false;
    setHubOpen(!isOpen);
  });

  document.addEventListener('click', (e) => {
    if (!hubMenu || !hubBtn) return;
    if (
      hubMenu.classList.contains('show') &&
      !hubMenu.contains(e.target as Node) &&
      !hubBtn.contains(e.target as Node)
    ) {
      setHubOpen(false);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (hubMenu?.classList.contains('show') && e.key === 'Escape') {
      e.preventDefault();
      setHubOpen(false, true);
      return;
    }

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

  window.addEventListener(
    'resize',
    () => {
      if (window.innerWidth >= 1200 && document.body.classList.contains('mobile-nav-active')) {
        setMobileNavOpen(false, false);
      }
    },
    { passive: true }
  );

  scrollTopBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener(
    'scroll',
    () => {
      toggleScrolled();
      toggleScrollTop();
      updateScrollspy();
    },
    { passive: true }
  );

  toggleScrolled();
  toggleScrollTop();
  updateScrollspy();
}
