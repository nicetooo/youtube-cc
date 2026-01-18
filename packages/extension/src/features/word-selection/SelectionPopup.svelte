<script lang="ts">
  import { onMount } from "svelte";
  import { scale } from "svelte/transition";
  import { translate, speak, type TranslateError } from "./translate";
  import { saveWord } from "@/shared/stores/words.svelte";
  import type { WordSource } from "@aspect/shared";

  // Props
  interface Props {
    text: string;
    context: string;
    source: WordSource;
    targetLanguage: string;
    position: { x: number; y: number };
    onClose: () => void;
  }

  let { text, context, source, targetLanguage, position, onClose }: Props =
    $props();

  // State
  let translation = $state("");
  let detectedLang = $state<string | undefined>();
  let isLoading = $state(true);
  let error = $state<string | null>(null);
  let isSaved = $state(false);
  let isSaving = $state(false);

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

    // Close on click outside
    const handleClickOutside = (e: MouseEvent) => {
      if (popupEl && !popupEl.contains(e.target as Node)) {
        onClose();
      }
    };
    // Delay to prevent immediate close
    setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 100);

    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("click", handleClickOutside);
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
      targetLanguage
    );
    isLoading = true;
    error = null;

    try {
      const result = await translate(text, targetLanguage);
      console.log("[CC Plus] Translation result:", result);
      translation = result.translation;
      detectedLang = result.detectedLang;
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

  async function handleSave() {
    if (isSaved || isSaving) return;

    isSaving = true;
    try {
      await saveWord({
        text,
        context,
        translation: translation || undefined,
        source,
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
    <span class="selected-text">{text}</span>
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
  </div>

  <!-- Divider -->
  <div class="divider"></div>

  <!-- Translation content -->
  <div class="popup-content">
    {#if isLoading}
      <div class="loading">
        <div class="spinner"></div>
        <span>Translating...</span>
      </div>
    {:else if error}
      <div class="error">
        <span>{error}</span>
        <button
          class="retry-button"
          onclick={(e) => {
            e.stopPropagation();
            doTranslate();
          }}>Retry</button
        >
      </div>
    {:else}
      <p class="translation">{translation}</p>
    {/if}
  </div>

  <!-- Footer: Save button -->
  <div class="popup-footer">
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
        Saved
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
        Save
      {/if}
    </button>
    <button class="close-button" onclick={onClose} aria-label="Close">
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
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  </div>
</div>

<style>
  .cc-plus-selection-popup {
    position: fixed;
    z-index: 2147483647;
    min-width: 160px;
    max-width: 280px;
    background: var(--popup-bg);
    color: var(--popup-text);
    border: 1px solid var(--popup-border);
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
    font-family:
      -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 13px;
    line-height: 1.4;
    overflow: hidden;
  }

  .popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 10px 6px;
    gap: 6px;
  }

  .selected-text {
    font-weight: 600;
    font-size: 14px;
    word-break: break-word;
    flex: 1;
  }

  .speak-button {
    flex-shrink: 0;
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--popup-button-bg);
    border: none;
    border-radius: 6px;
    cursor: pointer;
    color: var(--popup-text-secondary);
    transition: all 0.15s ease;
  }

  .speak-button:hover {
    background: var(--popup-button-hover);
    color: var(--popup-text);
  }

  .divider {
    height: 1px;
    background: var(--popup-border);
    margin: 0 10px;
  }

  .popup-content {
    padding: 8px 10px;
    min-height: 24px;
  }

  .loading {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--popup-text-secondary);
    font-size: 12px;
  }

  .spinner {
    width: 14px;
    height: 14px;
    border: 2px solid var(--popup-border);
    border-top-color: var(--popup-accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .spinner.small {
    width: 12px;
    height: 12px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .error {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    color: var(--popup-accent);
    font-size: 12px;
  }

  .retry-button {
    padding: 3px 6px;
    background: var(--popup-button-bg);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 11px;
    color: var(--popup-text);
    transition: background 0.15s ease;
  }

  .retry-button:hover {
    background: var(--popup-button-hover);
  }

  .translation {
    margin: 0;
    color: var(--popup-text);
    word-break: break-word;
  }

  .popup-footer {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px 8px;
  }

  .save-button {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 6px 12px;
    background: var(--popup-accent);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.15s ease;
  }

  .save-button:hover:not(:disabled) {
    background: var(--popup-accent-hover);
  }

  .save-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .save-button.saved {
    background: #16a34a;
  }

  .close-button {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--popup-button-bg);
    border: none;
    border-radius: 6px;
    cursor: pointer;
    color: var(--popup-text-secondary);
    transition: all 0.15s ease;
  }

  .close-button:hover {
    background: var(--popup-button-hover);
    color: var(--popup-text);
  }

  .icon {
    width: 14px;
    height: 14px;
  }
</style>
