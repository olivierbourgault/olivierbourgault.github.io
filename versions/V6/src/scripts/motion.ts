import { SITE } from '../data/site';
import { getSiteLang } from './i18n';

export function isMotionReduced(): boolean {
  return document.documentElement.classList.contains('reduce-motion');
}

export function getScrollBehavior(): ScrollBehavior {
  return isMotionReduced() ? 'auto' : 'smooth';
}

function detectInitialReducedMotion(): boolean {
  try {
    const saved = localStorage.getItem(SITE.motionStorageKey);
    if (saved === 'reduced') return true;
    if (saved === 'full') return false;
  } catch {
    // Ignorer si stockage bloqué
  }
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

function syncMotionToggleLabels(reduced: boolean): void {
  const isEn = getSiteLang() === 'en';
  const label = reduced
    ? isEn
      ? 'Enable animations'
      : 'Réactiver les animations'
    : isEn
      ? 'Disable all animations'
      : 'Désactiver toutes les animations';

  document.querySelectorAll<HTMLElement>('[data-motion-toggle], #motionSwitcherBtn').forEach((btn) => {
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
    btn.setAttribute('aria-pressed', reduced ? 'true' : 'false');
    btn.classList.toggle('is-reduced', reduced);
  });
}

export function applyReducedMotion(reduced: boolean, persist = true): void {
  const html = document.documentElement;
  html.classList.toggle('reduce-motion', reduced);
  html.dataset.motion = reduced ? 'reduced' : 'full';

  if (document.body) {
    document.body.classList.toggle('reduce-motion', reduced);
    if (reduced) {
      document.body.style.cursor = '';
    }
  }

  document.querySelectorAll<HTMLElement>('[data-motion-icon], #motionSwitcherIcon').forEach((icon) => {
    icon.classList.toggle('bi-play-circle-fill', reduced);
    icon.classList.toggle('bi-pause-circle', !reduced);
  });

  syncMotionToggleLabels(reduced);

  if (persist) {
    try {
      localStorage.setItem(SITE.motionStorageKey, reduced ? 'reduced' : 'full');
    } catch {
      // Ignorer si stockage bloqué
    }
  }

  window.dispatchEvent(new CustomEvent('ob:motionchange', { detail: { reduced } }));
}

export function initMotionToggle(): void {
  applyReducedMotion(detectInitialReducedMotion(), false);

  document.querySelectorAll<HTMLElement>('[data-motion-toggle], #motionSwitcherBtn').forEach((btn) => {
    btn.addEventListener('click', () => {
      applyReducedMotion(!isMotionReduced(), true);
    });
  });

  window.addEventListener('ob:langchange', () => {
    syncMotionToggleLabels(isMotionReduced());
  });

  window.addEventListener('storage', (e) => {
    if (
      e.key === SITE.motionStorageKey &&
      (e.newValue === 'reduced' || e.newValue === 'full')
    ) {
      applyReducedMotion(e.newValue === 'reduced', false);
    }
  });
}
