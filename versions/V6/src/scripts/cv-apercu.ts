import { getSiteLang, setSiteLang } from './i18n';
import { isDarkTheme } from './theme';

type CvLang = 'fr' | 'en';
const CV_LANG_STORAGE_KEY = 'ob_v6_cv_lang';

let currentLang: CvLang = 'fr';

const UI_STRINGS: Record<
  CvLang,
  {
    backLink: string;
    heading: string;
    subtitle: string;
    translateBtn: string;
    footTranslateBtn: string;
    printBtn: string;
    downloadBtn: string;
    modalBtn: string;
    statusDark: string;
    statusLight: string;
  }
> = {
  fr: {
    backLink: 'Retour au portfolio',
    heading: 'CV - Aperçu',
    subtitle: 'Curriculum vitae complet (CV_V3) — Olivier Bourgault, Gatineau',
    translateBtn: 'English (EN)',
    footTranslateBtn: 'Switch to English (EN)',
    printBtn: 'Imprimer',
    downloadBtn: 'Télécharger PDF (FR)',
    modalBtn: 'Tous les PDF (FR / EN)',
    statusDark: 'Thème Portfolio (Sombre)',
    statusLight: 'Thème Portfolio (Clair)'
  },
  en: {
    backLink: 'Back to portfolio',
    heading: 'Resume - Preview',
    subtitle: 'Complete Curriculum Vitae (CV_V3) — Olivier Bourgault, Gatineau',
    translateBtn: 'Français (FR)',
    footTranslateBtn: 'Passer en français (FR)',
    printBtn: 'Print',
    downloadBtn: 'Download PDF (EN)',
    modalBtn: 'All PDFs (FR / EN)',
    statusDark: 'Portfolio Theme (Dark)',
    statusLight: 'Portfolio Theme (Light)'
  }
};

function syncStatusBadge(): void {
  const statusEl = document.getElementById('cvVersionStatus');
  if (!statusEl) return;
  const copy = UI_STRINGS[currentLang];
  statusEl.textContent = isDarkTheme() ? copy.statusDark : copy.statusLight;
}

function applyCvLanguage(lang: CvLang, persist = true): void {
  currentLang = lang;
  const copy = UI_STRINGS[lang];
  const root = document.getElementById('cvResumeRoot');

  document.querySelectorAll<HTMLElement>('[data-cv-lang-sheet]').forEach((sheet) => {
    const isMatch = sheet.dataset.cvLangSheet === lang;
    sheet.hidden = !isMatch;
  });

  document.querySelectorAll<HTMLButtonElement>('[data-cv-lang-btn]').forEach((btn) => {
    const isMatch = btn.dataset.cvLangBtn === lang;
    btn.classList.toggle('active', isMatch);
    btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
  });

  const setText = (id: string, text: string) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  setText('cvBackLinkLabel', copy.backLink);
  setText('cvMainHeading', copy.heading);
  setText('cvMainSubtitle', copy.subtitle);
  setText('cvTranslateBtnLabel', copy.translateBtn);
  setText('cvFootTranslateLabel', copy.footTranslateBtn);
  setText('cvPrintBtnLabel', copy.printBtn);
  setText('cvModalBtnLabel', copy.modalBtn);

  const pdfHref =
    lang === 'en' ? root?.dataset.pdfEn || '' : root?.dataset.pdfFr || '';
  const pdfFilename =
    lang === 'en' ? root?.dataset.filenameEn || '' : root?.dataset.filenameFr || '';

  document.querySelectorAll<HTMLAnchorElement>('[data-cv-direct-download]').forEach((link) => {
    if (pdfHref) link.href = pdfHref;
    if (pdfFilename) link.setAttribute('download', pdfFilename);
  });

  document.querySelectorAll<HTMLElement>('[data-cv-download-label]').forEach((label) => {
    label.textContent = copy.downloadBtn;
  });

  syncStatusBadge();

  if (persist) {
    try {
      localStorage.setItem(CV_LANG_STORAGE_KEY, lang);
    } catch {
      // Ignore storage error
    }
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      window.history.replaceState({ lang }, '', url.toString());
    } catch {
      // Ignore history error
    }
  }
}

function detectInitialLang(): CvLang {
  try {
    const param = new URLSearchParams(window.location.search).get('lang')?.toLowerCase();
    if (param === 'en' || param === 'fr') return param;
  } catch {
    // Ignore
  }
  try {
    const saved = localStorage.getItem(CV_LANG_STORAGE_KEY);
    if (saved === 'en' || saved === 'fr') return saved;
  } catch {
    // Ignore
  }
  return 'fr';
}

export function initCvApercuPage(): void {
  applyCvLanguage(getSiteLang(), false);

  window.addEventListener('ob:themechange', () => {
    syncStatusBadge();
  });

  window.addEventListener('ob:langchange', (e: Event) => {
    const detail = (e as CustomEvent<{ lang?: CvLang }>).detail;
    const nextLang = detail?.lang === 'en' ? 'en' : getSiteLang();
    if (nextLang !== currentLang) {
      applyCvLanguage(nextLang, false);
    }
  });

  document.querySelectorAll<HTMLButtonElement>('[data-cv-lang-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetLang = btn.dataset.cvLangBtn === 'en' ? 'en' : 'fr';
      applyCvLanguage(targetLang, true);
      setSiteLang(targetLang, true);
    });
  });

  document.querySelectorAll<HTMLElement>('[data-toggle-cv-lang]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = currentLang === 'fr' ? 'en' : 'fr';
      applyCvLanguage(next, true);
      setSiteLang(next, true);
    });
  });

  document.querySelectorAll<HTMLElement>('[data-print-cv]').forEach((btn) => {
    btn.addEventListener('click', () => {
      window.print();
    });
  });
}
