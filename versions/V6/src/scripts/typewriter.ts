import { getSiteLang } from './i18n';
import { isMotionReduced } from './motion';

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

  let reducedMotion = isMotionReduced();

  let wordIndex = 0;
  let charIndex = getWords()[0].length;
  let isDeleting = true;
  let timerId: number | null = null;

  el.textContent = getWords()[0];

  function clearTimer(): void {
    if (timerId !== null) {
      window.clearTimeout(timerId);
      timerId = null;
    }
  }

  function schedule(delayMs: number): void {
    clearTimer();
    if (reducedMotion) return;
    timerId = window.setTimeout(tick, delayMs);
  }

  function tick(): void {
    timerId = null;
    const list = getWords();
    const currentWord = list[wordIndex % list.length];
    if (isDeleting) {
      charIndex--;
      el!.textContent = currentWord.slice(0, Math.max(0, charIndex));
      if (charIndex <= 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % list.length;
        schedule(220);
        return;
      }
      schedule(45);
    } else {
      charIndex++;
      el!.textContent = currentWord.slice(0, charIndex);
      if (charIndex >= currentWord.length) {
        isDeleting = true;
        schedule(1800);
        return;
      }
      schedule(65 + Math.floor(Math.random() * 40));
    }
  }

  window.addEventListener('ob:langchange', () => {
    const list = getWords();
    wordIndex = wordIndex % list.length;
    const translatedWord = list[wordIndex];
    charIndex = translatedWord.length;
    isDeleting = true;
    el.textContent = translatedWord;
    if (!reducedMotion) {
      schedule(1400);
    }
  });

  window.addEventListener('ob:motionchange', () => {
    reducedMotion = isMotionReduced();
    if (reducedMotion) {
      clearTimer();
      const list = getWords();
      wordIndex = 0;
      charIndex = list[0].length;
      isDeleting = true;
      el.textContent = list[0];
    } else {
      schedule(1200);
    }
  });

  if (reducedMotion) {
    return;
  }

  schedule(1500);
}
