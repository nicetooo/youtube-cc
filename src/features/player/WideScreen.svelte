<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { waitFor } from "@/shared/utils/wait";

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

  // 用于清理的引用
  let resizeObserver: ResizeObserver | null = null;
  let timeUpdateHandler: (() => void) | null = null;

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

    // 清理旧的 observer 和 listener
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
    if (timeUpdateHandler && video) {
      video.removeEventListener("timeupdate", timeUpdateHandler);
    }

    resizeObserver = new ResizeObserver(() => {
      if (!video || !chromeBottom || !videoContainer) {
        return;
      }
      video.style.width = "fit-content";
      video.style.height = "100%";
      chromeBottom.style.width = videoContainer.clientWidth - 24 + "px";
    });

    timeUpdateHandler = () => {
      if (!video || !isWideScreenOn) {
        return;
      }
      video.style.width = "fit-content";
      video.style.height = "100%";
    };

    video.addEventListener("timeupdate", timeUpdateHandler);
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
      () =>
        document.getElementsByClassName(
          "html5-main-video"
        )[0] as HTMLVideoElement,
      0
    );
    videoContainer = await waitFor<HTMLDivElement>(
      () => document.querySelector(".html5-video-container") as HTMLDivElement
    );
    columns = await waitFor<HTMLDivElement>(
      () => document.getElementById("columns") as HTMLDivElement
    );
    chromeBottom = await waitFor<HTMLDivElement>(
      () => document.querySelector(".ytp-chrome-bottom") as HTMLDivElement
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

  onDestroy(() => {
    // 清理 ResizeObserver
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    // 清理 timeupdate 事件监听器
    if (timeUpdateHandler && video) {
      video.removeEventListener("timeupdate", timeUpdateHandler);
      timeUpdateHandler = null;
    }
  });

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
