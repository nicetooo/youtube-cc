<script lang="ts">
  import { themeStore } from "$lib/stores/theme.svelte";
  import { authStore } from "$lib/stores/auth.svelte";
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
</script>

<svelte:head>
  <title>{i18n.t("settings_title")} - CC Plus</title>
</svelte:head>

<div class="max-w-xl mx-auto px-4 py-6">
  <h1 class="text-2xl font-bold mb-6">{i18n.t("settings_title")}</h1>

  <!-- Account section -->
  <section class="card mb-6">
    <h2 class="text-sm font-medium text-secondary mb-4">
      {i18n.t("settings_account")}
    </h2>
    {#if authStore.user}
      <div class="flex items-center gap-4">
        <div
          class="w-12 h-12 rounded-full bg-tertiary flex items-center justify-center"
        >
          {#if authStore.user.photoURL}
            <img
              src={authStore.user.photoURL}
              alt=""
              class="w-full h-full rounded-full object-cover"
            />
          {:else}
            <span class="text-lg font-medium">
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
          class="btn btn-ghost text-sm"
        >
          {i18n.t("settings_logout")}
        </button>
      </div>
    {:else}
      <button
        onclick={() => authStore.loginWithGoogle()}
        class="btn btn-primary"
      >
        Sign in with Google
      </button>
    {/if}
  </section>

  <!-- Appearance section -->
  <section class="card mb-6">
    <h2 class="text-sm font-medium text-secondary mb-4">
      {i18n.t("settings_appearance")}
    </h2>
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <div class="font-medium">{i18n.t("settings_theme")}</div>
        </div>
        <select
          class="input w-32"
          value={themeStore.theme}
          onchange={handleThemeChange}
        >
          <option value="system">{i18n.t("settings_theme_system")}</option>
          <option value="light">{i18n.t("settings_theme_light")}</option>
          <option value="dark">{i18n.t("settings_theme_dark")}</option>
        </select>
      </div>
      <div class="flex items-center justify-between">
        <div>
          <div class="font-medium">{i18n.t("settings_language")}</div>
        </div>
        <select
          class="input w-32"
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

  <!-- Sync section -->
  <section class="card mb-6">
    <h2 class="text-sm font-medium text-secondary mb-4">
      {i18n.t("settings_sync")}
    </h2>
    <div class="flex items-center justify-between">
      <div>
        <div class="font-medium">{i18n.t("settings_sync_enabled")}</div>
        <div class="text-sm text-secondary">{i18n.t("settings_sync_desc")}</div>
      </div>
      <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked class="sr-only peer" />
        <div
          class="w-11 h-6 bg-tertiary peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"
        ></div>
      </label>
    </div>
  </section>

  <!-- Danger zone -->
  <section class="card border-[var(--error)]/30">
    <h2 class="text-sm font-medium text-[var(--error)] mb-4">Danger Zone</h2>
    <div class="flex items-center justify-between">
      <div>
        <div class="font-medium">{i18n.t("delete")}</div>
      </div>
      <button
        class="btn text-sm bg-[var(--error)]/10 text-[var(--error)] hover:bg-[var(--error)]/20"
      >
        {i18n.t("delete")}
      </button>
    </div>
  </section>

  <!-- About -->
  <div class="mt-8 text-center text-sm text-tertiary">
    <p>CC Plus v1.3.1</p>
    <p class="mt-1">
      <span class="hover:text-secondary cursor-pointer">Privacy</span>
      {" · "}
      <span class="hover:text-secondary cursor-pointer">Terms</span>
      {" · "}
      <span class="hover:text-secondary cursor-pointer">GitHub</span>
    </p>
  </div>
</div>
