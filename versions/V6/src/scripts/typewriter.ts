import { getSiteLang } from './i18n';

const WORDS_FR = [
  'Développeur',
  'Programmeur',
  'Technicien',
  'Intégrateur',
  'Concepteur',
  'Créateur',
  'Codeur',
  'Informaticien',
  'Professionnel'
];

const WORDS_EN = [
  'Developer',
  'Programmer',
  'IT Technician',
  'Integrator',
  'Designer',
  'Creator',
  'Coder',
  'Computer Scientist',
  'Professional'
];

function getWords(): string[] {
  return getSiteLang() === 'en' ? WORDS_EN : WORDS_FR;
}

export function initTypewriter(): void {
  const el = document.querySelector<HTMLElement>('.typewriter');
  if (!el || el.dataset.twInit === '1') return;
  el.dataset.twInit = '1';

  let reducedMotion = false;
  try {
    reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    reducedMotion = false;
  }

  let wordIndex = 0;
  let charIndex = getWords()[0].length;
  let isDeleting = true;

  el.textContent = getWords()[0];

  window.addEventListener('ob:langchange', () => {
    const list = getWords();
    wordIndex = wordIndex % list.length;
    if (reducedMotion || isDeleting) {
      charIndex = list[wordIndex].length;
      el.textContent = list[wordIndex];
    }
  });

  if (reducedMotion) {
    return;
  }

  function tick(): void {
    const list = getWords();
    const currentWord = list[wordIndex % list.length];
    if (isDeleting) {
      charIndex--;
      el!.textContent = currentWord.slice(0, Math.max(0, charIndex));
      if (charIndex <= 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % list.length;
        setTimeout(tick, 220);
        return;
      }
      setTimeout(tick, 45);
    } else {
      charIndex++;
      el!.textContent = currentWord.slice(0, charIndex);
      if (charIndex >= currentWord.length) {
        isDeleting = true;
        setTimeout(tick, 1800);
        return;
      }
      setTimeout(tick, 65 + Math.floor(Math.random() * 40));
    }
  }

  setTimeout(tick, 1500);
}
