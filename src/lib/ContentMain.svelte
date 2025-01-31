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
        videoCurrentTime = Math.floor(video.currentTime);
      } else {
        console.log("skip ad");
        video.currentTime = 999;
      }
    });

    videoHeight = window.getComputedStyle(video).height;
    watchVideoSize();
  });
</script>

{#if video}
  <CaptionList {video} {videoHeight} {videoCurrentTime}></CaptionList>
{/if}
