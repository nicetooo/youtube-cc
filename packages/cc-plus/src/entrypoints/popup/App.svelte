<script lang="ts">
  import { onMount } from "svelte";
  import {
    appStore,
    subscribeStorageChange,
  } from "@/shared/stores/settings.svelte";
  import { i18n } from "@/shared/i18n/i18n";
  import { fade } from "svelte/transition";

  onMount(async () => {
    subscribeStorageChange();
  });

  // Toggle helper to ensure reactive updates work smoothly
  function toggle(
    key:
      | "caption"
      | "skipAd"
      | "removeAds"
      | "wideScreen"
      | "sideComment"
      | "commentSearch"
      | "enlargeSkipButton"
  ) {
    appStore.update((s) => {
      return {
        ...s,
        settings: {
          ...s.settings,
          [key]: !s.settings[key],
        },
      };
    });
  }
</script>

<main
  class="cc-plus-style-root w-[340px] bg-[var(--cc-bg)] text-[var(--cc-text)] flex flex-col h-auto font-sans selection:bg-[var(--cc-selection)]"
>
  <!-- Header with Glassmorphism -->
  <header
    class="sticky top-0 z-50 px-6 py-5 bg-[var(--cc-bg-secondary)]/80 backdrop-blur-md border-b border-[var(--cc-border)] flex items-center justify-between"
  >
    <div class="flex items-center gap-3">
      <div class="relative group">
        <div
          class="absolute -inset-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"
        ></div>
        <div
          class="relative w-9 h-9 bg-[var(--cc-bg-secondary)] rounded-lg flex items-center justify-center border border-[var(--cc-border-hover)]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-5 h-5 text-[var(--cc-accent)]"
          >
            <path
              d="M10 15.5l6-3.5-6-3.5v7zM12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2z"
            />
          </svg>
        </div>
      </div>
      <div>
        <h1 class="text-base font-bold tracking-tight">CC Plus</h1>
        <p class="text-[10px] text-[var(--cc-text-muted)] font-medium">
          Powering your watch
        </p>
      </div>
    </div>
    <div
      class="px-2 py-0.5 rounded-full bg-[var(--cc-bg-hover)] border border-[var(--cc-border-hover)] text-[9px] font-bold text-[var(--cc-text-secondary)] uppercase tracking-tighter"
    >
      v{__APP_VERSION__}
    </div>
  </header>

  <!-- Scrollable Content -->
  <div class="p-4 flex flex-col gap-4 custom-scrollbar">
    <!-- Section: Player Controls -->
    <section transition:fade>
      <div class="flex items-center gap-2 mb-4">
        <div class="w-1 h-3 bg-[var(--cc-accent)] rounded-full"></div>
        <h2
          class="text-[11px] font-bold text-[var(--cc-text-secondary)] uppercase tracking-[0.2em]"
        >
          Player View
        </h2>
      </div>

      <div class="space-y-3">
        <!-- Transcription Panel -->
        <button
          onclick={() => toggle("caption")}
          class="w-full flex items-center justify-between p-3.5 rounded-xl bg-[var(--cc-bg-secondary)] border border-[var(--cc-border)] hover:border-[var(--cc-border-hover)] hover:bg-[var(--cc-bg-hover)] transition-all group"
        >
          <div class="flex flex-col text-left">
            <span
              class="text-sm font-semibold text-[var(--cc-text-secondary)] group-hover:text-[var(--cc-text)] transition-colors"
              >{i18n("transcription")}</span
            >
            <span class="text-xs text-[var(--cc-text-muted)]"
              >{i18n("transcription_sub")}</span
            >
          </div>
          <div
            class={`w-10 h-5 rounded-full relative transition-colors duration-300 ${$appStore.settings.caption ? "bg-[var(--cc-accent)]" : "bg-[var(--cc-toggle-off)]"}`}
          >
            <div
              class={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${$appStore.settings.caption ? "left-6" : "left-1"}`}
            ></div>
          </div>
        </button>

        <!-- Wide Screen -->
        <button
          onclick={() => toggle("wideScreen")}
          class="w-full flex items-center justify-between p-3.5 rounded-xl bg-[var(--cc-bg-secondary)] border border-[var(--cc-border)] hover:border-[var(--cc-border-hover)] hover:bg-[var(--cc-bg-hover)] transition-all group"
        >
          <div class="flex flex-col text-left">
            <span
              class="text-sm font-semibold text-[var(--cc-text-secondary)] group-hover:text-[var(--cc-text)] transition-colors"
              >{i18n("wide_screen")}</span
            >
            <span class="text-xs text-[var(--cc-text-muted)]"
              >{i18n("wide_screen_sub")}</span
            >
          </div>
          <div
            class={`w-10 h-5 rounded-full relative transition-colors duration-300 ${$appStore.settings.wideScreen ? "bg-[var(--cc-accent)]" : "bg-[var(--cc-toggle-off)]"}`}
          >
            <div
              class={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${$appStore.settings.wideScreen ? "left-6" : "left-1"}`}
            ></div>
          </div>
        </button>
      </div>
    </section>

    <!-- Section: Content Polish -->
    <section transition:fade>
      <div class="flex items-center gap-2 mb-4">
        <div class="w-1 h-3 bg-blue-500 rounded-full"></div>
        <h2
          class="text-[11px] font-bold text-[var(--cc-text-secondary)] uppercase tracking-[0.2em]"
        >
          Content Refine
        </h2>
      </div>

      <div class="space-y-3">
        <!-- Remove Ads -->
        <button
          onclick={() => toggle("removeAds")}
          class="w-full flex items-center justify-between p-3.5 rounded-xl bg-[var(--cc-bg-secondary)] border border-[var(--cc-border)] hover:border-[var(--cc-border-hover)] hover:bg-[var(--cc-bg-hover)] transition-all group"
        >
          <div class="flex flex-col text-left">
            <span
              class="text-sm font-semibold text-[var(--cc-text-secondary)] group-hover:text-[var(--cc-text)] transition-colors"
              >{i18n("remove_ad_items")}</span
            >
            <span class="text-xs text-[var(--cc-text-muted)]"
              >{i18n("remove_ad_items_sub")}</span
            >
          </div>
          <div
            class={`w-10 h-5 rounded-full relative transition-colors duration-300 ${$appStore.settings.removeAds ? "bg-[var(--cc-accent)]" : "bg-[var(--cc-toggle-off)]"}`}
          >
            <div
              class={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${$appStore.settings.removeAds ? "left-6" : "left-1"}`}
            ></div>
          </div>
        </button>

        <!-- Enlarge Skip Button -->
        <button
          onclick={() => toggle("enlargeSkipButton")}
          class="w-full flex items-center justify-between p-3.5 rounded-xl bg-[var(--cc-bg-secondary)] border border-[var(--cc-border)] hover:border-[var(--cc-border-hover)] hover:bg-[var(--cc-bg-hover)] transition-all group"
        >
          <div class="flex flex-col text-left">
            <span
              class="text-sm font-semibold text-[var(--cc-text-secondary)] group-hover:text-[var(--cc-text)] transition-colors"
              >{i18n("enlarge_skip_button")}</span
            >
            <span class="text-xs text-[var(--cc-text-muted)]"
              >{i18n("enlarge_skip_button_sub")}</span
            >
          </div>
          <div
            class={`w-10 h-5 rounded-full relative transition-colors duration-300 ${($appStore.settings.enlargeSkipButton ?? false) ? "bg-[var(--cc-accent)]" : "bg-[var(--cc-toggle-off)]"}`}
          >
            <div
              class={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${($appStore.settings.enlargeSkipButton ?? false) ? "left-6" : "left-1"}`}
            ></div>
          </div>
        </button>

        <!-- Side Comments -->
        <button
          onclick={() => toggle("sideComment")}
          class="w-full flex items-center justify-between p-3.5 rounded-xl bg-[var(--cc-bg-secondary)] border border-[var(--cc-border)] hover:border-[var(--cc-border-hover)] hover:bg-[var(--cc-bg-hover)] transition-all group"
        >
          <div class="flex flex-col text-left">
            <span
              class="text-sm font-semibold text-[var(--cc-text-secondary)] group-hover:text-[var(--cc-text)] transition-colors"
              >{i18n("side_comments")}</span
            >
            <span class="text-xs text-[var(--cc-text-muted)]"
              >{i18n("side_comments_sub")}</span
            >
          </div>
          <div
            class={`w-10 h-5 rounded-full relative transition-colors duration-300 ${$appStore.settings.sideComment ? "bg-[var(--cc-accent)]" : "bg-[var(--cc-toggle-off)]"}`}
          >
            <div
              class={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${$appStore.settings.sideComment ? "left-6" : "left-1"}`}
            ></div>
          </div>
        </button>

        <!-- Comment Search -->
        <button
          onclick={() => toggle("commentSearch")}
          class="w-full flex items-center justify-between p-3.5 rounded-xl bg-[var(--cc-bg-secondary)] border border-[var(--cc-border)] hover:border-[var(--cc-border-hover)] hover:bg-[var(--cc-bg-hover)] transition-all group"
        >
          <div class="flex flex-col text-left">
            <span
              class="text-sm font-semibold text-[var(--cc-text-secondary)] group-hover:text-[var(--cc-text)] transition-colors"
              >{i18n("search_comment")}</span
            >
            <span class="text-xs text-[var(--cc-text-muted)]"
              >{i18n("search_comment_sub")}</span
            >
          </div>
          <div
            class={`w-10 h-5 rounded-full relative transition-colors duration-300 ${$appStore.settings.commentSearch ? "bg-[var(--cc-accent)]" : "bg-[var(--cc-toggle-off)]"}`}
          >
            <div
              class={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${$appStore.settings.commentSearch ? "left-6" : "left-1"}`}
            ></div>
          </div>
        </button>
      </div>
    </section>
  </div>
</main>

<style>
  :global(html),
  :global(body) {
    width: fit-content;
    margin: 0;
    padding: 0;
    background-color: var(--cc-bg);
    overflow: hidden;
  }

  :global(#app) {
    display: contents;
  }

  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: var(--cc-scrollbar) transparent;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--cc-scrollbar);
    border-radius: 10px;
  }

  button div {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
</style>
