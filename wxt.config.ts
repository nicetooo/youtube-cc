import { defineConfig } from "wxt";
import pkg from "./package.json";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-svelte"],
  manifest: {
    permissions: ["storage", "webRequest", "tabs", "alarms"],
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
  vite: () => ({
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
    },
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
  }),
});

