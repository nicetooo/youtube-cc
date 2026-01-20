<script lang="ts">
  import { themeStore } from "$lib/stores/theme.svelte";
  import { authStore } from "$lib/stores/auth.svelte";
  import { wordsStore } from "$lib/stores/words.svelte";
  import { i18n, type Locale } from "$lib/i18n/index.svelte";

  type ThemeOption = "light" | "dark" | "system";

  function handleThemeChange(e: Event) {
    const value = (e.target as HTMLSelectElement).value as ThemeOption;
    themeStore.set(value);
  }

  function handleLocaleChange(e: Event) {
    const value = (e.target as HTMLSelectElement).value as Locale;
    i18n.setLocale(value);
  }

  function exportData() {
    const data = {
      exportedAt: new Date().toISOString(),
      version: "1.0",
      words: wordsStore.words,
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ccplus-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
</script>

<svelte:head>
  <title>{i18n.t("settings_title")} - CC Plus</title>
</svelte:head>

<div class="max-w-xl mx-auto px-4 py-8">
  <!-- Header -->
  <h1 class="text-2xl font-bold mb-8">{i18n.t("settings_title")}</h1>

  <!-- Account section -->
  <section class="mb-8">
    <div class="flex items-center gap-2 mb-4">
      <div class="w-1 h-4 bg-[var(--accent)] rounded-full"></div>
      <h2 class="text-xs font-semibold text-secondary uppercase tracking-wider">
        {i18n.t("settings_account")}
      </h2>
    </div>

    <div class="card">
      {#if authStore.user && !authStore.isAnonymous}
        <div class="flex items-center gap-4">
          <div
            class="w-12 h-12 rounded-full bg-tertiary flex items-center justify-center overflow-hidden shrink-0"
          >
            {#if authStore.user.photoURL}
              <img
                src={authStore.user.photoURL}
                alt=""
                class="w-full h-full object-cover"
                referrerpolicy="no-referrer"
              />
            {:else}
              <span class="text-lg font-semibold text-secondary">
                {authStore.user.displayName?.[0] ||
                  authStore.user.email?.[0]?.toUpperCase() ||
                  "?"}
              </span>
            {/if}
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-medium truncate">
              {authStore.user.displayName || "User"}
            </div>
            <div class="text-sm text-secondary truncate">
              {authStore.user.email}
            </div>
          </div>
          <button
            onclick={() => authStore.logout()}
            class="px-3 py-1.5 rounded-lg text-sm font-medium text-secondary hover:text-[var(--error)] hover:bg-[var(--error)]/10 transition-colors"
          >
            {i18n.t("settings_logout")}
          </button>
        </div>
      {:else}
        <div class="text-center py-2">
          <p class="text-sm text-secondary mb-4">
            {i18n.t("settings_login_hint")}
          </p>
          <button
            onclick={() => authStore.loginWithGoogle()}
            class="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary border border-[var(--border)] hover:bg-tertiary transition-colors"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
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
            <span class="font-medium">{i18n.t("settings_google_login")}</span>
          </button>
        </div>
      {/if}
    </div>
  </section>

  <!-- Appearance section -->
  <section class="mb-8">
    <div class="flex items-center gap-2 mb-4">
      <div class="w-1 h-4 bg-blue-500 rounded-full"></div>
      <h2 class="text-xs font-semibold text-secondary uppercase tracking-wider">
        {i18n.t("settings_appearance")}
      </h2>
    </div>

    <div class="card space-y-1">
      <div class="setting-row">
        <span class="font-medium">{i18n.t("settings_theme")}</span>
        <select
          class="setting-select"
          value={themeStore.theme}
          onchange={handleThemeChange}
        >
          <option value="system">{i18n.t("settings_theme_system")}</option>
          <option value="light">{i18n.t("settings_theme_light")}</option>
          <option value="dark">{i18n.t("settings_theme_dark")}</option>
        </select>
      </div>

      <div class="setting-row">
        <span class="font-medium">{i18n.t("settings_language")}</span>
        <select
          class="setting-select"
          value={i18n.locale}
          onchange={handleLocaleChange}
        >
          {#each i18n.locales as locale}
            <option value={locale}>{i18n.localeNames[locale]}</option>
          {/each}
        </select>
      </div>
    </div>
  </section>

  <!-- Sync section (only for logged in users) -->
  {#if !authStore.isAnonymous}
    <section class="mb-8">
      <div class="flex items-center gap-2 mb-4">
        <div class="w-1 h-4 bg-emerald-500 rounded-full"></div>
        <h2
          class="text-xs font-semibold text-secondary uppercase tracking-wider"
        >
          {i18n.t("settings_sync")}
        </h2>
      </div>

      <div class="card">
        <div class="setting-row">
          <div>
            <div class="font-medium">{i18n.t("settings_sync_enabled")}</div>
            <div class="text-sm text-secondary mt-0.5">
              {i18n.t("settings_sync_desc")}
            </div>
          </div>
          <label class="toggle">
            <input type="checkbox" checked />
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>
    </section>
  {/if}

  <!-- Data section -->
  <section class="mb-8">
    <div class="flex items-center gap-2 mb-4">
      <div class="w-1 h-4 bg-purple-500 rounded-full"></div>
      <h2 class="text-xs font-semibold text-secondary uppercase tracking-wider">
        {i18n.t("settings_data")}
      </h2>
    </div>

    <div class="card">
      <div class="setting-row">
        <div>
          <div class="font-medium">{i18n.t("settings_export")}</div>
          <div class="text-sm text-secondary mt-0.5">
            {i18n.t("settings_export_desc", { count: wordsStore.words.length })}
          </div>
        </div>
        <button
          onclick={exportData}
          disabled={wordsStore.words.length === 0}
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-tertiary hover:bg-[var(--border)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline
              points="7 10 12 15 17 10"
            /><line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          {i18n.t("settings_export_btn")}
        </button>
      </div>
    </div>
  </section>

  <!-- Danger zone -->
  <section class="mb-8">
    <div class="flex items-center gap-2 mb-4">
      <div class="w-1 h-4 bg-[var(--error)] rounded-full"></div>
      <h2
        class="text-xs font-semibold text-[var(--error)] uppercase tracking-wider"
      >
        {i18n.t("settings_danger")}
      </h2>
    </div>

    <div class="card border-[var(--error)]/20">
      <div class="setting-row">
        <div>
          <div class="font-medium">{i18n.t("settings_delete_account")}</div>
          <div class="text-sm text-secondary mt-0.5">
            {i18n.t("settings_delete_account_desc")}
          </div>
        </div>
        <button
          class="px-3 py-1.5 rounded-lg text-sm font-medium bg-[var(--error)]/10 text-[var(--error)] hover:bg-[var(--error)]/20 transition-colors"
        >
          {i18n.t("delete")}
        </button>
      </div>
    </div>
  </section>

  <!-- About -->
  <footer class="pt-4 border-t border-[var(--border)]">
    <div class="flex items-center justify-between text-sm text-tertiary">
      <span>CC Plus v1.3.1</span>
      <div class="flex items-center gap-4">
        <a href="/privacy" class="hover:text-secondary transition-colors"
          >Privacy</a
        >
        <a href="/terms" class="hover:text-secondary transition-colors">Terms</a
        >
      </div>
    </div>
  </footer>
</div>

<style>
  .setting-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.75rem 0;
  }

  .setting-row:not(:last-child) {
    border-bottom: 1px solid var(--border);
  }

  .setting-row:first-child {
    padding-top: 0;
  }

  .setting-row:last-child {
    padding-bottom: 0;
  }

  .setting-select {
    padding: 0.5rem 2rem 0.5rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 500;
    background-color: var(--bg-tertiary);
    color: var(--text-primary);
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    transition: background-color 0.15s;
  }

  .setting-select:hover {
    background-color: var(--border);
  }

  .setting-select:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--accent);
  }

  /* Toggle switch */
  .toggle {
    position: relative;
    display: inline-block;
    width: 44px;
    height: 24px;
    flex-shrink: 0;
  }

  .toggle input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .toggle-slider {
    position: absolute;
    cursor: pointer;
    inset: 0;
    background-color: var(--bg-tertiary);
    border-radius: 24px;
    transition: 0.2s;
  }

  .toggle-slider::before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  .toggle input:checked + .toggle-slider {
    background-color: var(--accent);
  }

  .toggle input:checked + .toggle-slider::before {
    transform: translateX(20px);
  }

  .toggle input:focus-visible + .toggle-slider {
    box-shadow: 0 0 0 2px var(--accent);
  }
</style>
