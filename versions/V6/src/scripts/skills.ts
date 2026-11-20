export function initSkills(): void {
  const container = document.querySelector<HTMLElement>('#skills-collapsable > div');
  const toggleBtn = document.getElementById('btn-toggle-all-skills') as HTMLButtonElement | null;
  const toggleText = document.getElementById('toggle-all-text');
  const langEl = document.getElementById('languages');
  const softEl = document.getElementById('softwares');

  function positionSkills(): void {
    if (!container) return;
    container.classList.toggle('flex-column', window.innerWidth < 540);
  }

  function syncState(isOpen: boolean): void {
    if (!langEl || !softEl || !toggleBtn || !toggleText) return;
    langEl.classList.toggle('show', isOpen);
    softEl.classList.toggle('show', isOpen);
    langEl.inert = !isOpen;
    softEl.inert = !isOpen;

    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    toggleBtn.classList.toggle('active-all', isOpen);
    toggleText.textContent = isOpen ? 'Masquer tout' : 'Tout afficher (Tous)';
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      icon.className = isOpen ? 'bi bi-chevron-up me-2' : 'bi bi-grid-3x3-gap-fill me-2';
    }
  }

  if (langEl && softEl) {
    langEl.inert = !langEl.classList.contains('show');
    softEl.inert = !softEl.classList.contains('show');
  }

  toggleBtn?.addEventListener('click', () => {
    const bothOpen =
      (langEl?.classList.contains('show') ?? false) &&
      (softEl?.classList.contains('show') ?? false);
    syncState(!bothOpen);
  });

  // Animation de barres de compétences éventuelles via IntersectionObserver (sans Waypoints)
  const skillsBars = document.querySelectorAll<HTMLElement>('.skills-animation');
  if (skillsBars.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.querySelectorAll<HTMLElement>('.progress .progress-bar').forEach((bar) => {
            const val = bar.getAttribute('aria-valuenow');
            if (val) bar.style.width = `${val}%`;
          });
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );
    skillsBars.forEach((item) => observer.observe(item));
  }

  window.addEventListener('resize', positionSkills, { passive: true });
  positionSkills();
}
