export type SiteLang = 'fr' | 'en';
export const SITE_LANG_STORAGE_KEY = 'ob_v6_lang';

type I18nDictModule = typeof import('../data/i18n');

interface TextBinding {
  fr: string;
  en: string;
  lead: string;
  trail: string;
}

const textNodeBindings = new WeakMap<Text, TextBinding>();
const htmlBindings = new WeakMap<Element, { fr: string; en: string }>();
const attrBindings = new WeakMap<Element, Map<string, { fr: string; en: string }>>();

let currentLang: SiteLang = 'fr';
let initialized = false;
let cachedDict: I18nDictModule | null = null;
let dictPromise: Promise<I18nDictModule> | null = null;

function loadDict(): Promise<I18nDictModule> {
  if (cachedDict) return Promise.resolve(cachedDict);
  if (!dictPromise) {
    dictPromise = import('../data/i18n').then((mod) => {
      cachedDict = mod;
      return mod;
    });
  }
  return dictPromise;
}

export function getSiteLang(): SiteLang {
  return currentLang;
}

export function detectInitialSiteLang(): SiteLang {
  try {
    const param = new URLSearchParams(window.location.search).get('lang')?.toLowerCase();
    if (param === 'en' || param === 'fr') return param;
  } catch {
    // Ignore
  }
  try {
    const saved =
      localStorage.getItem(SITE_LANG_STORAGE_KEY) ||
      localStorage.getItem('ob_v6_cv_lang');
    if (saved === 'en' || saved === 'fr') return saved;
  } catch {
    // Ignore
  }
  const htmlLang = document.documentElement.dataset.lang;
  if (htmlLang === 'en' || htmlLang === 'fr') return htmlLang;
  return 'fr';
}

function applyDomTranslationsWithDict(dict: I18nDictModule, root: ParentNode): void {
  const lang = currentLang;

  // 1. Rich HTML selector bindings
  for (const item of dict.SELECTOR_HTML_FR_TO_EN) {
    document.querySelectorAll(item.selector).forEach((el) => {
      let binding = htmlBindings.get(el);
      if (!binding) {
        binding = { fr: el.innerHTML, en: item.enHtml };
        htmlBindings.set(el, binding);
      }
      const nextHtml = lang === 'en' ? binding.en : binding.fr;
      if (el.innerHTML !== nextHtml) {
        el.innerHTML = nextHtml;
      }
    });
  }

  // 2. Reversible text-node walk
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      const tag = parent.tagName;
      if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT') {
        return NodeFilter.FILTER_REJECT;
      }
      if (parent.closest('[data-cv-lang-sheet]')) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  let currentNode = walker.nextNode() as Text | null;
  while (currentNode) {
    let binding = textNodeBindings.get(currentNode);
    if (!binding) {
      const raw = currentNode.nodeValue || '';
      const trimmed = raw.trim().replace(/\s+/g, ' ');
      const enMatch = trimmed ? dict.EXACT_TEXT_FR_TO_EN[trimmed] : undefined;
      if (enMatch) {
        const leadMatch = raw.match(/^\s*/);
        const trailMatch = raw.match(/\s*$/);
        binding = {
          fr: trimmed,
          en: enMatch,
          lead: leadMatch ? leadMatch[0] : '',
          trail: trailMatch ? trailMatch[0] : ''
        };
        textNodeBindings.set(currentNode, binding);
      }
    }

    if (binding) {
      const targetText = `${binding.lead}${lang === 'en' ? binding.en : binding.fr}${binding.trail}`;
      if (currentNode.nodeValue !== targetText) {
        currentNode.nodeValue = targetText;
      }
    }

    currentNode = walker.nextNode() as Text | null;
  }

  // 3. Attributes (placeholder, title, aria-label)
  const attrNames = ['placeholder', 'title', 'aria-label'] as const;
  document
    .querySelectorAll('[placeholder], [title], [aria-label]')
    .forEach((el) => {
      if (el.id === 'langSwitcherBtn' || el.id === 'themeSwitcherBtn') return;
      let elMap = attrBindings.get(el);
      for (const attr of attrNames) {
        const val = el.getAttribute(attr);
        if (!val) continue;
        let pair = elMap?.get(attr);
        if (!pair) {
          const enVal = dict.ATTR_FR_TO_EN[val.trim()];
          if (enVal) {
            if (!elMap) {
              elMap = new Map();
              attrBindings.set(el, elMap);
            }
            pair = { fr: val, en: enVal };
            elMap.set(attr, pair);
          }
        }
        if (pair) {
          const targetVal = lang === 'en' ? pair.en : pair.fr;
          if (el.getAttribute(attr) !== targetVal) {
            el.setAttribute(attr, targetVal);
          }
        }
      }
    });
}

export function applyDomTranslations(root: ParentNode = document.body): void {
  if (!root) return;
  // En français avant toute bascule EN : 0 Ko de dictionnaire téléchargé
  if (currentLang === 'fr' && !cachedDict) return;
  if (cachedDict) {
    applyDomTranslationsWithDict(cachedDict, root);
    return;
  }
  void loadDict().then((dict) => {
    applyDomTranslationsWithDict(dict, root);
  });
}

function syncLangToggleButtons(lang: SiteLang): void {
  const nextCode = lang === 'fr' ? 'EN' : 'FR';
  const nextTitle =
    lang === 'fr' ? 'Switch to English (EN)' : 'Passer en français (FR)';

  document.querySelectorAll<HTMLElement>('[data-site-lang-code]').forEach((badge) => {
    badge.textContent = nextCode;
  });

  document.querySelectorAll<HTMLElement>('[data-toggle-site-lang], #langSwitcherBtn').forEach((btn) => {
    btn.setAttribute('aria-label', nextTitle);
    btn.setAttribute('title', nextTitle);
    btn.setAttribute('aria-pressed', lang === 'en' ? 'true' : 'false');
  });
}

function syncHeadMetadata(lang: SiteLang): void {
  const html = document.documentElement;
  const nextTitle = lang === 'en' ? html.dataset.titleEn : html.dataset.titleFr;
  const nextDesc = lang === 'en' ? html.dataset.descEn : html.dataset.descFr;

  if (nextTitle) {
    document.title = nextTitle;
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', nextTitle);
    document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', nextTitle);
  }
  if (nextDesc) {
    document.querySelector('meta[name="description"]')?.setAttribute('content', nextDesc);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', nextDesc);
    document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', nextDesc);
  }
  document
    .querySelector('meta[property="og:locale"]')
    ?.setAttribute('content', lang === 'en' ? 'en_CA' : 'fr_CA');
}

export function setSiteLang(lang: SiteLang, persist = true): void {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.documentElement.dataset.lang = lang;

  if (persist) {
    try {
      localStorage.setItem(SITE_LANG_STORAGE_KEY, lang);
      localStorage.setItem('ob_v6_cv_lang', lang);
    } catch {
      // Ignore
    }
  }

  syncHeadMetadata(lang);
  applyDomTranslations(document.body);
  syncLangToggleButtons(lang);

  window.dispatchEvent(new CustomEvent('ob:langchange', { detail: { lang } }));
}

export function initSiteLang(): void {
  const initial = detectInitialSiteLang();
  setSiteLang(initial, false);

  if (initialized) return;
  initialized = true;

  document.addEventListener('click', (e) => {
    const trigger = (e.target as Element | null)?.closest('[data-toggle-site-lang]');
    if (!trigger) return;
    e.preventDefault();
    setSiteLang(currentLang === 'fr' ? 'en' : 'fr', true);
  });

  window.addEventListener('storage', (e) => {
    if (
      (e.key === SITE_LANG_STORAGE_KEY || e.key === 'ob_v6_cv_lang') &&
      (e.newValue === 'fr' || e.newValue === 'en')
    ) {
      setSiteLang(e.newValue, false);
    }
  });
}
