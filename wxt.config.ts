import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-svelte"],
  manifest: {
    permissions: ["storage"],
    default_locale: "en",
  },
  runner: {
    // Use a persistent profile so you stay logged into YouTube
    chromiumArgs: ["--user-data-dir=./.wxt/user-data"],
    // Automatically open YouTube when starting dev mode
    startUrls: ["https://www.youtube.com"],
  },
});
