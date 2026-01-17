<script lang="ts">
  import { page } from "$app/stores";
  import ThemeToggle from "./ThemeToggle.svelte";
  import LocaleSelect from "./LocaleSelect.svelte";
  import { wordsStore } from "$lib/stores/words.svelte";
  import { i18n } from "$lib/i18n/index.svelte";

  const links = [
    { href: "/words", labelKey: "nav_words" as const },
    { href: "/review", labelKey: "nav_review" as const },
    { href: "/stats", labelKey: "nav_stats" as const },
  ];
</script>

<header class="sticky top-0 z-50 bg-primary border-b border-default">
  <div class="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
    <div class="flex items-center gap-8">
      <a href="/" class="text-lg font-semibold text-accent"> CC Plus </a>
      <nav class="hidden sm:flex items-center gap-1">
        {#each links as link}
          {@const isActive = $page.url.pathname === link.href}
          <a
            href={link.href}
            class="px-3 py-1.5 text-sm rounded-md transition-colors {isActive
              ? 'bg-tertiary text-primary font-medium'
              : 'text-secondary hover:text-primary hover:bg-tertiary'}"
          >
            {i18n.t(link.labelKey)}
            {#if link.href === "/review" && wordsStore.dueForReview.length > 0}
              <span
                class="ml-1 px-1.5 py-0.5 text-xs bg-accent text-white rounded-full"
              >
                {wordsStore.dueForReview.length}
              </span>
            {/if}
          </a>
        {/each}
      </nav>
    </div>

    <div class="flex items-center gap-2">
      <LocaleSelect />
      <ThemeToggle />
      <a
        href="/settings"
        class="btn btn-ghost"
        aria-label={i18n.t("nav_settings")}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
          />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </a>
    </div>
  </div>
</header>

<!-- Mobile nav -->
<nav
  class="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-primary border-t border-default"
>
  <div class="flex justify-around py-2">
    {#each links as link}
      {@const isActive = $page.url.pathname === link.href}
      <a
        href={link.href}
        class="relative flex flex-col items-center gap-1 px-4 py-2 text-xs {isActive
          ? 'text-accent'
          : 'text-secondary'}"
      >
        {#if link.href === "/words"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><path
              d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"
            /></svg
          >
        {:else if link.href === "/review"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><rect width="18" height="18" x="3" y="3" rx="2" /><path
              d="M12 8v8"
            /><path d="M8 12h8" /></svg
          >
        {:else if link.href === "/stats"}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            ><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg
          >
        {/if}
        <span>{i18n.t(link.labelKey)}</span>
        {#if link.href === "/review" && wordsStore.dueForReview.length > 0}
          <span
            class="absolute -top-1 -right-1 px-1.5 text-xs bg-accent text-white rounded-full"
          >
            {wordsStore.dueForReview.length}
          </span>
        {/if}
      </a>
    {/each}
  </div>
</nav>
