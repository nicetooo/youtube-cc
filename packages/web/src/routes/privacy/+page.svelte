<script lang="ts">
  import { i18n } from "$lib/i18n/index.svelte";
</script>

<svelte:head>
  <title>{i18n.t("privacy_title")} - CC Words</title>
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
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    </div>
    <h1 class="text-3xl font-bold mb-2">{i18n.t("privacy_title")}</h1>
    <p class="text-tertiary">{i18n.t("privacy_updated")}</p>
  </div>

  <!-- Content -->
  <div class="space-y-6">
    <!-- Introduction -->
    <div class="card">
      <h2 class="flex items-center gap-3 text-lg font-semibold mb-4">
        <span
          class="flex items-center justify-center w-8 h-8 rounded-lg bg-tertiary text-sm"
          >1</span
        >
        {i18n.t("privacy_intro_title")}
      </h2>
      <p class="text-secondary leading-relaxed">
        {i18n.t("privacy_intro_text")}
      </p>
    </div>

    <!-- Data Collection -->
    <div class="card">
      <h2 class="flex items-center gap-3 text-lg font-semibold mb-4">
        <span
          class="flex items-center justify-center w-8 h-8 rounded-lg bg-tertiary text-sm"
          >2</span
        >
        {i18n.t("privacy_collect_title")}
      </h2>
      <div class="space-y-4">
        <div class="flex gap-3">
          <div class="w-2 h-2 rounded-full bg-accent mt-2 shrink-0"></div>
          <div>
            <p class="font-medium">{i18n.t("privacy_collect_vocab")}</p>
            <p class="text-secondary text-sm">
              {i18n.t("privacy_collect_vocab_desc")}
            </p>
          </div>
        </div>
        <div class="flex gap-3">
          <div class="w-2 h-2 rounded-full bg-accent mt-2 shrink-0"></div>
          <div>
            <p class="font-medium">{i18n.t("privacy_collect_account")}</p>
            <p class="text-secondary text-sm">
              {i18n.t("privacy_collect_account_desc")}
            </p>
          </div>
        </div>
        <div class="flex gap-3">
          <div class="w-2 h-2 rounded-full bg-accent mt-2 shrink-0"></div>
          <div>
            <p class="font-medium">{i18n.t("privacy_collect_analytics")}</p>
            <p class="text-secondary text-sm">
              {i18n.t("privacy_collect_analytics_desc")}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Data Storage -->
    <div class="card">
      <h2 class="flex items-center gap-3 text-lg font-semibold mb-4">
        <span
          class="flex items-center justify-center w-8 h-8 rounded-lg bg-tertiary text-sm"
          >3</span
        >
        {i18n.t("privacy_storage_title")}
      </h2>
      <div class="grid sm:grid-cols-2 gap-4">
        <div class="p-4 rounded-lg bg-primary border border-default">
          <div class="flex items-center gap-2 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="text-accent"
            >
              <path
                d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
              />
            </svg>
            <span class="font-medium">{i18n.t("privacy_storage_local")}</span>
          </div>
          <p class="text-secondary text-sm">
            {i18n.t("privacy_storage_local_desc")}
          </p>
        </div>
        <div class="p-4 rounded-lg bg-primary border border-default">
          <div class="flex items-center gap-2 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="text-accent"
            >
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
            </svg>
            <span class="font-medium">{i18n.t("privacy_storage_cloud")}</span>
          </div>
          <p class="text-secondary text-sm">
            {i18n.t("privacy_storage_cloud_desc")}
          </p>
        </div>
      </div>
    </div>

    <!-- Data Sharing -->
    <div class="card">
      <h2 class="flex items-center gap-3 text-lg font-semibold mb-4">
        <span
          class="flex items-center justify-center w-8 h-8 rounded-lg bg-tertiary text-sm"
          >4</span
        >
        {i18n.t("privacy_sharing_title")}
      </h2>
      <p class="text-secondary mb-4">
        {i18n.t("privacy_sharing_text")}
      </p>
      <div class="flex flex-wrap gap-2">
        <span class="px-3 py-1.5 rounded-full bg-tertiary text-sm"
          >{i18n.t("privacy_sharing_firebase")}</span
        >
        <span class="px-3 py-1.5 rounded-full bg-tertiary text-sm"
          >{i18n.t("privacy_sharing_analytics")}</span
        >
      </div>
    </div>

    <!-- Your Rights -->
    <div class="card">
      <h2 class="flex items-center gap-3 text-lg font-semibold mb-4">
        <span
          class="flex items-center justify-center w-8 h-8 rounded-lg bg-tertiary text-sm"
          >5</span
        >
        {i18n.t("privacy_rights_title")}
      </h2>
      <div class="flex flex-wrap gap-3">
        <div
          class="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 text-green-500 text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"><polyline points="20 6 9 17 4 12" /></svg
          >
          {i18n.t("privacy_rights_export")}
        </div>
        <div
          class="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 text-green-500 text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"><polyline points="20 6 9 17 4 12" /></svg
          >
          {i18n.t("privacy_rights_delete")}
        </div>
        <div
          class="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-500/10 text-green-500 text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"><polyline points="20 6 9 17 4 12" /></svg
          >
          {i18n.t("privacy_rights_no_account")}
        </div>
      </div>
    </div>

    <!-- Contact -->
    <div class="card bg-gradient-to-br from-secondary to-tertiary">
      <h2 class="flex items-center gap-3 text-lg font-semibold mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          class="text-accent"
        >
          <path
            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
          /><polyline points="22,6 12,13 2,6" />
        </svg>
        {i18n.t("privacy_contact_title")}
      </h2>
      <p class="text-secondary mb-3">{i18n.t("privacy_contact_text")}</p>
      <a
        href="mailto:nicetooo.a@gmail.com"
        class="inline-flex items-center gap-2 text-accent hover:underline font-medium"
      >
        nicetooo.a@gmail.com
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          ><line x1="7" y1="17" x2="17" y2="7" /><polyline
            points="7 7 17 7 17 17"
          /></svg
        >
      </a>
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
      {i18n.t("privacy_back")}
    </a>
  </div>
</div>
