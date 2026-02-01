<script lang="ts">
  import { i18n } from "$lib/i18n/index.svelte";
</script>

<svelte:head>
  <title>{i18n.t("terms_title")} - CC Words</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-12">
  <!-- Header -->
  <div class="text-center mb-12">
    <div
      class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-secondary mb-4"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        class="text-accent"
      >
        <path
          d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
        /><polyline points="14 2 14 8 20 8" /><line
          x1="16"
          y1="13"
          x2="8"
          y2="13"
        /><line x1="16" y1="17" x2="8" y2="17" /><polyline
          points="10 9 9 9 8 9"
        />
      </svg>
    </div>
    <h1 class="text-3xl font-bold mb-2">{i18n.t("terms_title")}</h1>
    <p class="text-tertiary">{i18n.t("terms_updated")}</p>
  </div>

  <!-- Content -->
  <div class="space-y-6">
    <!-- Acceptance -->
    <div class="card">
      <h2 class="flex items-center gap-3 text-lg font-semibold mb-4">
        <span
          class="flex items-center justify-center w-8 h-8 rounded-lg bg-tertiary text-sm"
          >1</span
        >
        {i18n.t("terms_accept_title")}
      </h2>
      <p class="text-secondary leading-relaxed">
        {i18n.t("terms_accept_text")}
      </p>
    </div>

    <!-- Description -->
    <div class="card">
      <h2 class="flex items-center gap-3 text-lg font-semibold mb-4">
        <span
          class="flex items-center justify-center w-8 h-8 rounded-lg bg-tertiary text-sm"
          >2</span
        >
        {i18n.t("terms_service_title")}
      </h2>
      <p class="text-secondary leading-relaxed">
        {i18n.t("terms_service_text")}
      </p>
    </div>

    <!-- User Responsibilities -->
    <div class="card">
      <h2 class="flex items-center gap-3 text-lg font-semibold mb-4">
        <span
          class="flex items-center justify-center w-8 h-8 rounded-lg bg-tertiary text-sm"
          >3</span
        >
        {i18n.t("terms_responsibility_title")}
      </h2>
      <div class="space-y-3">
        <div class="flex items-center gap-3">
          <div
            class="w-6 h-6 rounded-full bg-tertiary flex items-center justify-center shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"><polyline points="20 6 9 17 4 12" /></svg
            >
          </div>
          <span class="text-secondary">{i18n.t("terms_responsibility_1")}</span>
        </div>
        <div class="flex items-center gap-3">
          <div
            class="w-6 h-6 rounded-full bg-tertiary flex items-center justify-center shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"><polyline points="20 6 9 17 4 12" /></svg
            >
          </div>
          <span class="text-secondary">{i18n.t("terms_responsibility_2")}</span>
        </div>
        <div class="flex items-center gap-3">
          <div
            class="w-6 h-6 rounded-full bg-tertiary flex items-center justify-center shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"><polyline points="20 6 9 17 4 12" /></svg
            >
          </div>
          <span class="text-secondary">{i18n.t("terms_responsibility_3")}</span>
        </div>
      </div>
    </div>

    <!-- Intellectual Property -->
    <div class="card">
      <h2 class="flex items-center gap-3 text-lg font-semibold mb-4">
        <span
          class="flex items-center justify-center w-8 h-8 rounded-lg bg-tertiary text-sm"
          >4</span
        >
        {i18n.t("terms_ip_title")}
      </h2>
      <p class="text-secondary leading-relaxed">
        {i18n.t("terms_ip_text")}
      </p>
    </div>

    <!-- Your Data -->
    <div class="card">
      <h2 class="flex items-center gap-3 text-lg font-semibold mb-4">
        <span
          class="flex items-center justify-center w-8 h-8 rounded-lg bg-tertiary text-sm"
          >5</span
        >
        {i18n.t("terms_data_title")}
      </h2>
      <p class="text-secondary leading-relaxed">
        {i18n.t("terms_data_text")}
        <a href="/privacy" class="text-accent hover:underline ml-1">
          {i18n.t("privacy_title")} &rarr;
        </a>
      </p>
    </div>

    <!-- Disclaimer -->
    <div class="card border-yellow-500/30 bg-yellow-500/5">
      <h2 class="flex items-center gap-3 text-lg font-semibold mb-4">
        <span
          class="flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-500/20 text-yellow-500 text-sm"
          >!</span
        >
        {i18n.t("terms_disclaimer_title")}
      </h2>
      <p class="text-secondary leading-relaxed">
        {i18n.t("terms_disclaimer_text")}
      </p>
    </div>

    <!-- Liability -->
    <div class="card">
      <h2 class="flex items-center gap-3 text-lg font-semibold mb-4">
        <span
          class="flex items-center justify-center w-8 h-8 rounded-lg bg-tertiary text-sm"
          >6</span
        >
        {i18n.t("terms_liability_title")}
      </h2>
      <p class="text-secondary leading-relaxed">
        {i18n.t("terms_liability_text")}
      </p>
    </div>

    <!-- Termination -->
    <div class="card">
      <h2 class="flex items-center gap-3 text-lg font-semibold mb-4">
        <span
          class="flex items-center justify-center w-8 h-8 rounded-lg bg-tertiary text-sm"
          >7</span
        >
        {i18n.t("terms_termination_title")}
      </h2>
      <p class="text-secondary leading-relaxed">
        {i18n.t("terms_termination_text")}
      </p>
    </div>

    <!-- Changes -->
    <div class="card">
      <h2 class="flex items-center gap-3 text-lg font-semibold mb-4">
        <span
          class="flex items-center justify-center w-8 h-8 rounded-lg bg-tertiary text-sm"
          >8</span
        >
        {i18n.t("terms_changes_title")}
      </h2>
      <p class="text-secondary leading-relaxed">
        {i18n.t("terms_changes_text")}
      </p>
    </div>
  </div>

  <!-- Back link -->
  <div class="mt-8 text-center">
    <a
      href="/settings"
      class="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        ><line x1="19" y1="12" x2="5" y2="12" /><polyline
          points="12 19 5 12 12 5"
        /></svg
      >
      {i18n.t("terms_back")}
    </a>
  </div>
</div>
