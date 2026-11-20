const RAW_BASE = import.meta.env.BASE_URL || '/versions/V6';
export const BASE_PATH = RAW_BASE.endsWith('/') ? RAW_BASE.slice(0, -1) : RAW_BASE;

/**
 * Construit une URL absolue sous `/versions/V6/...` (ou la base Astro configurée),
 * sûre depuis toutes les pages V6 ainsi que depuis `/404.html` à la racine.
 */
export function withBase(subpath = ''): string {
  if (!subpath || subpath === '/') return `${BASE_PATH}/`;
  if (/^(https?:|mailto:|tel:|data:|#)/i.test(subpath)) return subpath;
  const cleaned = subpath.replace(/^\/+/, '');
  return `${BASE_PATH}/${cleaned}`;
}
