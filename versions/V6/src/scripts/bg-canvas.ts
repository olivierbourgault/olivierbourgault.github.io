import { isDarkTheme } from './theme';

interface NodeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  accent: 'orange' | 'sky';
  phase: number;
}

function isEmbeddedPreview(): boolean {
  try {
    if (new URLSearchParams(window.location.search).get('embed') === '1') return true;
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function initAnimatedBackground(): void {
  const canvas = document.getElementById('tech-bg-canvas') as HTMLCanvasElement | null;
  if (!canvas || canvas.dataset.bgInit === '1') return;
  canvas.dataset.bgInit = '1';

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const embedded = isEmbeddedPreview();
  let reducedMotion = false;
  try {
    reducedMotion = embedded || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    reducedMotion = embedded;
  }

  const STEP = 48;
  const RADIUS = 210;
  const RADIUS_SQ = RADIUS * RADIUS;
  const LINK_DIST = 145;
  const LINK_DIST_SQ = LINK_DIST * LINK_DIST;
  const POINTER_DIST = 185;
  const POINTER_DIST_SQ = POINTER_DIST * POINTER_DIST;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let cols = 0;
  let rows = 0;
  // Buffers préalloués dans resize() : zéro allocation Float32Array ou tableau par frame
  let ptsX = new Float32Array(0);
  let ptsY = new Float32Array(0);
  let glow = new Float32Array(0);

  let particles: NodeParticle[] = [];
  let rafId: number | null = null;
  let darkMode = isDarkTheme();

  const pointer = {
    x: -9999,
    y: -9999,
    sx: -9999,
    sy: -9999,
    strength: 0,
    active: false
  };

  if (!reducedMotion) {
    document.documentElement.classList.add('has-animated-grid');
  }

  function createParticles(): void {
    const area = width * height;
    const count = embedded ? 18 : Math.max(24, Math.min(56, Math.round(area / 30000)));
    particles = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.42,
      vy: (Math.random() - 0.5) * 0.42,
      radius: 1.6 + Math.random() * 1.8,
      accent: i % 3 === 0 ? 'sky' : 'orange',
      phase: Math.random() * Math.PI * 2
    }));
  }

  function resize(): void {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas!.width = Math.floor(width * dpr);
    canvas!.height = Math.floor(height * dpr);
    canvas!.style.width = `${width}px`;
    canvas!.style.height = `${height}px`;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

    cols = Math.ceil(width / STEP) + 3;
    rows = Math.ceil(height / STEP) + 3;
    const gridLen = cols * rows;
    if (ptsX.length !== gridLen) {
      ptsX = new Float32Array(gridLen);
      ptsY = new Float32Array(gridLen);
      glow = new Float32Array(gridLen);
    }

    createParticles();
    if (reducedMotion) {
      drawFrame(0);
    }
  }

  function drawWarpedGrid(time: number): void {
    const driftX = (time * 0.016) % STEP;
    const driftY = (time * 0.011) % STEP;
    const hasPointer = pointer.strength > 0.01;
    const maxPush = 28 * pointer.strength;
    const psx = pointer.sx;
    const psy = pointer.sy;
    const tWaveX = time * 0.0011;
    const tWaveY = time * 0.0009;

    for (let r = 0; r < rows; r++) {
      const baseY = (r - 2) * STEP + driftY;
      const rowOffset = r * cols;
      for (let c = 0; c < cols; c++) {
        const baseX = (c - 2) * STEP + driftX;
        let gx = baseX + Math.sin(tWaveX + r * 0.45 + c * 0.25) * 3.2;
        let gy = baseY + Math.cos(tWaveY + c * 0.45 + r * 0.25) * 3.2;
        let f = 0;

        if (hasPointer) {
          const dx = gx - psx;
          const dy = gy - psy;
          const distSq = dx * dx + dy * dy;
          if (distSq > 0.0001 && distSq < RADIUS_SQ) {
            const dist = Math.sqrt(distSq);
            const falloff = 1 - dist / RADIUS;
            f = falloff * falloff;
            const push = (f * maxPush) / dist;
            gx += dx * push;
            gy += dy * push;
          }
        }

        const idx = rowOffset + c;
        ptsX[idx] = gx;
        ptsY[idx] = gy;
        glow[idx] = f;
      }
    }

    ctx!.lineWidth = 1;
    ctx!.strokeStyle = darkMode ? 'rgba(255, 102, 0, 0.085)' : 'rgba(22, 22, 22, 0.065)';
    ctx!.beginPath();

    for (let r = 0; r < rows; r++) {
      const base = r * cols;
      ctx!.moveTo(ptsX[base], ptsY[base]);
      for (let c = 1; c < cols; c++) {
        ctx!.lineTo(ptsX[base + c], ptsY[base + c]);
      }
    }

    for (let c = 0; c < cols; c++) {
      ctx!.moveTo(ptsX[c], ptsY[c]);
      for (let r = 1; r < rows; r++) {
        const idx = r * cols + c;
        ctx!.lineTo(ptsX[idx], ptsY[idx]);
      }
    }
    ctx!.stroke();

    if (pointer.strength > 0.02) {
      const alphaScale = darkMode ? 0.72 : 0.55;
      for (let i = 0; i < glow.length; i++) {
        const f = glow[i];
        if (f <= 0.04) continue;
        ctx!.fillStyle = `rgba(255, 102, 0, ${(f * alphaScale).toFixed(3)})`;
        ctx!.beginPath();
        ctx!.arc(ptsX[i], ptsY[i], 1.5 + f * 1.4, 0, Math.PI * 2);
        ctx!.fill();
      }
    }
  }

  function drawFrame(time: number): void {
    ctx!.clearRect(0, 0, width, height);

    if (!reducedMotion) {
      if (pointer.active) {
        if (pointer.sx < -5000) {
          pointer.sx = pointer.x;
          pointer.sy = pointer.y;
        } else {
          pointer.sx += (pointer.x - pointer.sx) * 0.18;
          pointer.sy += (pointer.y - pointer.sy) * 0.18;
        }
        pointer.strength += (1 - pointer.strength) * 0.15;
      } else {
        pointer.strength += (0 - pointer.strength) * 0.1;
      }
      drawWarpedGrid(time);
    }

    const skyRgb = darkMode ? '56, 189, 248' : '2, 132, 199';
    const orangeRgb = darkMode ? '255, 102, 0' : '234, 88, 12';
    const baseOpacity = darkMode ? 0.5 : 0.38;
    const linkMaxAlpha = darkMode ? 0.16 : 0.12;
    const ptrMaxAlpha = darkMode ? 0.34 : 0.25;
    const len = particles.length;

    for (let i = 0; i < len; i++) {
      const p = particles[i];

      if (!reducedMotion) {
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dSq = dx * dx + dy * dy;
          if (dSq > 144 && dSq < 14400) {
            const d = Math.sqrt(dSq);
            const push = (((120 - d) / 120) * 0.03) / d;
            p.vx += dx * push;
            p.vy += dy * push;
          }
        }

        const speedSq = p.vx * p.vx + p.vy * p.vy;
        if (speedSq > 0.4225) {
          const inv = 0.65 / Math.sqrt(speedSq);
          p.vx *= inv;
          p.vy *= inv;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = width + 20;
        else if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        else if (p.y > height + 20) p.y = -20;
      }

      const pulse = 0.72 + 0.28 * Math.sin(time * 0.002 + p.phase);
      const rgb = p.accent === 'sky' ? skyRgb : orangeRgb;

      ctx!.fillStyle = `rgba(${rgb}, ${(baseOpacity * pulse).toFixed(3)})`;
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx!.fill();

      for (let j = i + 1; j < len; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < LINK_DIST_SQ) {
          const lineAlpha = (1 - Math.sqrt(distSq) / LINK_DIST) * linkMaxAlpha;
          ctx!.strokeStyle = `rgba(${rgb}, ${lineAlpha.toFixed(3)})`;
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.moveTo(p.x, p.y);
          ctx!.lineTo(q.x, q.y);
          ctx!.stroke();
        }
      }

      if (pointer.active) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < POINTER_DIST_SQ) {
          const lineAlpha = (1 - Math.sqrt(distSq) / POINTER_DIST) * ptrMaxAlpha;
          ctx!.strokeStyle = `rgba(${orangeRgb}, ${lineAlpha.toFixed(3)})`;
          ctx!.lineWidth = 1.1;
          ctx!.beginPath();
          ctx!.moveTo(p.x, p.y);
          ctx!.lineTo(pointer.x, pointer.y);
          ctx!.stroke();
        }
      }
    }
  }

  function loop(time: number): void {
    drawFrame(time);
    rafId = requestAnimationFrame(loop);
  }

  function startLoop(): void {
    if (reducedMotion || rafId !== null) return;
    rafId = requestAnimationFrame(loop);
  }

  function stopLoop(): void {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  window.addEventListener('resize', resize, { passive: true });

  if (!reducedMotion) {
    window.addEventListener(
      'pointermove',
      (e) => {
        if (e.pointerType === 'touch') return;
        pointer.x = e.clientX;
        pointer.y = e.clientY;
        pointer.active = true;
      },
      { passive: true }
    );

    document.addEventListener('pointerleave', () => {
      pointer.active = false;
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopLoop();
      else startLoop();
    });
  }

  window.addEventListener('ob:themechange', () => {
    darkMode = isDarkTheme();
    if (reducedMotion) drawFrame(0);
  });

  resize();
  if (!reducedMotion) {
    startLoop();
  }
}
