import { copyTextToClipboard } from './clipboard';
import { getSiteLang } from './i18n';
import { bindVerticalNavSpy } from './vnav';

const HERO_EMBLEM_META: Record<string, { fr: string; en: string }> = {
  'ob-tech': { fr: 'OB Hexagonal · R 46 · 60°', en: 'OB Hexagonal · R 46 · 60°' },
  terminal: { fr: 'Terminal </> · R 44 · 74°', en: 'Terminal </> · R 44 · 74°' },
  neural: { fr: 'Nœud Neuronal · R 42 · dash 8/4', en: 'Neural Node · R 42 · dash 8/4' }
};

function initHeroBlueprintSwitcher(): void {
  const switcher = document.getElementById('heroEmblemSwitcher');
  const svg = document.getElementById('heroBlueprintSvg');
  const readout = document.getElementById('heroBlueprintReadout');
  if (!switcher || !svg) return;

  const buttons = Array.from(switcher.querySelectorAll<HTMLElement>('[data-hero-emblem]'));
  const groups = Array.from(svg.querySelectorAll<SVGElement>('[data-hero-svg]'));
  let activeKey = 'ob-tech';

  function syncReadout(): void {
    const meta = HERO_EMBLEM_META[activeKey];
    if (readout && meta) {
      readout.textContent = getSiteLang() === 'en' ? meta.en : meta.fr;
    }
  }

  function selectEmblem(key: string): void {
    activeKey = key;
    buttons.forEach((btn) => {
      btn.setAttribute(
        'aria-pressed',
        btn.getAttribute('data-hero-emblem') === key ? 'true' : 'false'
      );
    });
    groups.forEach((g) => {
      g.classList.toggle('is-active', g.getAttribute('data-hero-svg') === key);
    });
    syncReadout();
  }

  switcher.addEventListener('click', (e) => {
    const btn = (e.target as Element | null)?.closest('[data-hero-emblem]');
    const key = btn?.getAttribute('data-hero-emblem');
    if (key) selectEmblem(key);
  });

  window.addEventListener('ob:langchange', syncReadout);
}

function initLogoInspectors(): void {
  const hasNativeFocusgroup = Object.hasOwn(HTMLElement.prototype, 'focusGroup');
  const inspectors = Array.from(document.querySelectorAll<HTMLElement>('.logo-inspector'));

  inspectors.forEach((inspector) => {
    const tablist = inspector.querySelector<HTMLElement>('[role="tablist"]');
    const stage = inspector.querySelector<HTMLElement>('.inspector-stage');
    if (!tablist || !stage) return;

    const tabs = Array.from(tablist.querySelectorAll<HTMLElement>('[role="tab"]'));
    const panels = Array.from(inspector.querySelectorAll<HTMLElement>('[role="tabpanel"]'));

    function activateTab(selectedTab: HTMLElement, shouldFocus = false): void {
      const mode = selectedTab.getAttribute('data-inspector-mode') || 'logo';
      stage!.setAttribute('data-mode', mode);

      tabs.forEach((tab) => {
        const isCurrent = tab === selectedTab;
        tab.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
        tab.toggleAttribute('focusgroupstart', isCurrent);
        tab.tabIndex = isCurrent ? 0 : -1;
      });

      panels.forEach((panel) => {
        const isCurrent = panel.getAttribute('aria-labelledby') === selectedTab.id;
        if (isCurrent) {
          panel.hidden = false;
          panel.setAttribute('tabindex', '0');
        } else {
          (panel as unknown as { hidden: string | boolean }).hidden = 'until-found';
          panel.removeAttribute('tabindex');
        }
      });

      if (shouldFocus) {
        selectedTab.focus();
      }
    }

    tablist.addEventListener('click', (e) => {
      const tab = (e.target as Element | null)?.closest<HTMLElement>('[role="tab"]');
      if (tab) activateTab(tab, false);
    });

    tablist.addEventListener('focusin', (e) => {
      const tab = (e.target as Element | null)?.closest<HTMLElement>('[role="tab"]');
      if (tab && tab.getAttribute('aria-selected') !== 'true') {
        activateTab(tab, false);
      }
    });

    if (!hasNativeFocusgroup) {
      tablist.addEventListener('keydown', (e) => {
        const currentIdx = tabs.indexOf(document.activeElement as HTMLElement);
        if (currentIdx === -1) return;

        let nextIdx: number | null = null;
        if (e.key === 'ArrowRight') nextIdx = (currentIdx + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') nextIdx = (currentIdx - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') nextIdx = 0;
        else if (e.key === 'End') nextIdx = tabs.length - 1;

        if (nextIdx !== null) {
          e.preventDefault();
          activateTab(tabs[nextIdx], true);
        }
      });
    }

    panels.forEach((panel) => {
      panel.addEventListener('beforematch', () => {
        const tabId = panel.getAttribute('aria-labelledby');
        const matchingTab = tabId ? document.getElementById(tabId) : null;
        if (matchingTab) activateTab(matchingTab, false);
      });
    });

    const surfaceBtns = Array.from(stage.querySelectorAll<HTMLElement>('[data-stage-surface]'));
    stage.addEventListener('click', (e) => {
      const btn = (e.target as Element | null)?.closest<HTMLElement>('[data-stage-surface]');
      if (!btn) return;
      const chosenSurface = btn.getAttribute('data-stage-surface') || 'dark';
      stage.setAttribute('data-surface', chosenSurface);
      surfaceBtns.forEach((b) => {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });
    });
  });
}

function initTestBench(): void {
  const controls = document.getElementById('benchControls');
  const stage = document.getElementById('benchStage');
  if (!controls || !stage) return;

  const buttons = Array.from(controls.querySelectorAll<HTMLElement>('[data-bench-mode]'));
  controls.addEventListener('click', (e) => {
    const btn = (e.target as Element | null)?.closest<HTMLElement>('[data-bench-mode]');
    if (!btn) return;
    const mode = btn.getAttribute('data-bench-mode') || 'dark';
    stage.setAttribute('data-bench-surface', mode);
    buttons.forEach((b) => {
      b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
    });
  });
}

function initCopyButtons(): void {
  const copyTimers = new WeakMap<HTMLElement, number>();
  let lastCopyMessage = '';

  function reportCopy(button: HTMLElement, ok: boolean): void {
    const tip = button.nextElementSibling as HTMLElement | null;
    const prevTimer = copyTimers.get(button);
    if (prevTimer) window.clearTimeout(prevTimer);

    button.removeAttribute('data-copied');
    button.removeAttribute('data-failed');

    const isEn = getSiteLang() === 'en';
    let message = ok ? (isEn ? 'Copied!' : 'Copié !') : isEn ? 'Failed' : 'Échec';
    if (message === lastCopyMessage) message += '\u00A0';
    lastCopyMessage = message;

    if (tip) tip.textContent = '';
    void button.offsetWidth;
    button.setAttribute(ok ? 'data-copied' : 'data-failed', '');
    if (tip) requestAnimationFrame(() => (tip.textContent = message));

    copyTimers.set(
      button,
      window.setTimeout(() => {
        button.removeAttribute('data-copied');
        button.removeAttribute('data-failed');
        if (tip) tip.textContent = '';
      }, 2000)
    );
  }

  async function copyFromTarget(button: HTMLElement | null, target: HTMLElement | null): Promise<void> {
    if (!button || !target) return;
    const text = target.matches('input, textarea')
      ? (target as HTMLInputElement).value
      : target.innerText.trim();
    if (!text) return;

    const ok = await copyTextToClipboard(text);
    reportCopy(button, ok);
  }

  if ('CommandEvent' in window) {
    document.addEventListener(
      'command',
      (event: Event) => {
        const cmdEvent = event as Event & {
          command?: string;
          source?: HTMLElement | null;
          target?: HTMLElement | null;
        };
        if (cmdEvent.command === '--copy') {
          void copyFromTarget(cmdEvent.source ?? null, cmdEvent.target ?? null);
        }
      },
      true
    );
  } else {
    document.addEventListener('click', (event) => {
      const button = (event.target as Element | null)?.closest<HTMLElement>('button[command="--copy"]');
      if (!button) return;
      const targetId = button.getAttribute('commandfor');
      const target = targetId ? document.getElementById(targetId) : null;
      if (target) void copyFromTarget(button, target);
    });
  }
}

export function initIdentitePage(): void {
  initHeroBlueprintSwitcher();
  initLogoInspectors();
  initTestBench();
  initCopyButtons();

  bindVerticalNavSpy({
    listId: 'vnavIdentiteList',
    getTargets: () => Array.from(document.querySelectorAll<HTMLElement>('section.identite-chapter')),
    onSelect: (target) => target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  });
}
