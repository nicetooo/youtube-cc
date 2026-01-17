<script lang="ts">
  import { i18n, type Locale } from "$lib/i18n/index.svelte";

  let open = $state(false);

  function handleSelect(locale: Locale) {
    i18n.setLocale(locale);
    open = false;
  }

  function handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest(".locale-select")) {
      open = false;
    }
  }
</script>

<svelte:window onclick={handleClickOutside} />

<div class="locale-select">
  <button
    class="locale-button"
    onclick={() => (open = !open)}
    aria-expanded={open}
    aria-haspopup="listbox"
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
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      />
    </svg>
    <span class="locale-name hidden sm:inline"
      >{i18n.localeNames[i18n.locale]}</span
    >
    <svg
      class="chevron hidden sm:block"
      class:rotated={open}
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  </button>

  {#if open}
    <ul class="locale-dropdown" role="listbox">
      {#each i18n.locales as locale}
        <li role="option" aria-selected={locale === i18n.locale}>
          <button
            class="locale-option"
            class:active={locale === i18n.locale}
            onclick={() => handleSelect(locale)}
          >
            {i18n.localeNames[locale]}
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .locale-select {
    position: relative;
  }

  .locale-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    background: transparent;
    border: none;
    border-radius: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  @media (min-width: 640px) {
    .locale-button {
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--border);
    }
  }

  .locale-button:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }

  .chevron {
    transition: transform 0.15s ease;
  }

  .chevron.rotated {
    transform: rotate(180deg);
  }

  .locale-dropdown {
    position: absolute;
    top: calc(100% + 0.25rem);
    right: 0;
    min-width: 10rem;
    padding: 0.25rem;
    margin: 0;
    list-style: none;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 100;
  }

  .locale-option {
    display: block;
    width: 100%;
    padding: 0.5rem 0.75rem;
    background: transparent;
    border: none;
    border-radius: 0.375rem;
    color: var(--text-secondary);
    font-size: 0.875rem;
    text-align: left;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .locale-option:hover {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }

  .locale-option.active {
    background: var(--accent);
    color: #fff;
  }
</style>
