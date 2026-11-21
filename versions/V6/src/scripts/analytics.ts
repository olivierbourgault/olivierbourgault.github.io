import { SITE } from '../data/site';
import { withBase } from '../utils/paths';

interface GoatCounterWindow extends Window {
  goatcounter?: {
    count?: (vars: { path: string; title?: string; event?: boolean }) => void;
  };
}

export function trackConversionEvent(
  eventName: string,
  props: Record<string, string> = {}
): void {
  try {
    window.dispatchEvent(
      new CustomEvent('ob:track', {
        detail: {
          event: eventName,
          props,
          ts: Date.now()
        }
      })
    );

    const w = window as GoatCounterWindow;
    if (w.goatcounter && typeof w.goatcounter.count === 'function') {
      const label = props.label ? `${eventName}:${props.label}` : eventName;
      w.goatcounter.count({
        path: `event/${label}`,
        title: eventName,
        event: true
      });
    }
  } catch {
    // Ignorer toute erreur de télémétrie
  }
}

function initOptionalCookieFreeAnalytics(): void {
  const { goatcounterCode, cloudflareToken } = SITE.analytics;

  if (goatcounterCode && !document.getElementById('ob-goatcounter-js')) {
    const s = document.createElement('script');
    s.id = 'ob-goatcounter-js';
    s.async = true;
    s.dataset.goatcounter = `https://${goatcounterCode}.goatcounter.com/count`;
    s.src = 'https://gc.zgo.at/count.js';
    document.head.appendChild(s);
  }

  if (cloudflareToken && !document.getElementById('ob-cf-beacon-js')) {
    const s = document.createElement('script');
    s.id = 'ob-cf-beacon-js';
    s.defer = true;
    s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    s.setAttribute('data-cf-beacon', JSON.stringify({ token: cloudflareToken }));
    document.head.appendChild(s);
  }
}

function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  try {
    if (new URLSearchParams(window.location.search).get('embed') === '1') return;
    if (window.self !== window.top) return;
  } catch {
    return;
  }

  window.addEventListener(
    'load',
    () => {
      navigator.serviceWorker.register(withBase('sw.js')).catch(() => {
        // Ignorer si le navigateur refuse l'enregistrement (ex: navigation privée)
      });
    },
    { once: true }
  );
}

function bindGlobalConversionTracking(): void {
  document.addEventListener('click', (e) => {
    const target = e.target as Element | null;
    if (!target) return;

    const pdfLink = target.closest<HTMLAnchorElement>('a[href$=".pdf"], a[data-cv-direct-download]');
    if (pdfLink) {
      const href = pdfLink.getAttribute('href') || '';
      trackConversionEvent('cv_pdf_download', {
        lang: href.includes('cv-en') ? 'en' : 'fr'
      });
      return;
    }

    const csBtn = target.closest<HTMLElement>('[data-case-study]');
    if (csBtn) {
      trackConversionEvent('case_study_open', {
        label: csBtn.getAttribute('data-case-study') || ''
      });
      return;
    }

    const webmailBtn = target.closest<HTMLElement>('[data-webmail]');
    if (webmailBtn) {
      trackConversionEvent('contact_webmail_open', {
        label: webmailBtn.getAttribute('data-webmail') || ''
      });
    }
  });
}

export function initPwaAndAnalytics(): void {
  initOptionalCookieFreeAnalytics();
  bindGlobalConversionTracking();
  registerServiceWorker();
}
