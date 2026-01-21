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
    permissions: ["storage", "webRequest", "tabs", "alarms", "scripting"],
    host_permissions: ["*://www.youtube.com/*"],
    // Optional permission for word selection on any website
    // User must explicitly enable this feature to grant permission
    optional_host_permissions: ["<all_urls>"],
    default_locale: "en",
  },
  // Remove broad host permissions that WXT auto-adds from runtime content scripts
  transformManifest(manifest) {
    if (manifest.host_permissions) {
      // Only keep YouTube-specific permissions, remove broad permissions
      // (http://*/*, https://*/*) that come from selection.content.ts
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
