<script lang="ts">
  import { onMount, onDestroy } from "svelte";
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

    if (location.pathname !== "/watch") {
      return;
    }

    await waitFor(() => document.querySelector(".html5-main-video"));
    await waitFor(() => document.querySelector("ytd-watch-flexy"));
    await waitFor(() => document.querySelector("ytd-comments"));
    await waitFor(() => document.querySelector("#secondary-inner"));

    const captionList = await waitFor<HTMLDivElement>(
      () => document.querySelector("#caption-list") as HTMLDivElement
    );
    disconnect = observeMutations(captionList);

    const ytdComments = await waitFor<HTMLDivElement>(
      () => document.querySelector("#comments") as HTMLDivElement
    );
    ytdComments.style.width = "100%";

    const sideVideoList = await waitFor<HTMLDivElement>(
      () => document.querySelector("#secondary-inner") as HTMLDivElement
    );
    const belowVideo = await waitFor<HTMLDivElement>(
      () => document.querySelector("#above-the-fold") as HTMLDivElement
    );
    const secondaryColumn = await waitFor<HTMLDivElement>(
      () => document.querySelector("#secondary") as HTMLDivElement
    );

    const sideComment = await waitFor<HTMLDivElement>(
      () => document.querySelector("#side-comment") as HTMLDivElement
    );

    // Prevent loop: only move if not already there
    if (ytdComments.parentElement !== sideComment) {
      sideComment.prepend(ytdComments);
    }
    if (secondaryColumn && !secondaryColumn.contains(sideComment)) {
      secondaryColumn.append(sideComment);
    }
    if (belowVideo.parentElement !== sideVideoList) {
      // Logic for moving sideVideoList seems to be placing it into belowVideo
      // creating the swapping effect.
      // Confirm where sideVideoList is currently:
      // standard layout: #secondary-inner is inside #secondary
      // our layout: #secondary-inner is inside #above-the-fold
      if (sideVideoList.parentElement !== belowVideo) {
        belowVideo.appendChild(sideVideoList);
      }
    }
  };

  const recover = async () => {
    // recovery also needs to be careful not to run on non-watch pages if SPA navigation happened
    if (location.pathname !== "/watch") {
      return;
    }
    disconnect?.();
    const ytdComments = await waitFor<HTMLDivElement>(
      () => document.querySelector("#comments") as HTMLDivElement
    );
    ytdComments.style.width = "unset";

    const sideVideoList = await waitFor<HTMLDivElement>(
      () => document.querySelector("#secondary-inner") as HTMLDivElement
    );
    const belowVideo = await waitFor<HTMLDivElement>(
      () => document.querySelector("#above-the-fold") as HTMLDivElement
    );
    const secondaryColumn = await waitFor<HTMLDivElement>(
      () => document.querySelector("#secondary") as HTMLDivElement
    );

    // unexpected: if we are not in our modified state, do not recover blindly
    // Default state: comments are in #below (or #primary-inner > #below), actually #comments is typically under #below
    // To safe recover:
    // Put comments back to #belowVideo (which is likely #above-the-fold or #below based on YT version, assuming existing vars are correct target)
    // Put sideVideoList back to #secondary

    // Check if recover is needed
    if (ytdComments.parentElement !== belowVideo && belowVideo) {
      belowVideo.appendChild(ytdComments);
    }

    if (sideVideoList.parentElement !== secondaryColumn && secondaryColumn) {
      secondaryColumn.appendChild(sideVideoList);
    }
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
