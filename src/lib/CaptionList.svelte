<script lang="ts">
  import { waitFor } from "./utils/wait";

  const { video, videoHeight, videoCurrentTime } = $props();

  let timedtextUrl: URL | null = $state(null);
  let videoId: string | null = $state(null);
  let caption = $state("");
  let input = $state();
  let captionQuery = $state("");
  let isMouseHover = $state(false);

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
    console.log({ videoTime });
  }

  function formatTimestamp(seconds: string) {
    const minutes = Math.floor(Number(seconds) / 60);
    const secs = Math.floor(Number(seconds) % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`; // 确保秒数为两位数
  }

  async function getCaptions() {
    if (timedtextUrl?.searchParams.get("v") !== videoId) {
      console.log("id not match", videoId, timedtextUrl);
      return;
    }

    console.log({ timedtextUrl });
    const res = await fetch(timedtextUrl.toString());
    const text = await res.text();
    console.log({ text });
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

  $effect(() => {
    if (captions.length === 0 && videoCurrentTime) {
      const subTitleBtn = document.getElementsByClassName(
        "ytp-subtitles-button"
      )[0] as HTMLDivElement;
      if (!subTitleBtn) {
        return;
      }
      console.log({ subTitleBtn });
      subTitleBtn.click();
      setTimeout(() => {
        subTitleBtn.click();
      }, 500);
    }
  });

  const handleMouseEnter = () => {
    isMouseHover = true;
  };

  const handleMouseLeave = () => {
    scrollParentToChild();
    isMouseHover = false;
  };

  const setUp = async () => {
    caption = "";
    await waitFor(() => document.getElementById("secondary"));
    videoId = new URL(location.href).searchParams.get("v");
  };

  onMount(() => {
    chrome.runtime.onMessage.addListener(
      function (message, sender, sendResponse) {
        switch (message.type) {
          case "url_change": {
            setUp();
            break;
          }
          case "timedtext_url": {
            console.log(JSON.stringify(message));
            const urlCalled = new URL(message.url);
            urlCalled.searchParams.delete("fmt");
            if (timedtextUrl?.toString() !== urlCalled.toString()) {
              timedtextUrl = urlCalled;
              getCaptions();
            }
            break;
          }
          default: {
            console.log("unhandled", message);
          }
        }
      }
    );
    setUp();
  });
</script>

{#if captions.length > 0}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="overflow-hidden flex flex-col"
    style={`
     color: var(--yt-spec-text-primary);
      height: calc(${videoHeight} - 24px);
      width: calc(100% - 24px);
      background: var(--yt-spec-badge-chip-background);
      border-radius: 12px;
      padding:12px;
      margin-bottom:12px;
    `}
    onmouseenter={handleMouseEnter}
    onmouseleave={handleMouseLeave}
  >
    <div class="flex">
      <input
        type="text"
        class="flex-grow"
        tabindex={0}
        bind:this={input}
        placeholder="Search Caption..."
        onclick={(e) => e.stopPropagation()}
        onkeypress={(e) => e.stopPropagation()}
        bind:value={captionQuery}
      />
      <button
        class="ytp-button"
        style="width: 32px;height:32px;"
        aria-label="settings"
        title="settings"
      >
        <svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"
          ><path
            fill="currentColor"
            d="m 23.94,18.78 c .03,-0.25 .05,-0.51 .05,-0.78 0,-0.27 -0.02,-0.52 -0.05,-0.78 l 1.68,-1.32 c .15,-0.12 .19,-0.33 .09,-0.51 l -1.6,-2.76 c -0.09,-0.17 -0.31,-0.24 -0.48,-0.17 l -1.99,.8 c -0.41,-0.32 -0.86,-0.58 -1.35,-0.78 l -0.30,-2.12 c -0.02,-0.19 -0.19,-0.33 -0.39,-0.33 l -3.2,0 c -0.2,0 -0.36,.14 -0.39,.33 l -0.30,2.12 c -0.48,.2 -0.93,.47 -1.35,.78 l -1.99,-0.8 c -0.18,-0.07 -0.39,0 -0.48,.17 l -1.6,2.76 c -0.10,.17 -0.05,.39 .09,.51 l 1.68,1.32 c -0.03,.25 -0.05,.52 -0.05,.78 0,.26 .02,.52 .05,.78 l -1.68,1.32 c -0.15,.12 -0.19,.33 -0.09,.51 l 1.6,2.76 c .09,.17 .31,.24 .48,.17 l 1.99,-0.8 c .41,.32 .86,.58 1.35,.78 l .30,2.12 c .02,.19 .19,.33 .39,.33 l 3.2,0 c .2,0 .36,-0.14 .39,-0.33 l .30,-2.12 c .48,-0.2 .93,-0.47 1.35,-0.78 l 1.99,.8 c .18,.07 .39,0 .48,-0.17 l 1.6,-2.76 c .09,-0.17 .05,-0.39 -0.09,-0.51 l -1.68,-1.32 0,0 z m -5.94,2.01 c -1.54,0 -2.8,-1.25 -2.8,-2.8 0,-1.54 1.25,-2.8 2.8,-2.8 1.54,0 2.8,1.25 2.8,2.8 0,1.54 -1.25,2.8 -2.8,2.8 l 0,0 z"
          ></path></svg
        >
      </button>
    </div>

    <div class="transcript">
      {#each filteredCaption as { start, dur, content }}
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
          <span class="timestamp">[{formatTimestamp(start)}]</span>
          <span class="text">{content}</span>
        </div>
      {/each}
    </div>
  </div>
{/if}

<style>
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
    border-color: hsl(0, 0%, 50%);
    border-radius: 99px;
    padding: 6px;
    padding-left: 12px;
    font-size: 13px;
    margin-bottom: 4px;
  }

  .caption-line {
    display: flex;
  }

  .timestamp {
    font-size: 0.9em;
    margin-right: 8px;
  }

  .caption-line:hover {
    opacity: 0.5;
    cursor: pointer;
  }

  .caption-line:active {
    opacity: 0.5;
  }
</style>
