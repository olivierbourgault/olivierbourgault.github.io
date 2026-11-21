import { SITE } from '../data/site';
import { trackConversionEvent } from './analytics';
import { copyTextToClipboard } from './clipboard';
import { getSiteLang } from './i18n';

export function initContactForm(): void {
  const form = document.getElementById('contactForm') as HTMLFormElement | null;
  const statusEl = document.getElementById('contactFormStatus');
  const copyBtn = document.getElementById('contactCopyEmailBtn') as HTMLButtonElement | null;
  const submitBtn = document.getElementById('contactSubmitBtn') as HTMLButtonElement | null;
  const gmailLink = document.getElementById('contactGmailLink') as HTMLAnchorElement | null;
  const outlookLink = document.getElementById('contactOutlookLink') as HTMLAnchorElement | null;

  let copyResetTimer: number | null = null;

  function showStatus(msg: string, isError = false): void {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.classList.toggle('is-visible', msg.length > 0);
    statusEl.classList.toggle('is-error', isError);
  }

  function getFormValues(): {
    name: string;
    email: string;
    subject: string;
    message: string;
    mailSubject: string;
  } {
    const isEn = getSiteLang() === 'en';
    const nameInput = form?.elements.namedItem('name') as HTMLInputElement | null;
    const emailInput = form?.elements.namedItem('email') as HTMLInputElement | null;
    const subjectInput = form?.elements.namedItem('subject') as HTMLInputElement | null;
    const messageInput = form?.elements.namedItem('message') as HTMLTextAreaElement | null;

    const name = nameInput?.value.trim() || '';
    const email = emailInput?.value.trim() || '';
    const subject =
      subjectInput?.value.trim() ||
      (isEn
        ? 'Job / Project Opportunity — Olivier Bourgault Portfolio'
        : 'Opportunité professionnelle — Portfolio Olivier Bourgault');
    const message = messageInput?.value.trim() || '';

    const mailSubject =
      name || email
        ? isEn
          ? `Contact from ${name || 'Recruiter'}${email ? ` (${email})` : ''}: ${subject}`
          : `Contact de ${name || 'Recruteur'}${email ? ` (${email})` : ''} : ${subject}`
        : subject;

    return { name, email, subject, message, mailSubject };
  }

  function syncWebmailComposeLinks(): void {
    const isEn = getSiteLang() === 'en';
    const { message, mailSubject } = getFormValues();
    const to = encodeURIComponent(SITE.email);
    const su = encodeURIComponent(mailSubject);
    const bodyParam = message ? `&body=${encodeURIComponent(message)}` : '';

    if (gmailLink) {
      gmailLink.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}${bodyParam}`;
      const gTitle = isEn
        ? 'Open Gmail with pre-filled message'
        : 'Ouvrir Gmail avec le message pré-rempli';
      gmailLink.title = gTitle;
      gmailLink.setAttribute('aria-label', gTitle);
    }

    if (outlookLink) {
      outlookLink.href = `https://outlook.office.com/mail/deeplink/compose?to=${to}&subject=${su}${bodyParam}`;
      const oTitle = isEn
        ? 'Open Outlook Web with pre-filled message'
        : 'Ouvrir Outlook Web avec le message pré-rempli';
      outlookLink.title = oTitle;
      outlookLink.setAttribute('aria-label', oTitle);
    }
  }

  copyBtn?.addEventListener('click', async () => {
    const email = copyBtn.dataset.copyEmail || SITE.email;
    const isEn = getSiteLang() === 'en';
    const ok = await copyTextToClipboard(email);
    const icon = copyBtn.querySelector('i');
    trackConversionEvent('contact_copy_email');

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

  form.addEventListener('input', syncWebmailComposeLinks);
  window.addEventListener('ob:langchange', syncWebmailComposeLinks);
  syncWebmailComposeLinks();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const gotchaInput = form.elements.namedItem('_gotcha') as HTMLInputElement | null;
    if (gotchaInput && gotchaInput.value.trim().length > 0) {
      return;
    }

    const { name, email, message, mailSubject } = getFormValues();
    if (!message) return;

    syncWebmailComposeLinks();
    trackConversionEvent('contact_submit');

    const isEn = getSiteLang() === 'en';
    const formattedCopy = `${mailSubject}\n\n${message}`;
    const copied = await copyTextToClipboard(formattedCopy);

    const web3Key = (form.dataset.web3formsKey || SITE.contact.web3formsAccessKey || '').trim();
    const formspreeUrl = (form.dataset.formspreeEndpoint || SITE.contact.formspreeEndpoint || '').trim();

    if (web3Key || formspreeUrl) {
      const endpoint = formspreeUrl || 'https://api.web3forms.com/submit';
      const origBtnText = submitBtn?.textContent || (isEn ? 'Send' : 'Envoyer');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = isEn ? 'Sending…' : 'Envoi en cours…';
      }

      try {
        const payload: Record<string, string> = {
          name,
          email,
          subject: mailSubject,
          message
        };
        if (web3Key) {
          payload.access_key = web3Key;
          payload.from_name = `${name} (Portfolio V6)`;
        }

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          showStatus(
            isEn
              ? 'Message sent directly! A copy was also saved to your clipboard.'
              : 'Message envoyé directement avec succès ! Une copie a aussi été placée dans votre presse-papiers.',
            false
          );
          form.reset();
          syncWebmailComposeLinks();
          return;
        }
      } catch {
        // Repli gracieux vers Webmail / mailto si le réseau échoue
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = origBtnText;
        }
      }
    }

    gmailLink?.classList.add('is-highlighted');
    outlookLink?.classList.add('is-highlighted');

    showStatus(
      isEn
        ? copied
          ? `Opening your mail client… Your message is also copied to clipboard and pre-filled in the Gmail / Outlook Web buttons above.`
          : `Opening your mail client… Using webmail? Click Gmail or Outlook Web above to open your pre-filled message.`
        : copied
          ? `Ouverture de votre client courriel… Votre message est aussi copié dans le presse-papiers et pré-rempli dans les boutons Gmail / Outlook Web ci-dessus.`
          : `Ouverture de votre client courriel… Sur webmail ? Cliquez sur Gmail ou Outlook Web ci-dessus pour ouvrir votre message pré-rempli.`,
      false
    );

    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(
      mailSubject
    )}&body=${encodeURIComponent(message)}`;
  });
}
