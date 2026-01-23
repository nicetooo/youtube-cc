<script lang="ts">
  import { onMount, onDestroy } from "svelte";

  let {
    isEnlargeSkipButtonOn,
  }: {
    isEnlargeSkipButtonOn: boolean;
  } = $props();

  const SKIP_BUTTON_SELECTOR = ".ytp-skip-ad-button";
  const PLAYER_SELECTOR = "#movie_player";
  const STYLE_ID = "ccplus-enlarge-skip-button-style";

  let observer: MutationObserver | null = null;

  function applyEnlargeStyle() {
    const player = document.querySelector(PLAYER_SELECTOR) as HTMLElement;
    const skipButton = document.querySelector(
      SKIP_BUTTON_SELECTOR
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
      ${SKIP_BUTTON_SELECTOR} {
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
    if (!isEnlargeSkipButtonOn) {
      removeStyle();
      return;
    }

    const skipButton = document.querySelector(SKIP_BUTTON_SELECTOR);
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

  onMount(() => {
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
  });
</script>

<div id="ad-skip-enlarge"></div>
