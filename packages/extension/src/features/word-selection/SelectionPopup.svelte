<script lang="ts">
  import { onMount } from "svelte";
  import { scale } from "svelte/transition";
  import {
    translate,
    speak,
    canSpeak,
    type TranslateError,
    type DictEntry,
  } from "./translate";
  import { saveWord } from "@/shared/stores/words.svelte";
  import { i18n } from "@/shared/i18n/i18n";
  import type { WordSource } from "@aspect/shared";

  // Props
  interface Props {
    text: string;
    context: string;
    source: WordSource;
    targetLanguage: string;
    myLanguage: string;
    position: { x: number; y: number };
    onClose: () => void;
  }

  let {
    text,
    context,
    source,
    targetLanguage,
    myLanguage,
    position,
    onClose,
  }: Props = $props();

  // Clean up phonetic transcription from Google Translate
  // Google uses non-standard characters like T͟H (with combining macron) instead of proper IPA
  function cleanPhonetic(phonetic: string | undefined): string | undefined {
    if (!phonetic) return undefined;
    return (
      phonetic
        // Remove combining double macron below (U+035F) - used in T͟H
        .replace(/\u035F/g, "")
        // Common Google Translate phonetic to readable conversions
        .replace(/T͟H/gi, "th")
        .replace(/TH/g, "th")
        .replace(/SH/g, "sh")
        .replace(/CH/g, "ch")
        .replace(/NG/g, "ŋ")
        .trim()
    );
  }

  // Check if detected language matches my language
  function isMyLanguage(detected: string | undefined): boolean {
    if (!detected) return false;
    const normalizedDetected = detected.toLowerCase();
    const normalizedMy = myLanguage.toLowerCase();

    // Handle zh variants: zh matches zh-CN, zh-TW
    if (normalizedMy.startsWith("zh")) {
      return (
        normalizedDetected === "zh" ||
        normalizedDetected === normalizedMy.replace("-", "") ||
        normalizedDetected === normalizedMy
      );
    }

    // For other languages, match the base language code
    const baseDetected = normalizedDetected.split("-")[0];
    const baseMy = normalizedMy.split("-")[0];
    return baseDetected === baseMy;
  }

  // State
  let translation = $state("");
  let detectedLang = $state<string | undefined>();
  let definitions = $state<DictEntry[] | undefined>();
  let srcTranslit = $state<string | undefined>(); // Source phonetic/pinyin
  let translit = $state<string | undefined>(); // Translation phonetic/pinyin
  let isLoading = $state(true);
  let error = $state<string | null>(null);
  let isSaved = $state(false);
  let isSaving = $state(false);

  // Check if source and translation languages support speech
  let canSpeakSource = $derived(canSpeak(detectedLang));
  let canSpeakTranslation = $derived(
    canSpeak(isMyLanguage(detectedLang) ? targetLanguage : myLanguage)
  );

  // Theme detection
  let isDarkMode = $state(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  // Popup element for positioning
  let popupEl: HTMLDivElement | undefined = $state();

  // Adjusted position to keep popup in viewport
  let adjustedPosition = $state({ x: 0, y: 0 });

  // Initialize position from props
  $effect(() => {
    adjustedPosition = { x: position.x, y: position.y };
  });

  onMount(() => {
    // Listen for theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = (e: MediaQueryListEvent) => {
      isDarkMode = e.matches;
    };
    mediaQuery.addEventListener("change", handleThemeChange);

    // Translate the text
    doTranslate();

    // Close on escape key
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeydown);

    // Close on click outside (use composedPath for Shadow DOM compatibility)
    const handleClickOutside = (e: MouseEvent) => {
      if (!popupEl) return;

      // composedPath() returns the actual path through Shadow DOM boundaries
      const path = e.composedPath();
      const isClickInside = path.includes(popupEl);

      if (!isClickInside) {
        onClose();
      }
    };
    // Delay to prevent immediate close from the selection click
    setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  // Adjust position when popup is rendered
  $effect(() => {
    if (popupEl) {
      const rect = popupEl.getBoundingClientRect();
      const padding = 10;

      let newX = position.x;
      let newY = position.y;

      // Adjust horizontal position
      if (newX + rect.width > window.innerWidth - padding) {
        newX = window.innerWidth - rect.width - padding;
      }
      if (newX < padding) {
        newX = padding;
      }

      // Adjust vertical position
      if (newY + rect.height > window.innerHeight - padding) {
        // Show above the selection if not enough space below
        newY = position.y - rect.height - 10;
      }
      if (newY < padding) {
        newY = padding;
      }

      adjustedPosition = { x: newX, y: newY };
    }
  });

  async function doTranslate() {
    console.log(
      "[CC Plus] doTranslate called, text:",
      text,
      "targetLang:",
      targetLanguage,
      "myLang:",
      myLanguage
    );
    isLoading = true;
    error = null;

    try {
      // First, translate to detect the source language
      const result = await translate(text, targetLanguage);
      console.log("[CC Plus] Translation result:", result);
      detectedLang = result.detectedLang;
      definitions = result.definitions;
      srcTranslit = result.srcTranslit; // Source text phonetic

      // Determine translation direction based on detected language
      if (isMyLanguage(detectedLang)) {
        // Source is my language -> translate to target language (already done)
        console.log(
          "[CC Plus] Source is my language, using target translation"
        );
        translation = result.translation;
        translit = result.translit; // Translation phonetic
      } else {
        // Source is not my language -> translate to my language
        console.log(
          "[CC Plus] Source is foreign language, translating to my language"
        );
        const result2 = await translate(text, myLanguage);
        translation = result2.translation;
        translit = result2.translit; // Translation phonetic
        // Get source phonetic from second translation if first didn't have it
        // (happens when targetLanguage equals source language, e.g., en->en)
        if (!srcTranslit && result2.srcTranslit) {
          srcTranslit = result2.srcTranslit;
        }
        // Prefer definitions from first translation (English POS tags),
        // fallback to second translation if first has none
        if (!definitions || definitions.length === 0) {
          definitions = result2.definitions;
        }
      }
    } catch (e) {
      console.error("[CC Plus] Translation error:", e);
      const err = e as TranslateError;
      error = err.message || "Translation failed";
    } finally {
      isLoading = false;
    }
  }

  function handleSpeak() {
    speak(text, detectedLang);
  }

  function handleSpeakTranslation() {
    // Determine the language of the translation
    const translationLang = isMyLanguage(detectedLang)
      ? targetLanguage
      : myLanguage;
    speak(translation, translationLang);
  }

  async function handleSave() {
    if (isSaved || isSaving) return;

    isSaving = true;
    try {
      await saveWord({
        text,
        context,
        translation: translation || undefined,
        source,
        detectedLang,
        definitions,
      });
      isSaved = true;
    } catch (e) {
      console.error("Failed to save word:", e);
      // Could show error toast here
    } finally {
      isSaving = false;
    }
  }

  // Theme colors
  const colors = $derived(
    isDarkMode
      ? {
          bg: "#1a1a1a",
          text: "#f1f1f1",
          textSecondary: "#9ca3af",
          border: "rgba(255, 255, 255, 0.1)",
          accent: "#dc2626",
          accentHover: "#b91c1c",
          buttonBg: "#333333",
          buttonHover: "#444444",
        }
      : {
          bg: "#ffffff",
          text: "#1a1a1a",
          textSecondary: "#6b7280",
          border: "rgba(0, 0, 0, 0.1)",
          accent: "#dc2626",
          accentHover: "#b91c1c",
          buttonBg: "#f3f4f6",
          buttonHover: "#e5e7eb",
        }
  );
</script>

<div
  bind:this={popupEl}
  class="cc-plus-selection-popup"
  style="
    left: {adjustedPosition.x}px;
    top: {adjustedPosition.y}px;
    --popup-bg: {colors.bg};
    --popup-text: {colors.text};
    --popup-text-secondary: {colors.textSecondary};
    --popup-border: {colors.border};
    --popup-accent: {colors.accent};
    --popup-accent-hover: {colors.accentHover};
    --popup-button-bg: {colors.buttonBg};
    --popup-button-hover: {colors.buttonHover};
  "
  transition:scale={{ duration: 150, start: 0.95 }}
>
  <!-- Header: Selected text + speak button -->
  <div class="popup-header">
    <div class="header-text">
      <div class="selected-text-row">
        <span class="selected-text">{text}</span>
        {#if detectedLang}
          <span class="lang-badge">{detectedLang}</span>
        {/if}
      </div>
      {#if srcTranslit && !isMyLanguage(detectedLang)}
        <span class="phonetic">/{cleanPhonetic(srcTranslit)}/</span>
      {/if}
    </div>
    {#if canSpeakSource}
      <button
        class="speak-button"
        onclick={handleSpeak}
        title="Speak"
        aria-label="Speak"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      </button>
    {/if}
  </div>

  <!-- Divider -->
  <div class="divider"></div>

  <!-- Translation content -->
  <div class="popup-content">
    {#if isLoading}
      <div class="loading">
        <div class="spinner"></div>
        <span>{i18n("translation_loading", myLanguage)}</span>
      </div>
    {:else if error}
      <div class="error">
        <span>{error}</span>
        <button
          class="retry-button"
          onclick={(e) => {
            e.stopPropagation();
            doTranslate();
          }}>{i18n("retry", myLanguage)}</button
        >
      </div>
    {:else}
      <!-- Main translation with speak button -->
      <div class="translation-row">
        <div class="translation-content">
          <p class="translation">{translation}</p>
          {#if translit && isMyLanguage(detectedLang)}
            <span class="phonetic translation-phonetic"
              >/{cleanPhonetic(translit)}/</span
            >
          {/if}
        </div>
        {#if canSpeakTranslation}
          <button
            class="speak-button small"
            onclick={handleSpeakTranslation}
            title="Speak translation"
            aria-label="Speak translation"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          </button>
        {/if}
      </div>

      <!-- Dictionary definitions by part of speech -->
      {#if definitions && definitions.length > 0}
        <div class="definitions">
          {#each definitions as def}
            <div class="definition-group">
              <div class="definition-header">
                <span class="pos-tag">{def.pos}</span>
                <span class="terms">{def.terms.join(", ")}</span>
              </div>
              <!-- Synonyms for each entry -->
              {#if def.entries && def.entries.length > 0}
                <div class="synonyms-list">
                  {#each def.entries as entry}
                    <div class="synonym-entry">
                      <span class="synonym-word">{entry.word}</span>
                      {#if entry.synonyms && entry.synonyms.length > 0}
                        <span class="synonym-tags"
                          >{entry.synonyms.join(", ")}</span
                        >
                      {/if}
                    </div>
                  {/each}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    {/if}
  </div>

  <!-- Footer: Save button (only show for foreign language words) -->
  <div class="popup-footer">
    {#if !isLoading && !isMyLanguage(detectedLang)}
      <button
        class="save-button"
        class:saved={isSaved}
        onclick={handleSave}
        disabled={isSaved || isSaving || isLoading}
      >
        {#if isSaving}
          <div class="spinner small"></div>
        {:else if isSaved}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {i18n("word_saved", myLanguage)}
        {:else}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon"
          >
            <path
              d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
            />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          {i18n("save_word", myLanguage)}
        {/if}
      </button>
    {/if}
  </div>
</div>

<!-- Styles are in tailwind.css for Shadow DOM injection -->
