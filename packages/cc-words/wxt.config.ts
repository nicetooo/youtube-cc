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
    permissions: ["storage", "tabs", "scripting"],
    // No host_permissions needed - word selection works via optional permissions
    // Optional permission for word selection on any website
    optional_host_permissions: ["<all_urls>"],
    default_locale: "en",
  },
  // Remove broad host permissions that WXT auto-adds from runtime content scripts
  transformManifest(manifest) {
    if (manifest.host_permissions) {
      // Remove broad permissions (http://*/*, https://*/*) that come from selection.content.ts
      manifest.host_permissions = manifest.host_permissions.filter(
        (permission) =>
          !["http://*/*", "https://*/*", "<all_urls>"].includes(permission)
      );
    }
    return manifest;
  },
  runner: {
    startUrls: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
  },
  vite: ({ mode }) => ({
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      __WEBSITE_URL__: JSON.stringify(
        mode === "production"
          ? "https://youtube-cc.com"
          : "http://localhost:5188"
      ),
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
