import { sveltekit } from "@sveltejs/kit/vite";
import { SvelteKitPWA } from "@vite-pwa/sveltekit";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    sveltekit(),
    SvelteKitPWA({
      srcDir: "src",
      mode: "production",
      strategies: "generateSW",
      registerType: "autoUpdate",
      scope: "/",
      base: "/",
      manifest: {
        name: "CC Plus - YouTube Learning",
        short_name: "CC Plus",
        description:
          "YouTube CC Plus - Save words, sync across devices, master languages",
        theme_color: "#0f0f0f",
        background_color: "#0f0f0f",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        categories: ["education", "productivity"],
        screenshots: [],
      },
      injectManifest: {
        globPatterns: ["client/**/*.{js,css,ico,png,svg,webp,woff,woff2}"],
      },
      workbox: {
        globPatterns: ["client/**/*.{js,css,ico,png,svg,webp,woff,woff2}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            // Cache Google Fonts
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            // Cache images
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
          {
            // Cache API responses (with network first strategy)
            urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24, // 1 day
              },
              networkTimeoutSeconds: 10,
            },
          },
        ],
      },
      devOptions: {
        enabled: true, // Enable PWA in dev mode for manifest
        type: "module",
        navigateFallback: "/",
      },
      kit: {
        includeVersionFile: true,
      },
    }),
  ],
  server: {
    port: 5188,
  },
});
