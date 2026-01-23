<script lang="ts">
  import { browser } from "$app/environment";
  import { i18n } from "$lib/i18n/index.svelte";

  console.log("[PWA] Component script loaded, browser:", browser);

  // Install prompt state
  let deferredPrompt: any = $state(null);
  const t = (key: string) => i18n.t(key as any);
  let showIOSPrompt = $state(false);
  let dismissed = $state(false);
  let initialized = $state(false);

  const DISMISS_KEY = "pwa-install-dismissed";
  const DISMISS_DAYS = 7; // 用户关闭后 7 天内不再显示

  $effect(() => {
    if (!browser || initialized) return;
    initialized = true;

    // 调试日志
    console.log("[PWA] Effect running");
    console.log("[PWA] User Agent:", navigator.userAgent);
    console.log("[PWA] isIOSSafari:", isIOSSafari());
    console.log("[PWA] isStandalone:", isStandalone());
    console.log("[PWA] isDismissed:", isDismissed());

    // 检查是否已安装或已关闭
    if (isStandalone() || isDismissed()) {
      console.log("[PWA] Skipping install prompt (standalone or dismissed)");
      return;
    }

    // Android Chrome: 监听 beforeinstallprompt
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // iOS Safari: 检测并显示自定义提示
    if (isIOSSafari()) {
      console.log("[PWA] iOS Safari detected, showing prompt immediately");
      showIOSPrompt = true;
    } else {
      // 开发调试：非 iOS 也显示，便于测试
      console.log("[PWA] Not iOS Safari, but showing for debug");
      showIOSPrompt = true;
    }
  });

  function handleBeforeInstallPrompt(e: any) {
    e.preventDefault();
    deferredPrompt = e;
    console.log("[PWA] Install prompt available");
  }

  function isStandalone(): boolean {
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true
    );
  }

  function isIOSSafari(): boolean {
    const ua = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua);
    const isWebkit = /WebKit/.test(ua);
    const isNotChrome = !/CriOS/.test(ua);
    const isNotFirefox = !/FxiOS/.test(ua);
    return isIOS && isWebkit && isNotChrome && isNotFirefox;
  }

  function isDismissed(): boolean {
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (!dismissedAt) return false;

    const dismissedDate = new Date(parseInt(dismissedAt));
    const now = new Date();
    const diffDays =
      (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays < DISMISS_DAYS;
  }

  async function installPWA() {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log("[PWA] Install prompt outcome:", outcome);

      if (outcome === "accepted") {
        deferredPrompt = null;
      }
    } catch (error) {
      console.error("[PWA] Install prompt error:", error);
    }
  }

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
    dismissed = true;
    deferredPrompt = null;
    showIOSPrompt = false;
  }

  // 是否显示提示
  const showPrompt = $derived(
    !dismissed && (deferredPrompt !== null || showIOSPrompt)
  );
</script>

{#if showPrompt}
  <div
    class="fixed bottom-20 sm:bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50"
    role="alert"
  >
    <div
      class="rounded-lg p-4 shadow-lg"
      style="background-color: var(--bg-secondary); border: 1px solid var(--border-primary);"
    >
      <div class="flex items-start gap-3">
        <!-- App Icon -->
        <div
          class="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
          style="background: linear-gradient(135deg, #3b82f6, #8b5cf6);"
        >
          <svg
            class="w-7 h-7 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>

        <div class="flex-1 min-w-0">
          <p class="font-medium" style="color: var(--text-primary);">
            {t("pwa_install_title")}
          </p>

          {#if showIOSPrompt}
            <!-- iOS 引导 -->
            <p class="text-sm mt-1" style="color: var(--text-secondary);">
              {t("pwa_install_ios_hint")}
            </p>
            <div class="flex items-center gap-2 mt-2 text-sm">
              <span style="color: var(--text-secondary);">1.</span>
              <span style="color: var(--text-secondary);"
                >{t("pwa_install_ios_step1")}</span
              >
              <svg
                class="w-5 h-5"
                style="color: var(--accent-primary);"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </div>
            <div class="flex items-center gap-2 mt-1 text-sm">
              <span style="color: var(--text-secondary);">2.</span>
              <span style="color: var(--text-secondary);"
                >{t("pwa_install_ios_step2")}</span
              >
            </div>
          {:else}
            <!-- Android 提示 -->
            <p class="text-sm mt-1" style="color: var(--text-secondary);">
              {t("pwa_install_hint")}
            </p>
          {/if}
        </div>

        <!-- Close button -->
        <button
          onclick={dismiss}
          class="flex-shrink-0 p-1 rounded-md transition-colors hover:bg-[var(--bg-tertiary)]"
          aria-label="Close"
        >
          <svg
            class="w-5 h-5"
            style="color: var(--text-secondary);"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {#if deferredPrompt}
        <!-- Android 安装按钮 -->
        <div class="mt-3 flex justify-end">
          <button
            onclick={installPWA}
            class="px-4 py-2 text-sm font-medium rounded-md transition-colors"
            style="background-color: var(--accent-primary); color: white;"
          >
            {t("pwa_install_button")}
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}
