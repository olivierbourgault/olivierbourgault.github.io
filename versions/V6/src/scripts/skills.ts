import { getSiteLang } from './i18n';

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

  function updateToggleLabel(isOpen: boolean): void {
    if (!toggleText) return;
    const isEn = getSiteLang() === 'en';
    toggleText.textContent = isOpen
      ? isEn
        ? 'Hide All Skills'
        : 'Masquer tout'
      : isEn
        ? 'Show All Skills'
        : 'Tout afficher (Tous)';
  }

  function syncState(isOpen: boolean): void {
    if (!langEl || !softEl || !toggleBtn || !toggleText) return;
    langEl.classList.toggle('show', isOpen);
    softEl.classList.toggle('show', isOpen);
    langEl.inert = !isOpen;
    softEl.inert = !isOpen;

    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    toggleBtn.classList.toggle('active-all', isOpen);
    updateToggleLabel(isOpen);
    const icon = toggleBtn.querySelector('i');
    if (icon) {
      icon.className = isOpen ? 'bi bi-chevron-up me-2' : 'bi bi-grid-3x3-gap-fill me-2';
    }
  }

  window.addEventListener('ob:langchange', () => {
    const bothOpen =
      (langEl?.classList.contains('show') ?? false) &&
      (softEl?.classList.contains('show') ?? false);
    updateToggleLabel(bothOpen);
  });

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

  window.addEventListener('resize', positionSkills, { passive: true });
  positionSkills();
}
