<script lang="ts">
  import { waitFor } from "./utils/wait";

  let isAdSkipOn = $state(true);
  let video: HTMLVideoElement | undefined = $state();

  const onTimeUpdate = () => {
    if (!video) {
      return;
    }

    const companion = document.querySelector("#companion");
    if (companion) {
      companion.remove();
    }

    const ad = document.querySelector(".ytp-ad-player-overlay-layout");
    if (ad !== null) {
      console.log("skip ad");
      video.currentTime = 999;
    }
  };

  const setUp = async () => {
    if (location.pathname !== "/watch" || !isAdSkipOn) {
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
            // console.log("unhandled", message);
            break;
          }
        }
      }
    );
    setUp();
  });
</script>

<div id="ad-skip"></div>
