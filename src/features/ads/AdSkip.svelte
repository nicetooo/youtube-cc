<script lang="ts">
  import { onMount } from "svelte";
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

    video.addEventListener("timeupdate", onTimeUpdate);
  };

  onMount(async () => {
    // Initial load
    selectors = await getAdSelectors();

    // Listen for updates
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && changes[SELECTORS_STORAGE_KEY]) {
        selectors = changes[SELECTORS_STORAGE_KEY].newValue;
      }
    });

    port.onMessage.addListener(function (message) {
      switch (message.type) {
        case "url_change": {
          video?.removeEventListener("timeupdate", onTimeUpdate);
          setUp();
          break;
        }
        default: {
          break;
        }
      }
    });

    setUp();
  });
</script>

<div id="ad-skip"></div>
