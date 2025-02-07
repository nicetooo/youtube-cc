<script lang="ts">
  import { waitFor } from "./utils/wait";

  let {
    isSideComment,
    port,
  }: {
    isSideComment: boolean;
    port: chrome.runtime.Port;
  } = $props();

  let captionListHeight = $state(0);
  let disconnect: (() => void) | null = null;

  function observeMutations(node: HTMLDivElement) {
    const observer = new MutationObserver(() => {
      captionListHeight = node.clientHeight;
    });

    observer.observe(node, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
    };
  }

  const setUp = async () => {
    if (!isSideComment) {
      return;
    }

    const captionList = await waitFor<HTMLDivElement>(() =>
      document.querySelector("#caption-list")
    );
    disconnect = observeMutations(captionList);

    const ytdComments = await waitFor<HTMLDivElement>(() =>
      document.querySelector("#comments")
    );
    const sideVideoList = await waitFor<HTMLDivElement>(() =>
      document.querySelector("#secondary-inner")
    );
    const belowVideo = await waitFor<HTMLDivElement>(() =>
      document.querySelector("#above-the-fold")
    );
    const secondaryColumn = await waitFor<HTMLDivElement>(() =>
      document.querySelector("#secondary")
    );

    const sideComment = await waitFor<HTMLDivElement>(() =>
      document.querySelector("#side-comment")
    );

    sideComment.prepend(ytdComments);

    secondaryColumn?.append(sideComment);

    belowVideo.appendChild(sideVideoList);
  };

  const recover = async () => {
    disconnect?.();
    const ytdComments = await waitFor<HTMLDivElement>(() =>
      document.querySelector("#comments")
    );
    const sideVideoList = await waitFor<HTMLDivElement>(() =>
      document.querySelector("#secondary-inner")
    );
    const belowVideo = await waitFor<HTMLDivElement>(() =>
      document.querySelector("#above-the-fold")
    );
    const secondaryColumn = await waitFor<HTMLDivElement>(() =>
      document.querySelector("#secondary")
    );

    belowVideo.appendChild(ytdComments);

    secondaryColumn.appendChild(sideVideoList);
  };

  $effect(() => {
    if (isSideComment) {
      setUp();
    } else {
      recover();
    }
  });

  $inspect({ isSideComment });

  onMount(() => {
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

  onDestroy(() => {
    disconnect?.();
  });
</script>

<div
  id="side-comment"
  class="overflow-auto"
  style={`
    color: var(--yt-spec-text-primary);
    height: calc(100vh - 118px - ${captionListHeight}px);
    width: calc(100% - 24px);
    border-radius: 12px;
    padding:12px;
    margin-bottom:12px;
    display: ${isSideComment ? "flex" : "none"};
    border: 1px solid var(--yt-spec-10-percent-layer);
    background: ${window.getComputedStyle(document.documentElement).backgroundColor};
    `}
></div>
