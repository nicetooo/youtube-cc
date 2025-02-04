<script lang="ts">
  import { waitFor } from "./utils/wait";

  let {
    isWideScreenOn,
    port,
  }: {
    isWideScreenOn: boolean;
    port: chrome.runtime.Port;
  } = $props();
  let video: HTMLVideoElement | undefined = $state();

  let columns: HTMLDivElement | undefined = $state();
  let videoContainer: HTMLDivElement | undefined = $state();
  let chromeBottom: HTMLDivElement | undefined = $state();

  let originalStyles = {
    hasBackup: false,
    columns: {},
    video: {},
    videoContainer: {},
    chromeBottom: {},
  };

  async function initSize() {
    if (!video || !columns || !videoContainer || !chromeBottom) {
      return;
    }
    if (!originalStyles.hasBackup) {
      originalStyles.hasBackup = true;
      originalStyles.columns = { ...columns.style };
      originalStyles.videoContainer = { ...videoContainer.style };
      originalStyles.video = { ...video.style };
      originalStyles.chromeBottom = { ...chromeBottom.style };
    }

    columns.style.maxWidth = "100%";

    videoContainer.style.width = "100%";
    videoContainer.style.height = "100%";

    video.style.width = "fit-content";
    video.style.height = "100%";

    chromeBottom.style.width = videoContainer.clientWidth - 24 + "px";
  }

  async function watchVideoSize() {
    if (!videoContainer || !video) {
      return;
    }
    const resizeObserver = new ResizeObserver((entries) => {
      if (!video || !chromeBottom || !videoContainer) {
        return;
      }
      for (let entry of entries) {
        video.style.width = "fit-content";
        video.style.height = "100%";
        chromeBottom.style.width = videoContainer.clientWidth - 24 + "px";
      }
    });

    video.addEventListener("timeupdate", function () {
      if (!video || !isWideScreenOn) {
        return;
      }
      video.style.width = "fit-content";
      video.style.height = "100%";
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

  function recover() {
    Object.entries(originalStyles.columns).forEach(([k, v]: any) => {
      if (columns) {
        columns.style[k] = v;
      }
    });

    Object.entries(originalStyles.video).forEach(([k, v]: any) => {
      if (video) {
        video.style[k] = v;
      }
    });

    Object.entries(originalStyles.videoContainer).forEach(([k, v]: any) => {
      if (videoContainer) {
        videoContainer.style[k] = v;
      }
    });

    Object.entries(originalStyles.chromeBottom).forEach(([k, v]: any) => {
      if (chromeBottom) {
        chromeBottom.style[k] = v;
      }
    });
  }

  $effect(() => {
    if (isWideScreenOn) {
      setUp();
    } else {
      recover();
    }
  });

  $inspect({ isWideScreenOn });

  onMount(async () => {
    port.onMessage.addListener(function (message) {
      switch (message.type) {
        case "url_change": {
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
