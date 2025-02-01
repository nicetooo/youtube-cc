<script lang="ts">
  import { waitFor } from "./utils/wait";

  let isWideScreenOn = $state(true);
  let video: HTMLVideoElement | undefined = $state();

  let columns: HTMLDivElement | undefined = $state();
  let videoContainer: HTMLDivElement | undefined = $state();
  let chromeBottom: HTMLDivElement | undefined = $state();

  async function initSize() {
    if (!video || !columns || !videoContainer || !chromeBottom) {
      return;
    }

    columns.style.maxWidth = "100%";

    videoContainer.style.width = "100%";
    videoContainer.style.height = "100%";

    video.style.width = videoContainer.clientWidth + "px";
    video.style.height = videoContainer.clientHeight + "px";

    chromeBottom.style.width = videoContainer.clientWidth - 24 + "px";
  }

  async function watchVideoSize() {
    if (!videoContainer) {
      return;
    }
    const resizeObserver = new ResizeObserver((entries) => {
      if (!video || !chromeBottom || !videoContainer) {
        return;
      }
      for (let entry of entries) {
        video.style.width = entry.contentRect.width + "px";
        video.style.height = entry.contentRect.height + "px";

        chromeBottom.style.width = videoContainer.clientWidth - 24 + "px";
      }
    });

    resizeObserver.observe(videoContainer);
  }

  async function setUp() {
    /**
     * only work on video detail page
     */
    if (location.pathname !== "/watch" || !isWideScreenOn) {
      return;
    }

    video = await waitFor<HTMLVideoElement>(
      () => document.getElementsByClassName("html5-main-video")[0],
      0
    );
    videoContainer = await waitFor<HTMLDivElement>(() =>
      document.querySelector(".html5-video-container")
    );
    columns = await waitFor<HTMLDivElement>(() =>
      document.getElementById("columns")
    );
    chromeBottom = await waitFor<HTMLDivElement>(() =>
      document.querySelector(".ytp-chrome-bottom")
    );

    initSize();
    watchVideoSize();
  }

  $effect(() => {
    if (isWideScreenOn) {
      setUp();
    }
  });

  onMount(async () => {
    chrome.runtime.onMessage.addListener(
      function (message, sender, sendResponse) {
        switch (message.type) {
          case "url_change": {
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
