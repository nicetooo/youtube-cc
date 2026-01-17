<script lang="ts">
  import { goto } from "$app/navigation";
  import ThemeToggle from "$lib/components/ThemeToggle.svelte";
  import LocaleSelect from "$lib/components/LocaleSelect.svelte";
  import { authStore } from "$lib/stores/auth.svelte";
  import { i18n } from "$lib/i18n/index.svelte";

  function handleSignIn() {
    authStore.login();
    goto("/words");
  }
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
  <header class="px-6 py-4">
    <div class="max-w-5xl mx-auto flex items-center justify-between">
      <span class="text-lg font-semibold text-accent">CC Plus</span>
      <div class="flex items-center gap-2">
        <LocaleSelect />
        <ThemeToggle />
      </div>
    </div>
  </header>

  <!-- Hero -->
  <main class="flex-1 flex items-center justify-center px-6">
    <div class="max-w-2xl text-center">
      <h1 class="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
        {i18n.t("home_title")}
      </h1>
      <p class="text-lg text-secondary mb-10 max-w-md mx-auto">
        {i18n.t("home_subtitle")}
      </p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button class="btn btn-primary px-6 py-3"
          >{i18n.t("home_get_extension")}</button
        >
        <button onclick={handleSignIn} class="btn btn-secondary px-6 py-3">
          {i18n.t("home_view_words")}
        </button>
      </div>
    </div>
  </main>

  <!-- Features -->
  <section class="px-6 py-16 border-t border-default">
    <div class="max-w-3xl mx-auto grid sm:grid-cols-3 gap-8">
      <div>
        <div
          class="w-10 h-10 rounded-lg bg-tertiary flex items-center justify-center mb-3"
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
          class="w-10 h-10 rounded-lg bg-tertiary flex items-center justify-center mb-3"
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
          class="w-10 h-10 rounded-lg bg-tertiary flex items-center justify-center mb-3"
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
  </section>

  <!-- Footer -->
  <footer class="px-6 py-6 text-center text-sm text-tertiary">
    <p>youtubecc.com</p>
  </footer>
</div>
