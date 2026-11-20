import { SITE } from '../data/site';

export function initContactForm(): void {
  const form = document.getElementById('contactForm') as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = form.elements.namedItem('name') as HTMLInputElement | null;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement | null;
    const subjectInput = form.elements.namedItem('subject') as HTMLInputElement | null;
    const messageInput = form.elements.namedItem('message') as HTMLTextAreaElement | null;

    const name = nameInput?.value.trim() || '';
    const email = emailInput?.value.trim() || '';
    const subject = subjectInput?.value.trim() || '';
    const message = messageInput?.value.trim() || '';

    if (message.length > 0) {
      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
        `Contact de ${name} (${email}) : ${subject}`
      )}&body=${encodeURIComponent(message)}`;
    }
  });
}
