/**
 * Contrôleur partagé pour les modales <dialog class="ob-dialog">
 * Conforme Modern Web Guidance (dialog & light-dismiss-a-dialog).
 */
const customHandlers = new Map<string, (trigger: Element) => boolean>();
let initialized = false;

export function registerDialogHandler(
  dialogId: string,
  handler: (trigger: Element) => boolean
): void {
  customHandlers.set(dialogId, handler);
}

export function initNativeDialogs(): void {
  if (initialized) return;
  initialized = true;

  document.addEventListener('click', (e) => {
    const trigger = (e.target as Element | null)?.closest('[data-open-dialog]');
    if (!trigger) return;
    e.preventDefault();

    const dialogId = trigger.getAttribute('data-open-dialog');
    if (!dialogId) return;

    const handler = customHandlers.get(dialogId);
    if (handler && handler(trigger)) {
      return;
    }

    const dialog = document.getElementById(dialogId) as HTMLDialogElement | null;
    if (dialog && typeof dialog.showModal === 'function') {
      dialog.showModal();
    }
  });

  document.querySelectorAll<HTMLDialogElement>('dialog.ob-dialog').forEach((dialog) => {
    dialog.addEventListener('close', () => {
      dialog.returnValue = '';
      if (dialog.id === 'fullscreenPreviewDialog') {
        const fsIframe = document.getElementById('fullscreenIframe') as HTMLIFrameElement | null;
        if (fsIframe) fsIframe.src = 'about:blank';
      }
    });

    dialog.querySelectorAll('[data-close-dialog]').forEach((closeBtn) => {
      closeBtn.addEventListener('click', () => dialog.close('close'));
    });
  });

  // Fallback pour light-dismiss lorsque closedBy n'est pas supporté nativement
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    const isOutside = (e: PointerEvent, dialog: HTMLDialogElement): boolean => {
      const r = dialog.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };

    document.querySelectorAll<HTMLDialogElement>('dialog[closedby="any"]').forEach((dialog) => {
      let pressedOutside = false;
      dialog.addEventListener('pointerdown', (e) => {
        pressedOutside = isOutside(e, dialog);
      });
      dialog.addEventListener('pointerup', (e) => {
        if (pressedOutside && isOutside(e, dialog)) {
          dialog.close();
        }
      });
    });
  }
}
