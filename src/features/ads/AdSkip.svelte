<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { waitFor } from "@/shared/utils/wait";

  import { getAdSelectors, SELECTORS_STORAGE_KEY } from "./ad-selectors";

  let {
    isAdSkipOn,
    port,
  }: {
    isAdSkipOn: boolean;
    port: chrome.runtime.Port;
  } = $props();
  let video: HTMLVideoElement | undefined = $state();
  let selectors = $state<any>(null);
  let timeUpdateHandler: (() => void) | null = null;
  let storageChangeHandler: ((changes: { [key: string]: chrome.storage.StorageChange }, area: string) => void) | null = null;
  let portMessageHandler: ((message: any) => void) | null = null;

  const onTimeUpdate = () => {
    if (!video || !isAdSkipOn || !selectors) {
      return;
    }

    const ad = document.querySelector(selectors.AD_SKIP_SELECTORS.OVERLAY);
    if (ad !== null) {
      video.currentTime = 999;
    }
  };

  const setUp = async () => {
    if (location.pathname !== "/watch") {
      return;
    }
    video = await waitFor<HTMLVideoElement>(
      () =>
        document.getElementsByClassName(
          "html5-main-video"
        )[0] as HTMLVideoElement,
      0
    );

    // 清理旧的监听器
    if (timeUpdateHandler && video) {
      video.removeEventListener("timeupdate", timeUpdateHandler);
    }

    timeUpdateHandler = onTimeUpdate;
    video.addEventListener("timeupdate", timeUpdateHandler);
  };

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

    portMessageHandler = (message) => {
      switch (message.type) {
        case "url_change": {
          setUp();
          break;
        }
        default: {
          break;
        }
      }
    };
    port.onMessage.addListener(portMessageHandler);

    setUp();
  });

  onDestroy(() => {
    // 清理 storage 监听器
    if (storageChangeHandler) {
      chrome.storage.onChanged.removeListener(storageChangeHandler);
      storageChangeHandler = null;
    }
    // 清理 port 监听器
    if (portMessageHandler) {
      port.onMessage.removeListener(portMessageHandler);
      portMessageHandler = null;
    }
    // 清理 video 事件监听器
    if (timeUpdateHandler && video) {
      video.removeEventListener("timeupdate", timeUpdateHandler);
      timeUpdateHandler = null;
    }
  });
</script>

<div id="ad-skip"></div>
