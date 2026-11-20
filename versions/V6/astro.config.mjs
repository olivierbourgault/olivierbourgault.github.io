import { defineConfig } from 'astro/config';
import devArchives from './tools/dev-archives.mjs';

export default defineConfig({
  site: 'https://olivierbourgault.github.io',
  base: '/versions/V6',
  build: {
    format: 'file',
    assets: '_astro'
  },
  vite: {
    plugins: [devArchives({ root: '../..' })]
  }
});
