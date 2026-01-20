<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import {
    appStore,
    subscribeStorageChange,
    getBrowserLanguage,
  } from "@/shared/stores/settings.svelte";
  import { i18n } from "@/shared/i18n/i18n";
  import { fade } from "svelte/transition";
  import {
    signInWithGoogle,
    logout,
    onAuthChange,
    WEBSITE_USER_KEY,
  } from "@aspect/shared";

  // Simplified Firebase user info type
  interface AuthUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    isAnonymous: boolean;
  }

  // Auth state
  let currentUser = $state<AuthUser | null>(null);
  let authLoading = $state(true);
  let syncStatus = $state<"idle" | "syncing" | "success" | "error">("idle");
  let unsubscribeAuth: (() => void) | null = null;

  onMount(async () => {
    subscribeStorageChange();

    // First check for website user (logged in via website)
    const result = await chrome.storage.local.get(WEBSITE_USER_KEY);
    const websiteUser = result[WEBSITE_USER_KEY] as AuthUser | undefined;

    if (websiteUser) {
      currentUser = websiteUser;
      authLoading = false;
    }

    // Listen for auth state changes from Firebase (for popup login)
    unsubscribeAuth = onAuthChange(async (user) => {
      if (user) {
        // Firebase user takes priority when actively logged in
        currentUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          isAnonymous: user.isAnonymous,
        };
      } else {
        // Firebase has no user - check storage for website user
        const stored = await chrome.storage.local.get(WEBSITE_USER_KEY);
        if (stored[WEBSITE_USER_KEY]) {
          currentUser = stored[WEBSITE_USER_KEY];
        } else {
          currentUser = null;
        }
      }
      authLoading = false;
    });

    // Listen for auth changes from background (website login/logout)
    chrome.runtime.onMessage.addListener(handleAuthMessage);

    // Listen for storage changes (website auth updates)
    chrome.storage.onChanged.addListener(handleStorageChange);
  });

  // Handle auth-changed messages from background
  function handleAuthMessage(message: { type: string; user?: AuthUser }) {
    if (message.type === "auth-changed") {
      currentUser = message.user || null;
      authLoading = false;
    }
  }

  // Handle storage changes (for website auth updates)
  function handleStorageChange(
    changes: { [key: string]: chrome.storage.StorageChange },
    areaName: string
  ) {
    if (areaName === "local" && changes[WEBSITE_USER_KEY]) {
      const newUser = changes[WEBSITE_USER_KEY].newValue as
        | AuthUser
        | undefined;
      if (newUser) {
        currentUser = newUser;
      } else {
        // Website user was removed, check if we have Firebase user
        // If not, clear current user
        if (
          !currentUser ||
          currentUser.uid === changes[WEBSITE_USER_KEY].oldValue?.uid
        ) {
          currentUser = null;
        }
      }
      authLoading = false;
    }
  }

  onDestroy(() => {
    unsubscribeAuth?.();
    chrome.runtime.onMessage.removeListener(handleAuthMessage);
    chrome.storage.onChanged.removeListener(handleStorageChange);
  });

  // Handle Google sign in
  async function handleSignIn() {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  }

  // Handle sign out
  async function handleSignOut() {
    try {
      await logout();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  }

  // Handle manual sync (forceAll=true to upload all local words, not just pending)
  async function handleSync() {
    if (syncStatus === "syncing") return;

    syncStatus = "syncing";
    try {
      // Force sync all local words (not just pending) to ensure everything is uploaded
      const response = await chrome.runtime.sendMessage({
        type: "sync",
        forceAll: true,
      });
      syncStatus = response?.success ? "success" : "error";

      // Reset status after 2 seconds
      setTimeout(() => {
        syncStatus = "idle";
      }, 2000);
    } catch (error) {
      console.error("Sync failed:", error);
      syncStatus = "error";
      setTimeout(() => {
        syncStatus = "idle";
      }, 2000);
    }
  }

  // Toggle helper to ensure reactive updates work smoothly
  function toggle(
    key:
      | "caption"
      | "skipAd"
      | "removeAds"
      | "wideScreen"
      | "sideComment"
      | "commentSearch"
      | "wordSelection"
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

  // Update target language
  function setTargetLanguage(lang: string) {
    appStore.update((s) => ({
      ...s,
      settings: {
        ...s.settings,
        targetLanguage: lang,
      },
    }));
  }

  // Update my language
  function setMyLanguage(lang: string) {
    appStore.update((s) => ({
      ...s,
      settings: {
        ...s.settings,
        myLanguage: lang,
      },
    }));
  }

  // Language options
  const languages = [
    { code: "zh-CN", label: "简体中文" },
    { code: "zh-TW", label: "繁體中文" },
    { code: "en", label: "English" },
    { code: "ja", label: "日本語" },
    { code: "ko", label: "한국어" },
  ];

  // Default language based on browser
  const defaultMyLanguage = getBrowserLanguage();

  // Target language dropdown state
  let showTargetLangDropdown = $state(false);

  function toggleTargetLangDropdown() {
    showTargetLangDropdown = !showTargetLangDropdown;
    showMyLangDropdown = false; // Close the other dropdown
  }

  function selectTargetLanguage(code: string) {
    setTargetLanguage(code);
    showTargetLangDropdown = false;
  }

  // My language dropdown state
  let showMyLangDropdown = $state(false);

  function toggleMyLangDropdown() {
    showMyLangDropdown = !showMyLangDropdown;
    showTargetLangDropdown = false; // Close the other dropdown
  }

  function selectMyLanguage(code: string) {
    setMyLanguage(code);
    showMyLangDropdown = false;
  }

  // Get current language label
  function getCurrentLangLabel(code: string): string {
    return languages.find((l) => l.code === code)?.label ?? "简体中文";
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
          on:click={() => toggle("caption")}
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
          on:click={() => toggle("wideScreen")}
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
          on:click={() => toggle("removeAds")}
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

        <!-- Skip Ads -->
        {#if false}
          <button
            on:click={() => toggle("skipAd")}
            class="w-full flex items-center justify-between p-3.5 rounded-xl bg-[var(--cc-bg-secondary)] border border-[var(--cc-border)] hover:border-[var(--cc-border-hover)] hover:bg-[var(--cc-bg-hover)] transition-all group"
          >
            <div class="flex flex-col text-left">
              <span
                class="text-sm font-semibold text-[var(--cc-text-secondary)] group-hover:text-[var(--cc-text)] transition-colors"
                >{i18n("skip_video_ads" as any)}</span
              >
              <span class="text-xs text-[var(--cc-text-muted)]"
                >{i18n("skip_video_ads_sub" as any)}</span
              >
            </div>
            <div
              class={`w-10 h-5 rounded-full relative transition-colors duration-300 ${$appStore.settings.skipAd ? "bg-[var(--cc-accent)]" : "bg-[var(--cc-toggle-off)]"}`}
            >
              <div
                class={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${$appStore.settings.skipAd ? "left-6" : "left-1"}`}
              ></div>
            </div>
          </button>
        {/if}

        <!-- Side Comments -->
        <button
          on:click={() => toggle("sideComment")}
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
          on:click={() => toggle("commentSearch")}
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

    <!-- Section: Vocabulary -->
    <section transition:fade>
      <div class="flex items-center gap-2 mb-4">
        <div class="w-1 h-3 bg-emerald-500 rounded-full"></div>
        <h2
          class="text-[11px] font-bold text-[var(--cc-text-secondary)] uppercase tracking-[0.2em]"
        >
          Vocabulary
        </h2>
      </div>

      <div class="space-y-3">
        <!-- Word Selection Toggle -->
        <button
          on:click={() => toggle("wordSelection")}
          class="w-full flex items-center justify-between p-3.5 rounded-xl bg-[var(--cc-bg-secondary)] border border-[var(--cc-border)] hover:border-[var(--cc-border-hover)] hover:bg-[var(--cc-bg-hover)] transition-all group"
        >
          <div class="flex flex-col text-left">
            <span
              class="text-sm font-semibold text-[var(--cc-text-secondary)] group-hover:text-[var(--cc-text)] transition-colors"
              >{i18n("word_selection")}</span
            >
            <span class="text-xs text-[var(--cc-text-muted)]"
              >{i18n("word_selection_sub")}</span
            >
          </div>
          <div
            class={`w-10 h-5 rounded-full relative transition-colors duration-300 ${($appStore.settings.wordSelection ?? true) ? "bg-[var(--cc-accent)]" : "bg-[var(--cc-toggle-off)]"}`}
          >
            <div
              class={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${($appStore.settings.wordSelection ?? true) ? "left-6" : "left-1"}`}
            ></div>
          </div>
        </button>

        <!-- My Language Selector -->
        <div class="relative">
          <button
            on:click={toggleMyLangDropdown}
            class="w-full flex items-center justify-between p-3.5 rounded-xl bg-[var(--cc-bg-secondary)] border border-[var(--cc-border)] hover:border-[var(--cc-border-hover)] hover:bg-[var(--cc-bg-hover)] transition-all group"
          >
            <div class="flex flex-col text-left">
              <span
                class="text-sm font-semibold text-[var(--cc-text-secondary)] group-hover:text-[var(--cc-text)] transition-colors"
                >{i18n("my_language")}</span
              >
              <span class="text-xs text-[var(--cc-text-muted)]"
                >{i18n("my_language_sub")}</span
              >
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-[var(--cc-text-secondary)]">
                {getCurrentLangLabel(
                  $appStore.settings.myLanguage ?? defaultMyLanguage
                )}
              </span>
              <svg
                class={`w-4 h-4 text-[var(--cc-text-muted)] transition-transform ${showMyLangDropdown ? "-rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>

          <!-- Dropdown Menu (opens upward) -->
          {#if showMyLangDropdown}
            <div
              class="absolute bottom-full right-0 mb-2 rounded-xl bg-[var(--cc-bg-secondary)] border border-[var(--cc-border-hover)] shadow-xl z-50 overflow-hidden"
              transition:fade={{ duration: 150 }}
            >
              {#each languages as lang}
                {@const isSelected =
                  ($appStore.settings.myLanguage ?? defaultMyLanguage) ===
                  lang.code}
                <button
                  on:click={() => selectMyLanguage(lang.code)}
                  style="padding: 10px 16px; font-size: 14px; {isSelected
                    ? 'background: var(--cc-accent); color: white;'
                    : 'color: var(--cc-text);'}"
                  class="block w-full text-left transition-colors lang-option"
                >
                  {lang.label}
                </button>
              {/each}
            </div>
          {/if}
        </div>

        <!-- Target Language Selector -->
        <div class="relative">
          <button
            on:click={toggleTargetLangDropdown}
            class="w-full flex items-center justify-between p-3.5 rounded-xl bg-[var(--cc-bg-secondary)] border border-[var(--cc-border)] hover:border-[var(--cc-border-hover)] hover:bg-[var(--cc-bg-hover)] transition-all group"
          >
            <div class="flex flex-col text-left">
              <span
                class="text-sm font-semibold text-[var(--cc-text-secondary)] group-hover:text-[var(--cc-text)] transition-colors"
                >{i18n("target_language")}</span
              >
              <span class="text-xs text-[var(--cc-text-muted)]"
                >{i18n("target_language_sub")}</span
              >
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-[var(--cc-text-secondary)]">
                {getCurrentLangLabel($appStore.settings.targetLanguage ?? "en")}
              </span>
              <svg
                class={`w-4 h-4 text-[var(--cc-text-muted)] transition-transform ${showTargetLangDropdown ? "-rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </button>

          <!-- Dropdown Menu (opens upward) -->
          {#if showTargetLangDropdown}
            <div
              class="absolute bottom-full right-0 mb-2 rounded-xl bg-[var(--cc-bg-secondary)] border border-[var(--cc-border-hover)] shadow-xl z-50 overflow-hidden"
              transition:fade={{ duration: 150 }}
            >
              {#each languages as lang}
                {@const isSelected =
                  ($appStore.settings.targetLanguage ?? "en") === lang.code}
                <button
                  on:click={() => selectTargetLanguage(lang.code)}
                  style="padding: 10px 16px; font-size: 14px; {isSelected
                    ? 'background: var(--cc-accent); color: white;'
                    : 'color: var(--cc-text);'}"
                  class="block w-full text-left transition-colors lang-option"
                >
                  {lang.label}
                </button>
              {/each}
            </div>
          {/if}
        </div>

        <!-- View Words Button -->
        <button
          on:click={() =>
            chrome.tabs.create({ url: "http://localhost:5188/words" })}
          class="w-full flex items-center justify-between p-3.5 rounded-xl bg-[var(--cc-bg-secondary)] border border-[var(--cc-border)] hover:border-[var(--cc-border-hover)] hover:bg-[var(--cc-bg-hover)] transition-all group"
        >
          <div class="flex flex-col text-left">
            <span
              class="text-sm font-semibold text-[var(--cc-text-secondary)] group-hover:text-[var(--cc-text)] transition-colors"
              >{i18n("view_words")}</span
            >
            <span class="text-xs text-[var(--cc-text-muted)]"
              >{i18n("view_words_sub")}</span
            >
          </div>
          <svg
            class="w-5 h-5 text-[var(--cc-text-muted)] group-hover:text-[var(--cc-text)] transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </button>
      </div>
    </section>

    <!-- Section: Account -->
    <section transition:fade>
      <div class="flex items-center gap-2 mb-4">
        <div class="w-1 h-3 bg-purple-500 rounded-full"></div>
        <h2
          class="text-[11px] font-bold text-[var(--cc-text-secondary)] uppercase tracking-[0.2em]"
        >
          {i18n("account")}
        </h2>
      </div>

      <div class="space-y-3">
        {#if authLoading}
          <!-- Loading state -->
          <div
            class="w-full flex items-center justify-center p-4 rounded-xl bg-[var(--cc-bg-secondary)] border border-[var(--cc-border)]"
          >
            <div
              class="w-5 h-5 border-2 border-[var(--cc-text-muted)] border-t-transparent rounded-full animate-spin"
            ></div>
          </div>
        {:else if currentUser}
          <!-- Logged in state (includes anonymous website users for sync) -->
          <div
            class="w-full p-3.5 rounded-xl bg-[var(--cc-bg-secondary)] border border-[var(--cc-border)]"
          >
            <div class="flex items-center gap-3 mb-3">
              {#if currentUser.photoURL}
                <img
                  src={currentUser.photoURL}
                  alt="Avatar"
                  class="w-9 h-9 rounded-full"
                  referrerpolicy="no-referrer"
                />
              {:else}
                <div
                  class="w-9 h-9 rounded-full bg-[var(--cc-accent)] flex items-center justify-center text-white font-semibold text-sm"
                >
                  {(currentUser.displayName || currentUser.email || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>
              {/if}
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-[var(--cc-text)] truncate">
                  {currentUser.displayName || i18n("anonymous")}
                </p>
                <p class="text-xs text-[var(--cc-text-muted)] truncate">
                  {currentUser.email || ""}
                </p>
              </div>
            </div>

            <!-- Action buttons -->
            <div class="flex gap-2">
              <button
                on:click={handleSync}
                disabled={syncStatus === "syncing"}
                class="flex-1 px-3 py-2 rounded-lg bg-[var(--cc-bg-hover)] border border-[var(--cc-border)] hover:border-[var(--cc-border-hover)] text-xs font-medium text-[var(--cc-text-secondary)] hover:text-[var(--cc-text)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                {#if syncStatus === "syncing"}
                  <div
                    class="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"
                  ></div>
                  {i18n("syncing")}
                {:else if syncStatus === "success"}
                  <svg
                    class="w-3.5 h-3.5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {i18n("sync_success")}
                {:else}
                  <svg
                    class="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  {i18n("sync_now")}
                {/if}
              </button>
              <button
                on:click={handleSignOut}
                class="px-3 py-2 rounded-lg bg-[var(--cc-bg-hover)] border border-[var(--cc-border)] hover:border-red-500/50 text-xs font-medium text-[var(--cc-text-muted)] hover:text-red-400 transition-all"
              >
                {i18n("sign_out")}
              </button>
            </div>
          </div>
        {:else}
          <!-- Not logged in state -->
          <button
            on:click={handleSignIn}
            class="w-full flex items-center justify-center gap-2.5 p-3.5 rounded-xl bg-[var(--cc-bg-secondary)] border border-[var(--cc-border)] hover:border-[var(--cc-border-hover)] hover:bg-[var(--cc-bg-hover)] transition-all group"
          >
            <!-- Google icon -->
            <svg class="w-4.5 h-4.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span
              class="text-sm font-semibold text-[var(--cc-text-secondary)] group-hover:text-[var(--cc-text)] transition-colors"
            >
              {i18n("sign_in_google")}
            </span>
          </button>
        {/if}
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
