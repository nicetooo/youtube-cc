<script lang="ts">
  import { onMount } from "svelte";
  import {
    appStore,
    subscribeStorageChange,
  } from "../../lib/store/settings.svelte";
  import { fade, slide } from "svelte/transition";

  onMount(() => {
    subscribeStorageChange();
  });

  // Toggle helper to ensure reactive updates work smoothly
  function toggle(key: keyof typeof $appStore.settings) {
    appStore.update((s) => {
      s.settings[key] = !s.settings[key];
      return { ...s };
    });
  }
</script>

<main
  class="cc-plus-style-root w-[340px] bg-[#0f0f0f] text-[#f1f1f1] flex flex-col min-h-[520px] font-sans selection:bg-red-500/30"
>
  <!-- Header with Glassmorphism -->
  <header
    class="sticky top-0 z-50 px-6 py-5 bg-[#1a1a1a]/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between"
  >
    <div class="flex items-center gap-3">
      <div class="relative group">
        <div
          class="absolute -inset-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"
        ></div>
        <div
          class="relative w-9 h-9 bg-[#1a1a1a] rounded-lg flex items-center justify-center border border-white/10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-5 h-5 text-red-600"
          >
            <path
              d="M10 15.5l6-3.5-6-3.5v7zM12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2z"
            />
          </svg>
        </div>
      </div>
      <div>
        <h1 class="text-base font-bold tracking-tight text-white">CC Plus</h1>
        <p class="text-[10px] text-gray-500 font-medium">Powering your watch</p>
      </div>
    </div>
    <div
      class="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold text-gray-400 uppercase tracking-tighter"
    >
      v0.9.1
    </div>
  </header>

  <!-- Scrollable Content -->
  <div class="flex-grow p-6 flex flex-col gap-8 custom-scrollbar">
    <!-- Section: Player Controls -->
    <section transition:fade>
      <div class="flex items-center gap-2 mb-4">
        <div class="w-1 h-3 bg-red-600 rounded-full"></div>
        <h2
          class="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]"
        >
          Player View
        </h2>
      </div>

      <div class="space-y-3">
        <!-- Transcription Panel -->
        <button
          on:click={() => toggle("caption")}
          class="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#1a1a1a] border border-white/5 hover:border-white/10 hover:bg-[#222] transition-all group"
        >
          <div class="flex flex-col text-left">
            <span
              class="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors"
              >Transcription Panel</span
            >
            <span class="text-xs text-gray-500"
              >Interactive sidebar transcript</span
            >
          </div>
          <div
            class={`w-10 h-5 rounded-full relative transition-colors duration-300 ${$appStore.settings.caption ? "bg-red-600" : "bg-[#333]"}`}
          >
            <div
              class={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${$appStore.settings.caption ? "left-6" : "left-1"}`}
            ></div>
          </div>
        </button>

        <!-- Wide Screen -->
        <button
          on:click={() => toggle("wideScreen")}
          class="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#1a1a1a] border border-white/5 hover:border-white/10 hover:bg-[#222] transition-all group"
        >
          <div class="flex flex-col text-left">
            <span
              class="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors"
              >Theater Expander</span
            >
            <span class="text-xs text-gray-500"
              >Maximize immersion automatically</span
            >
          </div>
          <div
            class={`w-10 h-5 rounded-full relative transition-colors duration-300 ${$appStore.settings.wideScreen ? "bg-red-600" : "bg-[#333]"}`}
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
          class="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em]"
        >
          Content Refine
        </h2>
      </div>

      <div class="space-y-3">
        <!-- Remove Ads -->
        <button
          on:click={() => toggle("removeAds")}
          class="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#1a1a1a] border border-white/5 hover:border-white/10 hover:bg-[#222] transition-all group"
        >
          <div class="flex flex-col text-left">
            <span
              class="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors"
              >Ad-Free Layout</span
            >
            <span class="text-xs text-gray-500"
              >Cleaner banners & UI elements</span
            >
          </div>
          <div
            class={`w-10 h-5 rounded-full relative transition-colors duration-300 ${$appStore.settings.removeAds ? "bg-red-600" : "bg-[#333]"}`}
          >
            <div
              class={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${$appStore.settings.removeAds ? "left-6" : "left-1"}`}
            ></div>
          </div>
        </button>

        <!-- Skip Ads -->
        <button
          on:click={() => toggle("skipAd")}
          class="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#1a1a1a] border border-white/5 hover:border-white/10 hover:bg-[#222] transition-all group"
        >
          <div class="flex flex-col text-left">
            <span
              class="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors"
              >Instant Forward</span
            >
            <span class="text-xs text-gray-500"
              >Auto-skip video advertisements</span
            >
          </div>
          <div
            class={`w-10 h-5 rounded-full relative transition-colors duration-300 ${$appStore.settings.skipAd ? "bg-red-600" : "bg-[#333]"}`}
          >
            <div
              class={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${$appStore.settings.skipAd ? "left-6" : "left-1"}`}
            ></div>
          </div>
        </button>

        <!-- Side Comments -->
        <button
          on:click={() => toggle("sideComment")}
          class="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#1a1a1a] border border-white/5 hover:border-white/10 hover:bg-[#222] transition-all group"
        >
          <div class="flex flex-col text-left">
            <span
              class="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors"
              >Dynamic Sidebar</span
            >
            <span class="text-xs text-gray-500"
              >Shift comments to the right</span
            >
          </div>
          <div
            class={`w-10 h-5 rounded-full relative transition-colors duration-300 ${$appStore.settings.sideComment ? "bg-red-600" : "bg-[#333]"}`}
          >
            <div
              class={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${$appStore.settings.sideComment ? "left-6" : "left-1"}`}
            ></div>
          </div>
        </button>

        <!-- Comment Search -->
        <button
          on:click={() => toggle("commentSearch")}
          class="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#1a1a1a] border border-white/5 hover:border-white/10 hover:bg-[#222] transition-all group"
        >
          <div class="flex flex-col text-left">
            <span
              class="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors"
              >Smart Discovery</span
            >
            <span class="text-xs text-gray-500">Search and filter comments</span
            >
          </div>
          <div
            class={`w-10 h-5 rounded-full relative transition-colors duration-300 ${$appStore.settings.commentSearch ? "bg-red-600" : "bg-[#333]"}`}
          >
            <div
              class={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${$appStore.settings.commentSearch ? "left-6" : "left-1"}`}
            ></div>
          </div>
        </button>
      </div>
    </section>
  </div>

  <!-- Minimal Footer -->
  <footer
    class="px-6 py-4 bg-[#1a1a1a] border-t border-white/5 flex items-center justify-center"
  >
    <div
      class="flex items-center gap-1.5 opacity-50 hover:opacity-100 transition-opacity cursor-default"
    >
      <div class="w-1 h-1 bg-green-500 rounded-full animate-pulse"></div>
      <span
        class="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none"
        >All Systems Green</span
      >
    </div>
  </footer>
</main>

<style>
  :global(body) {
    background-color: #0f0f0f;
    margin: 0;
    padding: 0;
  }

  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #333 transparent;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 10px;
  }

  /* Smooth Toggle Transition */
  button div {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
</style>
