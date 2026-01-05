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
    startUrls: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
    
    // Disable other extensions for cleaner dev environment
    disabled: false,
    
    // Chrome binary path for macOS
    binaries: {
      chrome: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    },
    
    // Browser arguments for better dev experience
    chromiumArgs: [
      "--lang=en-US",
      // Auto-open DevTools (optional, comment out if not needed)
      // "--auto-open-devtools-for-tabs",
    ],
  },
});
