import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-svelte"],
  manifest: {
    permissions: ["webRequest", "storage"],
    host_permissions: ["*://www.youtube.com/*", "*://youtube.com/*"],
    default_locale: "en",
  },
});
