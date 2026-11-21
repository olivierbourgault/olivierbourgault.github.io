import { SITE } from '../data/site';

const BOOT_SEEN_KEY = 'ob_v6_boot_seen';

function computeYearsSinceStart(): number {
  const start = new Date(SITE.careerStartDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.round(diffDays / 365.25);
}

function isEmbeddedContext(): boolean {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('embed') === '1') return true;
    return window.self !== window.top;
  } catch {
    return true;
  }
}

function markBootSeen(): void {
  try {
    window.sessionStorage.setItem(BOOT_SEEN_KEY, '1');
  } catch {
    // sessionStorage indisponible (navigation privée stricte)
  }
}

function wasBootSeen(): boolean {
  try {
    return window.sessionStorage.getItem(BOOT_SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * Boot Loader Fusion : Tracé OB Tech + Nœuds IA + Terminal OB_TECH_CORE
 * - Overlay fixed sans masquer #page (préserve le LCP du Hero).
 * - Ignoré immédiatement en mode embarqué (?embed=1 / iframe),
 *   en revisite de session (sessionStorage) ou avec prefers-reduced-motion.
 */
export function initBootSequence(onReady: () => void): void {
  const spinner = document.getElementById('spinner');
  const page = document.getElementById('page');

  const expEl = document.getElementById('experience');
  if (expEl) expEl.textContent = String(computeYearsSinceStart());

  const prefersReduced = (() => {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  })();

  const shouldSkipImmediately =
    !spinner ||
    spinner.classList.contains('d-none') ||
    prefersReduced ||
    isEmbeddedContext() ||
    wasBootSeen();

  if (shouldSkipImmediately) {
    spinner?.classList.add('d-none');
    page?.classList.remove('d-none');
    markBootSeen();
    onReady();
    return;
  }

  const pctEl = document.getElementById('obBootPct');
  const barEl = document.getElementById('obBootBar');
  const line1 = document.getElementById('obBootLine1');
  const line2 = document.getElementById('obBootLine2');
  const line3 = document.getElementById('obBootLine3');

  let pct = 0;
  let isLoaded = document.readyState === 'complete';
  let minElapsed = false;
  let finalized = false;

  function finishBoot(): void {
    if (finalized) return;
    finalized = true;
    clearInterval(pctTimer);
    markBootSeen();

    if (pctEl) pctEl.textContent = '100%';
    if (barEl) barEl.style.width = '100%';
    line1?.classList.add('is-visible');
    line2?.classList.add('is-visible');
    line3?.classList.add('is-visible');

    spinner?.classList.add('is-fading');
    page?.classList.remove('d-none');

    setTimeout(() => {
      spinner?.classList.add('d-none');
      onReady();
    }, 140);
  }

  function triggerReadyPhase(): void {
    line3?.classList.add('is-visible');
    if (barEl) barEl.style.width = '100%';
    if (minElapsed && pct >= 100) {
      finishBoot();
    }
  }

  const pctTimer = window.setInterval(() => {
    const cap = isLoaded ? 100 : 92;
    if (pct < cap) {
      pct = Math.min(cap, pct + (isLoaded ? 8 : 5));
      if (pctEl) pctEl.textContent = `${String(pct).padStart(2, '0')}%`;
      if (barEl && !isLoaded) barEl.style.width = `${pct}%`;
    }
    if (isLoaded && minElapsed && pct >= 100) {
      finishBoot();
    }
  }, 30);

  setTimeout(() => line1?.classList.add('is-visible'), 60);
  setTimeout(() => line2?.classList.add('is-visible'), 220);
  setTimeout(() => {
    minElapsed = true;
    if (isLoaded) triggerReadyPhase();
  }, 450);

  if (!isLoaded) {
    window.addEventListener(
      'load',
      () => {
        isLoaded = true;
        triggerReadyPhase();
      },
      { once: true }
    );
  }

  // Sécurité si un chargement externe tarde
  setTimeout(() => {
    isLoaded = true;
    minElapsed = true;
    finishBoot();
  }, 2200);
}
