import { getSiteLang } from './i18n';
import { refreshScrollReveal } from './reveal';

export function initCollapsibleSections(): void {
  const sectionIds = ['expertise', 'about', 'skills', 'resume', 'portfolio', 'contact'];
  const sectionControllers = new Map<string, () => void>();

  function getCollapseWord(isExpanded: boolean): string {
    const isEn = getSiteLang() === 'en';
    return isExpanded ? (isEn ? 'Collapse' : 'Réduire') : isEn ? 'Expand' : 'Afficher';
  }

  function setWrapState(
    wrap: HTMLElement,
    btn: HTMLElement | null,
    isExpanded: boolean,
    onDone?: () => void
  ): void {
    wrap.classList.add('is-animating');
    wrap.classList.toggle('is-collapsed', !isExpanded);

    const inner = wrap.querySelector<HTMLElement>(':scope > .section-collapsible-inner');
    if (inner) inner.inert = !isExpanded;

    if (btn) {
      btn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      const label = btn.querySelector('.toggle-label');
      if (label) label.textContent = getCollapseWord(isExpanded);
    }

    const sectionEl = wrap.closest('section.section');
    if (sectionEl && (wrap.parentElement === sectionEl || wrap.dataset.isMainSection === '1')) {
      sectionEl.classList.toggle('is-section-collapsed', !isExpanded);
    }

    setTimeout(() => {
      wrap.classList.remove('is-animating');
      if (isExpanded && onDone) onDone();
    }, 400);
  }

  sectionIds.forEach((id) => {
    const section = document.getElementById(id);
    if (!section || section.dataset.collapsibleInit === '1') return;

    const titleBlock = section.querySelector<HTMLElement>('.section-title');
    const heading = titleBlock?.querySelector('h2');
    const parent = titleBlock?.parentElement;
    if (!titleBlock || !heading || !parent) return;

    const siblingsToWrap: Element[] = [];
    let next = titleBlock.nextElementSibling;
    while (next) {
      siblingsToWrap.push(next);
      next = next.nextElementSibling;
    }
    if (siblingsToWrap.length === 0) return;

    section.dataset.collapsibleInit = '1';

    const headerWrap = document.createElement('div');
    headerWrap.className = 'section-title-header';
    heading.parentNode?.insertBefore(headerWrap, heading);
    headerWrap.appendChild(heading);

    const wrap = document.createElement('div');
    wrap.className = 'section-collapsible-wrap';
    wrap.id = `collapsible-${id}`;
    wrap.dataset.isMainSection = '1';

    const inner = document.createElement('div');
    inner.className = 'section-collapsible-inner';
    siblingsToWrap.forEach((el) => inner.appendChild(el));
    wrap.appendChild(inner);
    parent.appendChild(wrap);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'section-collapse-btn';
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-controls', wrap.id);
    btn.setAttribute('aria-label', `Réduire ou développer la section ${heading.textContent?.trim() ?? id}`);
    btn.title = 'Réduire / Développer la section';
    btn.innerHTML = '<i class="bi bi-chevron-down" aria-hidden="true"></i>';
    headerWrap.appendChild(btn);

    const expand = () => {
      if (!wrap.classList.contains('is-collapsed')) return;
      setWrapState(wrap, btn, true, () => refreshScrollReveal());
    };
    sectionControllers.set(`#${id}`, expand);

    btn.addEventListener('click', () => {
      const willExpand = wrap.classList.contains('is-collapsed');
      setWrapState(wrap, btn, willExpand, () => refreshScrollReveal());
    });
  });

  // Blocs internes CV (.resume-block déjà structurés dans Resume.astro)
  document.querySelectorAll<HTMLElement>('#resume .resume-block').forEach((block) => {
    if (block.dataset.collapsibleInit === '1') return;
    const header = block.querySelector<HTMLElement>('.resume-block-header');
    const toggleBtn = block.querySelector<HTMLButtonElement>('.resume-block-toggle');
    const wrap = block.querySelector<HTMLElement>('.section-collapsible-wrap');
    if (!header || !toggleBtn || !wrap) return;

    block.dataset.collapsibleInit = '1';
    const inner = wrap.querySelector<HTMLElement>(':scope > .section-collapsible-inner');
    if (inner) inner.inert = wrap.classList.contains('is-collapsed');

    const toggleBlock = (e?: Event) => {
      e?.stopPropagation();
      const willExpand = wrap.classList.contains('is-collapsed');
      setWrapState(wrap, toggleBtn, willExpand);
    };

    toggleBtn.addEventListener('click', toggleBlock);
    header.addEventListener('click', (e) => {
      if (e.target !== toggleBtn && !toggleBtn.contains(e.target as Node)) {
        toggleBlock();
      }
    });
  });

  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    const hash = link.getAttribute('href');
    if (hash && sectionControllers.has(hash)) {
      link.addEventListener('click', () => {
        sectionControllers.get(hash)!();
      });
    }
  });
}
