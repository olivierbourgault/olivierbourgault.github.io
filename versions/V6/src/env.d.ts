/// <reference types="astro/client" />

declare module 'aos';
declare module 'glightbox';

declare namespace astroHTML.JSX {
  interface HTMLAttributes {
    focusgroup?: string;
    focusgroupstart?: boolean | string;
  }
}
