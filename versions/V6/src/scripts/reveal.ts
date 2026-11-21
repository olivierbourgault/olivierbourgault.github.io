/**
 * Révélation légère au défilement via IntersectionObserver (remplace AOS ~14 Ko JS + ~25 Ko CSS).
 */
let observer: IntersectionObserver | null = null;

function revealElement(el: HTMLElement): void {
  el.classList.add('aos-animate');
}

export function initScrollReveal(): void {
  const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-aos]'));
  if (nodes.length === 0) return;

  const prefersReduced = (() => {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  })();

  if (prefersReduced || !('IntersectionObserver' in window)) {
    nodes.forEach(revealElement);
    return;
  }

  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        revealElement(entry.target as HTMLElement);
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -40px 0px', threshold: 0.05 }
  );

  for (const el of nodes) {
    const delay = el.getAttribute('data-aos-delay');
    if (delay) {
      el.style.transitionDelay = `${delay}ms`;
    }
    el.classList.add('aos-init');
    observer.observe(el);
  }
}

export function refreshScrollReveal(): void {
  if (!observer) {
    initScrollReveal();
    return;
  }
  document.querySelectorAll<HTMLElement>('[data-aos]:not(.aos-animate)').forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      revealElement(el);
      observer?.unobserve(el);
    }
  });
}
