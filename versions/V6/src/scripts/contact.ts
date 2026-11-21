import { SITE } from '../data/site';
import { copyTextToClipboard } from './clipboard';
import { getSiteLang } from './i18n';

export function initContactForm(): void {
  const form = document.getElementById('contactForm') as HTMLFormElement | null;
  const statusEl = document.getElementById('contactFormStatus');
  const copyBtn = document.getElementById('contactCopyEmailBtn') as HTMLButtonElement | null;

  let copyResetTimer: number | null = null;

  function showStatus(msg: string, isError = false): void {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.classList.toggle('is-visible', msg.length > 0);
    statusEl.classList.toggle('is-error', isError);
  }

  copyBtn?.addEventListener('click', async () => {
    const email = copyBtn.dataset.copyEmail || SITE.email;
    const isEn = getSiteLang() === 'en';
    const ok = await copyTextToClipboard(email);
    const icon = copyBtn.querySelector('i');

    if (ok) {
      copyBtn.classList.add('is-copied');
      if (icon) {
        icon.classList.remove('bi-clipboard');
        icon.classList.add('bi-check2');
      }
      showStatus(
        isEn ? `Email address copied: ${email}` : `Adresse courriel copiée : ${email}`,
        false
      );
      if (copyResetTimer !== null) window.clearTimeout(copyResetTimer);
      copyResetTimer = window.setTimeout(() => {
        copyBtn.classList.remove('is-copied');
        if (icon) {
          icon.classList.remove('bi-check2');
          icon.classList.add('bi-clipboard');
        }
      }, 2400);
    } else {
      showStatus(
        isEn ? `Copy unavailable — email: ${email}` : `Copie impossible — courriel : ${email}`,
        true
      );
    }
  });

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const gotchaInput = form.elements.namedItem('_gotcha') as HTMLInputElement | null;
    if (gotchaInput && gotchaInput.value.trim().length > 0) {
      return;
    }

    const nameInput = form.elements.namedItem('name') as HTMLInputElement | null;
    const emailInput = form.elements.namedItem('email') as HTMLInputElement | null;
    const subjectInput = form.elements.namedItem('subject') as HTMLInputElement | null;
    const messageInput = form.elements.namedItem('message') as HTMLTextAreaElement | null;

    const name = nameInput?.value.trim() || '';
    const email = emailInput?.value.trim() || '';
    const subject = subjectInput?.value.trim() || '';
    const message = messageInput?.value.trim() || '';

    if (message.length > 0) {
      const isEn = getSiteLang() === 'en';
      const mailSubject = isEn
        ? `Contact from ${name} (${email}): ${subject}`
        : `Contact de ${name} (${email}) : ${subject}`;

      const formattedCopy = `${mailSubject}\n\n${message}`;
      const copied = await copyTextToClipboard(formattedCopy);

      showStatus(
        isEn
          ? copied
            ? `Opening your email client… Your formatted message was also copied to clipboard (${SITE.email}).`
            : `Opening your email client… Using webmail? Copy my email address above.`
          : copied
            ? `Ouverture de votre client courriel… Votre message formaté a aussi été copié dans le presse-papiers (${SITE.email}).`
            : `Ouverture de votre client courriel… Vous utilisez un webmail ? Copiez mon adresse ci-dessus.`,
        false
      );

      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
        mailSubject
      )}&body=${encodeURIComponent(message)}`;
    }
  });
}
