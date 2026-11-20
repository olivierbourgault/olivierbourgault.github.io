import { SITE } from '../data/site';

function computeYearsSinceStart(): number {
  const start = new Date(SITE.careerStartDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.round(diffDays / 365.25);
}

/**
 * Boot Loader Fusion : Tracé OB Tech + Nœuds IA + Terminal OB_TECH_CORE
 */
export function initBootSequence(onReady: () => void): void {
  const pctEl = document.getElementById('obBootPct');
  const barEl = document.getElementById('obBootBar');
  const line1 = document.getElementById('obBootLine1');
  const line2 = document.getElementById('obBootLine2');
  const line3 = document.getElementById('obBootLine3');

  let pct = 0;
  let isLoaded = document.readyState === 'complete';
  let minElapsed = false;
  let finalized = false;

  const prefersReduced = (() => {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  })();

  function finishBoot(): void {
    if (finalized) return;
    finalized = true;
    clearInterval(pctTimer);

    if (pctEl) pctEl.textContent = '100%';
    if (barEl) barEl.style.width = '100%';
    line1?.classList.add('is-visible');
    line2?.classList.add('is-visible');
    line3?.classList.add('is-visible');

    setTimeout(() => {
      const spinner = document.getElementById('spinner');
      const page = document.getElementById('page');
      spinner?.classList.add('d-none');
      page?.classList.remove('d-none');

      const expEl = document.getElementById('experience');
      if (expEl) expEl.textContent = String(computeYearsSinceStart());

      onReady();
    }, prefersReduced ? 40 : 220);
  }

  function triggerReadyPhase(): void {
    line3?.classList.add('is-visible');
    if (barEl) barEl.style.width = '100%';
    if (minElapsed && pct >= 100) {
      finishBoot();
    }
  }

  const pctTimer = window.setInterval(() => {
    const cap = isLoaded ? 100 : 90;
    if (pct < cap) {
      pct = Math.min(cap, pct + (isLoaded ? 5 : 3));
      if (pctEl) pctEl.textContent = `${String(pct).padStart(2, '0')}%`;
      if (barEl && !isLoaded) barEl.style.width = `${pct}%`;
    }
    if (isLoaded && minElapsed && pct >= 100) {
      finishBoot();
    }
  }, prefersReduced ? 10 : 40);

  if (prefersReduced) {
    pct = 100;
    isLoaded = true;
    minElapsed = true;
    finishBoot();
    return;
  }

  setTimeout(() => line1?.classList.add('is-visible'), 80);
  setTimeout(() => line2?.classList.add('is-visible'), 380);
  setTimeout(() => {
    minElapsed = true;
    if (isLoaded) triggerReadyPhase();
  }, 900);

  if (!isLoaded) {
    window.addEventListener('load', () => {
      isLoaded = true;
      triggerReadyPhase();
    });
  }

  // Sécurité si un chargement tarde
  setTimeout(() => {
    isLoaded = true;
    minElapsed = true;
    finishBoot();
  }, 4500);
}
