<script lang="ts">
  import { onMount } from "svelte";
  import { waitFor } from "@/shared/utils/wait";
  import { throttle } from "lodash-es";
  import { i18n } from "@/shared/i18n/i18n";

  let {
    isCaptionOn,
    port,
  }: {
    isCaptionOn: boolean;
    port: chrome.runtime.Port;
  } = $props();

  let isExpand = $state(true);
  let isStorageLoad = false;

  let captionsElm = $state<HTMLDivElement | null>(null);

  let video: HTMLVideoElement | undefined = $state();
  let videoHeight: number = $state(0);
  let videoCurrentTime: number = $state(0);

  let timedtextUrl: URL | null = null;
  let secondTimedtextUrl: URL | null = null; // 第二语言字幕
  let videoId: string | null = $state(null);
  let caption = $state("");
  let secondCaption = $state(""); // 第二语言字幕内容
  let captionQuery = $state("");
  let hasChat = $state(false);
  let isMouseHover = false;
  let isAutoClicked = false;

  function decodeHTML(str: string) {
    const doc = new DOMParser().parseFromString(str, "text/html");
    return doc.documentElement.textContent;
  }

  interface CaptionItem {
    start: string;
    dur: string;
    content: string | null;
    secondContent: string;
  }

  let captions = $derived.by((): CaptionItem[] => {
    if (typeof window === "undefined") {
      return [];
    }
    const parser = new DOMParser();

    // 解析主字幕
    const xmlDoc = parser.parseFromString(caption, "text/xml");
    const texts = xmlDoc.getElementsByTagName("text");
    const primaryCaptions = Array.from(texts).map((text) => ({
      start: text.getAttribute("start") || "",
      dur: text.getAttribute("dur") || "",
      content: text.textContent ? decodeHTML(text.textContent) : "",
    }));

    // 如果没有第二字幕,直接返回主字幕
    if (!secondCaption) {
      return primaryCaptions.map((p) => ({ ...p, secondContent: "" }));
    }

    // 解析第二字幕
    const xmlDoc2 = parser.parseFromString(secondCaption, "text/xml");
    const texts2 = xmlDoc2.getElementsByTagName("text");
    const secondaryCaptions = Array.from(texts2).map((text) => ({
      start: text.getAttribute("start") || "",
      dur: text.getAttribute("dur") || "",
      content: text.textContent ? decodeHTML(text.textContent) : "",
    }));

    // 合并主辅字幕
    return primaryCaptions.map((primary) => {
      // 查找时间轴匹配的第二字幕
      const secondary = secondaryCaptions.find((sec) => {
        const primaryStart = Number(primary.start);
        const secStart = Number(sec.start);
        // 允许0.5秒的误差
        return Math.abs(primaryStart - secStart) < 0.5;
      });

      return {
        ...primary,
        secondContent: secondary?.content || "",
      };
    });
  });

  let filteredCaption = $derived.by(() => {
    return captions.filter(({ content = "" }, _i) => {
      return content?.toLowerCase().includes(captionQuery.toLowerCase());
    });
  });

  // 提取显示条件为 derived state
  let shouldShow = $derived(isCaptionOn && location.pathname === "/watch");

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
    caption = text;
  }

  async function getSecondCaptions() {
    if (!secondTimedtextUrl) {
      return;
    }
    const res = await fetch(secondTimedtextUrl.toString());
    const text = await res.text();
    secondCaption = text;
  }

  function swapCaptions() {
    if (!secondCaption) return;

    // 交换 URL (引用地址)
    const tempUrl = timedtextUrl;
    timedtextUrl = secondTimedtextUrl;
    secondTimedtextUrl = tempUrl;

    // 交换内容 (Svelte 状态)
    const tempCaption = caption;
    caption = secondCaption;
    secondCaption = tempCaption;
  }

  const scrollParentToChild = throttle(() => {
    if (isMouseHover) {
      return;
    }
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
  }, 200);

  function clickCCBtn() {
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
  }

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

  async function setUp() {
    await waitFor(() => captionsElm);
    if (!captionsElm) {
      return;
    }
    const content = await Promise.race([
      waitFor(() => document.querySelector("#comments #sections")),
      waitFor(() => document.querySelector("#chat #chatframe")),
    ]);

    if (content.id === "chatframe") {
      hasChat = true;
    } else {
      hasChat = false;
    }
    video = await waitFor<HTMLVideoElement>(
      () =>
        document.getElementsByClassName(
          "html5-main-video"
        )[0] as HTMLVideoElement,
      0
    );
    video.addEventListener("timeupdate", function () {
      if (!video) {
        return;
      }

      scrollParentToChild();

      const ad = document.querySelector(".ytp-ad-player-overlay-layout");
      if (ad === null) {
        videoCurrentTime = video.currentTime;
        clickCCBtn();
      }
    });

    videoHeight = video?.height;
    watchVideoSize();

    await waitFor(() => document.getElementById("secondary"));
  }

  async function getExpendState() {
    const isExpandStorage = await chrome.storage.local.get("isExpand");
    // console.log({ isExpandStorage });
    isExpand = isExpandStorage.isExpand;
    isStorageLoad = true;
  }

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
    port.onMessage.addListener(function (message) {
      console.log("[CaptionList] onMessage", message);
      switch (message.type) {
        case "url_change": {
          timedtextUrl = null;
          secondTimedtextUrl = null;
          caption = "";
          secondCaption = "";
          isAutoClicked = false;
          videoId = new URL(location.href).searchParams.get("v");
          setUp();
          break;
        }
        case "timedtext_url": {
          console.log(
            "[CaptionList] timedtext_url received:",
            JSON.stringify(message)
          );
          const urlCalled = new URL(message.url);
          if (urlCalled.searchParams.get("fmt")) {
            urlCalled.searchParams.delete("fmt");
          }
          if (urlCalled?.searchParams.get("v") !== videoId) {
            return;
          }

          // 关键修复:检查是否与当前已有的 URL 完全一致(避免 fetch 拦截形成的无限循环)
          if (
            urlCalled.toString() === timedtextUrl?.toString() ||
            urlCalled.toString() === secondTimedtextUrl?.toString()
          ) {
            return;
          }

          if (!timedtextUrl) {
            // 第一个字幕
            timedtextUrl = urlCalled;
            getCaptions();
          } else {
            // 检查是否是相同语言
            const newLang = urlCalled.searchParams.get("lang");
            const newTlang = urlCalled.searchParams.get("tlang");
            const primaryLang = timedtextUrl.searchParams.get("lang");
            const primaryTlang = timedtextUrl.searchParams.get("tlang");

            const isSameLang =
              newLang === primaryLang && newTlang === primaryTlang;

            if (isSameLang) {
              // 相同语言,更新主字幕
              timedtextUrl = urlCalled;
              getCaptions();
            } else if (secondTimedtextUrl) {
              // 已有第二字幕,检查是否相同
              const secondLang = secondTimedtextUrl.searchParams.get("lang");
              const secondTlang = secondTimedtextUrl.searchParams.get("tlang");
              const isSameAsSecond =
                newLang === secondLang && newTlang === secondTlang;

              if (!isSameAsSecond) {
                // 不同的第二字幕,更新
                secondTimedtextUrl = urlCalled;
                getSecondCaptions();
              }
              // 如果相同,忽略(避免重复请求)
            } else {
              // 没有第二字幕,添加
              secondTimedtextUrl = urlCalled;
              getSecondCaptions();
            }
          }
          break;
        }
        default: {
          // console.log("unhandled", message);
          break;
        }
      }
    });

    setUp();
  });

  // let isMenuOpen = $state(false);
  // let clicked = $state("");
</script>

<div bind:this={captionsElm} id="caption-list">
  {#if hasChat}
    <div id="empty-caption-list"></div>
  {:else if isExpand}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="flex flex-col"
      style={`
       color: var(--yt-spec-text-primary);
       height: calc(${videoHeight}px - 24px);
       max-height: 80vh;
       min-height: 596px;
       width: calc(100% - 24px);
       border-radius: 12px;
       padding:12px;
       margin-bottom:12px;
       display: ${shouldShow ? "flex" : "none"};
       border: 1px solid var(--yt-spec-10-percent-layer);
       background: ${window.getComputedStyle(document.documentElement).backgroundColor};
       `}
    >
      <div
        class="flex items-center gap-2"
        style="height: 34px;margin-bottom: 6px;"
      >
        <div style="position: relative; flex-grow: 1;">
          <input
            type="text"
            class="flex-grow"
            style="width: 100%; padding-right: 32px;"
            tabindex={0}
            placeholder={i18n("search_transcription")}
            onclick={(e) => e.stopPropagation()}
            onkeypress={(e) => e.stopPropagation()}
            bind:value={captionQuery}
          />
          {#if captionQuery}
            <button
              class="clear-btn"
              aria-label="clear"
              title="clear"
              onclick={() => (captionQuery = "")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="18"
                viewBox="0 0 24 24"
                width="18"
                focusable="false"
                aria-hidden="true"
                style="pointer-events: none; display: inherit; width: 100%; height: 100%;"
                ><path
                  fill="currentColor"
                  d="m12.71 12 8.15 8.15-.71.71L12 12.71l-8.15 8.15-.71-.71L11.29 12 3.15 3.85l.71-.71L12 11.29l8.15-8.15.71.71L12.71 12z"
                ></path></svg
              >
            </button>
          {/if}
        </div>

        {#if secondCaption}
          <button
            class="ytp-button"
            style="width: 24px;height:24px;display: flex; align-items: center; justify-content: center;"
            aria-label="swap"
            title={i18n("swap_captions")}
            onclick={swapCaptions}
          >
            <svg viewBox="0 0 24 24" height="20" width="20"
              ><path
                fill="currentColor"
                d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z"
              ></path></svg
            >
          </button>
        {/if}

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

      {#if captions.length > 0}
        <div
          class="transcript"
          onmouseenter={handleMouseEnter}
          onmouseleave={handleMouseLeave}
        >
          {#each filteredCaption as { start, dur, content, secondContent }}
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
              <div class="caption-content">
                <span class="text">{content}</span>
                {#if secondContent}
                  <span class="text secondary">{secondContent}</span>
                {/if}
              </div>
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
      {:else}
        <div class="loading-state">
          <p
            style="text-align: center; color: var(--yt-spec-text-secondary); padding: 20px; line-height: 1.5; font-size: 13px;"
          >
            {i18n("loading_captions")}
          </p>
        </div>
      {/if}
    </div>
  {:else if shouldShow}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div class="show-btn" onclick={() => (isExpand = true)}>
      {i18n("display_transcription")}
    </div>
  {/if}
</div>

<style>
  .show-btn {
    user-select: none;
    border: 1px solid var(--yt-spec-10-percent-layer);
    border-radius: 99px;
    height: 34px;
    width: calc(100% - 24px);
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
    color: var(--yt-live-chat-secondary-text-color);
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

  .caption-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  .timestamp {
    flex-shrink: 0;
    color: var(--yt-live-chat-secondary-text-color);
    font-weight: 500;
  }

  .text {
    color: var(--yt-spec-text-primary);
  }

  .text.secondary {
    color: var(--yt-spec-text-secondary);
    font-size: 0.9em;
    font-style: italic;
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

  .clear-btn {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--yt-spec-text-secondary);
    opacity: 0.7;
    transition: opacity 0.2s;
  }

  .clear-btn:hover {
    opacity: 1;
  }
</style>
