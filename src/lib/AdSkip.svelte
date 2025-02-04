<script lang="ts">
  import { waitFor } from "./utils/wait";

  let { isAdSkipOn } = $props();
  let video: HTMLVideoElement | undefined = $state();

  const onTimeUpdate = () => {
    if (!video || !isAdSkipOn) {
      return;
    }

    const ad = document.querySelector(".ytp-ad-player-overlay-layout");
    if (ad !== null) {
      video.currentTime = 999;
    }
  };

  const setUp = async () => {
    if (location.pathname !== "/watch") {
      return;
    }
    video = await waitFor<HTMLVideoElement>(
      () => document.getElementsByClassName("html5-main-video")[0],
      0
    );

    video.addEventListener("timeupdate", onTimeUpdate);
  };

  onMount(() => {
    chrome.runtime.onMessage.addListener(
      function (message, sender, sendResponse) {
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
      }
    );

    setUp();
  });
</script>

<div id="ad-skip"></div>
