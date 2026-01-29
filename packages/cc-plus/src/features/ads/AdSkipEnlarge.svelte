<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import {
    getAdSelectors,
    SELECTORS_STORAGE_KEY,
    type AdSelectors,
  } from "./ad-selectors";

  let {
    isEnlargeSkipButtonOn,
  }: {
    isEnlargeSkipButtonOn: boolean;
  } = $props();

  const PLAYER_SELECTOR = "#movie_player";
  const STYLE_ID = "ccplus-enlarge-skip-button-style";

  let selectors = $state<AdSelectors | null>(null);
  let storageChangeHandler:
    | ((
        changes: { [key: string]: chrome.storage.StorageChange },
        area: string
      ) => void)
    | null = null;

  let observer: MutationObserver | null = null;

  function applyEnlargeStyle() {
    if (!selectors) return;

    const skipButtonSelector = selectors.AD_SKIP_SELECTORS.SKIP_BUTTON;
    const player = document.querySelector(PLAYER_SELECTOR) as HTMLElement;
    const skipButton = document.querySelector(
      skipButtonSelector
    ) as HTMLElement;

    if (!player || !skipButton) return;

    const playerWidth = player.offsetWidth;
    const playerHeight = player.offsetHeight;

    // Set button size to 50% of player
    const newWidth = playerWidth * 0.5;
    const newHeight = playerHeight * 0.5;

    // Remove old style if exists
    const oldStyle = document.getElementById(STYLE_ID);
    if (oldStyle) oldStyle.remove();

    // Create new style with calculated dimensions
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      ${skipButtonSelector} {
        width: ${newWidth}px !important;
        height: ${newHeight}px !important;
        font-size: 24px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
      }
    `;
    document.head.appendChild(style);
  }

  function removeStyle() {
    const existingStyle = document.getElementById(STYLE_ID);
    if (existingStyle) {
      existingStyle.remove();
    }
  }

  function checkAndApplyStyle() {
    if (!isEnlargeSkipButtonOn || !selectors) {
      removeStyle();
      return;
    }

    const skipButton = document.querySelector(
      selectors.AD_SKIP_SELECTORS.SKIP_BUTTON
    );
    if (skipButton) {
      applyEnlargeStyle();
    }
  }

  function setupObserver() {
    if (observer) {
      observer.disconnect();
    }

    observer = new MutationObserver(() => {
      checkAndApplyStyle();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Handle window resize to recalculate button size
  function handleResize() {
    if (isEnlargeSkipButtonOn) {
      checkAndApplyStyle();
    }
  }

  $effect(() => {
    if (isEnlargeSkipButtonOn) {
      setupObserver();
      checkAndApplyStyle();
      window.addEventListener("resize", handleResize);
    } else {
      removeStyle();
      window.removeEventListener("resize", handleResize);
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    }
  });

  onMount(async () => {
    // Load selectors from storage
    selectors = await getAdSelectors();

    // Listen for storage changes (remote updates)
    storageChangeHandler = (changes, area) => {
      if (area === "local" && changes[SELECTORS_STORAGE_KEY]) {
        selectors = changes[SELECTORS_STORAGE_KEY].newValue;
        checkAndApplyStyle();
      }
    };
    chrome.storage.onChanged.addListener(storageChangeHandler);

    if (isEnlargeSkipButtonOn) {
      setupObserver();
      checkAndApplyStyle();
      window.addEventListener("resize", handleResize);
    }
  });

  onDestroy(() => {
    removeStyle();
    window.removeEventListener("resize", handleResize);
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    // Clean up storage listener
    if (storageChangeHandler) {
      chrome.storage.onChanged.removeListener(storageChangeHandler);
      storageChangeHandler = null;
    }
  });
</script>

<div id="ad-skip-enlarge"></div>
