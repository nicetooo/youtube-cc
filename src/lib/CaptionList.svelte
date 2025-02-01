<script lang="ts">
  import { waitFor } from "./utils/wait";

  const { video, videoHeight, videoCurrentTime } = $props();

  let input = $state();
  let captionQuery = $state("");
  let caption = $state("");
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
    caption = "";
    await waitFor(() => document.getElementById("secondary"));
    const scripts = document.getElementsByTagName("script");
    const regex = /"https:\/\/www\.youtube\.com\/api\/timedtext[^"]*"/g;

    let link;
    Array.from(scripts).forEach((s) => {
      console.log("match");
      if (s.innerText.includes("https://www.youtube.com/api/timedtext")) {
        console.log("match in");

        const matches = s.innerText.match(regex);
        if (!matches) {
          return;
        }
        link = matches[0];
        console.log({ asdf: matches[0] });
      }
    });
    if (!link) {
      return;
    }

    const { url } = JSON.parse(`{"url": ${link}}`);

    console.log({ url });
    const res = await fetch(url);
    const text = await res.text();
    caption = text;
    console.log({ text });
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

    const parentCenter = Math.floor((bottom - top) / 2 + top);

    var childRect = line.getBoundingClientRect();

    const childCenter = line.clientHeight / 2;

    const scrollTop = childRect.top - parentCenter + childCenter;
    const scrollBot = childRect.bottom - parentCenter - childCenter;

    if (Math.abs(scrollTop) < Math.abs(scrollBot)) {
      line.parentElement.scrollTop += scrollTop;
    } else {
      line.parentElement.scrollTop += scrollBot;
    }
  }

  $effect(() => {
    if (isMouseHover) {
      return;
    }
    scrollParentToChild();
  });

  const handleMouseEnter = () => {
    isMouseHover = true;
  };

  const handleMouseLeave = () => {
    scrollParentToChild();
    isMouseHover = false;
  };

  onMount(async () => {
    getCaptions();
    chrome.runtime.onMessage.addListener(
      function (message, sender, sendResponse) {
        switch (message.type) {
          case "url_change": {
            console.log(message);
            getCaptions();
            break;
          }
          default: {
            console.log("unhandled", message);
          }
        }
      }
    );
  });
</script>

{#if captions.length > 0}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="overflow-hidden flex flex-col"
    style={`
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
    <input
      type="text"
      tabindex={0}
      bind:this={input}
      placeholder="Search Caption..."
      onclick={(e) => e.stopPropagation()}
      onkeypress={(e) => e.stopPropagation()}
      bind:value={captionQuery}
    />
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
    color: var(--yt-spec-text-primary);
    overflow: auto;
    font-family: Arial, sans-serif;
    line-height: 1.6;
    font-size: 1.4rem;
    padding-bottom: 12px;
  }

  input {
    background-color: transparent;
    border: none;
    box-shadow: none;
    color: var(--yt-spec-text-primary);
    outline: none;
    border: 1px solid;
    border-color: hsl(0, 0%, 50%);
    border-radius: 99px;
    padding: 6px;
    padding-left: 12px;
    font-size: 1.4rem;
    margin-bottom: 4px;
  }

  .caption-line {
    display: flex;
    margin-bottom: 8px;
  }

  .timestamp {
    font-size: 0.9em;
    color: var(--yt-spec-text-secondary);
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
