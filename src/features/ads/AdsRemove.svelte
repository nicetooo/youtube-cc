<script lang="ts">
  import { onMount } from "svelte";
  import { observeNodeAdd } from "@/shared/utils/observe";
  import { getAdSelectors, SELECTORS_STORAGE_KEY } from "./ad-selectors";

  let {
    isAdRemoveOn,
  }: {
    isAdRemoveOn: boolean;
    port: chrome.runtime.Port;
  } = $props();

  let selectors = $state<any>(null);
  let disconnect: () => void | null;

  const removeElements = (selectorsList: string[]) => {
    if (!selectorsList) return;
    selectorsList.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((el) => el.remove());
    });
  };

  const setUp = () =>
    observeNodeAdd(() => {
      if (!selectors) return;
      const path = location.pathname;

      const removalSelectors = selectors.AD_REMOVAL_SELECTORS;
      if (path === "/") {
        removeElements(removalSelectors.HOME);
      } else if (path === "/watch") {
        removeElements(removalSelectors.WATCH);
      } else if (path === "/results") {
        removeElements(removalSelectors.RESULTS);
      }

      // Always check for global ad elements
      removeElements(removalSelectors.GLOBAL);
    });

  $effect(() => {
    if (isAdRemoveOn && selectors) {
      disconnect = setUp();
    } else {
      disconnect?.();
    }
  });

  onMount(async () => {
    // Initial load
    selectors = await getAdSelectors();

    // Listen for updates
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && changes[SELECTORS_STORAGE_KEY]) {
        selectors = changes[SELECTORS_STORAGE_KEY].newValue;
      }
    });

    if (isAdRemoveOn) {
      disconnect = setUp();
    }
  });
</script>

<div id="ads-remove"></div>
