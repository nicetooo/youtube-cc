import { defineConfig } from "wxt";
import pkg from "./package.json";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-svelte"],
  manifest: {
    name: "__MSG_extName__",
    description: "__MSG_extDescription__",
    permissions: ["storage", "webRequest", "tabs", "alarms"],
    host_permissions: ["*://www.youtube.com/*"],
    default_locale: "en",
  },
  runner: {
    startUrls: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
  },
  vite: ({ mode }) => ({
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
    },
    build: {
      minify: mode === "production" ? "terser" : false,
      terserOptions: {
        compress: {
          drop_console: mode === "production",
          drop_debugger: mode === "production",
        },
      },
    },
  }),
});
