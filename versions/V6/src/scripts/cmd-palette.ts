import { SITE } from '../data/site';
import { withBase } from '../utils/paths';
import { copyTextToClipboard } from './clipboard';
import { promoteCursorToTopLayer } from './cursor';
import { getSiteLang, setSiteLang } from './i18n';
import { applyTheme, isDarkTheme } from './theme';

interface CommandItem {
  id: string;
  icon: string;
  groupFr: string;
  groupEn: string;
  labelFr: string;
  labelEn: string;
  subFr: string;
  subEn: string;
  keywords: string;
  run: () => void;
}

function navigateOrScroll(hashOrUrl: string): void {
  if (hashOrUrl.startsWith('#')) {
    const el = document.querySelector<HTMLElement>(hashOrUrl);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    window.location.href = `${withBase('')}${hashOrUrl}`;
    return;
  }
  window.location.href = hashOrUrl;
}

function triggerCaseStudy(projectName: string): void {
  const existingBtn = document.querySelector<HTMLButtonElement>(
    `[data-case-study="${projectName}"]`
  );
  if (existingBtn) {
    existingBtn.click();
    return;
  }
  window.location.href = `${withBase('')}#portfolio`;
}

export function initCommandPalette(): void {
  const dialog = document.getElementById('cmdPaletteDialog') as HTMLDialogElement | null;
  const input = document.getElementById('cmdPaletteInput') as HTMLInputElement | null;
  const listEl = document.getElementById('cmdPaletteList');
  if (!dialog || !input || !listEl) return;

  let activeIdx = 0;
  let visibleCommands: CommandItem[] = [];

  const COMMANDS: CommandItem[] = [
    {
      id: 'nav-home',
      icon: 'bi-house-door',
      groupFr: 'Navigation',
      groupEn: 'Navigation',
      labelFr: 'Aller à l’Accueil (Hero)',
      labelEn: 'Go to Home (Hero)',
      subFr: 'olivierbourgault.github.io/',
      subEn: 'olivierbourgault.github.io/',
      keywords: 'accueil home hero top debut',
      run: () => navigateOrScroll('#hero')
    },
    {
      id: 'nav-portfolio',
      icon: 'bi-grid-3x3-gap-fill',
      groupFr: 'Navigation',
      groupEn: 'Navigation',
      labelFr: 'Explorer le Portfolio (59+ projets GitHub)',
      labelEn: 'Explore Portfolio (59+ GitHub projects)',
      subFr: 'Filtres par catégorie, technologie et recherche',
      subEn: 'Filter by category, tech stack, and search',
      keywords: 'portfolio projets projects github realisations code',
      run: () => navigateOrScroll('#portfolio')
    },
    {
      id: 'nav-resume-page',
      icon: 'bi-file-earmark-person',
      groupFr: 'Navigation',
      groupEn: 'Navigation',
      labelFr: 'Ouvrir le CV interactif & imprimable (FR / EN)',
      labelEn: 'Open Interactive & Printable Resume (EN / FR)',
      subFr: '/resume',
      subEn: '/resume',
      keywords: 'cv resume curriculum vitae parcours experience formation',
      run: () => navigateOrScroll(withBase('resume'))
    },
    {
      id: 'nav-versions',
      icon: 'bi-clock-history',
      groupFr: 'Navigation',
      groupEn: 'Navigation',
      labelFr: 'Ouvrir le Studio des versions (V1 → V6)',
      labelEn: 'Open Interactive Version Browser (V1 → V6)',
      subFr: '/versions/',
      subEn: '/versions/',
      keywords: 'versions studio historique archives v1 v2 v3 v4 v5 v6',
      run: () => navigateOrScroll(withBase('versions'))
    },
    {
      id: 'nav-identity',
      icon: 'bi-palette2',
      groupFr: 'Navigation',
      groupEn: 'Navigation',
      labelFr: 'Charte graphique & Logos vectoriels OB Tech',
      labelEn: 'Visual Identity & OB Tech Vector Logos',
      subFr: '/identity',
      subEn: '/identity',
      keywords: 'identite identity logos charte design system tech canvas svg',
      run: () => navigateOrScroll(withBase('identity'))
    },
    {
      id: 'nav-contact',
      icon: 'bi-envelope-at',
      groupFr: 'Navigation',
      groupEn: 'Navigation',
      labelFr: 'Me contacter',
      labelEn: 'Contact Me',
      subFr: SITE.email,
      subEn: SITE.email,
      keywords: 'contact email courriel message embauche',
      run: () => navigateOrScroll('#contact')
    },
    {
      id: 'cs-hubai',
      icon: 'bi-journal-code',
      groupFr: 'Études de cas (Projets phares)',
      groupEn: 'Case Studies (Flagship Projects)',
      labelFr: 'Étude de cas : HubAI (Plateforme IA & LLM)',
      labelEn: 'Case Study: HubAI (Modular AI & LLM Platform)',
      subFr: 'Python • API Gemini / LLM • JavaScript • REST API',
      subEn: 'Python • Gemini / LLM API • JavaScript • REST API',
      keywords: 'hubai etude de cas case study ia ai python gemini llm',
      run: () => triggerCaseStudy('HubAI')
    },
    {
      id: 'cs-comparetools',
      icon: 'bi-journal-code',
      groupFr: 'Études de cas (Projets phares)',
      groupEn: 'Case Studies (Flagship Projects)',
      labelFr: 'Étude de cas : CompareTools (Chambre des Communes)',
      labelEn: 'Case Study: CompareTools (House of Commons)',
      subFr: 'PowerShell • Automatisation • Diagnostic TI',
      subEn: 'PowerShell • Automation • IT Diagnostics',
      keywords: 'comparetools etude de cas case study powershell chambre des communes hoc',
      run: () => triggerCaseStudy('CompareTools')
    },
    {
      id: 'cs-electrolib',
      icon: 'bi-journal-code',
      groupFr: 'Études de cas (Projets phares)',
      groupEn: 'Case Studies (Flagship Projects)',
      labelFr: 'Étude de cas : Electrolib (Angular + Symfony)',
      labelEn: 'Case Study: Electrolib (Angular + Symfony)',
      subFr: 'Angular • TypeScript • Symfony • MySQL',
      subEn: 'Angular • TypeScript • Symfony • MySQL',
      keywords: 'electrolib etude de cas case study angular typescript symfony php sql',
      run: () => triggerCaseStudy('Electrolib')
    },
    {
      id: 'act-cv-fr',
      icon: 'bi-file-earmark-pdf-fill',
      groupFr: 'Actions rapides & Documents',
      groupEn: 'Quick Actions & Documents',
      labelFr: 'Télécharger le CV en PDF (Français)',
      labelEn: 'Download French Resume (PDF)',
      subFr: SITE.cvFrFilename,
      subEn: SITE.cvFrFilename,
      keywords: 'pdf cv francais telecharger download',
      run: () => {
        window.open(withBase(SITE.cvFrPdf), '_blank', 'noopener');
      }
    },
    {
      id: 'act-cv-en',
      icon: 'bi-file-earmark-pdf',
      groupFr: 'Actions rapides & Documents',
      groupEn: 'Quick Actions & Documents',
      labelFr: 'Télécharger le Resume en PDF (English)',
      labelEn: 'Download English Resume (PDF)',
      subFr: SITE.cvEnFilename,
      subEn: SITE.cvEnFilename,
      keywords: 'pdf resume english anglais telecharger download',
      run: () => {
        window.open(withBase(SITE.cvEnPdf), '_blank', 'noopener');
      }
    },
    {
      id: 'act-copy-email',
      icon: 'bi-clipboard',
      groupFr: 'Actions rapides & Documents',
      groupEn: 'Quick Actions & Documents',
      labelFr: `Copier mon courriel (${SITE.email})`,
      labelEn: `Copy my email address (${SITE.email})`,
      subFr: 'Copie instantanée dans le presse-papiers',
      subEn: 'Instant copy to clipboard',
      keywords: 'copier copy courriel email presse-papiers clipboard',
      run: () => {
        void copyTextToClipboard(SITE.email);
      }
    },
    {
      id: 'act-toggle-lang',
      icon: 'bi-translate',
      groupFr: 'Préférences',
      groupEn: 'Preferences',
      labelFr: 'Basculer la langue en Anglais (EN)',
      labelEn: 'Switch site language to French (FR)',
      subFr: 'FR ↔ EN sans rechargement',
      subEn: 'EN ↔ FR live switch',
      keywords: 'langue language english francais traduire translate en fr',
      run: () => setSiteLang(getSiteLang() === 'fr' ? 'en' : 'fr', true)
    },
    {
      id: 'act-toggle-theme',
      icon: 'bi-sun-fill',
      groupFr: 'Préférences',
      groupEn: 'Preferences',
      labelFr: 'Basculer le thème Sombre / Clair',
      labelEn: 'Toggle Dark / Light Theme',
      subFr: 'Carbone #121316 ↔ Ivoire #F4F1EA',
      subEn: 'Carbon #121316 ↔ Ivory #F4F1EA',
      keywords: 'theme dark light sombre clair mode couleur',
      run: () => applyTheme(!isDarkTheme(), true)
    }
  ];

  function closePalette(): void {
    if (dialog?.open) dialog.close();
  }

  function executeCommand(cmd: CommandItem | undefined): void {
    if (!cmd) return;
    closePalette();
    cmd.run();
  }

  function renderList(): void {
    const isEn = getSiteLang() === 'en';
    const q = input!.value.trim().toLowerCase();

    input!.placeholder = isEn
      ? 'Search a page, case study, PDF resume, or quick action…'
      : 'Rechercher une page, étude de cas, CV PDF ou action…';

    visibleCommands = COMMANDS.filter((c) => {
      if (!q) return true;
      const hay = `${c.labelFr} ${c.labelEn} ${c.subFr} ${c.subEn} ${c.keywords}`.toLowerCase();
      return hay.includes(q);
    });

    if (activeIdx >= visibleCommands.length) {
      activeIdx = 0;
    }

    if (visibleCommands.length === 0) {
      listEl!.innerHTML = `<div class="ob-cmd-empty">${
        isEn ? 'No matching command found.' : 'Aucune commande correspondante.'
      }</div>`;
      return;
    }

    let html = '';
    let lastGroup = '';

    visibleCommands.forEach((cmd, idx) => {
      const grp = isEn ? cmd.groupEn : cmd.groupFr;
      if (grp !== lastGroup) {
        lastGroup = grp;
        html += `<div class="ob-cmd-group-label">${grp}</div>`;
      }
      const isSelected = idx === activeIdx;
      const label = isEn ? cmd.labelEn : cmd.labelFr;
      const sub = isEn ? cmd.subEn : cmd.subFr;
      html += `
        <button
          type="button"
          role="option"
          aria-selected="${isSelected ? 'true' : 'false'}"
          class="ob-cmd-item${isSelected ? ' is-active' : ''}"
          data-cmd-idx="${idx}"
        >
          <span class="ob-cmd-item-icon" aria-hidden="true"><i class="bi ${cmd.icon}"></i></span>
          <span class="ob-cmd-item-text">
            <span class="ob-cmd-item-title">${label}</span>
            <span class="ob-cmd-item-sub">${sub}</span>
          </span>
          <i class="bi bi-arrow-return-left ob-cmd-item-enter" aria-hidden="true"></i>
        </button>
      `;
    });

    listEl!.innerHTML = html;
  }

  function openPalette(): void {
    if (!dialog) return;
    input!.value = '';
    activeIdx = 0;
    renderList();
    if (!dialog.open && typeof dialog.showModal === 'function') {
      dialog.showModal();
      promoteCursorToTopLayer();
    }
    requestAnimationFrame(() => input?.focus());
  }

  document.querySelectorAll<HTMLElement>('[data-open-cmd-palette]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openPalette();
    });
  });

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (dialog.open) {
        closePalette();
      } else {
        openPalette();
      }
    }
  });

  input.addEventListener('input', () => {
    activeIdx = 0;
    renderList();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closePalette();
      return;
    }
    if (visibleCommands.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIdx = (activeIdx + 1) % visibleCommands.length;
      renderList();
      listEl.querySelector<HTMLElement>('.ob-cmd-item.is-active')?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIdx = (activeIdx - 1 + visibleCommands.length) % visibleCommands.length;
      renderList();
      listEl.querySelector<HTMLElement>('.ob-cmd-item.is-active')?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(visibleCommands[activeIdx]);
    }
  });

  listEl.addEventListener('click', (e) => {
    const btn = (e.target as Element | null)?.closest<HTMLElement>('[data-cmd-idx]');
    if (!btn) return;
    const idx = Number(btn.getAttribute('data-cmd-idx'));
    executeCommand(visibleCommands[idx]);
  });

  window.addEventListener('ob:langchange', () => {
    if (dialog.open) renderList();
  });
}
