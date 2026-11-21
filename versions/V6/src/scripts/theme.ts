import { SITE } from '../data/site';

export function isDarkTheme(): boolean {
  return document.documentElement.classList.contains('dark');
}

export function applyTheme(isDark: boolean, persist = true): void {
  const html = document.documentElement;
  const body = document.body;
  const mode = isDark ? 'dark' : 'light';

  html.classList.toggle('dark', isDark);
  html.classList.toggle('theme-light', !isDark);
  html.dataset.theme = mode;
  html.dataset.bsTheme = mode;

  const metaColorScheme = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
  if (metaColorScheme) {
    metaColorScheme.content = mode;
  }

  const metaThemeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.content = isDark ? '#121316' : '#F4F1EA';
  }

  if (body) {
    body.classList.toggle('dark', isDark);
    if (isDark) {
      body.setAttribute('data-bs-theme', 'dark');
    } else {
      body.removeAttribute('data-bs-theme');
    }
  }

  document.querySelectorAll<HTMLElement>('[data-theme-icon], #themeSwitcher').forEach((icon) => {
    icon.classList.toggle('bi-sun-fill', isDark);
    icon.classList.toggle('bi-moon-stars-fill', !isDark);
  });

  const label = isDark ? 'Passer au mode clair' : 'Passer au mode sombre';
  document.querySelectorAll<HTMLElement>('[data-theme-toggle], #themeSwitcherBtn').forEach((btn) => {
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
    btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
  });

  if (persist) {
    try {
      localStorage.setItem(SITE.themeStorageKey, mode);
    } catch {
      // Ignorer si stockage bloqué
    }
  }

  window.dispatchEvent(new CustomEvent('ob:themechange', { detail: { isDark } }));
}

export function initTheme(): void {
  let isDark = true;
  try {
    isDark = localStorage.getItem(SITE.themeStorageKey) !== 'light';
  } catch {
    isDark = true;
  }

  applyTheme(isDark, false);

  document.querySelectorAll<HTMLElement>('[data-theme-toggle], #themeSwitcherBtn').forEach((btn) => {
    btn.addEventListener('click', () => {
      applyTheme(!isDarkTheme(), true);
    });
  });

  window.addEventListener('storage', (e) => {
    if (e.key === SITE.themeStorageKey && (e.newValue === 'light' || e.newValue === 'dark')) {
      applyTheme(e.newValue === 'dark', false);
    }
  });
}
