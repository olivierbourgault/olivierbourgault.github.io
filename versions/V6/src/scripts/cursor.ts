const PRECISE_SELECTORS =
  'a, .badge, .btn-outline, .social-links a, .header-social-links a, .studio-palette-chip, .timeline-palette-btn, .vnav-item-btn, .studio-tab, .viewport-btn, .studio-icon-btn, .inspector-tab, .surface-btn, .hero-emblem-btn, .bench-btn, .copy-button, .svg-dl-btn, .hero-anchor-pill, .tech-marquee-item, summary, input, textarea, select, [role="button"]';

const BIG_SELECTORS =
  '.btn, button, .portfolio-card, .tech-pillar-card, .hero-stats .stat-item, .versions-btn-primary, .versions-btn-secondary, .versions-btn-outline, .timeline-version-card, .versions-kpi-card, .identite-btn-primary, .identite-btn-secondary, .identite-btn-outline, .origin-step-card, .logo-chapter-card, .palette-token-card, dialog.ob-dialog, .logo';

export function promoteCursorToTopLayer(): void {
  const cursorDot = document.getElementById('laser-dot') as (HTMLElement & {
    showPopover?: () => void;
    hidePopover?: () => void;
  }) | null;
  if (!cursorDot || typeof cursorDot.showPopover !== 'function') return;
  try {
    if (cursorDot.matches(':popover-open') && typeof cursorDot.hidePopover === 'function') {
      cursorDot.hidePopover();
    }
    cursorDot.showPopover();
  } catch {
    // Ignorer si l'élément n'est pas connecté ou si le navigateur refuse la promotion
  }
}

export function initInteractiveCursor(): void {
  const cursorDot = document.getElementById('laser-dot');
  if (!cursorDot) return;

  const isEmbedded = (() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('embed') === '1' || window.self !== window.top;
    } catch {
      return true;
    }
  })();

  if (isEmbedded) {
    cursorDot.style.display = 'none';
    return;
  }

  let hasFinePointer = true;
  let prefersReducedMotion = false;
  try {
    hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    hasFinePointer = true;
    prefersReducedMotion = false;
  }

  if (!hasFinePointer) {
    cursorDot.style.display = 'none';
    return;
  }

  let hasMoved = false;
  let currentX = 0;
  let currentY = 0;
  let targetX = 0;
  let targetY = 0;
  let rafId: number | null = null;

  function applyTransform(): void {
    cursorDot!.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
  }

  function stopTick(): void {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  function tick(): void {
    if (document.hidden) {
      rafId = null;
      return;
    }

    if (prefersReducedMotion) {
      currentX = targetX;
      currentY = targetY;
      applyTransform();
      rafId = null;
      return;
    }

    const dx = targetX - currentX;
    const dy = targetY - currentY;
    if (Math.hypot(dx, dy) < 0.25) {
      currentX = targetX;
      currentY = targetY;
      applyTransform();
      rafId = null;
      return;
    }

    currentX += dx * 0.35;
    currentY += dy * 0.35;
    applyTransform();
    rafId = requestAnimationFrame(tick);
  }

  function startTick(): void {
    if (rafId === null && !document.hidden) {
      rafId = requestAnimationFrame(tick);
    }
  }

  document.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType === 'touch') {
        cursorDot.classList.remove('on');
        document.body.style.cursor = '';
        stopTick();
        return;
      }

      targetX = e.clientX;
      targetY = e.clientY;

      if (!hasMoved) {
        hasMoved = true;
        currentX = targetX;
        currentY = targetY;
        cursorDot.style.display = 'block';
        promoteCursorToTopLayer();
        applyTransform();
      }

      const target = e.target as Element | null;
      const overIframe = Boolean(target?.closest('.device-scale-wrap, .fullscreen-iframe-wrap, iframe'));
      if (overIframe) {
        cursorDot.classList.remove('on');
        document.body.style.cursor = '';
        stopTick();
        return;
      }

      document.body.style.cursor = 'none';
      cursorDot.style.display = 'block';
      cursorDot.classList.add('on');
      startTick();

      const isPrecise = Boolean(target?.closest(PRECISE_SELECTORS));
      const isBig = Boolean(!isPrecise && target?.closest(BIG_SELECTORS));
      cursorDot.classList.toggle('precise', isPrecise);
      cursorDot.classList.toggle('big', isBig);
    },
    { passive: true }
  );

  document.addEventListener('pointerleave', () => {
    cursorDot.classList.remove('on');
    stopTick();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopTick();
  });

  document.querySelectorAll('.device-scale-wrap, .fullscreen-iframe-wrap').forEach((zone) => {
    zone.addEventListener('pointerenter', () => {
      cursorDot.classList.remove('on');
      document.body.style.cursor = '';
      stopTick();
    });
  });
}
