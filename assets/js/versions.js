/**
 * Navigateur de versions — Studio Interactif & Frise d'Évolution
 * Aligné sur l'architecture Tech Canvas (index.html) & Modern Web Guidance.
 */
(function () {
  'use strict';

  const THEME_STORAGE_KEY = 'ob_versions_theme';
  const LASER_STORAGE_KEY = 'laser_active';
  const IS_FILE_PROTOCOL = window.location.protocol === 'file:';

  function buildVersionUrl(folder, query = '') {
    if (!folder) return IS_FILE_PROTOCOL ? `index.html${query}` : `./${query}`;
    return IS_FILE_PROTOCOL ? `${folder}/index.html${query}` : `${folder}/${query}`;
  }

  const DEVICE_PRESETS = {
    desktop: { label: 'Desktop', width: 1366, height: 820, bezelPadX: 4, bezelPadY: 4 },
    tablet: { label: 'Tablette', width: 768, height: 820, bezelPadX: 34, bezelPadY: 44 },
    mobile: { label: 'Mobile', width: 390, height: 740, bezelPadX: 26, bezelPadY: 56 }
  };

  /**
   * Registre officiel des générations du portfolio.
   * Les dossiers V6..V10 publiés sur le serveur sont également détectés automatiquement.
   */
  const BASE_VERSIONS = [
    {
      id: 'V5',
      shortLabel: 'Tech Canvas',
      title: 'Version 5.0 — Édition Tech Canvas & Studio Interactif',
      path: 'index.html',
      date: '2026',
      status: 'Actuelle · Recommandée',
      statusType: 'live',
      featured: true,
      swatches: ['#121316', '#FF6600', '#38BDF8', '#F4F1EA'],
      stack: ['Tech Canvas', 'Vanilla JS', 'GitHub API', 'SVG / CSS3', 'WCAG'],
      description:
        'Direction artistique exclusive « Tech Canvas », fusionnant la rigueur technique Carbone #121316 & Orange #FF6600, l’atelier Figma de Shabnam Raghavan et le néo-brutalisme interactif d’Aahil Khan, enrichie d’un portfolio GitHub en temps réel et d’une ergonomie de lecture complète.',
      highlights: [
        'Direction artistique unifiée Tech Canvas : fond carbone #121316 (ou ivoire #F4F1EA en mode clair), grille 48×48 px, cartes néo-brutalistes à ombre dure #FF6600 et rubans d’atelier translucides',
        'Barre de navigation Shabnam évolutive : en-tête transparent avec soulignement sinusoïdal SVG qui se transforme au défilement en pilule translucide (hystérésis fluide) et tiroir mobile #302F2C',
        'Boot Loader Fusion exclusif : tracé vectoriel du monogramme OB Tech, nœuds neuronaux IA en orbite et terminal OB_TECH_CORE avec progression 00% → 100%',
        'Portfolio dynamique synchronisé avec GitHub (RinoShip77/MesProjets, 59+ projets) : 5 projets phares affichés par défaut et bouton « Voir plus » avec compteur',
        'Navigation avancée : sections collapsibles, barre de navigation verticale collante (CV & Portfolio), curseur Aahil Khan à halo radial orange (touche L) et page CV - Aperçu dédiée'
      ],
      palettes: [
        {
          key: 'tech-canvas',
          name: 'Tech Canvas (Exclusif V5)',
          url: 'index.html',
          color: 'linear-gradient(135deg, #FF6600, #121316)'
        }
      ]
    },
    {
      id: 'V4',
      shortLabel: 'OB Tech',
      title: 'Version 4.0 — Édition OB Tech & Identité Vectorielle',
      path: buildVersionUrl('V4'),
      date: '2026',
      status: 'Stable',
      statusType: 'stable',
      featured: false,
      swatches: ['#121316', '#FF6600', '#38BDF8', '#1C1E24'],
      stack: ['SVG Vectoriel', '7 Palettes', 'Bootstrap 5', 'Laser UI'],
      description:
        'Adoption officielle du logo vectoriel « OB Tech » (hexagone orange et circuit bleu ciel), déploiement de l’écosystème des 3 logos thématiques et mise en avant de la palette Tech Présentation avec 7 thèmes commutables.',
      highlights: [
        'Logo principal officiel OB Tech en SVG (hexagone #FF6600 & circuits binaires #38BDF8)',
        'Écosystème des 3 logos thématiques : OB Hexagonal (TI/DevOps), Terminal </> (Full-Stack) et Nœud Neuronal (IA)',
        'Palette Tech Présentation activée par défaut avec grille technique 40×40 px et pointeur laser virtuel (touche L)',
        'Sélecteur multi-styles étendu à 7 palettes commutables à chaud (Tech, Tech Canvas, Obsidian Blaze, Améthyste, Synthwave, Ethiack, Shabnam)',
        'Favicon vectoriel SVG et page de propositions d’identité visuelle associée'
      ],
      palettes: [
        {
          key: 'tech',
          name: 'Tech Présentation',
          url: buildVersionUrl('V4', '?palette=tech'),
          color: 'linear-gradient(135deg, #FF6600, #38BDF8)'
        },
        {
          key: 'tech-canvas',
          name: 'Tech Canvas',
          url: buildVersionUrl('V4', '?palette=tech-canvas'),
          color: 'linear-gradient(135deg, #FF6600, #121316)'
        },
        {
          key: 'obsidian-blaze',
          name: 'Obsidian Blaze',
          url: buildVersionUrl('V4', '?palette=obsidian-blaze'),
          color: 'linear-gradient(135deg, #FF5A1F, #FFBC42)'
        },
        {
          key: 'amethyst',
          name: 'Améthyste',
          url: buildVersionUrl('V4', '?palette=amethyst'),
          color: 'linear-gradient(135deg, #E11484, #A855F7)'
        },
        {
          key: 'synthwave',
          name: 'Active Theory',
          url: buildVersionUrl('V4', '?palette=synthwave'),
          color: 'linear-gradient(135deg, #00F0FF, #C026D3)'
        },
        {
          key: 'ethiack',
          name: 'Ethiack',
          url: buildVersionUrl('V4', '?palette=ethiack'),
          color: 'linear-gradient(135deg, #10B981, #059669)'
        },
        {
          key: 'shabnam',
          name: 'Shabnam',
          url: buildVersionUrl('V4', '?palette=shabnam'),
          color: 'linear-gradient(135deg, #C02D0C, #F2D987)'
        }
      ]
    },
    {
      id: 'V3',
      shortLabel: 'Multi-Styles',
      title: 'Version 3.0 — Édition Multi-Styles (6 Thèmes)',
      path: buildVersionUrl('V3'),
      date: '2026',
      status: 'Stable',
      statusType: 'stable',
      featured: false,
      swatches: ['#E11484', '#00F0FF', '#10B981', '#C02D0C'],
      stack: ['Multi-Thèmes', 'CSS Variables', 'URL Params', 'Mode Clair/Sombre'],
      description:
        'Expérimentation visuelle complète introduisant un sélecteur flottant de 6 directions artistiques commutables en temps réel (en mode sombre ou clair) et partageables par paramètre d’URL.',
      highlights: [
        'Original Améthyste & Fuchsia néon (#E11484 / #A855F7) avec halos diffus',
        'Active Theory Cyberpunk Synthwave (cyan #00F0FF & magenta #C026D3)',
        'Ethiack Terminal Matrix Hacker (vert émeraude #10B981, JetBrains Mono et trame binaire)',
        'Tech Présentation Keynote Orange (#FF6600 / #38BDF8) et introduction du pointeur laser',
        'Shabnam Atelier Papier (#CDC9B6 / Vermillon #C02D0C) et déclinaison Néo-Brutaliste Aahil'
      ],
      palettes: [
        {
          key: 'tech',
          name: 'Tech Présentation',
          url: buildVersionUrl('V3', '?palette=tech'),
          color: 'linear-gradient(135deg, #FF6600, #38BDF8)'
        },
        {
          key: 'amethyst',
          name: 'Améthyste',
          url: buildVersionUrl('V3', '?palette=amethyst'),
          color: 'linear-gradient(135deg, #E11484, #A855F7)'
        },
        {
          key: 'synthwave',
          name: 'Active Theory',
          url: buildVersionUrl('V3', '?palette=synthwave'),
          color: 'linear-gradient(135deg, #00F0FF, #C026D3)'
        },
        {
          key: 'ethiack',
          name: 'Ethiack',
          url: buildVersionUrl('V3', '?palette=ethiack'),
          color: 'linear-gradient(135deg, #10B981, #059669)'
        },
        {
          key: 'shabnam',
          name: 'Shabnam',
          url: buildVersionUrl('V3', '?palette=shabnam'),
          color: 'linear-gradient(135deg, #C02D0C, #F2D987)'
        },
        {
          key: 'aahil',
          name: 'Aahil Néo-Brutal',
          url: buildVersionUrl('V3', '?palette=aahil'),
          color: 'linear-gradient(135deg, #FACC15, #18181B)'
        }
      ]
    },
    {
      id: 'V2',
      shortLabel: 'Édition IA',
      title: 'Version 2.0 — Édition IA & Enrichie',
      path: buildVersionUrl('V2'),
      date: '2026',
      status: 'Stable',
      statusType: 'stable',
      featured: false,
      swatches: ['#0A0812', '#E11484', '#A855F7', '#FAF7FD'],
      stack: ['Bootstrap 5', 'Isotope', 'AOS', 'GLightbox'],
      description:
        'Refonte éditoriale alignée sur la spécialisation en intelligence artificielle, intégrant les expériences récentes et une présentation technique enrichie des compétences et projets.',
      highlights: [
        'Intégration de l’AEC en Intelligence Artificielle (Collège O’Sullivan)',
        'Ajout des expériences récentes : Élections Canada (2025) et perfectionnement Microsoft Learn',
        'Refonte complète des jauges de compétences (C#, .NET MAUI, Python/IA, Angular, Vue, Symfony)',
        'Fiches projets détaillées avec badges technologiques et formulaire de contact modernisé'
      ],
      palettes: []
    },
    {
      id: 'V1',
      shortLabel: 'Initiale',
      title: 'Version 1.0 — Archive Initiale',
      path: buildVersionUrl('V1'),
      date: '2025',
      status: 'Archive',
      statusType: 'archive',
      featured: false,
      swatches: ['#1E293B', '#E87532', '#64748B', '#F8FAFC'],
      stack: ['HTML5', 'CSS3', 'Bootstrap 5', 'GitHub'],
      description:
        'Première version complète publiée sur olivierbourgault.github.io, mettant en lumière le DEC en technique de l’informatique et les premières réalisations professionnelles et scolaires.',
      highlights: [
        'Présentation du parcours au Cégep de Saint-Jérôme, à la Chambre des Communes et chez VIWEB',
        'Galerie de projets filtrable par catégorie (Scolaires, Professionnels, Personnels)',
        'Première intégration dynamique des statistiques et du profil GitHub'
      ],
      palettes: []
    }
  ];

  const state = {
    versions: [...BASE_VERSIONS],
    activeVersionId: 'V5',
    activePaletteKey: 'tech-canvas',
    activeUrl: 'index.html',
    device: 'desktop',
    loadedVersionId: null,
    iframeReady: false,
    lastStageWidth: 0,
    resizeRafId: null,
    loaderTimeoutId: null
  };

  /* ------------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------------ */
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getVersionById(id) {
    return state.versions.find((v) => v.id.toUpperCase() === String(id).toUpperCase()) || state.versions[0];
  }

  function updateBrowserQueryString() {
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
    } catch (e) {
      // Ignore history API issues (e.g., file:// protocol)
    }
  }

  /* ------------------------------------------------------------------------
     Auto-discovery of future V6..V10 folders
     ------------------------------------------------------------------------ */
  async function discoverAdditionalVersions() {
    const knownIds = new Set(BASE_VERSIONS.map((v) => v.id.toUpperCase()));
    const discovered = [];

    for (let num = 6; num <= 10; num++) {
      const id = `V${num}`;
      if (knownIds.has(id)) continue;

      try {
        const response = await fetch(`${id}/index.html`, { method: 'HEAD' });
        if (response.ok) {
          discovered.push({
            id,
            shortLabel: 'Nouvelle',
            title: `Version ${num}.0 — Nouvelle itération`,
            path: buildVersionUrl(id),
            date: 'Nouveau',
            status: 'Disponible',
            statusType: 'live',
            featured: true,
            swatches: ['#121316', '#FF6600', '#38BDF8', '#FFFFFF'],
            stack: ['Auto-détectée', 'Portfolio'],
            description: `Nouvelle version (${id}) détectée automatiquement dans le dépôt olivierbourgault.github.io.`,
            highlights: [`Accès direct au dossier ${id}/index.html`],
            palettes: []
          });
        } else {
          break;
        }
      } catch (e) {
        break;
      }
    }

    if (discovered.length > 0) {
      const clonedBase = BASE_VERSIONS.map((v) => ({ ...v, featured: false }));
      discovered[discovered.length - 1].featured = true;
      return [...discovered.reverse(), ...clonedBase];
    }

    return [...BASE_VERSIONS];
  }

  /* ------------------------------------------------------------------------
     Studio Viewport Responsive Auto-Scaling
     ------------------------------------------------------------------------ */
  function updateDeviceScale() {
    const stage = document.getElementById('studioStage');
    const bezel = document.getElementById('studioDeviceBezel');
    const scaleWrap = document.getElementById('studioScaleWrap');
    const iframe = document.getElementById('studioIframe');
    const dimPill = document.getElementById('studioDimensionsPill');

    if (!stage || !bezel || !scaleWrap || !iframe) return;

    const preset = DEVICE_PRESETS[state.device] || DEVICE_PRESETS.desktop;
    bezel.setAttribute('data-device', state.device);

    const stageStyle = window.getComputedStyle(stage);
    const padX = (parseFloat(stageStyle.paddingLeft) || 0) + (parseFloat(stageStyle.paddingRight) || 0);
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

  function setDeviceMode(device) {
    if (!DEVICE_PRESETS[device]) return;
    state.device = device;

    document.querySelectorAll('.viewport-btn[data-device]').forEach((btn) => {
      const active = btn.getAttribute('data-device') === device;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    updateDeviceScale();
    syncFullscreenDeviceUI();
    updateBrowserQueryString();
  }

  /* ------------------------------------------------------------------------
     Studio Loader Overlay & Iframe Loading
     ------------------------------------------------------------------------ */
  function showStudioLoader(label) {
    const loader = document.getElementById('studioLoader');
    const loaderText = document.getElementById('studioLoaderText');
    if (loaderText && label) {
      loaderText.textContent = label;
    }
    if (loader) {
      loader.classList.add('is-loading');
    }
    if (state.loaderTimeoutId) {
      clearTimeout(state.loaderTimeoutId);
    }
    state.loaderTimeoutId = setTimeout(hideStudioLoader, 4500);
  }

  function hideStudioLoader() {
    const loader = document.getElementById('studioLoader');
    if (loader) {
      loader.classList.remove('is-loading');
    }
    if (state.loaderTimeoutId) {
      clearTimeout(state.loaderTimeoutId);
      state.loaderTimeoutId = null;
    }
  }

  function renderStudioPaletteBar(version) {
    const bar = document.getElementById('studioPaletteBar');
    const chipsContainer = document.getElementById('studioPaletteChips');
    const labelEl = document.getElementById('studioPaletteLabel');
    if (!bar || !chipsContainer || !labelEl) return;

    const palettes = version.palettes || [];
    if (palettes.length === 0) {
      labelEl.innerHTML = '<i class="bi bi-droplet-half" aria-hidden="true"></i> ADN Visuel';
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
        : `<i class="bi bi-palette2" aria-hidden="true"></i> Direction ${escapeHtml(version.id)}`;

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
          </button>
        `;
      })
      .join('');
  }

  function updateStudioChrome(version, targetUrl) {
    const addressText = document.getElementById('studioAddressText');
    const openExternal = document.getElementById('studioOpenExternal');
    const metaTitle = document.getElementById('studioMetaTitle');
    const metaDesc = document.getElementById('studioMetaDesc');
    const jumpTimelineBtn = document.getElementById('studioJumpTimeline');

    if (addressText) {
      addressText.textContent = `olivierbourgault.github.io/${targetUrl}`;
    }
    if (openExternal) {
      openExternal.setAttribute('href', targetUrl);
      openExternal.setAttribute('title', `Ouvrir ${version.id} dans un nouvel onglet`);
    }
    if (metaTitle) {
      metaTitle.textContent = version.title;
    }
    if (metaDesc) {
      metaDesc.textContent = version.description;
    }
    if (jumpTimelineBtn) {
      jumpTimelineBtn.setAttribute('href', `#version-${version.id}`);
    }
  }

  function selectVersionInStudio(versionId, paletteKey = null, options = {}) {
    const { forceReload = false, scrollToStudio = false } = options;
    const version = getVersionById(versionId);
    if (!version) return;

    const palettes = version.palettes || [];
    let chosenPalette = null;
    if (palettes.length > 0) {
      chosenPalette =
        (paletteKey && palettes.find((p) => p.key === paletteKey)) ||
        palettes[0];
    }

    const targetUrl = chosenPalette ? chosenPalette.url : version.path;
    const isSameVersionAlreadyLoaded =
      !forceReload &&
      state.loadedVersionId === version.id &&
      state.activeVersionId === version.id;

    state.activeVersionId = version.id;
    state.activePaletteKey = chosenPalette ? chosenPalette.key : null;
    state.activeUrl = targetUrl;

    // Sync accessible tablist selection & focusgroupstart (tabs guide)
    const tablist = document.getElementById('studioTablist');
    const panel = document.getElementById('studioTabpanel');
    if (tablist) {
      const tabs = tablist.querySelectorAll('[role="tab"]');
      tabs.forEach((tab) => {
        const isCurrent = tab.getAttribute('data-version-tab') === version.id;
        tab.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
        tab.toggleAttribute('focusgroupstart', isCurrent);
        tab.tabIndex = isCurrent ? 0 : -1;
        if (isCurrent) {
          if (panel) panel.setAttribute('aria-labelledby', tab.id);
          try {
            tab.scrollIntoView({ block: 'nearest', inline: 'nearest', container: 'nearest' });
          } catch (e) {
            tab.scrollIntoView({ block: 'nearest', inline: 'nearest' });
          }
        }
      });
    }

    renderStudioPaletteBar(version);
    updateStudioChrome(version, targetUrl);
    updateBrowserQueryString();

    const iframe = document.getElementById('studioIframe');
    if (iframe) {
      iframe.setAttribute('title', `Aperçu en direct de ${version.title}`);

      // Same-origin instant palette switch for V3/V4 once iframe has finished loading
      let switchedLive = false;
      if (isSameVersionAlreadyLoaded && state.iframeReady && chosenPalette && version.id !== 'V5') {
        try {
          const doc = iframe.contentDocument;
          if (
            doc &&
            doc.readyState === 'complete' &&
            iframe.contentWindow &&
            typeof iframe.contentWindow.setPalette === 'function'
          ) {
            iframe.contentWindow.setPalette(chosenPalette.key, true);
            switchedLive =
              Boolean(doc.body) &&
              doc.body.getAttribute('data-palette') === chosenPalette.key;
          }
        } catch (e) {
          switchedLive = false;
        }
      }

      if (!switchedLive) {
        if (chosenPalette && version.id !== 'V5') {
          try {
            localStorage.setItem('v4_palette', chosenPalette.key);
          } catch (e) {}
        }
        showStudioLoader(`Chargement de ${version.id} (${version.shortLabel})…`);
        const isReloadSameUrl = forceReload && state.loadedVersionId === version.id;
        state.loadedVersionId = version.id;
        state.iframeReady = false;
        if (isReloadSameUrl) {
          try {
            if (iframe.contentWindow && iframe.contentWindow.location) {
              iframe.contentWindow.location.reload();
            } else {
              iframe.src = targetUrl;
            }
          } catch (e) {
            iframe.src = targetUrl;
          }
        } else {
          iframe.src = targetUrl;
        }
      }
    }

    if (scrollToStudio) {
      const studioEl = document.getElementById('studio');
      if (studioEl) {
        studioEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  /* ------------------------------------------------------------------------
     Render Studio Tabs (Single-row accessible tablist, selection by activation)
     ------------------------------------------------------------------------ */
  function renderStudioTabs() {
    const tablist = document.getElementById('studioTablist');
    if (!tablist) return;

    tablist.innerHTML = state.versions
      .map((v, idx) => {
        const isSelected = v.id === state.activeVersionId;
        const badge = v.featured
          ? '<span class="studio-tab-badge">Actuelle</span>'
          : `<span class="studio-tab-badge">${escapeHtml(v.date)}</span>`;

        return `
          <button
            type="button"
            role="tab"
            id="studio-tab-${escapeHtml(v.id)}"
            class="studio-tab"
            data-version-tab="${escapeHtml(v.id)}"
            aria-selected="${isSelected ? 'true' : 'false'}"
            tabindex="${isSelected ? '0' : '-1'}"
            ${isSelected ? 'focusgroupstart' : ''}
          >
            <span class="studio-tab-id">${escapeHtml(v.id)}</span>
            <span>${escapeHtml(v.shortLabel)}</span>
            ${badge}
          </button>
        `;
      })
      .join('');

    initTablistKeyboardAndScrollHints(tablist);
  }

  function initTablistKeyboardAndScrollHints(tablist) {
    // Selection-by-activation keyboard fallback when native focusgroup is unsupported
    if (!Object.hasOwn(HTMLElement.prototype, 'focusGroup')) {
      tablist.addEventListener('keydown', (e) => {
        const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
        if (tabs.length === 0) return;

        const currentIdx = tabs.indexOf(document.activeElement);
        if (currentIdx === -1) return;

        let nextIdx = null;
        if (e.key === 'ArrowRight') nextIdx = (currentIdx + 1) % tabs.length;
        else if (e.key === 'ArrowLeft') nextIdx = (currentIdx - 1 + tabs.length) % tabs.length;
        else if (e.key === 'Home') nextIdx = 0;
        else if (e.key === 'End') nextIdx = tabs.length - 1;

        if (nextIdx !== null) {
          e.preventDefault();
          tabs[nextIdx].focus();
          try {
            tabs[nextIdx].scrollIntoView({ block: 'nearest', inline: 'nearest', container: 'nearest' });
          } catch (err) {
            tabs[nextIdx].scrollIntoView({ block: 'nearest', inline: 'nearest' });
          }
        }
      });
    }

    // Edge-fade fallback when CSS scroll-driven animations are unsupported (tabs guide)
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

  /* ------------------------------------------------------------------------
     Render Evolution Timeline & Sticky Vertical Navigation
     ------------------------------------------------------------------------ */
  function createTimelineCardHtml(v, index) {
    const statusClass =
      v.statusType === 'live'
        ? 'version-status-pill is-live'
        : v.statusType === 'archive'
          ? 'version-status-pill is-archive'
          : 'version-status-pill';

    const swatchesHtml = (v.swatches || [])
      .map(
        (hex) =>
          `<span class="version-swatch" style="background: ${escapeHtml(hex)};" title="${escapeHtml(hex)}"></span>`
      )
      .join('');

    const stackHtml = (v.stack || [])
      .map((tag) => `<span class="version-stack-pill">${escapeHtml(tag)}</span>`)
      .join('');

    const highlightsHtml = (v.highlights || [])
      .map(
        (item) => `
        <li>
          <i class="bi bi-check2-circle" aria-hidden="true"></i>
          <span>${escapeHtml(item)}</span>
        </li>`
      )
      .join('');

    const palettesSection =
      v.palettes && v.palettes.length > 1
        ? `
        <div class="version-card-palettes">
          <span class="version-card-palettes-label">
            <i class="bi bi-palette2 me-1" aria-hidden="true"></i>Tester un style historique dans le Studio :
          </span>
          <div class="version-card-palettes-list">
            ${v.palettes
              .map(
                (p) => `
              <button
                type="button"
                class="timeline-palette-btn"
                data-preview-version="${escapeHtml(v.id)}"
                data-preview-palette="${escapeHtml(p.key)}"
                title="Charger ${escapeHtml(v.id)} (${escapeHtml(p.name)}) dans le Studio"
              >
                <span class="studio-palette-dot" style="background: ${escapeHtml(p.color)};"></span>
                <span>${escapeHtml(p.name)}</span>
              </button>`
              )
              .join('')}
          </div>
        </div>`
        : '';

    return `
      <article id="version-${escapeHtml(v.id)}" class="timeline-version-card ${v.featured ? 'is-featured' : ''}" data-timeline-id="${escapeHtml(v.id)}">
        <span class="timeline-node-dot" aria-hidden="true"></span>

        <div class="version-card-top">
          <div class="version-card-badges">
            <span class="version-code-badge">${escapeHtml(v.id)}.0</span>
            <span class="${statusClass}">${escapeHtml(v.status)} &bull; ${escapeHtml(v.date)}</span>
          </div>
          <div class="version-swatches" aria-label="Palette chromatique de la ${escapeHtml(v.id)}">
            ${swatchesHtml}
          </div>
        </div>

        <h3 class="version-card-title">${escapeHtml(v.title)}</h3>
        <p class="version-card-desc">${escapeHtml(v.description)}</p>

        <div class="version-stack-list">
          ${stackHtml}
        </div>

        <details class="version-details" ${index === 0 ? 'open' : ''}>
          <summary class="version-details-summary">
            Notes de version &amp; nouveautés (${(v.highlights || []).length})
          </summary>
          <div class="version-details-body">
            <ul class="version-highlights-list">
              ${highlightsHtml}
            </ul>
            ${palettesSection}
          </div>
        </details>

        <div class="version-card-footer">
          <button
            type="button"
            class="versions-btn-primary"
            data-preview-version="${escapeHtml(v.id)}"
          >
            <i class="bi bi-display" aria-hidden="true"></i>
            <span>Prévisualiser dans le Studio</span>
          </button>
          <a href="${escapeHtml(v.path)}" class="versions-btn-outline">
            <span>Ouvrir la ${escapeHtml(v.id)}</span>
            <i class="bi bi-arrow-up-right" aria-hidden="true"></i>
          </a>
        </div>
      </article>
    `;
  }

  function createUpcomingCardHtml(nextNum) {
    return `
      <article id="version-V${nextNum}" class="timeline-version-card is-upcoming" data-timeline-id="V${nextNum}+">
        <span class="timeline-node-dot" aria-hidden="true"></span>
        <div class="version-card-top">
          <div class="version-card-badges">
            <span class="version-code-badge">V${nextNum}+</span>
            <span class="version-status-pill is-archive">Feuille de route &bull; À venir</span>
          </div>
        </div>
        <h3 class="version-card-title">Prochaines générations (V${nextNum}, V${nextNum + 1}…)</h3>
        <p class="version-card-desc">
          Cet espace est prêt pour accueillir automatiquement les futures itérations du portfolio : nouvelles expériences IA, démos interactives et évolutions de design.
        </p>
        <ul class="version-highlights-list mb-0">
          <li>
            <i class="bi bi-lightning-charge" aria-hidden="true"></i>
            <span>Détection automatique dès qu’un dossier <code>V${nextNum}/index.html</code> est publié sur le dépôt</span>
          </li>
          <li>
            <i class="bi bi-archive" aria-hidden="true"></i>
            <span>Conservation intégrale de l’historique V1 → V${nextNum - 1} sur <code>olivierbourgault.github.io</code></span>
          </li>
        </ul>
      </article>
    `;
  }

  function renderTimelineAndSidebar() {
    const track = document.getElementById('versionsTimeline');
    const sidebarList = document.getElementById('vnavVersionsList');
    const countBadge = document.getElementById('timelineCountBadge');
    const kpiCount = document.getElementById('kpiVersionsCount');
    const kpiRange = document.getElementById('kpiVersionsRange');

    if (!track || !sidebarList) return;

    const maxNum = Math.max(
      ...state.versions.map((v) => parseInt(v.id.replace(/\D/g, ''), 10) || 1)
    );
    const nextNum = maxNum + 1;

    if (kpiCount) kpiCount.textContent = String(state.versions.length);
    if (kpiRange) kpiRange.textContent = `V1 → V${maxNum}`;
    if (countBadge) {
      countBadge.textContent = `${state.versions.length} générations archivées · V${maxNum} active`;
    }

    track.innerHTML =
      state.versions.map((v, i) => createTimelineCardHtml(v, i)).join('') +
      createUpcomingCardHtml(nextNum);

    const sidebarItems = [
      ...state.versions.map((v) => ({
        targetId: `version-${v.id}`,
        title: `${v.id} · ${v.shortLabel}`,
        sub: `${v.status} · ${v.date}`
      })),
      {
        targetId: `version-V${nextNum}`,
        title: `V${nextNum}+ · À venir`,
        sub: 'Auto-détection'
      }
    ];

    sidebarList.innerHTML = sidebarItems
      .map(
        (item, idx) => `
        <li>
          <button
            type="button"
            class="vnav-item-btn ${idx === 0 ? 'is-active' : ''}"
            data-vnav-target="${escapeHtml(item.targetId)}"
          >
            <span class="vnav-dot" aria-hidden="true"></span>
            <span class="vnav-text">
              <span class="vnav-title">${escapeHtml(item.title)}</span>
              <span class="vnav-sub">${escapeHtml(item.sub)}</span>
            </span>
          </button>
        </li>`
      )
      .join('');

    initTimelineScrollSpy(sidebarList, track);
    syncToggleAllButtonState();
  }

  function initTimelineScrollSpy(sidebarList, track) {
    const buttons = Array.from(sidebarList.querySelectorAll('.vnav-item-btn'));
    const cards = Array.from(track.querySelectorAll('.timeline-version-card'));
    if (!buttons.length || !cards.length) return;

    const setActiveTarget = (targetId) => {
      buttons.forEach((btn) => {
        btn.classList.toggle('is-active', btn.getAttribute('data-vnav-target') === targetId);
      });
    };

    sidebarList.addEventListener('click', (e) => {
      const btn = e.target.closest('.vnav-item-btn[data-vnav-target]');
      if (!btn) return;
      const targetId = btn.getAttribute('data-vnav-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        setActiveTarget(targetId);
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    if ('IntersectionObserver' in window) {
      const spyObserver = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          if (visible.length > 0) {
            setActiveTarget(visible[0].target.id);
          }
        },
        { rootMargin: '-18% 0px -62% 0px', threshold: 0 }
      );
      cards.forEach((card) => spyObserver.observe(card));
    }
  }

  /* ------------------------------------------------------------------------
     Accordion Expand / Collapse All (accordion guide compliant)
     ------------------------------------------------------------------------ */
  function syncToggleAllButtonState() {
    const btn = document.getElementById('toggleAllDetailsBtn');
    const track = document.getElementById('versionsTimeline');
    if (!btn || !track) return;

    const items = Array.from(track.querySelectorAll('details.version-details'));
    const allOpen = items.length > 0 && items.every((d) => d.open);
    btn.setAttribute('aria-expanded', allOpen ? 'true' : 'false');
  }

  function initAccordionToggleAll() {
    const btn = document.getElementById('toggleAllDetailsBtn');
    const track = document.getElementById('versionsTimeline');
    if (!btn || !track) return;

    btn.addEventListener('click', () => {
      const expand = btn.getAttribute('aria-expanded') !== 'true';
      track.querySelectorAll('details.version-details').forEach((details) => {
        details.open = expand;
      });
      syncToggleAllButtonState();
    });

    // toggle event does not bubble — capture phase keeps button in sync with individual toggles
    track.addEventListener(
      'toggle',
      (e) => {
        if (e.target && e.target.matches('details.version-details')) {
          syncToggleAllButtonState();
        }
      },
      { capture: true }
    );
  }

  /* ------------------------------------------------------------------------
     Native <dialog> Controller (CV Download & Fullscreen Preview)
     ------------------------------------------------------------------------ */
  function syncFullscreenDeviceUI() {
    const fsIframe = document.getElementById('fullscreenIframe');
    if (fsIframe) {
      fsIframe.setAttribute('data-device', state.device);
    }
    document.querySelectorAll('[data-fs-device]').forEach((btn) => {
      const active = btn.getAttribute('data-fs-device') === state.device;
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function openFullscreenPreview() {
    const dialog = document.getElementById('fullscreenPreviewDialog');
    const fsIframe = document.getElementById('fullscreenIframe');
    const fsTitle = document.getElementById('fullscreenPreviewTitle');
    const fsSub = document.getElementById('fullscreenPreviewSub');
    const fsOpen = document.getElementById('fullscreenOpenExternal');
    if (!dialog || !fsIframe) return;

    const version = getVersionById(state.activeVersionId);
    if (fsTitle) fsTitle.textContent = `Aperçu plein écran — ${version.id} (${version.shortLabel})`;
    if (fsSub) fsSub.textContent = `olivierbourgault.github.io/${state.activeUrl}`;
    if (fsOpen) fsOpen.setAttribute('href', state.activeUrl);

    syncFullscreenDeviceUI();
    fsIframe.src = state.activeUrl;
    dialog.showModal();
  }

  function initNativeDialogs() {
    // Open dialog buttons
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-open-dialog]');
      if (!trigger) return;
      const dialogId = trigger.getAttribute('data-open-dialog');
      if (dialogId === 'fullscreenPreviewDialog') {
        openFullscreenPreview();
        return;
      }
      const dialog = document.getElementById(dialogId);
      if (dialog && typeof dialog.showModal === 'function') {
        dialog.showModal();
      }
    });

    // Close dialog buttons
    document.querySelectorAll('dialog.ob-dialog').forEach((dialog) => {
      dialog.addEventListener('close', () => {
        dialog.returnValue = '';
        if (dialog.id === 'fullscreenPreviewDialog') {
          const fsIframe = document.getElementById('fullscreenIframe');
          if (fsIframe) fsIframe.src = 'about:blank';
        }
      });

      dialog.querySelectorAll('[data-close-dialog]').forEach((closeBtn) => {
        closeBtn.addEventListener('click', () => dialog.close('close'));
      });
    });

    // Fullscreen dialog internal controls
    const fsReloadBtn = document.getElementById('fullscreenReloadBtn');
    if (fsReloadBtn) {
      fsReloadBtn.addEventListener('click', () => {
        const fsIframe = document.getElementById('fullscreenIframe');
        if (fsIframe) fsIframe.src = state.activeUrl;
      });
    }

    document.querySelectorAll('[data-fs-device]').forEach((btn) => {
      btn.addEventListener('click', () => {
        setDeviceMode(btn.getAttribute('data-fs-device'));
      });
    });

    // Fallback for closedby="any" where native closedBy is unsupported (dialog guide)
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      const isOutside = (e, dialog) => {
        const r = dialog.getBoundingClientRect();
        return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      };
      document.querySelectorAll('dialog[closedby="any"]').forEach((dialog) => {
        let pressedOutside = false;
        dialog.addEventListener('pointerdown', (e) => {
          pressedOutside = isOutside(e, dialog);
        });
        dialog.addEventListener('pointerup', (e) => {
          if (pressedOutside && isOutside(e, dialog)) {
            dialog.close();
          }
        });
      });
    }
  }

  /* ------------------------------------------------------------------------
     Navbar Scroll Hysteresis, Mobile Drawer, Scroll Top & Theme Switcher
     ------------------------------------------------------------------------ */
  function toggleScrolled() {
    const header = document.getElementById('header');
    if (!header) return;
    const y = window.scrollY;
    const currentlyScrolled = document.body.classList.contains('scrolled');
    const shouldBeScrolled = currentlyScrolled ? y > 50 : y > 110;
    if (shouldBeScrolled !== currentlyScrolled) {
      document.body.classList.toggle('scrolled', shouldBeScrolled);
      header.classList.toggle('solid', shouldBeScrolled);
    }
  }

  function toggleScrollTop() {
    const scrollTop = document.getElementById('scroll-top');
    if (scrollTop) {
      scrollTop.classList.toggle('active', window.scrollY > 160);
    }
  }

  function initMobileNav() {
    const toggleBtn = document.querySelector('.mobile-nav-toggle');
    const closeBtn = document.getElementById('menuCloseBtn');
    const scrim = document.getElementById('menuScrim');

    function setOpen(forceState, restoreFocus = false) {
      const isOpen = document.body.classList.contains('mobile-nav-active');
      const shouldOpen = typeof forceState === 'boolean' ? forceState : !isOpen;
      document.body.classList.toggle('mobile-nav-active', shouldOpen);
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
      if (shouldOpen && closeBtn) {
        requestAnimationFrame(() => closeBtn.focus());
      } else if (!shouldOpen && restoreFocus && toggleBtn) {
        toggleBtn.focus();
      }
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setOpen();
      });
    }
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setOpen(false, true);
      });
    }
    if (scrim) {
      scrim.addEventListener('click', () => setOpen(false, true));
    }
    document.querySelectorAll('#navmenu a').forEach((link) => {
      link.addEventListener('click', () => {
        if (document.body.classList.contains('mobile-nav-active')) {
          setOpen(false, false);
        }
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('mobile-nav-active')) {
        setOpen(false, true);
      }
    });
  }

  function applyTheme(isDark, persist = true) {
    document.documentElement.classList.toggle('theme-light', !isDark);
    document.body.classList.toggle('dark', isDark);
    document.body.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');

    const icon = document.getElementById('themeSwitcher');
    const btn = document.getElementById('themeSwitcherBtn');
    if (icon) {
      icon.classList.toggle('bi-sun-fill', isDark);
      icon.classList.toggle('bi-moon-stars-fill', !isDark);
    }
    if (btn) {
      btn.setAttribute('aria-label', isDark ? 'Passer au mode clair' : 'Passer au mode sombre');
      btn.setAttribute('title', isDark ? 'Passer au mode clair' : 'Passer au mode sombre');
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
    }

    if (persist) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
      } catch (e) {
        // Ignore storage errors
      }
    }
  }

  function initTheme() {
    let isDark = true;
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light') isDark = false;
    } catch (e) {
      isDark = true;
    }
    applyTheme(isDark, false);

    const btn = document.getElementById('themeSwitcherBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        applyTheme(!document.body.classList.contains('dark'), true);
      });
    }
  }

  /* ------------------------------------------------------------------------
     Aahil Khan Cursor + Orange Radial Halo (#laser-dot, key 'L')
     Automatically pauses while hovering inside the live preview iframe
     ------------------------------------------------------------------------ */
  function initInteractiveCursor() {
    const cursorDot = document.getElementById('laser-dot');
    if (!cursorDot) return;

    let hasFinePointer = false;
    try {
      hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    } catch (e) {
      hasFinePointer = false;
    }
    if (!hasFinePointer) return;

    let isActive = true;
    try {
      const saved = localStorage.getItem(LASER_STORAGE_KEY);
      if (saved === '0') isActive = false;
    } catch (e) {
      isActive = true;
    }

    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let targetX = currentX;
    let targetY = currentY;
    let rafId = null;

    function tick() {
      if (!isActive) {
        rafId = null;
        return;
      }
      currentX += (targetX - currentX) * 0.35;
      currentY += (targetY - currentY) * 0.35;
      cursorDot.style.left = `${currentX}px`;
      cursorDot.style.top = `${currentY}px`;
      rafId = requestAnimationFrame(tick);
    }

    function setCursorState(enabled) {
      isActive = enabled;
      try {
        localStorage.setItem(LASER_STORAGE_KEY, isActive ? '1' : '0');
      } catch (e) {}

      if (isActive) {
        cursorDot.style.display = 'block';
        cursorDot.classList.add('on');
        document.body.style.cursor = 'none';
        if (!rafId) rafId = requestAnimationFrame(tick);
      } else {
        cursorDot.style.display = 'none';
        cursorDot.classList.remove('on', 'big', 'precise');
        document.body.style.cursor = '';
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    }

    document.addEventListener(
      'pointermove',
      (e) => {
        if (e.pointerType === 'touch' || !isActive) return;
        targetX = e.clientX;
        targetY = e.clientY;

        const target = e.target;
        const overIframeZone = Boolean(
          target && target.closest('.device-scale-wrap, .fullscreen-iframe-wrap, iframe')
        );
        if (overIframeZone) {
          cursorDot.classList.remove('on');
          return;
        }

        cursorDot.classList.add('on');
        const isPrecise = Boolean(
          target &&
            target.closest(
              'a, .studio-palette-chip, .timeline-palette-btn, .vnav-item-btn, .studio-tab, .viewport-btn, .studio-icon-btn, summary, input, [role="button"]'
            )
        );
        const isBig = Boolean(
          !isPrecise &&
            target &&
            target.closest(
              'button, .versions-btn-primary, .versions-btn-secondary, .versions-btn-outline, .timeline-version-card, .versions-kpi-card, .logo'
            )
        );
        cursorDot.classList.toggle('precise', isPrecise);
        cursorDot.classList.toggle('big', isBig);
      },
      { passive: true }
    );

    document.addEventListener('pointerleave', () => {
      cursorDot.classList.remove('on');
    });

    // Hide custom dot cleanly when mouse crosses into iframe
    document.querySelectorAll('.device-scale-wrap, .fullscreen-iframe-wrap').forEach((zone) => {
      zone.addEventListener('pointerenter', () => {
        cursorDot.classList.remove('on');
      });
    });

    document.addEventListener('keydown', (e) => {
      const tag = e.target && e.target.tagName ? e.target.tagName.toUpperCase() : '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (e.target && e.target.isContentEditable)) {
        return;
      }
      if (e.key === 'l' || e.key === 'L') {
        setCursorState(!isActive);
      }
    });

    if (isActive) {
      setCursorState(true);
    }
  }

  /* ------------------------------------------------------------------------
     Wire Events & Boot
     ------------------------------------------------------------------------ */
  function bindStudioEvents() {
    const tablist = document.getElementById('studioTablist');
    if (tablist) {
      tablist.addEventListener('click', (e) => {
        const tab = e.target.closest('[role="tab"][data-version-tab]');
        if (!tab) return;
        selectVersionInStudio(tab.getAttribute('data-version-tab'));
      });
    }

    const paletteChips = document.getElementById('studioPaletteChips');
    if (paletteChips) {
      paletteChips.addEventListener('click', (e) => {
        const chip = e.target.closest('button[data-studio-palette]');
        if (!chip) return;
        selectVersionInStudio(state.activeVersionId, chip.getAttribute('data-studio-palette'));
      });
    }

    document.querySelectorAll('.viewport-btn[data-device]').forEach((btn) => {
      btn.addEventListener('click', () => {
        setDeviceMode(btn.getAttribute('data-device'));
      });
    });

    const reloadBtn = document.getElementById('studioReloadBtn');
    if (reloadBtn) {
      reloadBtn.addEventListener('click', () => {
        selectVersionInStudio(state.activeVersionId, state.activePaletteKey, { forceReload: true });
      });
    }

    const iframe = document.getElementById('studioIframe');
    if (iframe) {
      iframe.addEventListener('load', () => {
        state.iframeReady = true;
        // Re-assert chosen palette if user clicked a palette while the iframe was still loading
        if (state.activePaletteKey && state.activeVersionId !== 'V5') {
          try {
            if (iframe.contentWindow && typeof iframe.contentWindow.setPalette === 'function') {
              iframe.contentWindow.setPalette(state.activePaletteKey, true);
            }
          } catch (e) {}
        }
        hideStudioLoader();
      });
    }

    // Timeline cards -> load directly into Studio
    const timeline = document.getElementById('versionsTimeline');
    if (timeline) {
      timeline.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-preview-version]');
        if (!trigger) return;
        const vId = trigger.getAttribute('data-preview-version');
        const pKey = trigger.getAttribute('data-preview-palette') || null;
        selectVersionInStudio(vId, pKey, { scrollToStudio: true });
      });
    }

    // ResizeObserver on studio window width via rAF (prevents ResizeObserver loop notifications)
    const studioWindow = document.getElementById('studioTabpanel');
    if (studioWindow && 'ResizeObserver' in window) {
      const ro = new ResizeObserver((entries) => {
        const width = Math.round(entries[0]?.contentRect?.width || 0);
        if (!width || width === state.lastStageWidth) return;
        state.lastStageWidth = width;
        if (state.resizeRafId) cancelAnimationFrame(state.resizeRafId);
        state.resizeRafId = requestAnimationFrame(() => {
          state.resizeRafId = null;
          updateDeviceScale();
        });
      });
      ro.observe(studioWindow);
    } else {
      window.addEventListener('resize', updateDeviceScale);
    }

    // Scroll-to-top button
    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    window.addEventListener(
      'scroll',
      () => {
        toggleScrolled();
        toggleScrollTop();
      },
      { passive: true }
    );
  }

  async function init() {
    initTheme();
    initMobileNav();
    initNativeDialogs();
    initAccordionToggleAll();
    initInteractiveCursor();
    bindStudioEvents();
    toggleScrolled();
    toggleScrollTop();

    // Parse optional deep-link parameters (?v=V3&palette=synthwave&device=mobile)
    let initialVersion = null;
    let initialPalette = null;
    let initialDevice = 'desktop';
    try {
      const params = new URLSearchParams(window.location.search);
      initialVersion = params.get('v');
      initialPalette = params.get('palette');
      const dev = params.get('device');
      if (dev && DEVICE_PRESETS[dev]) initialDevice = dev;
    } catch (e) {}

    state.versions = await discoverAdditionalVersions();
    const defaultVersion = initialVersion
      ? getVersionById(initialVersion)
      : state.versions.find((v) => v.featured) || state.versions[0];

    state.activeVersionId = defaultVersion.id;
    state.device = initialDevice;

    renderStudioTabs();
    renderTimelineAndSidebar();
    setDeviceMode(state.device);
    selectVersionInStudio(defaultVersion.id, initialPalette);
  }

  document.addEventListener('DOMContentLoaded', init);
})();
