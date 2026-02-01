<script lang="ts">
  import ThemeToggle from "$lib/components/ThemeToggle.svelte";
  import LocaleSelect from "$lib/components/LocaleSelect.svelte";
  import { i18n } from "$lib/i18n/index.svelte";

  const CC_PLUS_URL =
    "https://chromewebstore.google.com/detail/cc-plus/gagahifolmmnnppdoohdbkibammhkpeb";
  const CC_WORDS_URL =
    "https://chromewebstore.google.com/detail/cc-words/cpkcognabaapedhhcjbidpojofmnmgpb";
</script>

<svelte:head>
  <title>CC Plus & CC Words - YouTube Learning Toolkit</title>
  <meta
    name="description"
    content="Two Chrome extensions that transform YouTube into a language learning platform. Interactive captions, word selection translation, spaced repetition review."
  />
</svelte:head>

<div class="min-h-screen flex flex-col">
  <!-- ====== Header ====== -->
  <header class="px-6 lg:px-12 py-4">
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      <a href="/" class="flex items-center gap-2">
        <div
          class="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-sm"
          style="background: linear-gradient(135deg, #ef4444, #f97316);"
        >
          CC
        </div>
        <span class="text-lg font-semibold" style="color: var(--text-primary);"
          >youtube-cc.com</span
        >
      </a>
      <div class="flex items-center gap-2">
        <a
          href="/words"
          class="hidden sm:inline-flex btn btn-ghost text-sm"
          style="color: var(--text-secondary);"
        >
          {i18n.t("home_open_app")}
        </a>
        <LocaleSelect />
        <ThemeToggle />
      </div>
    </div>
  </header>

  <!-- ====== Hero Section ====== -->
  <section class="px-6 pt-12 pb-16 lg:pt-20 lg:pb-24">
    <div class="max-w-5xl mx-auto text-center">
      <!-- Badge -->
      <div class="animate-fade-in-up">
        <span
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
          style="background-color: var(--bg-secondary); color: var(--text-secondary); border: 1px solid var(--border);"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon
              points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            />
          </svg>
          {i18n.t("home_hero_badge")}
        </span>
      </div>

      <!-- Title -->
      <h1
        class="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight animate-fade-in-up animate-delay-1"
        style="color: var(--text-primary);"
      >
        {i18n.t("home_title")}
      </h1>

      <!-- Subtitle -->
      <p
        class="mt-4 text-lg sm:text-xl max-w-2xl mx-auto animate-fade-in-up animate-delay-2"
        style="color: var(--text-secondary);"
      >
        {i18n.t("home_subtitle")}
      </p>
    </div>
  </section>

  <!-- ====== Two Product Cards ====== -->
  <section class="px-6 pb-20">
    <div
      class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
    >
      <!-- CC Plus Card -->
      <div class="product-card ccplus animate-fade-in-up animate-delay-2">
        <!-- Header -->
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style="background: linear-gradient(135deg, #ef4444, #f97316);"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect width="18" height="14" x="3" y="5" rx="2" ry="2" />
              <path d="M7 15h4M15 15h2M7 11h2M13 11h4" />
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-bold" style="color: var(--text-primary);">
              CC Plus
            </h2>
            <span class="text-xs font-medium text-orange-500">
              {i18n.t("home_ccplus_tag")}
            </span>
          </div>
        </div>

        <!-- Description -->
        <p
          class="text-sm mb-5 leading-relaxed"
          style="color: var(--text-secondary);"
        >
          {i18n.t("home_ccplus_desc")}
        </p>

        <!-- Features -->
        <div class="space-y-2.5 mb-6">
          <div class="landing-feature">
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style="background-color: var(--bg-tertiary);"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="text-red-500"
              >
                <rect width="18" height="14" x="3" y="5" rx="2" ry="2" />
                <path d="M7 15h4M15 15h2M7 11h2M13 11h4" />
              </svg>
            </div>
            <div>
              <div
                class="text-sm font-medium"
                style="color: var(--text-primary);"
              >
                {i18n.t("home_feature_captions")}
              </div>
              <div class="text-xs" style="color: var(--text-tertiary);">
                {i18n.t("home_feature_captions_desc")}
              </div>
            </div>
          </div>

          <div class="landing-feature">
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style="background-color: var(--bg-tertiary);"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="text-orange-500"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="m2 10 20 0" />
              </svg>
            </div>
            <div>
              <div
                class="text-sm font-medium"
                style="color: var(--text-primary);"
              >
                {i18n.t("home_feature_wide_screen")}
              </div>
              <div class="text-xs" style="color: var(--text-tertiary);">
                {i18n.t("home_feature_wide_screen_desc")}
              </div>
            </div>
          </div>

          <div class="landing-feature">
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style="background-color: var(--bg-tertiary);"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="text-pink-500"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </div>
            <div>
              <div
                class="text-sm font-medium"
                style="color: var(--text-primary);"
              >
                {i18n.t("home_feature_clean")}
              </div>
              <div class="text-xs" style="color: var(--text-tertiary);">
                {i18n.t("home_feature_clean_desc")}
              </div>
            </div>
          </div>

          <div class="landing-feature">
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style="background-color: var(--bg-tertiary);"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="text-cyan-500"
              >
                <path
                  d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                />
              </svg>
            </div>
            <div>
              <div
                class="text-sm font-medium"
                style="color: var(--text-primary);"
              >
                {i18n.t("home_feature_side_comments")}
              </div>
              <div class="text-xs" style="color: var(--text-tertiary);">
                {i18n.t("home_feature_side_comments_desc")}
              </div>
            </div>
          </div>

          <div class="landing-feature">
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style="background-color: var(--bg-tertiary);"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="text-amber-500"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </div>
            <div>
              <div
                class="text-sm font-medium"
                style="color: var(--text-primary);"
              >
                {i18n.t("home_feature_comment_search")}
              </div>
              <div class="text-xs" style="color: var(--text-tertiary);">
                {i18n.t("home_feature_comment_search_desc")}
              </div>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <a
          href={CC_PLUS_URL}
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
          style="background: linear-gradient(135deg, #ef4444, #f97316);"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
            />
          </svg>
          {i18n.t("home_install_free")}
        </a>
      </div>

      <!-- CC Words Card -->
      <div class="product-card ccwords animate-fade-in-up animate-delay-3">
        <!-- Header -->
        <div class="flex items-center gap-3 mb-4">
          <div
            class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style="background: linear-gradient(135deg, #10b981, #06b6d4);"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m5 8 6 6" />
              <path d="m4 14 6-6 2-3" />
              <path d="M2 5h12" />
              <path d="M7 2h1" />
              <path d="m22 22-5-10-5 10" />
              <path d="M14 18h6" />
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-bold" style="color: var(--text-primary);">
              CC Words
            </h2>
            <span class="text-xs font-medium text-emerald-500">
              {i18n.t("home_ccwords_tag")}
            </span>
          </div>
        </div>

        <!-- Description -->
        <p
          class="text-sm mb-5 leading-relaxed"
          style="color: var(--text-secondary);"
        >
          {i18n.t("home_ccwords_desc")}
        </p>

        <!-- Features -->
        <div class="space-y-2.5 mb-6">
          <div class="landing-feature">
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style="background-color: var(--bg-tertiary);"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="text-emerald-500"
              >
                <path d="m18 16 4-4-4-4" />
                <path d="m6 8-4 4 4 4" />
                <path d="m14.5 4-5 16" />
              </svg>
            </div>
            <div>
              <div
                class="text-sm font-medium"
                style="color: var(--text-primary);"
              >
                {i18n.t("home_feature_word_selection")}
              </div>
              <div class="text-xs" style="color: var(--text-tertiary);">
                {i18n.t("home_feature_word_selection_desc")}
              </div>
            </div>
          </div>

          <div class="landing-feature">
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style="background-color: var(--bg-tertiary);"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="text-teal-500"
              >
                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              </svg>
            </div>
            <div>
              <div
                class="text-sm font-medium"
                style="color: var(--text-primary);"
              >
                {i18n.t("home_ccwords_f_context")}
              </div>
              <div class="text-xs" style="color: var(--text-tertiary);">
                {i18n.t("home_ccwords_f_context_desc")}
              </div>
            </div>
          </div>

          <div class="landing-feature">
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style="background-color: var(--bg-tertiary);"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="text-violet-500"
              >
                <path
                  d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div>
              <div
                class="text-sm font-medium"
                style="color: var(--text-primary);"
              >
                {i18n.t("home_feature_review")}
              </div>
              <div class="text-xs" style="color: var(--text-tertiary);">
                {i18n.t("home_feature_review_desc")}
              </div>
            </div>
          </div>

          <div class="landing-feature">
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style="background-color: var(--bg-tertiary);"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="text-sky-500"
              >
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
              </svg>
            </div>
            <div>
              <div
                class="text-sm font-medium"
                style="color: var(--text-primary);"
              >
                {i18n.t("home_feature_sync")}
              </div>
              <div class="text-xs" style="color: var(--text-tertiary);">
                {i18n.t("home_feature_sync_desc")}
              </div>
            </div>
          </div>

          <div class="landing-feature">
            <div
              class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style="background-color: var(--bg-tertiary);"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="text-green-500"
              >
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
              </svg>
            </div>
            <div>
              <div
                class="text-sm font-medium"
                style="color: var(--text-primary);"
              >
                {i18n.t("home_ccwords_f_activity")}
              </div>
              <div class="text-xs" style="color: var(--text-tertiary);">
                {i18n.t("home_ccwords_f_activity_desc")}
              </div>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <a
          href={CC_WORDS_URL}
          target="_blank"
          rel="noopener"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90"
          style="background: linear-gradient(135deg, #10b981, #06b6d4);"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
            />
          </svg>
          {i18n.t("home_install_free")}
        </a>
      </div>
    </div>
  </section>

  <!-- ====== Platform Section ====== -->
  <section
    class="px-6 py-16 lg:py-20"
    style="background-color: var(--bg-secondary);"
  >
    <div class="max-w-5xl mx-auto">
      <div class="text-center mb-12 animate-fade-in-up">
        <h2
          class="text-2xl sm:text-3xl font-bold mb-3"
          style="color: var(--text-primary);"
        >
          {i18n.t("home_platform_title")}
        </h2>
        <p
          class="text-base max-w-xl mx-auto"
          style="color: var(--text-secondary);"
        >
          {i18n.t("home_platform_desc")}
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <!-- Flashcard Review -->
        <div
          class="text-center p-6 rounded-xl transition-all hover:-translate-y-0.5"
          style="background-color: var(--bg-primary); border: 1px solid var(--border);"
        >
          <div
            class="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center"
            style="background: linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(168, 85, 247, 0.15));"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8b5cf6"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M12 8v8" />
              <path d="M8 12h8" />
            </svg>
          </div>
          <h3
            class="font-semibold text-base mb-1.5"
            style="color: var(--text-primary);"
          >
            {i18n.t("home_platform_review")}
          </h3>
          <p
            class="text-sm leading-relaxed"
            style="color: var(--text-secondary);"
          >
            {i18n.t("home_platform_review_desc")}
          </p>
        </div>

        <!-- Learning Analytics -->
        <div
          class="text-center p-6 rounded-xl transition-all hover:-translate-y-0.5"
          style="background-color: var(--bg-primary); border: 1px solid var(--border);"
        >
          <div
            class="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center"
            style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(251, 191, 36, 0.15));"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f59e0b"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 3v18h18" />
              <path d="m19 9-5 5-4-4-3 3" />
            </svg>
          </div>
          <h3
            class="font-semibold text-base mb-1.5"
            style="color: var(--text-primary);"
          >
            {i18n.t("home_platform_stats")}
          </h3>
          <p
            class="text-sm leading-relaxed"
            style="color: var(--text-secondary);"
          >
            {i18n.t("home_platform_stats_desc")}
          </p>
        </div>

        <!-- Cross-device Sync -->
        <div
          class="text-center p-6 rounded-xl transition-all hover:-translate-y-0.5"
          style="background-color: var(--bg-primary); border: 1px solid var(--border);"
        >
          <div
            class="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center"
            style="background: linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(56, 189, 248, 0.15));"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0ea5e9"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
            </svg>
          </div>
          <h3
            class="font-semibold text-base mb-1.5"
            style="color: var(--text-primary);"
          >
            {i18n.t("home_platform_sync")}
          </h3>
          <p
            class="text-sm leading-relaxed"
            style="color: var(--text-secondary);"
          >
            {i18n.t("home_platform_sync_desc")}
          </p>
        </div>
      </div>

      <!-- CTA to web app -->
      <div class="text-center mt-10">
        <a
          href="/words"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all"
          style="background-color: var(--bg-tertiary); color: var(--text-primary);"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
            />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          {i18n.t("home_open_app")}
        </a>
      </div>
    </div>
  </section>

  <!-- ====== Footer ====== -->
  <footer class="px-6 py-8" style="border-top: 1px solid var(--border);">
    <div
      class="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      <div class="flex items-center gap-2" style="color: var(--text-tertiary);">
        <div
          class="w-5 h-5 rounded flex items-center justify-center text-white text-[8px] font-bold"
          style="background: linear-gradient(135deg, #ef4444, #f97316);"
        >
          CC
        </div>
        <span class="text-sm">youtube-cc.com</span>
      </div>

      <div
        class="flex items-center gap-4 text-sm"
        style="color: var(--text-tertiary);"
      >
        <a
          href="/privacy"
          class="transition-colors hover:underline"
          style="color: var(--text-tertiary);"
        >
          {i18n.t("footer_privacy")}
        </a>
        <span style="color: var(--border);">|</span>
        <a
          href="/terms"
          class="transition-colors hover:underline"
          style="color: var(--text-tertiary);"
        >
          {i18n.t("footer_terms")}
        </a>
        <span style="color: var(--border);">|</span>
        <a
          href={CC_PLUS_URL}
          target="_blank"
          rel="noopener"
          class="transition-colors hover:underline"
          style="color: var(--text-tertiary);"
        >
          Chrome Web Store
        </a>
      </div>
    </div>
  </footer>
</div>
