const RAW_BASE = import.meta.env.BASE_URL || '/';
export const BASE_PATH = RAW_BASE === '/' ? '' : RAW_BASE.replace(/\/+$/, '');

/**
 * Construit une URL absolue sous la base Astro configurée (`/`),
 * sûre depuis toutes les pages (`/`, `/versions`, `/identity`, `/resume`, `/404.html`).
 */
export function withBase(subpath = ''): string {
  if (!subpath || subpath === '/') return `${BASE_PATH}/`;
  if (/^(https?:|mailto:|tel:|data:|#)/i.test(subpath)) return subpath;
  const cleaned = subpath.replace(/^\/+/, '');
  return `${BASE_PATH}/${cleaned}`;
}
