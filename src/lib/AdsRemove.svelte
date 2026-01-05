<script lang="ts">
  import { onMount } from "svelte";
  import { observeNodeAdd } from "./utils/observe";
  import { AD_REMOVAL_SELECTORS } from "./configs/ad-selectors";

  let {
    isAdRemoveOn,
  }: {
    isAdRemoveOn: boolean;
    port: chrome.runtime.Port;
  } = $props();

  let disconnect: () => void | null;

  const removeElements = (selectors: string[]) => {
    selectors.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => el.remove());
    });
  };

  const setUp = () =>
    observeNodeAdd(() => {
      const path = location.pathname;

      if (path === "/") {
        removeElements(AD_REMOVAL_SELECTORS.HOME);
      } else if (path === "/watch") {
        removeElements(AD_REMOVAL_SELECTORS.WATCH);
      } else if (path === "/results") {
        removeElements(AD_REMOVAL_SELECTORS.RESULTS);
      }

      // Always check for global ad elements
      removeElements(AD_REMOVAL_SELECTORS.GLOBAL);
    });

  $effect(() => {
    if (isAdRemoveOn) {
      disconnect = setUp();
    } else {
      disconnect?.();
    }
  });

  $inspect({ isAdRemoveOn });
  onMount(() => {
    if (isAdRemoveOn) {
      disconnect = setUp();
    }
  });
</script>

<div id="ads-remove"></div>
