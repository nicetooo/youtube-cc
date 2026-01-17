<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { observeNodeAdd } from "@/shared/utils/observe";
  import { getAdSelectors, SELECTORS_STORAGE_KEY } from "./ad-selectors";

  let {
    isAdRemoveOn,
  }: {
    isAdRemoveOn: boolean;
    port: chrome.runtime.Port;
  } = $props();

  let selectors = $state<any>(null);
  let disconnect: (() => void) | null = null;
  let storageChangeHandler: ((changes: { [key: string]: chrome.storage.StorageChange }, area: string) => void) | null = null;

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

    // 保存监听器引用以便清理
    storageChangeHandler = (changes, area) => {
      if (area === "local" && changes[SELECTORS_STORAGE_KEY]) {
        selectors = changes[SELECTORS_STORAGE_KEY].newValue;
      }
    };
    chrome.storage.onChanged.addListener(storageChangeHandler);

    if (isAdRemoveOn) {
      disconnect = setUp();
    }
  });

  onDestroy(() => {
    // 清理 storage 监听器
    if (storageChangeHandler) {
      chrome.storage.onChanged.removeListener(storageChangeHandler);
      storageChangeHandler = null;
    }
    // 清理 MutationObserver
    disconnect?.();
    disconnect = null;
  });
</script>

<div id="ads-remove"></div>
