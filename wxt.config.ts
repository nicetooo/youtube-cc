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
  vite: ({ mode }) => ({
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
    },
    build: {
      minify: mode === "production" ? "terser" : false, // 开发模式不压缩
      terserOptions: {
        compress: {
          drop_console: mode === "production", // 仅在正式版移除 Log
          drop_debugger: mode === "production",
        },
      },
    },
  }),
});

