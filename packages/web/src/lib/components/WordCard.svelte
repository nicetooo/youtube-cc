<script lang="ts">
  import type { Word } from "@aspect/shared/types";

  interface Props {
    word: Word;
    onDelete?: (id: string) => void;
  }

  let { word, onDelete }: Props = $props();

  let expanded = $state(false);

  function formatTimestamp(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  function getYouTubeLink(videoId: string, timestamp: number): string {
    return `https://www.youtube.com/watch?v=${videoId}&t=${Math.floor(timestamp)}s`;
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
    <span class="badge {getStatusBadgeClass(word.status)}">
      {word.status}
    </span>

    <!-- Actions -->
    <div
      class="ml-auto flex items-center shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
    >
      <a
        href={getYouTubeLink(word.videoId, word.timestamp)}
        target="_blank"
        rel="noopener noreferrer"
        class="p-1.5 rounded hover:bg-tertiary transition-colors"
        title="Watch at {formatTimestamp(word.timestamp)}"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"><polygon points="6 3 20 12 6 21 6 3" /></svg
        >
      </a>
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
  <div class="text-xs text-tertiary">
    <span
      class="truncate inline-block max-w-[180px] sm:max-w-[250px] align-bottom"
      title={word.videoTitle}
    >
      {word.videoTitle || "Unknown video"}
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

      {#if word.examples && word.examples.length > 0}
        <div>
          <div class="text-xs text-tertiary mb-2">Example sentences</div>
          <ul class="space-y-1">
            {#each word.examples as example}
              <li class="text-sm text-secondary">• {example}</li>
            {/each}
          </ul>
        </div>
      {:else}
        <button class="btn btn-ghost text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            ><path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            /></svg
          >
          Generate examples
        </button>
      {/if}
    </div>
  {/if}
</div>
