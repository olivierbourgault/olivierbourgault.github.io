import { initBootSequence } from './boot';
import { initCollapsibleSections } from './collapsible';
import { initContactForm } from './contact';
import { getScrollBehavior } from './motion';
import { initPortfolio } from './portfolio';
import { initScrollReveal } from './reveal';
import { initSkills } from './skills';
import { initTypewriter } from './typewriter';
import { initHomeVerticalNavs } from './vnav';

function scrollHashIfPresent(): void {
  if (!window.location.hash) return;
  const target = document.querySelector<HTMLElement>(window.location.hash);
  if (!target) return;
  setTimeout(() => {
    const scrollMarginTop = parseInt(getComputedStyle(target).scrollMarginTop, 10) || 0;
    window.scrollTo({
      top: Math.max(0, target.offsetTop - scrollMarginTop),
      behavior: getScrollBehavior()
    });
  }, 100);
}

export function initHomePage(): void {
  initBootSequence(() => {
    initCollapsibleSections();
    initHomeVerticalNavs();
    initTypewriter();
    initSkills();
    initPortfolio();
    initContactForm();
    initScrollReveal();

    scrollHashIfPresent();
    window.dispatchEvent(new Event('scroll'));
  });
}
