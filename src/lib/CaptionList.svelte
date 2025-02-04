<script lang="ts">
  import { waitFor } from "./utils/wait";

  let { isCaptionOn } = $props();

  let isExpand = $state(true);
  let isStorageLoad = false;

  let captionsElm = $state<HTMLDivElement | null>(null);

  let video: HTMLVideoElement | undefined = $state();
  let videoHeight: number = $state(0);
  let videoCurrentTime: number = $state(0);

  let timedtextUrl: URL | null = null;
  let videoId: string | null = $state(null);
  let caption = $state("");
  let input = $state();
  let captionQuery = $state("");
  let isMouseHover = $state(false);
  let isAutoClicked = false;

  function decodeHTML(str: string) {
    const doc = new DOMParser().parseFromString(str, "text/html");
    return doc.documentElement.textContent;
  }

  let captions = $derived.by(() => {
    if (!browser) {
      return [];
    }
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(caption, "text/xml");

    // 获取所有的 <text> 元素
    const texts = xmlDoc.getElementsByTagName("text");
    return Array.from(texts).map((text) => ({
      start: text.getAttribute("start") || "",
      dur: text.getAttribute("dur") || "",
      content: text.textContent ? decodeHTML(text.textContent) : "",
    }));
  });

  let filteredCaption = $derived.by(() => {
    return captions.filter(({ content = "" }, i) => {
      return content?.toLowerCase().includes(captionQuery.toLowerCase());
    });
  });

  function toTimeStamp(time: string) {
    if (!video) {
      return;
    }
    let videoTime = Math.floor(Number(time));
    video.currentTime = videoTime;
    // console.log({ videoTime });
  }

  function formatTimestamp(seconds: string) {
    const minutes = Math.floor(Number(seconds) / 60);
    const secs = Math.floor(Number(seconds) % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`; // 确保秒数为两位数
  }

  async function getCaptions() {
    if (!timedtextUrl) {
      return;
    }
    const res = await fetch(timedtextUrl.toString());
    const text = await res.text();
    // console.log({ text });
    caption = text;
  }

  function scrollParentToChild() {
    const lines = document.getElementsByClassName(
      "caption-line"
    ) as HTMLCollectionOf<HTMLDivElement>;
    const line = Array.from(lines).filter((l) => {
      const { start = 0, dur = 0 } = l.dataset;
      return (
        Number(start) <= videoCurrentTime &&
        Number(start) + Number(dur) > videoCurrentTime
      );
    })[0];

    if (!line) {
      return;
    }
    if (!line.parentElement) {
      return;
    }

    var { bottom, top } = line.parentElement.getBoundingClientRect();

    const parentCenter =
      Math.floor((bottom - top) / 2 + top) - line.clientHeight;

    var childRect = line.getBoundingClientRect();

    const scrollTop = childRect.bottom - parentCenter;

    line.parentElement.scrollTop += scrollTop;
  }

  $effect(() => {
    if (isMouseHover) {
      return;
    }
    scrollParentToChild();
  });

  const clickCCBtn = () => {
    if (isAutoClicked) {
      return;
    }
    const subTitleBtn = document.getElementsByClassName(
      "ytp-subtitles-button"
    )[0] as HTMLDivElement;
    if (!subTitleBtn) {
      return;
    }
    isAutoClicked = true;
    subTitleBtn.click();
    setTimeout(() => {
      subTitleBtn.click();
    }, 1000);
  };

  const handleMouseEnter = () => {
    isMouseHover = true;
  };

  const handleMouseLeave = () => {
    scrollParentToChild();
    isMouseHover = false;
  };

  const addComment = (e: any) => {
    e.stopPropagation();
    const placeholder = document.getElementById("simplebox-placeholder");
    if (placeholder) {
      placeholder.click();
    }
    const comment = document.getElementById("contenteditable-root");
    if (comment) {
      if (comment.innerText) {
        comment.innerHTML =
          comment.innerHTML + `<div>${e.target.dataset.comment}</div>`;
      } else {
        comment.innerText = e.target.dataset.comment;
      }
    }
  };

  async function watchVideoSize() {
    if (!video) {
      return;
    }
    const resizeObserver = new ResizeObserver((entries) => {
      if (!video) {
        return;
      }
      for (let entry of entries) {
        videoHeight = entry.contentRect.height;
      }
    });

    resizeObserver.observe(video);
  }

  const setUp = async () => {
    await waitFor(() => captionsElm);
    if (!captionsElm) {
      return;
    }

    video = await waitFor<HTMLVideoElement>(
      () => document.getElementsByClassName("html5-main-video")[0],
      0
    );
    video.addEventListener("timeupdate", function () {
      if (!video) {
        return;
      }

      const ad = document.querySelector(".ytp-ad-player-overlay-layout");
      if (ad === null) {
        videoCurrentTime = video.currentTime;
        clickCCBtn();
      }
    });

    videoHeight = video?.height;
    watchVideoSize();

    await waitFor(() => document.getElementById("secondary"));
  };

  const getExpendState = async () => {
    const isExpandStorage = await chrome.storage.local.get("isExpand");
    // console.log({ isExpandStorage });
    isExpand = isExpandStorage.isExpand;
    isStorageLoad = true;
  };

  $effect(() => {
    // console.log({ isExpand });
    if (!isStorageLoad) {
      return;
    }
    chrome.storage.local.set({ isExpand }, () => {
      // console.log("isExpand saved");
    });
  });

  onMount(() => {
    getExpendState();
    videoId = new URL(location.href).searchParams.get("v");
    // console.log("caption list onmount");
    chrome.runtime.onMessage.addListener(
      function (message, sender, sendResponse) {
        // console.log("onMessage", message);
        switch (message.type) {
          case "url_change": {
            timedtextUrl = null;
            caption = "";
            isAutoClicked = false;
            videoId = new URL(location.href).searchParams.get("v");
            setUp();
            break;
          }
          case "timedtext_url": {
            // console.log(JSON.stringify(message));
            const urlCalled = new URL(message.url);
            if (urlCalled.searchParams.get("fmt")) {
              urlCalled.searchParams.delete("fmt");
            }
            if (urlCalled?.searchParams.get("v") !== videoId) {
              return;
            }
            if (!timedtextUrl) {
              timedtextUrl = urlCalled;
              getCaptions();
            } else {
              if (
                urlCalled.searchParams.get("tlang") &&
                urlCalled.searchParams.get("tlang") ===
                  timedtextUrl?.searchParams.get("tlang")
              ) {
                return;
              }

              if (
                urlCalled.searchParams.get("lang") ===
                timedtextUrl?.searchParams.get("lang")
              ) {
                return;
              }

              timedtextUrl = urlCalled;
              getCaptions();
            }
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

  $inspect({ isExpand, isCaptionOn, caption, captions });
</script>

<div bind:this={captionsElm}>
  {#if isExpand}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="overflow-hidden flex flex-col"
      style={`
       color: var(--yt-spec-text-primary);
       height: calc(${videoHeight}px - 24px);
       min-height: 596px;
       width: calc(100% - 24px);
       border-radius: 12px;
       padding:12px;
       margin-bottom:12px;
       display: ${isCaptionOn && captions.length !== 0 && location.pathname === "/watch" ? "flex" : "none"};
       border: 1px solid var(--yt-spec-10-percent-layer);
       `}
      onmouseenter={handleMouseEnter}
      onmouseleave={handleMouseLeave}
    >
      {#if captions.length > 0}
        <div
          class="flex items-center gap-2"
          style="height: 34px;margin-bottom: 6px;"
        >
          <input
            type="text"
            class="flex-grow"
            tabindex={0}
            bind:this={input}
            placeholder={browser.i18n.getMessage("search")}
            onclick={(e) => e.stopPropagation()}
            onkeypress={(e) => e.stopPropagation()}
            bind:value={captionQuery}
          />
          <button
            class="ytp-button"
            style="width: 24px;height:24px;"
            aria-label="settings"
            title="settings"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              enable-background="new 0 0 24 24"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              focusable="false"
              aria-hidden="true"
              style="pointer-events: none; display: inherit; width: 100%; height: 100%;"
              ><path
                fill="currentColor"
                d="M12 16.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zM10.5 12c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5zm0-6c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5z"
              ></path></svg
            >
          </button>

          <button
            class="ytp-button"
            style="width: 24px;height:24px;"
            aria-label="settings"
            title="settings"
            onclick={() => (isExpand = false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              enable-background="new 0 0 24 24"
              height="24"
              viewBox="0 0 24 24"
              width="24"
              focusable="false"
              aria-hidden="true"
              style="pointer-events: none; display: inherit; width: 100%; height: 100%;"
              ><path
                fill="currentColor"
                d="m12.71 12 8.15 8.15-.71.71L12 12.71l-8.15 8.15-.71-.71L11.29 12 3.15 3.85l.71-.71L12 11.29l8.15-8.15.71.71L12.71 12z"
              ></path></svg
            >
          </button>
        </div>

        <div class="transcript">
          {#each filteredCaption as { start, dur, content }}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <div
              role="button"
              class="caption-line"
              id={`caption-line-${start}`}
              style={videoCurrentTime >= Number(start) ? `opacity: 0.5;` : ``}
              tabindex="0"
              data-start={start}
              data-dur={dur}
              onclick={() => toTimeStamp(start)}
              onkeypress={(e) =>
                (e.key === "Enter" || e.key === " ") && toTimeStamp(start)}
            >
              <span class="timestamp">【{formatTimestamp(start)}】</span>
              <span class="text">{content}</span>
              <span
                class="comment flex-shrink-0"
                onclick={addComment}
                data-comment={`${formatTimestamp(start)}: ${content}`}
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  focusable="false"
                  aria-hidden="true"
                  style="pointer-events: none; display: inherit; width: 100%; height: 100%;"
                  ><path
                    fill="currentColor"
                    d="M16 3v11H7.59L5 16.59V3h11m1-1H4v17l4-4h9V2zM8 18h8l4 4V6h-1v13.59L16.41 17H8v1z"
                  ></path></svg
                ></span
              >
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {:else if isCaptionOn && captions.length !== 0 && location.pathname === "/watch"}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="show-btn" onclick={() => (isExpand = true)}>
      {browser.i18n.getMessage("display_transcription")}
    </div>
  {/if}
</div>

<style>
  .show-btn {
    user-select: none;
    border: 1px solid var(--yt-spec-10-percent-layer);
    border-radius: 99px;
    height: 34px;
    margin: 4px;
    margin-bottom: 12px;
    font-size: 14px;
    font-weight: 500;
    line-height: 36px;
    color: var(--yt-spec-text-primary);
    text-align: center;
    background-color: var(--yt-spec-base-background);
    cursor: pointer;
  }

  .show-btn:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .transcript {
    overflow: auto;
    font-family: Arial, sans-serif;
    font-size: 1.4rem;
    padding-bottom: 4px;
  }

  input {
    background-color: transparent;
    border: none;
    box-shadow: none;
    outline: none;
    border: 1px solid;
    border-color: var(--yt-spec-10-percent-layer);
    border-radius: 99px;
    padding: 6px;
    padding-left: 12px;
    font-size: 13px;
  }

  .caption-line {
    display: flex;
  }

  .timestamp {
    flex-shrink: 0;
    color: var(--yt-live-chat-secondary-text-color);
    font-weight: 500;
  }

  .text {
    color: var(--yt-spec-text-primary);
  }

  .caption-line:hover {
    opacity: 0.5;
    cursor: pointer;
  }

  .caption-line:active {
    opacity: 0.5;
  }

  .comment {
    margin-left: auto;
    display: none;
  }

  .caption-line:hover .comment {
    display: block;
  }
</style>
