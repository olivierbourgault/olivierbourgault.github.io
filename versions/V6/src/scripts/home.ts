import AOS from 'aos';
import { initBootSequence } from './boot';
import { initCollapsibleSections } from './collapsible';
import { initContactForm } from './contact';
import { initPortfolio } from './portfolio';
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
      behavior: 'smooth'
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

    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });

    scrollHashIfPresent();
    window.dispatchEvent(new Event('scroll'));
  });
}
