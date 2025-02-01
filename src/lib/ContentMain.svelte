<script lang="ts">
  import CaptionList from "./CaptionList.svelte";
  import { waitFor } from "./utils/wait";

  let video: HTMLVideoElement | undefined = $state();
  let videoHeight: string = $state("0px");
  let videoCurrentTime: number = $state(0);

  function watchVideoSize() {
    if (!video) {
      return;
    }
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (!video) {
          return;
        }
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "style"
        ) {
          videoHeight = window.getComputedStyle(video).height;
        }
      });
    });

    // Configuration of the observer:
    var config = { attributes: true, childList: false, subtree: false };

    // Pass in the target node and the observer options
    observer.observe(video, config);
  }

  async function removeAd() {
    await waitFor(
      () =>
        document.querySelectorAll(
          "ytd-rich-item-renderer:has(ytd-ad-slot-renderer)"
        )[0]
    );
    const ads = document.querySelectorAll(
      "ytd-rich-item-renderer:has(ytd-ad-slot-renderer)"
    );
    console.log("removing ads", ads);
    Array.from(ads).forEach((a) => {
      a.remove();
    });
  }

  onMount(async () => {
    video = await waitFor<HTMLVideoElement>(
      () => document.getElementsByClassName("html5-main-video")[0],
      0
    );

    video.addEventListener("timeupdate", function () {
      if (!video) {
        return;
      }

      const companion = document.querySelector("#companion");
      if (companion) {
        companion.remove();
      }

      const addSlots = document.getElementsByTagName("ytd-ad-slot-renderer");
      if (addSlots !== null) {
        Array.from(addSlots).forEach((a) => a.remove());
      }

      const ad = document.querySelector(".ytp-ad-player-overlay-layout");
      if (ad === null) {
        videoCurrentTime = video.currentTime;
      } else {
        console.log("skip ad");
        video.currentTime = 999;
      }
    });

    videoHeight = window.getComputedStyle(video).height;
    watchVideoSize();
    removeAd();
    chrome.runtime.onMessage.addListener(
      function (message, sender, sendResponse) {
        switch (message.type) {
          case "url_change": {
            removeAd();
            break;
          }
          case "has_load_more": {
            setTimeout(() => {
              removeAd();
            }, 100);
            break;
          }
          default: {
            // console.log("unhandled", message);
            break;
          }
        }
      }
    );
  });
</script>

{#if video}
  <CaptionList {video} {videoHeight} {videoCurrentTime}></CaptionList>
{/if}
