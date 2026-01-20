/// <reference types="wxt" />
/// <reference types="wxt/client" />
/// <reference types="svelte" />
/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

// CSS imports with ?inline suffix
declare module "*.css?inline" {
  const content: string;
  export default content;
}

declare module "~/assets/tailwind.css?inline" {
  const content: string;
  export default content;
}
