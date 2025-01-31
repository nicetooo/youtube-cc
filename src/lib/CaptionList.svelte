<script lang="ts">
  let input = $state();
  let captionQuery = $state("");
  let caption = $state("");
  let video: HTMLVideoElement | undefined = $state();
  let height = $state("0px");

  function decodeHTML(str: string) {
    const doc = new DOMParser().parseFromString(str, "text/html");
    return doc.documentElement.textContent;
  }

  let transcriptHTML = $derived.by(() => {
    if (!browser) {
      return [];
    }
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(caption, "text/xml");

    // 获取所有的 <text> 元素
    const texts = xmlDoc.getElementsByTagName("text");
    return Array.from(texts).map((text) => ({
      start: text.getAttribute("start") || "",
      content: text.textContent ? decodeHTML(text.textContent) : "",
    }));
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

  function watchVideoSize() {
    if (!video) {
      return;
    }
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "style"
        ) {
          if (!video) {
            return;
          }
          // 在这里，我们可以通过监听style属性的变化来获取到元素高度变化
          height = window.getComputedStyle(video).height;
          console.log("Element height changed: ", height);
        }
      });
    });

    // Configuration of the observer:
    var config = { attributes: true, childList: false, subtree: false };

    // Pass in the target node and the observer options
    observer.observe(video, config);
  }

  onMount(async () => {
    video = document.getElementsByClassName(
      "html5-main-video"
    )[0] as HTMLVideoElement;
    height = window.getComputedStyle(video).height;
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

    const { url } = JSON.parse(`{"url": ${link}}`);

    console.log({ url });
    const res = await fetch(url);
    const text = await res.text();
    caption = text;
    console.log({ text });
    watchVideoSize();
  });
</script>

<div
  class="overflow-hidden w-full rounded-r-xl bg-gray-800 p-4"
  style={`height: ${height}`}
>
  <input
    type="text"
    tabindex={0}
    bind:this={input}
    class="search-box bg-black bg-opacity-90"
    placeholder="Search Caption..."
    onclick={(e) => e.stopPropagation()}
    onkeypress={(e) => e.stopPropagation()}
    bind:value={captionQuery}
  />
  <div class="transcript">
    {#each transcriptHTML as { start, content }}
      <div
        role="button"
        class="entry"
        id={`entry-${start}`}
        tabindex="0"
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

<style>
  .transcript {
    color: var(--yt-spec-text-primary);
    overflow: auto;
    font-family: Arial, sans-serif;
    line-height: 1.6;
    max-width: 700px;
    margin: 0 auto;
    padding: 10px;
    height: 100%;
    font-size: 1.6rem;
  }

  .entry {
    margin-bottom: 8px;
  }

  .timestamp {
    font-size: 0.9em;
    color: var(--yt-spec-text-secondary);
    margin-right: 8px;
  }

  .entry:hover {
    opacity: 0.5;
    cursor: pointer;
  }

  .entry:active {
    opacity: 0.5;
  }
</style>
