<script lang="ts">
  import ThemeToggle from "$lib/components/ThemeToggle.svelte";
  import LocaleSelect from "$lib/components/LocaleSelect.svelte";
  import { i18n } from "$lib/i18n/index.svelte";
</script>

<svelte:head>
  <title>CC Plus - Learn Languages with YouTube</title>
  <meta
    name="description"
    content="Save vocabulary from YouTube videos, review with spaced repetition, master languages."
  />
</svelte:head>

<div class="min-h-screen flex flex-col">
  <!-- Header -->
  <header class="px-6 lg:px-12 py-4">
    <div class="flex items-center justify-between">
      <span class="text-lg font-semibold text-accent">CC Plus</span>
      <div class="flex items-center gap-2">
        <LocaleSelect />
        <ThemeToggle />
      </div>
    </div>
  </header>

  <!-- Main Content - Centered -->
  <main class="flex-1 flex items-center justify-center px-6 py-12">
    <div class="max-w-5xl w-full">
      <!-- Hero -->
      <div class="text-center mb-16">
        <h1
          class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 whitespace-nowrap"
        >
          {i18n.t("home_title")}
        </h1>
        <p class="text-lg sm:text-xl text-secondary mb-10">
          {i18n.t("home_subtitle")}
        </p>
        <div class="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://chromewebstore.google.com/detail/cc-plus/gagahifolmmnnppdoohdbkibammhkpeb"
            target="_blank"
            rel="noopener"
            class="btn btn-primary px-6 py-3"
          >
            {i18n.t("home_get_cc_plus")}
          </a>
          <a
            href="https://chromewebstore.google.com/detail/cc-words/cpkcognabaapedhhcjbidpojofmnmgpb"
            target="_blank"
            rel="noopener"
            class="btn btn-primary px-6 py-3 !bg-emerald-600 hover:!bg-emerald-700"
          >
            {i18n.t("home_get_cc_words")}
          </a>
          <a href="/words" class="btn btn-secondary px-6 py-3">
            {i18n.t("home_view_words")}
          </a>
        </div>
      </div>

      <!-- Features -->
      <div
        class="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center max-w-5xl mx-auto"
      >
        <!-- Interactive Captions -->
        <div
          class="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
        >
          <div
            class="w-10 h-10 mx-auto rounded-lg bg-tertiary flex items-center justify-center mb-3"
          >
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
              class="text-accent"
            >
              <rect width="18" height="14" x="3" y="5" rx="2" ry="2" /><path
                d="M7 15h4M15 15h2M7 11h2M13 11h4"
              />
            </svg>
          </div>
          <h3 class="font-medium text-sm mb-1">
            {i18n.t("home_feature_captions")}
          </h3>
          <p class="text-xs text-secondary">
            {i18n.t("home_feature_captions_desc")}
          </p>
        </div>

        <!-- Word Selection -->
        <div
          class="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
        >
          <div
            class="w-10 h-10 mx-auto rounded-lg bg-tertiary flex items-center justify-center mb-3"
          >
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
              class="text-emerald-500"
            >
              <path d="m18 16 4-4-4-4" /><path d="m6 8-4 4 4 4" /><path
                d="m14.5 4-5 16"
              />
            </svg>
          </div>
          <h3 class="font-medium text-sm mb-1">
            {i18n.t("home_feature_word_selection")}
          </h3>
          <p class="text-xs text-secondary">
            {i18n.t("home_feature_word_selection_desc")}
          </p>
        </div>

        <!-- Smart Review -->
        <div
          class="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
        >
          <div
            class="w-10 h-10 mx-auto rounded-lg bg-tertiary flex items-center justify-center mb-3"
          >
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
              class="text-violet-500"
            >
              <path
                d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
              /><path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <h3 class="font-medium text-sm mb-1">
            {i18n.t("home_feature_review")}
          </h3>
          <p class="text-xs text-secondary">
            {i18n.t("home_feature_review_desc")}
          </p>
        </div>

        <!-- Cloud Sync -->
        <div
          class="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
        >
          <div
            class="w-10 h-10 mx-auto rounded-lg bg-tertiary flex items-center justify-center mb-3"
          >
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
              class="text-sky-500"
            >
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
            </svg>
          </div>
          <h3 class="font-medium text-sm mb-1">
            {i18n.t("home_feature_sync")}
          </h3>
          <p class="text-xs text-secondary">
            {i18n.t("home_feature_sync_desc")}
          </p>
        </div>

        <!-- Wide Screen -->
        <div
          class="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
        >
          <div
            class="w-10 h-10 mx-auto rounded-lg bg-tertiary flex items-center justify-center mb-3"
          >
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
              class="text-orange-500"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" /><path
                d="m2 10 20 0"
              />
            </svg>
          </div>
          <h3 class="font-medium text-sm mb-1">
            {i18n.t("home_feature_wide_screen")}
          </h3>
          <p class="text-xs text-secondary">
            {i18n.t("home_feature_wide_screen_desc")}
          </p>
        </div>

        <!-- Clean Interface -->
        <div
          class="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
        >
          <div
            class="w-10 h-10 mx-auto rounded-lg bg-tertiary flex items-center justify-center mb-3"
          >
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
              class="text-pink-500"
            >
              <path d="M3 6h18" /><path
                d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"
              /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
          </div>
          <h3 class="font-medium text-sm mb-1">
            {i18n.t("home_feature_clean")}
          </h3>
          <p class="text-xs text-secondary">
            {i18n.t("home_feature_clean_desc")}
          </p>
        </div>

        <!-- Side Comments -->
        <div
          class="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
        >
          <div
            class="w-10 h-10 mx-auto rounded-lg bg-tertiary flex items-center justify-center mb-3"
          >
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
              class="text-cyan-500"
            >
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
              />
            </svg>
          </div>
          <h3 class="font-medium text-sm mb-1">
            {i18n.t("home_feature_side_comments")}
          </h3>
          <p class="text-xs text-secondary">
            {i18n.t("home_feature_side_comments_desc")}
          </p>
        </div>

        <!-- Comment Search -->
        <div
          class="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
        >
          <div
            class="w-10 h-10 mx-auto rounded-lg bg-tertiary flex items-center justify-center mb-3"
          >
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
              class="text-amber-500"
            >
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <h3 class="font-medium text-sm mb-1">
            {i18n.t("home_feature_comment_search")}
          </h3>
          <p class="text-xs text-secondary">
            {i18n.t("home_feature_comment_search_desc")}
          </p>
        </div>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="px-6 py-6 text-center text-sm text-tertiary">
    <p>youtube-cc.com</p>
  </footer>
</div>
