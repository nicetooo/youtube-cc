<script lang="ts">
  import { onMount } from "svelte";
  import { browser } from "$app/environment";

  let offlineReady = $state(false);
  let needRefresh = $state(false);
  let registration: ServiceWorkerRegistration | null = $state(null);

  onMount(async () => {
    if (!browser || !("serviceWorker" in navigator)) return;

    try {
      // Register service worker
      const reg = await navigator.serviceWorker.register("/sw.js", {
        scope: "/",
      });
      registration = reg;
      console.log("[PWA] Service Worker registered:", reg.scope);

      // Check if there's an update available
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // New content is available
              needRefresh = true;
              console.log("[PWA] New content available");
            }
          });
        }
      });

      // Check if SW is already controlling the page
      if (reg.active && !navigator.serviceWorker.controller) {
        // First time install
        offlineReady = true;
        console.log("[PWA] App ready for offline use");
      }

      // Listen for controlling change
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        console.log("[PWA] Controller changed, reloading...");
      });

      // Check for updates periodically (every hour)
      setInterval(
        () => {
          reg.update();
        },
        60 * 60 * 1000
      );
    } catch (error) {
      console.error("[PWA] Service Worker registration failed:", error);
    }
  });

  function close() {
    offlineReady = false;
    needRefresh = false;
  }

  function updateApp() {
    if (registration?.waiting) {
      // Tell the waiting service worker to skip waiting
      registration.waiting.postMessage({ type: "SKIP_WAITING" });
      // Reload the page to use the new service worker
      window.location.reload();
    }
  }
</script>

{#if offlineReady || needRefresh}
  <div
    class="fixed bottom-20 sm:bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50"
    role="alert"
  >
    <div
      class="rounded-lg p-4 shadow-lg"
      style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);"
    >
      <div class="flex items-start gap-3">
        <div class="flex-1">
          {#if offlineReady}
            <p class="text-sm" style="color: var(--text-primary);">
              App ready to work offline
            </p>
          {:else if needRefresh}
            <p class="text-sm" style="color: var(--text-primary);">
              New version available
            </p>
            <p class="text-xs mt-1" style="color: var(--text-secondary);">
              Click reload to update
            </p>
          {/if}
        </div>
        <div class="flex gap-2">
          {#if needRefresh}
            <button
              onclick={updateApp}
              class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
              style="background-color: var(--accent-primary); color: white;"
            >
              Reload
            </button>
          {/if}
          <button
            onclick={close}
            class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
            style="background-color: var(--bg-tertiary); color: var(--text-secondary);"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
{/if}
