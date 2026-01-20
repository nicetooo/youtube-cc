<script lang="ts">
  import { wordsStore } from "$lib/stores/words.svelte";
  import WordCard from "$lib/components/WordCard.svelte";
  import { i18n } from "$lib/i18n/index.svelte";
  import { getExtensionSyncState } from "$lib/stores/extension-sync.svelte";

  // Debug: log words store state
  const syncState = getExtensionSyncState();
  $effect(() => {
    console.log("[WordsPage] words count:", wordsStore.words.length);
    console.log("[WordsPage] filtered count:", wordsStore.filtered.length);
    console.log("[WordsPage] loading:", wordsStore.loading);
    console.log("[WordsPage] extension detected:", syncState.extensionDetected);
    console.log("[WordsPage] extension sync result:", syncState.lastSyncResult);
  });

  // Debounced search
  let searchInput = $state("");
  let searchTimeout: ReturnType<typeof setTimeout>;

  function handleSearch(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    searchInput = value;
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      wordsStore.setSearch(value);
    }, 300);
  }

  function handleVideoFilter(e: Event) {
    const value = (e.target as HTMLSelectElement).value;
    wordsStore.setVideoFilter(value || null);
  }

  function handleDelete(id: string) {
    if (confirm("Delete this word?")) {
      wordsStore.deleteWord(id);
    }
  }
</script>

<svelte:head>
  <title>{i18n.t("words_title")} - CC Plus</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-6">
  <!-- Header -->
  <div class="flex items-center justify-between mb-6">
    <div>
      <h1 class="text-2xl font-bold">{i18n.t("words_title")}</h1>
      <p class="text-sm text-secondary mt-1">
        {i18n.t("words_count", { count: wordsStore.stats.total })}
      </p>
    </div>
  </div>

  <!-- Filters -->
  <div class="flex flex-col sm:flex-row gap-3 mb-6">
    <div class="flex-1">
      <input
        type="text"
        class="input"
        placeholder={i18n.t("words_search_placeholder")}
        value={searchInput}
        oninput={handleSearch}
      />
    </div>
    <select class="input sm:w-48" onchange={handleVideoFilter}>
      <option value="">{i18n.t("words_filter_all")}</option>
      {#each wordsStore.videos as video}
        <option value={video.id}>
          {video.title} ({video.wordCount})
        </option>
      {/each}
    </select>
  </div>

  <!-- Stats bar -->
  <div class="flex gap-4 mb-6 text-sm">
    <div class="flex items-center gap-2">
      <span class="badge badge-new">{i18n.t("words_filter_new")}</span>
      <span class="text-secondary">{wordsStore.stats.new}</span>
    </div>
    <div class="flex items-center gap-2">
      <span class="badge badge-learning">{i18n.t("words_filter_learning")}</span
      >
      <span class="text-secondary">{wordsStore.stats.learning}</span>
    </div>
    <div class="flex items-center gap-2">
      <span class="badge badge-mastered">{i18n.t("words_filter_mastered")}</span
      >
      <span class="text-secondary">{wordsStore.stats.mastered}</span>
    </div>
  </div>

  <!-- Word list -->
  {#if wordsStore.filtered.length === 0}
    <div class="text-center py-16">
      <div
        class="w-16 h-16 mx-auto mb-4 rounded-full bg-tertiary flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-tertiary"
          ><path
            d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"
          /></svg
        >
      </div>
      {#if wordsStore.searchQuery || wordsStore.selectedVideoId}
        <p class="text-secondary mb-2">{i18n.t("words_empty")}</p>
        <button
          class="btn btn-ghost"
          onclick={() => {
            searchInput = "";
            wordsStore.setSearch("");
            wordsStore.setVideoFilter(null);
          }}
        >
          {i18n.t("words_filter_all")}
        </button>
      {:else}
        <p class="text-secondary mb-2">{i18n.t("words_empty")}</p>
        <p class="text-sm text-tertiary">
          {i18n.t("words_empty_hint")}
        </p>
      {/if}
    </div>
  {:else}
    <div class="space-y-3">
      {#each wordsStore.filtered as word (word.id)}
        <WordCard {word} onDelete={handleDelete} />
      {/each}
    </div>
  {/if}
</div>
