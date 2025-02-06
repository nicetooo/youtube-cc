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
  id="youtube-cc-comment"
  bind:this={sideComment}
  class="overflow-auto"
  style={`height: ${isSideComment ? "700px" : "0px"};`}
></div>
