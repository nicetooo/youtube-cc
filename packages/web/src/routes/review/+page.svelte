<script lang="ts">
  import { goto } from "$app/navigation";
  import { wordsStore } from "$lib/stores/words.svelte";
  import { getIntervalPreview } from "$lib/sm2/algorithm";
  import { i18n } from "$lib/i18n/index.svelte";
  import type { SimpleRating } from "@aspect/shared/types";

  let currentIndex = $state(0);
  let showAnswer = $state(false);
  let sessionComplete = $state(false);
  let reviewedCount = $state(0);

  // Get words due for review
  const dueWords = $derived(wordsStore.dueForReview);
  const currentWord = $derived(dueWords[currentIndex]);
  const intervalPreview = $derived(
    currentWord ? getIntervalPreview(currentWord) : null
  );

  function handleRating(rating: SimpleRating) {
    if (!currentWord) return;

    wordsStore.reviewWord(currentWord.id, rating);
    reviewedCount++;
    showAnswer = false;

    // Check if session is complete
    if (currentIndex >= dueWords.length - 1) {
      sessionComplete = true;
    } else {
      currentIndex++;
    }
  }

  function startNewSession() {
    currentIndex = 0;
    showAnswer = false;
    sessionComplete = false;
    reviewedCount = 0;
  }

  // Keyboard shortcuts
  function handleKeydown(e: KeyboardEvent) {
    if (sessionComplete) return;

    if (!showAnswer) {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        showAnswer = true;
      }
    } else {
      switch (e.key) {
        case "1":
          handleRating("again");
          break;
        case "2":
          handleRating("hard");
          break;
        case "3":
          handleRating("good");
          break;
        case "4":
          handleRating("easy");
          break;
      }
    }
  }
</script>

<svelte:head>
  <title>{i18n.t("review_title")} - CC Plus</title>
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

<div class="max-w-xl mx-auto px-4 py-6">
  <!-- Header -->
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-2xl font-bold">{i18n.t("review_title")}</h1>
    {#if dueWords.length > 0 && !sessionComplete}
      <span class="text-sm text-secondary">
        {currentIndex + 1} / {dueWords.length}
      </span>
    {/if}
  </div>

  {#if dueWords.length === 0}
    <!-- No words to review -->
    <div class="text-center py-16">
      <div
        class="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--success)]/10 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--success)"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          ><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline
            points="22 4 12 14.01 9 11.01"
          /></svg
        >
      </div>
      <p class="text-xl font-medium mb-2">{i18n.t("review_no_cards")}</p>
      <p class="text-secondary mb-6">{i18n.t("review_no_cards_hint")}</p>
      <a href="/words" class="btn btn-primary">{i18n.t("nav_words")}</a>
    </div>
  {:else if sessionComplete}
    <!-- Session complete -->
    <div class="text-center py-16">
      <div
        class="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--success)]/10 flex items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--success)"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          ><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline
            points="22 4 12 14.01 9 11.01"
          /></svg
        >
      </div>
      <p class="text-xl font-medium mb-2">{i18n.t("review_complete")}</p>
      <p class="text-secondary mb-6">
        {i18n.t("review_complete_message", { count: reviewedCount })}
      </p>
      <div class="flex gap-3 justify-center">
        <a href="/words" class="btn btn-secondary">{i18n.t("nav_words")}</a>
        {#if wordsStore.dueForReview.length > 0}
          <button onclick={startNewSession} class="btn btn-primary">
            {i18n.t("review_start")} ({wordsStore.dueForReview.length})
          </button>
        {/if}
      </div>
    </div>
  {:else if currentWord}
    <!-- Flash card -->
    <div class="card p-6 sm:p-8">
      <!-- Progress bar -->
      <div class="h-1 bg-tertiary rounded-full mb-6 overflow-hidden">
        <div
          class="h-full bg-accent transition-all duration-300"
          style="width: {((currentIndex + 1) / dueWords.length) * 100}%"
        ></div>
      </div>

      <!-- Word -->
      <div class="text-center mb-6">
        <h2 class="text-3xl sm:text-4xl font-bold mb-4">{currentWord.text}</h2>
        <p class="text-secondary">"{currentWord.context}"</p>
      </div>

      {#if showAnswer}
        <!-- Answer -->
        <div class="text-center mb-8 animate-fade-in">
          <div
            class="inline-block px-4 py-2 rounded-lg bg-accent/10 text-accent text-xl font-medium mb-4"
          >
            {currentWord.translation || "No translation"}
          </div>

          {#if currentWord.examples && currentWord.examples.length > 0}
            <div class="mt-4 text-left">
              <p class="text-xs text-tertiary mb-2">Examples:</p>
              {#each currentWord.examples.slice(0, 2) as example}
                <p class="text-sm text-secondary mb-1">• {example}</p>
              {/each}
            </div>
          {/if}
        </div>

        <!-- Rating buttons -->
        <div class="grid grid-cols-4 gap-2">
          <button
            onclick={() => handleRating("again")}
            class="flex flex-col items-center gap-1 p-3 rounded-lg bg-[var(--error)]/10 hover:bg-[var(--error)]/20 transition-colors"
          >
            <span class="text-sm font-medium text-[var(--error)]"
              >{i18n.t("review_again")}</span
            >
            <span class="text-xs text-tertiary">{intervalPreview?.again}</span>
          </button>
          <button
            onclick={() => handleRating("hard")}
            class="flex flex-col items-center gap-1 p-3 rounded-lg bg-[var(--warning)]/10 hover:bg-[var(--warning)]/20 transition-colors"
          >
            <span class="text-sm font-medium text-[var(--warning)]"
              >{i18n.t("review_hard")}</span
            >
            <span class="text-xs text-tertiary">{intervalPreview?.hard}</span>
          </button>
          <button
            onclick={() => handleRating("good")}
            class="flex flex-col items-center gap-1 p-3 rounded-lg bg-[var(--success)]/10 hover:bg-[var(--success)]/20 transition-colors"
          >
            <span class="text-sm font-medium text-[var(--success)]"
              >{i18n.t("review_good")}</span
            >
            <span class="text-xs text-tertiary">{intervalPreview?.good}</span>
          </button>
          <button
            onclick={() => handleRating("easy")}
            class="flex flex-col items-center gap-1 p-3 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors"
          >
            <span class="text-sm font-medium text-accent"
              >{i18n.t("review_easy")}</span
            >
            <span class="text-xs text-tertiary">{intervalPreview?.easy}</span>
          </button>
        </div>

        <p class="text-center text-xs text-tertiary mt-4">
          Keyboard: 1-4 to rate
        </p>
      {:else}
        <!-- Show answer button -->
        <div class="text-center">
          <button
            onclick={() => (showAnswer = true)}
            class="btn btn-primary px-8 py-3"
          >
            {i18n.t("review_show_answer")}
          </button>
          <p class="text-xs text-tertiary mt-3">Space / Enter</p>
        </div>
      {/if}
    </div>

    <!-- Video link -->
    <div class="mt-4 text-center">
      <a
        href="https://www.youtube.com/watch?v={currentWord.videoId}&t={Math.floor(
          currentWord.timestamp
        )}s"
        target="_blank"
        rel="noopener noreferrer"
        class="text-sm text-tertiary hover:text-secondary transition-colors inline-flex items-center gap-1"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"><polygon points="6 3 20 12 6 21 6 3" /></svg
        >
        Watch in video
      </a>
    </div>
  {/if}
</div>
