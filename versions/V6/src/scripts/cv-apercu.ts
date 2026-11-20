import { isDarkTheme } from './theme';

function syncStatusBadge(): void {
  const statusEl = document.getElementById('cvVersionStatus');
  if (!statusEl) return;
  statusEl.textContent = isDarkTheme()
    ? 'Thème Portfolio (Sombre)'
    : 'Thème Portfolio (Clair)';
}

export function initCvApercuPage(): void {
  syncStatusBadge();

  window.addEventListener('ob:themechange', () => {
    syncStatusBadge();
  });

  document.querySelectorAll<HTMLElement>('[data-print-cv]').forEach((btn) => {
    btn.addEventListener('click', () => {
      window.print();
    });
  });
}
