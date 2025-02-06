<script lang="ts">
  import { waitFor } from "./utils/wait";

  let {
    isSideComment,
    port,
  }: {
    isSideComment: boolean;
    port: chrome.runtime.Port;
  } = $props();

  let sideComment: HTMLDivElement | null = $state(null);
  let commentPrevParent: HTMLDivElement | null = null;

  const setUp = async () => {
    if (!isSideComment) {
      return;
    }
    const ytdComments = await waitFor<HTMLDivElement>(() =>
      document.querySelector("ytd-comments")
    );
    console.log({ ytdComments });
    commentPrevParent = ytdComments.parentElement as HTMLDivElement;
    await waitFor<HTMLDivElement>(() => sideComment);

    sideComment?.prepend(ytdComments);
  };

  const recover = async () => {
    console.log("recover", commentPrevParent);
    if (!commentPrevParent) {
      return;
    }
    const ytdComments = await waitFor<HTMLDivElement>(() =>
      document.querySelector("ytd-comments")
    );
    commentPrevParent?.append(ytdComments);
    commentPrevParent = null;
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
</script>

<div
  id="side-comment"
  bind:this={sideComment}
  class="overflow-auto"
  style={`
    color: var(--yt-spec-text-primary);
    height: 700px;
    min-height: 596px;
    width: calc(100% - 24px);
    border-radius: 12px;
    padding:12px;
    margin-bottom:12px;
    display: ${isSideComment ? "flex" : "none"};
    border: 1px solid var(--yt-spec-10-percent-layer);
    background: ${window.getComputedStyle(document.documentElement).backgroundColor};
    `}
></div>
