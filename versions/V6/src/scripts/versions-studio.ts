import { PORTFOLIO_VERSIONS, type PortfolioVersion } from '../data/versions';
import { registerDialogHandler } from './dialogs';
import { getSiteLang } from './i18n';
import { bindVerticalNavSpy } from './vnav';

type VersionMetaEnMap = Record<string, { title: string; description: string }>;
let cachedVersionMetaEn: VersionMetaEnMap | null = null;

async function getVersionMetaEn(): Promise<VersionMetaEnMap> {
  if (cachedVersionMetaEn) return cachedVersionMetaEn;
  const mod = await import('../data/i18n');
  cachedVersionMetaEn = mod.VERSION_META_EN;
  return cachedVersionMetaEn;
}

function toIframePreviewUrl(versionId: string, targetUrl: string): string {
  if (versionId !== 'V6') return targetUrl;
  const sep = targetUrl.includes('?') ? '&' : '?';
  return `${targetUrl}${sep}embed=1`;
}

type DeviceType = 'desktop' | 'tablet' | 'mobile';

const DEVICE_PRESETS: Record<
  DeviceType,
  { label: string; width: number; height: number; bezelPadX: number }
> = {
  desktop: { label: 'Desktop', width: 1366, height: 820, bezelPadX: 4 },
  tablet: { label: 'Tablette', width: 768, height: 820, bezelPadX: 34 },
  mobile: { label: 'Mobile', width: 390, height: 740, bezelPadX: 26 }
};

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function initVersionsStudio(): void {
  const defaultFeatured =
    PORTFOLIO_VERSIONS.find((v) => v.featured) || PORTFOLIO_VERSIONS[0];

  const state: {
    activeVersionId: string;
    activePaletteKey: string | null;
    activeUrl: string;
    device: DeviceType;
    loadedVersionId: string | null;
    iframeReady: boolean;
    lastStageWidth: number;
    resizeRafId: number | null;
    loaderTimeoutId: number | null;
  } = {
    activeVersionId: defaultFeatured.id,
    activePaletteKey: defaultFeatured.palettes[0]?.key || null,
    activeUrl: defaultFeatured.path,
    device: 'desktop',
    loadedVersionId: null,
    iframeReady: false,
    lastStageWidth: 0,
    resizeRafId: null,
    loaderTimeoutId: null
  };

  function getVersionById(id: string): PortfolioVersion {
    return (
      PORTFOLIO_VERSIONS.find(
        (v) => v.id.toUpperCase() === String(id).toUpperCase()
      ) || defaultFeatured
    );
  }

  function updateBrowserQueryString(): void {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('v', state.activeVersionId);
      if (state.activePaletteKey) {
        url.searchParams.set('palette', state.activePaletteKey);
      } else {
        url.searchParams.delete('palette');
      }
      if (state.device !== 'desktop') {
        url.searchParams.set('device', state.device);
      } else {
        url.searchParams.delete('device');
      }
      window.history.replaceState({}, '', url.toString());
    } catch {
      // Ignorer si history API indisponible
    }
  }

  function updateDeviceScale(): void {
    const stage = document.getElementById('studioStage');
    const bezel = document.getElementById('studioDeviceBezel');
    const scaleWrap = document.getElementById('studioScaleWrap');
    const iframe = document.getElementById('studioIframe');
    const dimPill = document.getElementById('studioDimensionsPill');

    if (!stage || !bezel || !scaleWrap || !iframe) return;

    const preset = DEVICE_PRESETS[state.device] || DEVICE_PRESETS.desktop;
    bezel.setAttribute('data-device', state.device);

    const stageStyle = window.getComputedStyle(stage);
    const padX =
      (parseFloat(stageStyle.paddingLeft) || 0) +
      (parseFloat(stageStyle.paddingRight) || 0);
    const availableWidth = Math.max(260, stage.clientWidth - padX - preset.bezelPadX);

    const scale = Math.min(1, availableWidth / preset.width);
    const scaledWidth = Math.round(preset.width * scale);
    const scaledHeight = Math.round(preset.height * scale);

    scaleWrap.style.width = `${scaledWidth}px`;
    scaleWrap.style.height = `${scaledHeight}px`;

    iframe.style.width = `${preset.width}px`;
    iframe.style.height = `${preset.height}px`;
    iframe.style.transform = scale < 0.999 ? `scale(${scale})` : 'none';

    if (dimPill) {
      const zoomPct = Math.round(scale * 100);
      dimPill.textContent = `${preset.width} × ${preset.height} px · ${zoomPct}%`;
    }
  }

  function syncFullscreenDeviceUI(): void {
    const fsIframe = document.getElementById('fullscreenIframe');
    if (fsIframe) {
      fsIframe.setAttribute('data-device', state.device);
    }
    document.querySelectorAll<HTMLElement>('[data-fs-device]').forEach((btn) => {
      const active = btn.getAttribute('data-fs-device') === state.device;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function setDeviceMode(device: DeviceType): void {
    if (!DEVICE_PRESETS[device]) return;
    state.device = device;

    document.querySelectorAll<HTMLElement>('.viewport-btn[data-device]').forEach((btn) => {
      const active = btn.getAttribute('data-device') === device;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    updateDeviceScale();
    syncFullscreenDeviceUI();
    updateBrowserQueryString();
  }

  function showStudioLoader(label: string): void {
    const loader = document.getElementById('studioLoader');
    const loaderText = document.getElementById('studioLoaderText');
    if (loaderText && label) loaderText.textContent = label;
    loader?.classList.add('is-loading');

    if (state.loaderTimeoutId !== null) {
      window.clearTimeout(state.loaderTimeoutId);
    }
    state.loaderTimeoutId = window.setTimeout(hideStudioLoader, 4500);
  }

  function hideStudioLoader(): void {
    const loader = document.getElementById('studioLoader');
    loader?.classList.remove('is-loading');
    if (state.loaderTimeoutId !== null) {
      window.clearTimeout(state.loaderTimeoutId);
      state.loaderTimeoutId = null;
    }
  }

  function renderStudioPaletteBar(version: PortfolioVersion): void {
    const bar = document.getElementById('studioPaletteBar');
    const chipsContainer = document.getElementById('studioPaletteChips');
    const labelEl = document.getElementById('studioPaletteLabel');
    if (!bar || !chipsContainer || !labelEl) return;

    const palettes = version.palettes || [];
    const isEn = getSiteLang() === 'en';
    if (palettes.length === 0) {
      labelEl.innerHTML = `<i class="bi bi-droplet-half" aria-hidden="true"></i> ${isEn ? 'Visual DNA' : 'ADN Visuel'}`;
      chipsContainer.innerHTML = version.swatches
        .map(
          (hex) => `
          <span class="studio-palette-chip" style="cursor: default;">
            <span class="studio-palette-dot" style="background: ${escapeHtml(hex)};"></span>
            <span style="font-family: var(--coding-font); font-size: 0.74rem;">${escapeHtml(hex)}</span>
          </span>`
        )
        .join('');
      return;
    }

    labelEl.innerHTML =
      palettes.length > 1
        ? `<i class="bi bi-palette2" aria-hidden="true"></i> Styles ${escapeHtml(version.id)} (${palettes.length})`
        : `<i class="bi bi-palette2" aria-hidden="true"></i> ${isEn ? 'Theme' : 'Direction'} ${escapeHtml(version.id)}`;

    chipsContainer.innerHTML = palettes
      .map((p) => {
        const isSelected = p.key === state.activePaletteKey;
        return `
          <button
            type="button"
            class="studio-palette-chip"
            data-studio-palette="${escapeHtml(p.key)}"
            aria-pressed="${isSelected ? 'true' : 'false'}"
            title="Tester le style ${escapeHtml(p.name)}"
          >
            <span class="studio-palette-dot" style="background: ${escapeHtml(p.color)};"></span>
            <span>${escapeHtml(p.name)}</span>
          </button>`;
      })
      .join('');
  }

  function updateStudioChrome(version: PortfolioVersion, targetUrl: string): void {
    const addressText = document.getElementById('studioAddressText');
    const openExternal = document.getElementById('studioOpenExternal');
    const metaTitle = document.getElementById('studioMetaTitle');
    const metaDesc = document.getElementById('studioMetaDesc');
    const jumpTimelineBtn = document.getElementById('studioJumpTimeline');

    const displayPath = targetUrl.replace(/^\/+/, '');
    if (addressText) addressText.textContent = `olivierbourgault.github.io/${displayPath}`;
    if (openExternal) {
      openExternal.setAttribute('href', targetUrl);
      openExternal.setAttribute('title', `Ouvrir ${version.id} dans un nouvel onglet`);
    }
    const isEn = getSiteLang() === 'en';
    if (isEn) {
      if (cachedVersionMetaEn?.[version.id]) {
        const enMeta = cachedVersionMetaEn[version.id];
        if (metaTitle) metaTitle.textContent = enMeta.title;
        if (metaDesc) metaDesc.textContent = enMeta.description;
      } else {
        if (metaTitle) metaTitle.textContent = version.title;
        if (metaDesc) metaDesc.textContent = version.description;
        void getVersionMetaEn().then((map) => {
          if (getSiteLang() === 'en' && state.activeVersionId === version.id && map[version.id]) {
            if (metaTitle) metaTitle.textContent = map[version.id].title;
            if (metaDesc) metaDesc.textContent = map[version.id].description;
          }
        });
      }
    } else {
      if (metaTitle) metaTitle.textContent = version.title;
      if (metaDesc) metaDesc.textContent = version.description;
    }
    if (jumpTimelineBtn) jumpTimelineBtn.setAttribute('href', `#version-${version.id}`);
  }

  window.addEventListener('ob:langchange', () => {
    const activeVer = getVersionById(state.activeVersionId);
    renderStudioPaletteBar(activeVer);
    updateStudioChrome(activeVer, state.activeUrl);
  });

  function selectVersionInStudio(
    versionId: string,
    paletteKey: string | null = null,
    options: { forceReload?: boolean; scrollToStudio?: boolean } = {}
  ): void {
    const { forceReload = false, scrollToStudio = false } = options;
    const version = getVersionById(versionId);
    const palettes = version.palettes || [];
    const chosenPalette =
      palettes.length > 0
        ? (paletteKey && palettes.find((p) => p.key === paletteKey)) || palettes[0]
        : null;

    const targetUrl = chosenPalette ? chosenPalette.url : version.path;
    const isSameVersionAlreadyLoaded =
      !forceReload &&
      state.loadedVersionId === version.id &&
      state.activeVersionId === version.id;

    state.activeVersionId = version.id;
    state.activePaletteKey = chosenPalette ? chosenPalette.key : null;
    state.activeUrl = targetUrl;

    const tablist = document.getElementById('studioTablist');
    const panel = document.getElementById('studioTabpanel');
    if (tablist) {
      tablist.querySelectorAll<HTMLElement>('[role="tab"]').forEach((tab) => {
        const isCurrent = tab.getAttribute('data-version-tab') === version.id;
        tab.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
        tab.toggleAttribute('focusgroupstart', isCurrent);
        tab.tabIndex = isCurrent ? 0 : -1;
        if (isCurrent) {
          panel?.setAttribute('aria-labelledby', tab.id);
          const tabLeft = tab.offsetLeft;
          const tabRight = tabLeft + tab.offsetWidth;
          if (tabLeft < tablist.scrollLeft || tabRight > tablist.scrollLeft + tablist.clientWidth) {
            tablist.scrollTo({ left: Math.max(0, tabLeft - 16), behavior: 'smooth' });
          }
        }
      });
    }

    renderStudioPaletteBar(version);
    updateStudioChrome(version, targetUrl);
    updateBrowserQueryString();

    const iframe = document.getElementById('studioIframe') as HTMLIFrameElement | null;
    if (iframe) {
      iframe.setAttribute('title', `Aperçu en direct de ${version.title}`);

      let switchedLive = false;
      if (
        isSameVersionAlreadyLoaded &&
        state.iframeReady &&
        chosenPalette &&
        (version.id === 'V3' || version.id === 'V4')
      ) {
        try {
          const doc = iframe.contentDocument;
          const win = iframe.contentWindow as (Window & { setPalette?: (k: string, b?: boolean) => void }) | null;
          if (doc?.readyState === 'complete' && typeof win?.setPalette === 'function') {
            win.setPalette(chosenPalette.key, true);
            switchedLive = doc.body?.getAttribute('data-palette') === chosenPalette.key;
          }
        } catch {
          switchedLive = false;
        }
      }

      if (!switchedLive) {
        if (chosenPalette && (version.id === 'V3' || version.id === 'V4')) {
          try {
            localStorage.setItem('v4_palette', chosenPalette.key);
          } catch {
            // Ignorer
          }
        }
        showStudioLoader(`Chargement de ${version.id} (${version.shortLabel})…`);
        const isReloadSameUrl = forceReload && state.loadedVersionId === version.id;
        state.loadedVersionId = version.id;
        state.iframeReady = false;
        const iframeTargetUrl = toIframePreviewUrl(version.id, targetUrl);
        if (isReloadSameUrl) {
          try {
            if (iframe.contentWindow?.location) {
              iframe.contentWindow.location.reload();
            } else {
              iframe.src = iframeTargetUrl;
            }
          } catch {
            iframe.src = iframeTargetUrl;
          }
        } else {
          iframe.src = iframeTargetUrl;
        }
      }
    }

    if (scrollToStudio) {
      document.getElementById('studio')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function initTablistKeyboardAndScrollHints(): void {
    const tablist = document.getElementById('studioTablist');
    if (!tablist) return;

    if (!Object.hasOwn(HTMLElement.prototype, 'focusGroup')) {
      tablist.addEventListener('keydown', (e) => {
        const tabs = Array.from(tablist.querySelectorAll<HTMLElement>('[role="tab"]'));
        if (tabs.length === 0) return;

        const currentIdx = tabs.indexOf(document.activeElement as HTMLElement);
        if (currentIdx === -1) return;

        let nextIdx: number | null = null;
        if (e.key === 'ArrowRight') nextIdx = (currentIdx + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') nextIdx = (currentIdx - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') nextIdx = 0;
        else if (e.key === 'End') nextIdx = tabs.length - 1;

        if (nextIdx !== null) {
          e.preventDefault();
          tabs[nextIdx].focus();
          const targetTab = tabs[nextIdx];
          const tabLeft = targetTab.offsetLeft;
          const tabRight = tabLeft + targetTab.offsetWidth;
          if (tabLeft < tablist.scrollLeft || tabRight > tablist.scrollLeft + tablist.clientWidth) {
            tablist.scrollTo({ left: Math.max(0, tabLeft - 16), behavior: 'smooth' });
          }
        }
      });
    }

    if (typeof CSS === 'undefined' || !CSS.supports('animation-timeline', 'scroll()')) {
      const first = tablist.firstElementChild;
      const last = tablist.lastElementChild;
      if (first && last && 'IntersectionObserver' in window) {
        const fadeObserver = new IntersectionObserver(
          (entries) => {
            for (const { target, intersectionRatio } of entries) {
              tablist.classList.toggle(
                target === first ? 'more-start' : 'more-end',
                intersectionRatio < 1
              );
            }
          },
          { root: tablist, threshold: 1, rootMargin: '1px' }
        );
        fadeObserver.observe(first);
        fadeObserver.observe(last);
      }
    }
  }

  function initAccordionToggleAll(): void {
    const btn = document.getElementById('toggleAllDetailsBtn');
    const track = document.getElementById('versionsTimeline');
    if (!btn || !track) return;

    const syncToggleAllButtonState = () => {
      const items = Array.from(track.querySelectorAll<HTMLDetailsElement>('details.version-details'));
      const allOpen = items.length > 0 && items.every((d) => d.open);
      btn.setAttribute('aria-expanded', allOpen ? 'true' : 'false');
    };

    btn.addEventListener('click', () => {
      const expand = btn.getAttribute('aria-expanded') !== 'true';
      track.querySelectorAll<HTMLDetailsElement>('details.version-details').forEach((details) => {
        details.open = expand;
      });
      syncToggleAllButtonState();
    });

    track.addEventListener(
      'toggle',
      (e) => {
        if ((e.target as Element | null)?.matches('details.version-details')) {
          syncToggleAllButtonState();
        }
      },
      { capture: true }
    );

    syncToggleAllButtonState();
  }

  function openFullscreenPreview(): boolean {
    const dialog = document.getElementById('fullscreenPreviewDialog') as HTMLDialogElement | null;
    const fsIframe = document.getElementById('fullscreenIframe') as HTMLIFrameElement | null;
    const fsTitle = document.getElementById('fullscreenPreviewTitle');
    const fsSub = document.getElementById('fullscreenPreviewSub');
    const fsOpen = document.getElementById('fullscreenOpenExternal');
    if (!dialog || !fsIframe) return false;

    const version = getVersionById(state.activeVersionId);
    const fsDisplayPath = state.activeUrl.replace(/^\/+/, '');
    if (fsTitle) fsTitle.textContent = `Aperçu plein écran — ${version.id} (${version.shortLabel})`;
    if (fsSub) fsSub.textContent = `olivierbourgault.github.io/${fsDisplayPath}`;
    if (fsOpen) fsOpen.setAttribute('href', state.activeUrl);

    syncFullscreenDeviceUI();
    fsIframe.src = toIframePreviewUrl(version.id, state.activeUrl);
    dialog.showModal();
    return true;
  }

  registerDialogHandler('fullscreenPreviewDialog', () => openFullscreenPreview());

  document.getElementById('fullscreenReloadBtn')?.addEventListener('click', () => {
    const fsIframe = document.getElementById('fullscreenIframe') as HTMLIFrameElement | null;
    if (fsIframe) fsIframe.src = toIframePreviewUrl(state.activeVersionId, state.activeUrl);
  });

  document.querySelectorAll<HTMLElement>('[data-fs-device]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dev = btn.getAttribute('data-fs-device') as DeviceType | null;
      if (dev) setDeviceMode(dev);
    });
  });

  document.getElementById('studioTablist')?.addEventListener('click', (e) => {
    const tab = (e.target as Element | null)?.closest('[role="tab"][data-version-tab]');
    const vId = tab?.getAttribute('data-version-tab');
    if (vId) selectVersionInStudio(vId);
  });

  document.getElementById('studioPaletteChips')?.addEventListener('click', (e) => {
    const chip = (e.target as Element | null)?.closest('button[data-studio-palette]');
    const pKey = chip?.getAttribute('data-studio-palette');
    if (pKey) selectVersionInStudio(state.activeVersionId, pKey);
  });

  document.querySelectorAll<HTMLElement>('.viewport-btn[data-device]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dev = btn.getAttribute('data-device') as DeviceType | null;
      if (dev) setDeviceMode(dev);
    });
  });

  document.getElementById('studioReloadBtn')?.addEventListener('click', () => {
    selectVersionInStudio(state.activeVersionId, state.activePaletteKey, { forceReload: true });
  });

  const iframe = document.getElementById('studioIframe') as HTMLIFrameElement | null;
  iframe?.addEventListener('load', () => {
    state.iframeReady = true;
    if (state.activePaletteKey && (state.activeVersionId === 'V3' || state.activeVersionId === 'V4')) {
      try {
        const win = iframe.contentWindow as (Window & { setPalette?: (k: string, b?: boolean) => void }) | null;
        if (typeof win?.setPalette === 'function') {
          win.setPalette(state.activePaletteKey, true);
        }
      } catch {
        // Ignorer
      }
    }
    hideStudioLoader();
  });

  document.getElementById('versionsTimeline')?.addEventListener('click', (e) => {
    const trigger = (e.target as Element | null)?.closest('[data-preview-version]');
    if (!trigger) return;
    const vId = trigger.getAttribute('data-preview-version');
    const pKey = trigger.getAttribute('data-preview-palette') || null;
    if (vId) selectVersionInStudio(vId, pKey, { scrollToStudio: true });
  });

  const studioWindow = document.getElementById('studioTabpanel');
  if (studioWindow && 'ResizeObserver' in window) {
    const ro = new ResizeObserver((entries) => {
      const width = Math.round(entries[0]?.contentRect?.width || 0);
      if (!width || width === state.lastStageWidth) return;
      state.lastStageWidth = width;
      if (state.resizeRafId !== null) cancelAnimationFrame(state.resizeRafId);
      state.resizeRafId = requestAnimationFrame(() => {
        state.resizeRafId = null;
        updateDeviceScale();
      });
    });
    ro.observe(studioWindow);
  } else {
    window.addEventListener('resize', updateDeviceScale);
  }

  initTablistKeyboardAndScrollHints();
  initAccordionToggleAll();
  bindVerticalNavSpy({
    listId: 'vnavVersionsList',
    getTargets: () => Array.from(document.querySelectorAll<HTMLElement>('#versionsTimeline .timeline-version-card')),
    onSelect: (target) => target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  });

  let initialVersion: string | null = null;
  let initialPalette: string | null = null;
  let initialDevice: DeviceType = 'desktop';
  try {
    const params = new URLSearchParams(window.location.search);
    initialVersion = params.get('v');
    initialPalette = params.get('palette');
    const dev = params.get('device') as DeviceType | null;
    if (dev && DEVICE_PRESETS[dev]) initialDevice = dev;
  } catch {
    // Ignorer
  }

  const startVersion = initialVersion ? getVersionById(initialVersion) : defaultFeatured;
  state.activeVersionId = startVersion.id;
  state.device = initialDevice;
  setDeviceMode(state.device);
  selectVersionInStudio(startVersion.id, initialPalette);
}
