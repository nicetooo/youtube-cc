// Import CSS as string for Shadow DOM injection
import tailwindStyles from "~/assets/tailwind.css?inline";
import { mount, unmount } from "svelte";
import SelectionPopup from "@/features/word-selection/SelectionPopup.svelte";
import { getBrowserLanguage } from "@/shared/stores/settings.svelte";
import {
  extractSentenceContext,
  isYouTubePage,
  getYouTubeVideoId,
  getYouTubeVideoTitle,
  getYouTubeTimestamp,
  getPageInfo,
} from "@/features/word-selection/context-extractor";
import type { WordSource } from "@aspect/shared";

// WXT content script definition
export default defineContentScript({
  matches: ["http://*/*", "https://*/*"],
  // No need to exclude websites anymore - Shadow DOM isolates CSS completely
  runAt: "document_end",
  // Don't inject CSS globally - we'll inject it into Shadow DOM
  cssInjectionMode: "manual",

  main() {
    let popupInstance: ReturnType<typeof mount> | null = null;
    let shadowHost: HTMLDivElement | null = null;
    let shadowRoot: ShadowRoot | null = null;
    let isEnabled = true;
    let targetLanguage = "en";
    let myLanguage = getBrowserLanguage();

    // Load settings from storage
    async function loadSettings() {
      try {
        const { settings } = await chrome.storage.local.get("settings");
        if (settings) {
          isEnabled = settings.wordSelection ?? true;
          targetLanguage = settings.targetLanguage ?? "en";
          myLanguage = settings.myLanguage ?? getBrowserLanguage();
        }
      } catch (error) {
        console.error("[CC Plus] Failed to load settings:", error);
      }
    }

    // Listen for settings changes
    function subscribeToSettings() {
      chrome.storage.onChanged.addListener((changes) => {
        if (changes.settings) {
          const newSettings = changes.settings.newValue;
          if (newSettings) {
            isEnabled = newSettings.wordSelection ?? true;
            targetLanguage = newSettings.targetLanguage ?? "en";
            myLanguage = newSettings.myLanguage ?? getBrowserLanguage();

            // If disabled, close any open popup
            if (!isEnabled) {
              closePopup();
            }
          }
        }
      });
    }

    // Create Shadow DOM container for CSS isolation
    function createShadowContainer(): {
      host: HTMLDivElement;
      root: ShadowRoot;
    } {
      const host = document.createElement("div");
      host.id = "cc-plus-selection-popup-host";
      host.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0;
        height: 0;
        z-index: 2147483647;
        pointer-events: none;
      `;
      document.body.appendChild(host);

      // Create shadow root for CSS isolation
      const root = host.attachShadow({ mode: "open" });

      // Inject CSS into shadow DOM
      const style = document.createElement("style");
      style.textContent = tailwindStyles;
      root.appendChild(style);

      return { host, root };
    }

    // Close popup
    function closePopup() {
      if (popupInstance) {
        unmount(popupInstance);
        popupInstance = null;
      }
      // Clear shadow root content except styles
      if (shadowRoot) {
        const children = Array.from(shadowRoot.children);
        children.forEach((child) => {
          if (child.tagName !== "STYLE") {
            child.remove();
          }
        });
      }
    }

    // Show popup with translation
    function showPopup(
      text: string,
      context: string,
      source: WordSource,
      position: { x: number; y: number }
    ) {
      // Close existing popup
      closePopup();

      // Ensure shadow container exists
      if (!shadowHost || !shadowRoot) {
        const container = createShadowContainer();
        shadowHost = container.host;
        shadowRoot = container.root;
      }

      // Create wrapper element for popup inside shadow DOM
      const wrapper = document.createElement("div");
      wrapper.style.pointerEvents = "auto";
      shadowRoot.appendChild(wrapper);

      // Mount popup component into shadow DOM
      popupInstance = mount(SelectionPopup, {
        target: wrapper,
        props: {
          text,
          context,
          source,
          targetLanguage,
          myLanguage,
          position,
          onClose: () => {
            closePopup();
          },
        },
      });
    }

    // Handle text selection
    function handleSelection() {
      console.log("[CC Plus] handleSelection called, isEnabled:", isEnabled);
      if (!isEnabled) return;

      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) {
        console.log("[CC Plus] No selection or collapsed");
        return;
      }

      const text = selection.toString().trim();
      console.log("[CC Plus] Selected text:", text);

      // Ignore empty or too long selections
      if (!text || text.length > 100) {
        console.log("[CC Plus] Text empty or too long");
        return;
      }

      // Ignore if selection contains newlines (likely a paragraph, not a word/phrase)
      if (text.includes("\n") && text.split("\n").length > 2) return;

      // Get selection position
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Position popup below the selection (fixed positioning, no scroll offset needed)
      const position = {
        x: rect.left,
        y: rect.bottom + 8,
      };

      // Extract context
      const context = extractSentenceContext(selection);

      // Determine source
      let source: WordSource;
      if (isYouTubePage()) {
        const videoId = getYouTubeVideoId();
        if (videoId) {
          source = {
            type: "youtube-caption",
            videoId,
            videoTitle: getYouTubeVideoTitle(),
            timestamp: getYouTubeTimestamp(),
          };
        } else {
          // YouTube page but not a video page
          const pageInfo = getPageInfo();
          source = {
            type: "webpage",
            url: pageInfo.url,
            pageTitle: pageInfo.title,
          };
        }
      } else {
        const pageInfo = getPageInfo();
        source = {
          type: "webpage",
          url: pageInfo.url,
          pageTitle: pageInfo.title,
        };
      }

      // Show popup
      showPopup(text, context, source, position);
    }

    // Debounced selection handler
    let selectionTimeout: ReturnType<typeof setTimeout> | null = null;

    function debouncedHandleSelection() {
      if (selectionTimeout) {
        clearTimeout(selectionTimeout);
      }
      selectionTimeout = setTimeout(() => {
        handleSelection();
      }, 300); // Wait 300ms after selection stops changing
    }

    // Initialize
    async function init() {
      await loadSettings();
      subscribeToSettings();

      // Listen for mouseup to detect selection
      document.addEventListener("mouseup", (e) => {
        // Don't trigger if clicking inside the popup host
        const target = e.target as Element;
        if (target.closest("#cc-plus-selection-popup-host")) {
          return;
        }

        debouncedHandleSelection();
      });

      // Listen for keyboard selection (Shift+arrows)
      document.addEventListener("keyup", (e) => {
        if (
          e.shiftKey &&
          ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
        ) {
          debouncedHandleSelection();
        }
      });

      // Close popup when clicking outside
      document.addEventListener("mousedown", (e) => {
        // Use composedPath to correctly detect clicks inside Shadow DOM
        const path = e.composedPath();
        const isClickInsidePopup = shadowHost && path.includes(shadowHost);

        if (shadowHost && !isClickInsidePopup) {
          // Don't close immediately, let the popup's click handler work first
          setTimeout(() => {
            const selection = window.getSelection();
            if (!selection || selection.isCollapsed) {
              closePopup();
            }
          }, 0);
        }
      });

      // Close popup on scroll
      let scrollTimeout: ReturnType<typeof setTimeout> | null = null;
      window.addEventListener(
        "scroll",
        () => {
          if (scrollTimeout) clearTimeout(scrollTimeout);
          scrollTimeout = setTimeout(() => {
            closePopup();
          }, 100);
        },
        { passive: true }
      );

      console.log("[CC Plus] Word selection initialized");
    }

    init();
  },
});
