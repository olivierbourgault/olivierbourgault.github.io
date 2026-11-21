import { SITE } from '../data/site';
import { getSiteLang } from './i18n';

async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fallback below
    }
  }
  try {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.cssText = 'position:fixed;inset-block-start:0;opacity:0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

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
    const ok = await copyText(email);
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
      const isEn = getSiteLang() === 'en';
      const mailSubject = isEn
        ? `Contact from ${name} (${email}): ${subject}`
        : `Contact de ${name} (${email}) : ${subject}`;

      showStatus(
        isEn
          ? 'Opening your email client… Using webmail? Copy my email address above.'
          : 'Ouverture de votre client courriel… Vous utilisez un webmail ? Copiez mon adresse ci-dessus.',
        false
      );

      window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
        mailSubject
      )}&body=${encodeURIComponent(message)}`;
    }
  });
}
