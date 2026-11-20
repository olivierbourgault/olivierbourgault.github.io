const PRECISE_SELECTORS =
  'a, .badge, .btn-outline, .social-links a, .header-social-links a, .studio-palette-chip, .timeline-palette-btn, .vnav-item-btn, .studio-tab, .viewport-btn, .studio-icon-btn, .inspector-tab, .surface-btn, .hero-emblem-btn, .bench-btn, .copy-button, .svg-dl-btn, .hero-anchor-pill, .tech-marquee-item, summary, input, textarea, select, [role="button"]';

const BIG_SELECTORS =
  '.btn, button, .portfolio-card, .tech-pillar-card, .hero-stats .stat-item, .versions-btn-primary, .versions-btn-secondary, .versions-btn-outline, .timeline-version-card, .versions-kpi-card, .identite-btn-primary, .identite-btn-secondary, .identite-btn-outline, .origin-step-card, .logo-chapter-card, .palette-token-card, dialog.ob-dialog, .logo';

export function initInteractiveCursor(): void {
  const cursorDot = document.getElementById('laser-dot');
  if (!cursorDot) return;

  let prefersReducedMotion = false;
  try {
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    prefersReducedMotion = false;
  }

  let currentX = window.innerWidth / 2;
  let currentY = window.innerHeight / 2;
  let targetX = currentX;
  let targetY = currentY;
  let rafId: number | null = null;

  function tick(): void {
    if (prefersReducedMotion) {
      currentX = targetX;
      currentY = targetY;
    } else {
      currentX += (targetX - currentX) * 0.35;
      currentY += (targetY - currentY) * 0.35;
    }
    cursorDot!.style.left = `${currentX}px`;
    cursorDot!.style.top = `${currentY}px`;
    rafId = requestAnimationFrame(tick);
  }

  cursorDot.style.display = 'block';
  cursorDot.classList.add('on');
  document.body.style.cursor = 'none';
  rafId = requestAnimationFrame(tick);

  document.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType === 'touch') return;
      targetX = e.clientX;
      targetY = e.clientY;

      const target = e.target as Element | null;
      const overIframe = Boolean(target?.closest('.device-scale-wrap, .fullscreen-iframe-wrap, iframe'));
      if (overIframe) {
        cursorDot.classList.remove('on');
        return;
      }

      cursorDot.style.display = 'block';
      cursorDot.classList.add('on');
      if (!rafId) rafId = requestAnimationFrame(tick);

      const isPrecise = Boolean(target?.closest(PRECISE_SELECTORS));
      const isBig = Boolean(!isPrecise && target?.closest(BIG_SELECTORS));
      cursorDot.classList.toggle('precise', isPrecise);
      cursorDot.classList.toggle('big', isBig);
    },
    { passive: true }
  );

  document.addEventListener('pointerleave', () => {
    cursorDot.classList.remove('on');
  });

  document.querySelectorAll('.device-scale-wrap, .fullscreen-iframe-wrap').forEach((zone) => {
    zone.addEventListener('pointerenter', () => {
      cursorDot.classList.remove('on');
    });
  });
}
