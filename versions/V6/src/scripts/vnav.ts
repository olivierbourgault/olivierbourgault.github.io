import { getScrollBehavior } from './motion';

export function scrollToElement(el: Element | null): void {
  if (!el) return;
  const headerOffset = 94;
  const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;
  window.scrollTo({ top: Math.max(0, y), behavior: getScrollBehavior() });
}

interface SidebarConfig {
  listId: string;
  getTargets: () => HTMLElement[];
  onSelect: (target: HTMLElement, btn: HTMLButtonElement) => void;
}

export function bindVerticalNavSpy({ listId, getTargets, onSelect }: SidebarConfig): {
  refreshSpy: () => void;
} {
  const list = document.getElementById(listId);
  if (!list) return { refreshSpy: () => {} };

  function setActiveById(targetId: string): void {
    list!.querySelectorAll<HTMLButtonElement>('.vnav-item-btn').forEach((btn) => {
      btn.classList.toggle('is-active', btn.dataset.vnavTarget === targetId);
    });
  }

  list.addEventListener('click', (e) => {
    const btn = (e.target as Element | null)?.closest<HTMLButtonElement>('.vnav-item-btn[data-vnav-target]');
    if (!btn) return;
    const targetId = btn.dataset.vnavTarget;
    if (!targetId) return;
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      setActiveById(targetId);
      onSelect(targetEl, btn);
    }
  });

  function updateActiveOnScroll(): void {
    const targets = getTargets().filter((el) => el.offsetParent !== null);
    if (targets.length === 0) return;

    const probeY = 160;
    let activeEl = targets[0];
    for (const el of targets) {
      if (el.getBoundingClientRect().top <= probeY) {
        activeEl = el;
      }
    }
    if (activeEl.id) {
      setActiveById(activeEl.id);
    }
  }

  window.addEventListener('scroll', updateActiveOnScroll, { passive: true });
  updateActiveOnScroll();

  return { refreshSpy: updateActiveOnScroll };
}

export function renderPortfolioVerticalNav(visibleCards: HTMLElement[]): void {
  const list = document.getElementById('vnav-portfolio-list');
  if (!list) return;

  list.innerHTML = '';
  visibleCards.forEach((card, index) => {
    const h3 = card.querySelector('h3');
    const cat = card.querySelector('.category');
    if (!card.id) {
      card.id = `portfolio-item-${index}`;
    }

    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `vnav-item-btn${index === 0 ? ' is-active' : ''}`;
    btn.dataset.vnavTarget = card.id;

    const dot = document.createElement('span');
    dot.className = 'vnav-dot';
    dot.setAttribute('aria-hidden', 'true');

    const textWrap = document.createElement('span');
    textWrap.className = 'vnav-text';

    const title = document.createElement('span');
    title.className = 'vnav-title';
    title.textContent = h3?.textContent?.trim() || 'Projet';
    textWrap.appendChild(title);

    const subText = cat?.textContent?.trim();
    if (subText) {
      const sub = document.createElement('span');
      sub.className = 'vnav-sub';
      sub.textContent = subText;
      textWrap.appendChild(sub);
    }

    btn.appendChild(dot);
    btn.appendChild(textWrap);
    li.appendChild(btn);
    list.appendChild(li);
  });
}

export function initHomeVerticalNavs(): void {
  bindVerticalNavSpy({
    listId: 'vnav-resume-list',
    getTargets: () => Array.from(document.querySelectorAll<HTMLElement>('#resume .resume-block')),
    onSelect: (target) => {
      const wrap = target.querySelector<HTMLElement>('.section-collapsible-wrap');
      const toggleBtn = target.querySelector<HTMLButtonElement>('.resume-block-toggle');
      if (wrap?.classList.contains('is-collapsed') && toggleBtn) {
        toggleBtn.click();
        setTimeout(() => scrollToElement(target), 120);
      } else {
        scrollToElement(target);
      }
    }
  });

  bindVerticalNavSpy({
    listId: 'vnav-portfolio-list',
    getTargets: () =>
      Array.from(document.querySelectorAll<HTMLElement>('#portfolioGrid .portfolio-item:not(.d-none)')),
    onSelect: (target) => scrollToElement(target)
  });
}
