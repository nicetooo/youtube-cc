import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-svelte"],
  manifest: {
    permissions: ["storage", "webRequest", "tabs"],
    host_permissions: ["*://www.youtube.com/*"],
    default_locale: "en",
  },
  runner: {
    // Automatically open YouTube when starting dev mode
    startUrls: ["https://www.youtube.com"],
    chromiumArgs: ["--lang=en-US"],
  },
});
