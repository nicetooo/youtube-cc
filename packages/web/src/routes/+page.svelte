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
            href="https://chromewebstore.google.com/detail/youtube-cc/gagahifolmmnnppdoohdbkibammhkpeb"
            target="_blank"
            rel="noopener"
            class="btn btn-primary px-6 py-3"
          >
            {i18n.t("home_get_extension")}
          </a>
          <a href="/words" class="btn btn-secondary px-6 py-3">
            {i18n.t("home_view_words")}
          </a>
        </div>
      </div>

      <!-- Features -->
      <div class="grid sm:grid-cols-3 gap-12 text-center max-w-4xl mx-auto">
        <div>
          <div
            class="w-12 h-12 mx-auto rounded-lg bg-tertiary flex items-center justify-center mb-3"
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
              class="text-accent"
              ><path
                d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"
              /></svg
            >
          </div>
          <h3 class="font-medium mb-1">{i18n.t("home_feature_captions")}</h3>
          <p class="text-sm text-secondary">
            {i18n.t("home_feature_captions_desc")}
          </p>
        </div>
        <div>
          <div
            class="w-12 h-12 mx-auto rounded-lg bg-tertiary flex items-center justify-center mb-3"
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
              class="text-accent"
              ><path
                d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
              /><path d="m9 12 2 2 4-4" /></svg
            >
          </div>
          <h3 class="font-medium mb-1">{i18n.t("home_feature_review")}</h3>
          <p class="text-sm text-secondary">
            {i18n.t("home_feature_review_desc")}
          </p>
        </div>
        <div>
          <div
            class="w-12 h-12 mx-auto rounded-lg bg-tertiary flex items-center justify-center mb-3"
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
              class="text-accent"
              ><path
                d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"
              /></svg
            >
          </div>
          <h3 class="font-medium mb-1">{i18n.t("home_feature_sync")}</h3>
          <p class="text-sm text-secondary">
            {i18n.t("home_feature_sync_desc")}
          </p>
        </div>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="px-6 py-6 text-center text-sm text-tertiary">
    <p>youtubecc.com</p>
  </footer>
</div>
