const WORDS = [
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

export function initTypewriter(): void {
  const el = document.querySelector<HTMLElement>('.typewriter');
  if (!el || el.dataset.twInit === '1') return;
  el.dataset.twInit = '1';

  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = WORDS[0];
      return;
    }
  } catch {
    // Continuer si matchMedia échoue
  }

  let wordIndex = 0;
  let charIndex = WORDS[0].length;
  let isDeleting = true;

  el.textContent = WORDS[0];

  function tick(): void {
    const currentWord = WORDS[wordIndex];
    if (isDeleting) {
      charIndex--;
      el!.textContent = currentWord.slice(0, charIndex);
      if (charIndex <= 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % WORDS.length;
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
