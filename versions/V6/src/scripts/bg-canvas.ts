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

export function initAnimatedBackground(): void {
  const canvas = document.getElementById('tech-bg-canvas') as HTMLCanvasElement | null;
  if (!canvas || canvas.dataset.bgInit === '1') return;
  canvas.dataset.bgInit = '1';

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let reducedMotion = false;
  try {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    reducedMotion = false;
  }

  let width = 0;
  let height = 0;
  let dpr = 1;
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
    const count = Math.max(24, Math.min(64, Math.round(area / 28000)));
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
    createParticles();
    if (reducedMotion) {
      drawFrame(0);
    }
  }

  function displacePoint(gx: number, gy: number): [number, number, number] {
    if (pointer.strength <= 0.01) return [gx, gy, 0];
    const radius = 210;
    const maxPush = 28 * pointer.strength;
    const dx = gx - pointer.sx;
    const dy = gy - pointer.sy;
    const dist = Math.hypot(dx, dy);
    if (dist < 0.001 || dist >= radius) return [gx, gy, 0];

    const falloff = Math.pow(1 - dist / radius, 2);
    const push = falloff * maxPush;
    return [gx + (dx / dist) * push, gy + (dy / dist) * push, falloff];
  }

  function drawWarpedGrid(time: number): void {
    const step = 48;
    const cols = Math.ceil(width / step) + 3;
    const rows = Math.ceil(height / step) + 3;

    const driftX = (time * 0.016) % step;
    const driftY = (time * 0.011) % step;

    const ptsX = new Float32Array(cols * rows);
    const ptsY = new Float32Array(cols * rows);
    const glow = new Float32Array(cols * rows);

    for (let r = 0; r < rows; r++) {
      const baseY = (r - 2) * step + driftY;
      for (let c = 0; c < cols; c++) {
        const baseX = (c - 2) * step + driftX;
        const waveX = Math.sin(time * 0.0011 + r * 0.45 + c * 0.25) * 3.2;
        const waveY = Math.cos(time * 0.0009 + c * 0.45 + r * 0.25) * 3.2;
        const idx = r * cols + c;
        const [px, py, f] = displacePoint(baseX + waveX, baseY + waveY);
        ptsX[idx] = px;
        ptsY[idx] = py;
        glow[idx] = f;
      }
    }

    ctx!.lineWidth = 1;
    ctx!.strokeStyle = darkMode ? 'rgba(255, 102, 0, 0.085)' : 'rgba(22, 22, 22, 0.065)';
    ctx!.beginPath();

    // Horizontal grid lines
    for (let r = 0; r < rows; r++) {
      const base = r * cols;
      ctx!.moveTo(ptsX[base], ptsY[base]);
      for (let c = 1; c < cols; c++) {
        ctx!.lineTo(ptsX[base + c], ptsY[base + c]);
      }
    }

    // Vertical grid lines
    for (let c = 0; c < cols; c++) {
      ctx!.moveTo(ptsX[c], ptsY[c]);
      for (let r = 1; r < rows; r++) {
        const idx = r * cols + c;
        ctx!.lineTo(ptsX[idx], ptsY[idx]);
      }
    }
    ctx!.stroke();

    // Highlight displaced grid intersections near cursor
    if (pointer.strength > 0.02) {
      for (let i = 0; i < glow.length; i++) {
        const f = glow[i];
        if (f <= 0.04) continue;
        const alpha = f * (darkMode ? 0.72 : 0.55);
        ctx!.fillStyle = `rgba(255, 102, 0, ${alpha.toFixed(3)})`;
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

    const linkDist = 145;
    const pointerDist = 185;
    const skyRgb = darkMode ? '56, 189, 248' : '2, 132, 199';
    const orangeRgb = darkMode ? '255, 102, 0' : '234, 88, 12';

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      if (!reducedMotion) {
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d > 12 && d < 120) {
            const push = ((120 - d) / 120) * 0.03;
            p.vx += (dx / d) * push;
            p.vy += (dy / d) * push;
          }
        }

        const speed = Math.hypot(p.vx, p.vy);
        if (speed > 0.65) {
          p.vx = (p.vx / speed) * 0.65;
          p.vy = (p.vy / speed) * 0.65;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = width + 20;
        else if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        else if (p.y > height + 20) p.y = -20;
      }

      const pulse = 0.72 + 0.28 * Math.sin(time * 0.002 + p.phase);
      const baseAlpha = (darkMode ? 0.5 : 0.38) * pulse;
      const rgb = p.accent === 'sky' ? skyRgb : orangeRgb;

      ctx!.fillStyle = `rgba(${rgb}, ${baseAlpha.toFixed(3)})`;
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx!.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < linkDist) {
          const lineAlpha = (1 - dist / linkDist) * (darkMode ? 0.16 : 0.12);
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
        const dist = Math.hypot(dx, dy);
        if (dist < pointerDist) {
          const lineAlpha = (1 - dist / pointerDist) * (darkMode ? 0.34 : 0.25);
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

  window.addEventListener('ob:themechange', () => {
    darkMode = isDarkTheme();
    if (reducedMotion) drawFrame(0);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopLoop();
    } else {
      startLoop();
    }
  });

  resize();
  if (!reducedMotion) {
    startLoop();
  }
}
