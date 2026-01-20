<script lang="ts">
  import type { Word } from "@aspect/shared/types";
  import { speak } from "$lib/utils/speak";
  import { fetchWordExamples } from "$lib/utils/dictionary";
  import { wordsStore } from "$lib/stores/words.svelte";

  interface Props {
    word: Word;
    onDelete?: (id: string) => void;
  }

  let { word, onDelete }: Props = $props();

  function handleSpeak() {
    // Default to English for word pronunciation
    speak(word.text, "en");
  }

  let expanded = $state(false);
  let fetchingExamples = $state(false);
  let fetchError = $state("");

  // Local examples state - initialized from word.examples, updated after fetch
  let examples = $state<string[]>(word.examples ?? []);

  // Debug: log when component initializes
  console.log(`[WordCard] ${word.text} initialized, examples:`, word.examples);

  async function handleFetchExamples() {
    if (fetchingExamples) return;

    fetchingExamples = true;
    fetchError = "";

    try {
      const fetchedExamples = await fetchWordExamples(word.text);
      if (fetchedExamples.length > 0) {
        examples = fetchedExamples;
        // Persist to store (IndexedDB + Firebase)
        console.log(
          `[WordCard] Saving examples for ${word.text}:`,
          fetchedExamples
        );
        await wordsStore.updateWord(word.id, { examples: fetchedExamples });
        console.log(`[WordCard] Examples saved for ${word.text}`);
      } else {
        fetchError = "No examples found";
      }
    } catch (e) {
      console.error("[WordCard] Failed to fetch examples:", e);
      fetchError = "Failed to fetch";
    } finally {
      fetchingExamples = false;
    }
  }

  // Check source type
  const isYouTube = $derived(word.source?.type === "youtube-caption");
  const isWebpage = $derived(word.source?.type === "webpage");

  function formatTimestamp(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function getSourceLink(): string | null {
    if (!word.source) return null;

    if (word.source.type === "youtube-caption") {
      const { videoId, timestamp } = word.source;
      return `https://www.youtube.com/watch?v=${videoId}&t=${Math.floor(timestamp)}s`;
    } else if (word.source.type === "webpage") {
      return word.source.url;
    }
    return null;
  }

  function getSourceTitle(): string {
    if (!word.source) return "Unknown source";

    if (word.source.type === "youtube-caption") {
      return word.source.videoTitle || "YouTube Video";
    } else if (word.source.type === "webpage") {
      // Show page title or extract host from URL
      if (word.source.pageTitle) return word.source.pageTitle;
      try {
        const url = new URL(word.source.url);
        return url.hostname;
      } catch {
        return "Webpage";
      }
    }
    return "Unknown source";
  }

  function getSourceIcon(): "youtube" | "webpage" {
    return isYouTube ? "youtube" : "webpage";
  }

  function getStatusBadgeClass(status: Word["status"]): string {
    switch (status) {
      case "new":
        return "badge-new";
      case "learning":
        return "badge-learning";
      case "mastered":
        return "badge-mastered";
    }
  }

  function formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
  }
</script>

<div class="card hover:border-[var(--accent)] transition-colors group">
  <!-- Header: Word + Status + Actions -->
  <div class="flex items-center gap-2 mb-2">
    <button
      onclick={() => (expanded = !expanded)}
      class="text-lg font-semibold hover:text-accent transition-colors text-left"
    >
      {word.text}
    </button>
    <!-- Speak button -->
    <button
      onclick={handleSpeak}
      class="p-1 rounded hover:bg-tertiary transition-colors text-secondary hover:text-accent"
      title="Pronounce"
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
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
    </button>
    <span class="badge {getStatusBadgeClass(word.status)}">
      {word.status}
    </span>

    <!-- Actions -->
    <div
      class="ml-auto flex items-center shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
    >
      {#if getSourceLink()}
        <a
          href={getSourceLink()}
          target="_blank"
          rel="noopener noreferrer"
          class="p-1.5 rounded hover:bg-tertiary transition-colors"
          title={isYouTube && word.source?.type === "youtube-caption"
            ? `Watch at ${formatTimestamp(word.source.timestamp)}`
            : "Open source page"}
        >
          {#if isYouTube}
            <!-- Play icon for YouTube -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"><polygon points="6 3 20 12 6 21 6 3" /></svg
            >
          {:else}
            <!-- External link icon for webpage -->
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
              <path
                d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
              />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          {/if}
        </a>
      {/if}
      {#if onDelete}
        <button
          onclick={() => onDelete?.(word.id)}
          class="p-1.5 rounded hover:bg-tertiary hover:text-[var(--error)] transition-colors"
          title="Delete"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            ><path d="M3 6h18" /><path
              d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"
            /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg
          >
        </button>
      {/if}
    </div>
  </div>

  <!-- Context -->
  <p class="text-sm text-secondary line-clamp-2 mb-2">"{word.context}"</p>

  <!-- Meta -->
  <div class="text-xs text-tertiary flex items-center gap-1">
    {#if isYouTube}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="text-red-500 shrink-0"
      >
        <path
          d="M23.5 6.2c-.3-1-1-1.8-2-2.1C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.5.5c-1 .3-1.7 1.1-2 2.1-.5 1.9-.5 5.8-.5 5.8s0 3.9.5 5.8c.3 1 1 1.8 2 2.1 1.9.5 9.5.5 9.5.5s7.6 0 9.5-.5c1-.3 1.7-1.1 2-2.1.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.7zM9.5 15.5v-7l6.5 3.5-6.5 3.5z"
        />
      </svg>
    {:else}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        class="shrink-0"
      >
        <circle cx="12" cy="12" r="10" /><line
          x1="2"
          y1="12"
          x2="22"
          y2="12"
        /><path
          d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
        />
      </svg>
    {/if}
    <span
      class="truncate inline-block max-w-[180px] sm:max-w-[250px] align-bottom"
      title={getSourceTitle()}
    >
      {getSourceTitle()}
    </span>
    <span class="mx-1">·</span>
    <span>{formatDate(word.createdAt)}</span>
  </div>

  <!-- Expanded content -->
  {#if expanded}
    <div class="mt-4 pt-4 border-t border-default animate-fade-in">
      {#if word.translation}
        <div class="mb-3">
          <div class="text-xs text-tertiary mb-1">Translation</div>
          <div class="text-accent">{word.translation}</div>
        </div>
      {/if}

      {#if examples.length > 0}
        <div>
          <div class="text-xs text-tertiary mb-2">Example sentences</div>
          <ul class="space-y-1">
            {#each examples as example}
              <li class="text-sm text-secondary">• {example}</li>
            {/each}
          </ul>
        </div>
      {:else}
        <div class="flex items-center gap-2">
          <button
            class="btn btn-ghost text-sm"
            onclick={handleFetchExamples}
            disabled={fetchingExamples}
          >
            {#if fetchingExamples}
              <svg
                class="animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Fetching...
            {:else}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"
                />
              </svg>
              Fetch examples
            {/if}
          </button>
          {#if fetchError}
            <span class="text-xs text-[var(--error)]">{fetchError}</span>
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</div>
