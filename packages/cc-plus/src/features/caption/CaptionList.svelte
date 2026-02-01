<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { waitFor } from "@/shared/utils/wait";
  import { throttle } from "lodash-es";
  import { i18n } from "@/shared/i18n/i18n";
  import type {
    CaptionTrackInfo,
    TranslationLanguageInfo,
  } from "./caption-bridge";

  /** Request caption tracks from the main world bridge */
  function requestTracks(): void {
    window.postMessage({ source: "ccplus-caption", type: "get-tracks" }, "*");
  }

  /** Request to switch the caption track via the main world bridge */
  function switchTrack(
    languageCode: string,
    translationLanguageCode?: string
  ): void {
    window.postMessage(
      {
        source: "ccplus-caption",
        type: "switch-track",
        languageCode,
        translationLanguageCode,
      },
      "*"
    );
  }

  let {
    isCaptionOn,
    port,
    fontSize = 14,
    onFontSizeChange,
    preferredPrimaryLang = "",
    preferredSecondaryLang = "",
    onLangChange,
  }: {
    isCaptionOn: boolean;
    port: chrome.runtime.Port;
    fontSize?: number;
    onFontSizeChange?: (size: number) => void;
    preferredPrimaryLang?: string;
    preferredSecondaryLang?: string;
    onLangChange?: (primary: string, secondary: string) => void;
  } = $props();

  let isExpand = $state(true);
  let isStorageLoad = false;
  let showFontSizePopup = $state(false);
  let showLangPopup = $state(false);

  const MIN_FONT_SIZE = 12;
  const MAX_FONT_SIZE = 24;

  // 用于清理的引用
  let timeUpdateHandler: (() => void) | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let portMessageHandler: ((message: any) => void) | null = null;
  let bridgeMessageHandler: ((event: MessageEvent) => void) | null = null;

  // Language track data from bridge
  let captionTracks = $state<CaptionTrackInfo[]>([]);
  let translationLanguages = $state<TranslationLanguageInfo[]>([]);
  let selectedLangUpper = $state(""); // Language shown on top line
  let selectedLangLower = $state(""); // Language shown on bottom line (optional)
  let langInitialized = false;
  let isLanguageSwitching = $state(false);

  /**
   * Cache of successfully fetched caption XML text, keyed by effective language code.
   * Used as fallback when:
   * - YouTube returns 429 (rate limited)
   * - YouTube serves track from memory cache (no network request for us to intercept)
   * - Any other fetch failure
   * Cleared on video change (url_change).
   */
  const captionTextCache = new Map<string, string>();

  /** Get the effective language code from a timedtext URL */
  function getEffectiveLang(url: URL | null): string {
    if (!url) return "";
    return url.searchParams.get("tlang") || url.searchParams.get("lang") || "";
  }

  /** Unified language option for dropdowns */
  interface UnifiedLangOption {
    languageCode: string;
    languageName: string;
    isOriginal: boolean; // true = original caption track, false = auto-translated
    kind?: string; // "asr" for auto-generated original tracks
  }

  /**
   * Build a unified, deduplicated list of all available languages.
   * Original caption tracks come first and are marked with isOriginal=true.
   * Translation languages that duplicate an original track are excluded.
   */
  let unifiedLanguages = $derived.by((): UnifiedLangOption[] => {
    const result: UnifiedLangOption[] = [];
    const seen = new Set<string>();

    // Add original caption tracks first (higher priority)
    for (const track of captionTracks) {
      if (!seen.has(track.languageCode)) {
        seen.add(track.languageCode);
        result.push({
          languageCode: track.languageCode,
          languageName: track.languageName,
          isOriginal: true,
          kind: track.kind,
        });
      }
    }

    // Add translation languages (skip duplicates)
    for (const lang of translationLanguages) {
      if (!seen.has(lang.languageCode)) {
        seen.add(lang.languageCode);
        result.push({
          languageCode: lang.languageCode,
          languageName: lang.languageName,
          isOriginal: false,
        });
      }
    }

    return result;
  });

  function increaseFontSize() {
    const newSize = Math.min(fontSize + 2, MAX_FONT_SIZE);
    onFontSizeChange?.(newSize);
  }

  function decreaseFontSize() {
    const newSize = Math.max(fontSize - 2, MIN_FONT_SIZE);
    onFontSizeChange?.(newSize);
  }

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
  }

  function formatTimestamp(seconds: string) {
    const minutes = Math.floor(Number(seconds) / 60);
    const secs = Math.floor(Number(seconds) % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }

  async function getCaptions() {
    if (!timedtextUrl) {
      return;
    }
    const lang = getEffectiveLang(timedtextUrl);
    try {
      const res = await fetch(timedtextUrl.toString());
      if (!res.ok) {
        console.warn("[CaptionList] Failed to fetch captions:", res.status);
        // Fallback to cache
        if (lang && captionTextCache.has(lang)) {
          console.log("[CaptionList] Using cached caption for", lang);
          caption = captionTextCache.get(lang)!;
        }
        return;
      }
      const text = await res.text();
      caption = text;
      // Cache on success
      if (lang && text) {
        captionTextCache.set(lang, text);
      }
    } catch (err) {
      console.error("[CaptionList] Error fetching captions:", err);
      // Fallback to cache
      if (lang && captionTextCache.has(lang)) {
        caption = captionTextCache.get(lang)!;
      }
    }
  }

  async function getSecondCaptions() {
    if (!secondTimedtextUrl) {
      return;
    }
    const lang = getEffectiveLang(secondTimedtextUrl);
    try {
      const res = await fetch(secondTimedtextUrl.toString());
      if (!res.ok) {
        console.warn(
          "[CaptionList] Failed to fetch second captions:",
          res.status
        );
        if (lang && captionTextCache.has(lang)) {
          console.log("[CaptionList] Using cached second caption for", lang);
          secondCaption = captionTextCache.get(lang)!;
        }
        return;
      }
      const text = await res.text();
      secondCaption = text;
      if (lang && text) {
        captionTextCache.set(lang, text);
      }
    } catch (err) {
      console.error("[CaptionList] Error fetching second captions:", err);
      if (lang && captionTextCache.has(lang)) {
        secondCaption = captionTextCache.get(lang)!;
      }
    }
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

    // 交换语言选择状态 (让下拉框同步更新)
    const tempLang = selectedLangUpper;
    selectedLangUpper = selectedLangLower;
    selectedLangLower = tempLang;

    // 持久化交换后的偏好
    onLangChange?.(selectedLangUpper, selectedLangLower);
  }

  // --- Language switching ---

  /**
   * Check if a language code corresponds to an original caption track
   */
  function isOriginalTrack(langCode: string): boolean {
    return captionTracks.some((t) => t.languageCode === langCode);
  }

  /**
   * Find the best original track to use as a base for translation.
   * Prefers the first translatable track.
   */
  function findBestBaseTrack(): string {
    const translatable = captionTracks.find((t) => t.isTranslatable);
    return translatable?.languageCode || captionTracks[0]?.languageCode || "";
  }

  /**
   * Perform the actual language switch via the bridge.
   * Determines the optimal setOption call based on whether languages
   * are original tracks or translations.
   *
   * Cases:
   * 1. Single language, is original → setOption(lang)
   * 2. Single language, is translation → setOption(base, translationLang)
   * 3. Two languages, one original + one translation → setOption(original, translationLang)
   * 4. Two languages, both original → setOption(langA) then need second from interception
   * 5. Two languages, both translations → setOption(base, tlangA) — only one pair possible
   */
  function performLanguageSwitch() {
    const upper = selectedLangUpper;
    const lower = selectedLangLower;

    if (!upper) {
      // No upper language — don't touch existing captions
      if (!lower) {
        secondTimedtextUrl = null;
        secondCaption = "";
      }
      return;
    }

    const upperIsOriginal = isOriginalTrack(upper);
    const lowerIsOriginal = lower ? isOriginalTrack(lower) : false;

    // Clear URL references so new URLs are accepted by the handler.
    // DON'T clear caption/secondCaption text — keep old text visible
    // until new data arrives to avoid "loading" flash.
    timedtextUrl = null;
    secondTimedtextUrl = null;
    isLanguageSwitching = true;

    if (!lower) {
      // Single language mode — clear secondary text
      secondCaption = "";

      if (upperIsOriginal) {
        switchTrack(upper);
      } else {
        const base = findBestBaseTrack();
        if (base) {
          switchTrack(base, upper);
        }
      }
    } else {
      // Dual language mode
      if (upperIsOriginal && !lowerIsOriginal) {
        // Original + translation: ideal case, YouTube gives us both
        switchTrack(upper, lower);
      } else if (!upperIsOriginal && lowerIsOriginal) {
        // Translation (upper) + Original (lower): use lower as base
        switchTrack(lower, upper);
      } else if (upperIsOriginal && lowerIsOriginal) {
        // Both are original tracks — use upper as base, lower as translation target.
        // YouTube will return a translation URL (lang=upper&tlang=lower),
        // and our tlang handler will derive the base URL automatically.
        switchTrack(upper, lower);
      } else {
        // Both are translations — use best base, translate to upper
        const base = findBestBaseTrack();
        if (base) {
          switchTrack(base, upper);
        }
      }
    }

    // Persist preference
    onLangChange?.(selectedLangUpper, selectedLangLower);

    // Fallback: if URLs don't arrive via interception within 2s
    // (YouTube memory cache, 429 rate limit, etc.), try using cached caption text
    setTimeout(() => {
      if (!isLanguageSwitching) return; // Already resolved normally

      let resolved = false;

      if (!timedtextUrl && selectedLangUpper) {
        const cached = captionTextCache.get(selectedLangUpper);
        if (cached) {
          console.log(
            "[CaptionList] Cache fallback for upper:",
            selectedLangUpper
          );
          caption = cached;
          resolved = true;
        }
      }

      if (!secondTimedtextUrl && selectedLangLower) {
        const cached = captionTextCache.get(selectedLangLower);
        if (cached) {
          console.log(
            "[CaptionList] Cache fallback for lower:",
            selectedLangLower
          );
          secondCaption = cached;
          resolved = true;
        }
      }

      if (resolved) {
        isLanguageSwitching = false;
      }
    }, 2000);

    // Hard reset switching state after 5s no matter what
    setTimeout(() => {
      isLanguageSwitching = false;
    }, 5000);
  }

  function handleUpperLangChange(lang: string) {
    if (lang === selectedLangUpper) return;
    selectedLangUpper = lang;
    // 上下不能一样 — 如果冲突，清空下方
    if (lang && lang === selectedLangLower) {
      selectedLangLower = "";
      secondCaption = "";
    }
    performLanguageSwitch();
  }

  function handleLowerLangChange(lang: string) {
    if (lang === selectedLangLower) return;
    // 上下不能一样 — 如果冲突，不执行
    if (lang && lang === selectedLangUpper) return;
    selectedLangLower = lang;
    performLanguageSwitch();
  }

  function setupBridgeListener() {
    bridgeMessageHandler = (event: MessageEvent) => {
      if (event.source !== window) return;
      if (!event.data || event.data.source !== "ccplus-bridge") return;

      const msg = event.data;
      switch (msg.type) {
        case "tracks-data": {
          captionTracks = msg.captionTracks || [];
          translationLanguages = msg.translationLanguages || [];
          console.log(
            "[CaptionList] Received tracks:",
            captionTracks.length,
            "tracks,",
            translationLanguages.length,
            "translation languages"
          );

          // Apply preferred language or sync dropdown state
          if (captionTracks.length > 0 && !langInitialized) {
            langInitialized = true;

            if (preferredPrimaryLang) {
              // Check if preferred lang exists in unified list
              const hasPreferred =
                captionTracks.some(
                  (t) => t.languageCode === preferredPrimaryLang
                ) ||
                translationLanguages.some(
                  (t) => t.languageCode === preferredPrimaryLang
                );
              if (hasPreferred) {
                // Only switch if preferred differs from what's currently displayed
                const needsSwitch =
                  selectedLangUpper !== preferredPrimaryLang ||
                  selectedLangLower !== preferredSecondaryLang;
                selectedLangUpper = preferredPrimaryLang;
                selectedLangLower = preferredSecondaryLang;
                if (needsSwitch) {
                  performLanguageSwitch();
                }
              }
            }
          }
          break;
        }
        case "track-switched": {
          console.log(
            "[CaptionList] Track switched:",
            msg.success ? "success" : "failed"
          );
          break;
        }
      }
    };

    window.addEventListener("message", bridgeMessageHandler);
  }

  // --- End language switching ---

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
      const commentText = e.target.dataset.comment || "";
      if (comment.innerText) {
        const div = document.createElement("div");
        div.textContent = commentText;
        comment.appendChild(div);
      } else {
        comment.textContent = commentText;
      }
    }
  };

  async function watchVideoSize() {
    if (!video) {
      return;
    }
    resizeObserver?.disconnect();

    resizeObserver = new ResizeObserver((entries) => {
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

    if (timeUpdateHandler && video) {
      video.removeEventListener("timeupdate", timeUpdateHandler);
    }

    timeUpdateHandler = () => {
      if (!video) {
        return;
      }

      scrollParentToChild();

      const ad = document.querySelector(".ytp-ad-player-overlay-layout");
      if (ad === null) {
        videoCurrentTime = video.currentTime;
        clickCCBtn();
      }
    };

    video.addEventListener("timeupdate", timeUpdateHandler);

    videoHeight = video?.height;
    watchVideoSize();

    await waitFor(() => document.getElementById("secondary"));
  }

  async function getExpendState() {
    const isExpandStorage = await chrome.storage.local.get("isExpand");
    isExpand = isExpandStorage.isExpand;
    isStorageLoad = true;
  }

  $effect(() => {
    if (!isStorageLoad) {
      return;
    }
    chrome.storage.local.set({ isExpand }, () => {});
  });

  // Close popups when clicking outside
  function handleGlobalClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (showLangPopup && !target.closest(".lang-control")) {
      showLangPopup = false;
    }
    if (showFontSizePopup && !target.closest(".font-size-control")) {
      showFontSizePopup = false;
    }
  }

  onMount(() => {
    getExpendState();
    videoId = new URL(location.href).searchParams.get("v");

    // Set up bridge listener (bridge script runs in MAIN world via WXT)
    setupBridgeListener();

    // Request tracks after a delay for the main world bridge to initialize
    setTimeout(() => {
      requestTracks();
    }, 2500);

    portMessageHandler = function (message: any) {
      console.log("[CaptionList] onMessage", message);
      switch (message.type) {
        case "url_change": {
          timedtextUrl = null;
          secondTimedtextUrl = null;
          caption = "";
          secondCaption = "";
          captionTextCache.clear();
          langInitialized = false;
          isLanguageSwitching = false;
          isAutoClicked = false;
          videoId = new URL(location.href).searchParams.get("v");
          setUp();

          // Re-request tracks for new video
          setTimeout(() => {
            requestTracks();
          }, 1500);
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

          // 避免 fetch 拦截形成的无限循环
          if (
            urlCalled.toString() === timedtextUrl?.toString() ||
            urlCalled.toString() === secondTimedtextUrl?.toString()
          ) {
            return;
          }

          // URL 的实际语言: tlang 存在时为翻译语言，否则为 lang 原始语言
          const urlLang = urlCalled.searchParams.get("lang");
          const urlTlang = urlCalled.searchParams.get("tlang");
          const effectiveLang = urlTlang || urlLang;

          if (isLanguageSwitching && selectedLangUpper) {
            // ── 智能分配模式：根据用户选择的语言分配到正确位置 ──
            //
            // YouTube 在翻译模式下只发 1 个网络请求 (带 tlang)。
            // 基础语言从 YouTube 内部缓存获取，不产生网络请求。
            // 因此当收到翻译 URL 时，需要手动构造基础语言 URL。
            //
            // 翻译 URL: lang=en&tlang=zh-Hans → effectiveLang='zh-Hans'
            // 基础 URL: lang=en (去掉 tlang) → effectiveLang='en'

            if (urlTlang && selectedLangLower) {
              // ── 翻译 URL: 同时处理翻译和基础语言 ──
              const translationLang = urlTlang; // e.g. 'zh-Hans'
              const baseLang = urlLang; // e.g. 'en'

              // 构造基础语言 URL (去掉 tlang 参数)
              const baseUrl = new URL(urlCalled.toString());
              baseUrl.searchParams.delete("tlang");

              // 判断翻译语言和基础语言分别对应上方还是下方
              const translationIsUpper = translationLang === selectedLangUpper;
              const translationIsLower = translationLang === selectedLangLower;
              const baseIsUpper = baseLang === selectedLangUpper;
              const baseIsLower = baseLang === selectedLangLower;

              if (translationIsUpper && baseIsLower) {
                // 翻译→上方, 基础→下方
                if (!timedtextUrl) {
                  timedtextUrl = urlCalled;
                  getCaptions();
                }
                if (!secondTimedtextUrl) {
                  secondTimedtextUrl = baseUrl;
                  getSecondCaptions();
                }
              } else if (translationIsLower && baseIsUpper) {
                // 翻译→下方, 基础→上方
                if (!timedtextUrl) {
                  timedtextUrl = baseUrl;
                  getCaptions();
                }
                if (!secondTimedtextUrl) {
                  secondTimedtextUrl = urlCalled;
                  getSecondCaptions();
                }
              } else {
                // 兜底: effectiveLang 匹配
                if (!timedtextUrl) {
                  timedtextUrl = urlCalled;
                  getCaptions();
                }
                if (!secondTimedtextUrl) {
                  secondTimedtextUrl = baseUrl;
                  getSecondCaptions();
                }
              }
            } else {
              // ── 非翻译 URL (纯 lang，无 tlang): 单语言切换 ──
              const isForUpper = effectiveLang === selectedLangUpper;
              const isForLower =
                selectedLangLower && effectiveLang === selectedLangLower;

              if (isForUpper && !timedtextUrl) {
                timedtextUrl = urlCalled;
                getCaptions();
              } else if (isForLower && !secondTimedtextUrl) {
                secondTimedtextUrl = urlCalled;
                getSecondCaptions();
              } else if (!timedtextUrl) {
                timedtextUrl = urlCalled;
                getCaptions();
              } else if (!secondTimedtextUrl && selectedLangLower) {
                secondTimedtextUrl = urlCalled;
                getSecondCaptions();
              }
            }

            // 检查是否两个都到齐了
            const upperDone = !!timedtextUrl;
            const lowerDone = !selectedLangLower || !!secondTimedtextUrl;
            if (upperDone && lowerDone) {
              isLanguageSwitching = false;
            }
          } else {
            // ── 默认模式：初次加载 / 非语言切换 ──
            if (!timedtextUrl) {
              timedtextUrl = urlCalled;
              getCaptions();
              // 同步语言下拉框，反映当前实际播放的字幕语言
              if (!selectedLangUpper && effectiveLang) {
                selectedLangUpper = effectiveLang;
              }
            } else {
              const newLang = urlCalled.searchParams.get("lang");
              const newTlang = urlCalled.searchParams.get("tlang");
              const primaryLang = timedtextUrl.searchParams.get("lang");
              const primaryTlang = timedtextUrl.searchParams.get("tlang");

              const isSameLang =
                newLang === primaryLang && newTlang === primaryTlang;

              if (isSameLang) {
                timedtextUrl = urlCalled;
                getCaptions();
              } else if (secondTimedtextUrl) {
                const secondLang = secondTimedtextUrl.searchParams.get("lang");
                const secondTlang =
                  secondTimedtextUrl.searchParams.get("tlang");
                const isSameAsSecond =
                  newLang === secondLang && newTlang === secondTlang;

                if (!isSameAsSecond) {
                  secondTimedtextUrl = urlCalled;
                  getSecondCaptions();
                }
              } else {
                secondTimedtextUrl = urlCalled;
                getSecondCaptions();
                // 同步下方语言下拉框
                if (!selectedLangLower && effectiveLang) {
                  selectedLangLower = effectiveLang;
                }
              }
            }

            if (isLanguageSwitching) {
              isLanguageSwitching = false;
            }
          }
          break;
        }
        default: {
          break;
        }
      }
    };

    port.onMessage.addListener(portMessageHandler);
    setUp();

    // Add global click handler for closing popups
    document.addEventListener("click", handleGlobalClick);
  });

  onDestroy(() => {
    if (portMessageHandler) {
      port.onMessage.removeListener(portMessageHandler);
      portMessageHandler = null;
    }
    if (timeUpdateHandler && video) {
      video.removeEventListener("timeupdate", timeUpdateHandler);
      timeUpdateHandler = null;
    }
    resizeObserver?.disconnect();
    resizeObserver = null;
    if (bridgeMessageHandler) {
      window.removeEventListener("message", bridgeMessageHandler);
      bridgeMessageHandler = null;
    }
    document.removeEventListener("click", handleGlobalClick);
  });
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
       background: var(--yt-spec-additive-background);
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

        <!-- Language selector button -->
        {#if unifiedLanguages.length > 0}
          <div class="lang-control">
            <button
              class="ytp-button"
              style="width: 24px;height:24px;display: flex; align-items: center; justify-content: center;"
              aria-label={i18n("caption_language")}
              title={i18n("caption_language")}
              onclick={(e) => {
                e.stopPropagation();
                showLangPopup = !showLangPopup;
                showFontSizePopup = false;
              }}
            >
              <svg viewBox="0 0 24 24" height="18" width="18">
                <path
                  fill="currentColor"
                  d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0 0 14.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"
                />
              </svg>
            </button>
            {#if showLangPopup}
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <!-- svelte-ignore a11y_click_events_have_key_events -->
              <div class="lang-popup" onclick={(e) => e.stopPropagation()}>
                <!-- Language ▲ (upper / top line in transcript) -->
                <div class="lang-section">
                  <label class="lang-label" for="ccplus-lang-upper"
                    >▲ {i18n("language_upper")}</label
                  >
                  <select
                    id="ccplus-lang-upper"
                    class="lang-select"
                    value={selectedLangUpper}
                    onchange={(e) =>
                      handleUpperLangChange(
                        (e.target as HTMLSelectElement).value
                      )}
                  >
                    <option value="">—</option>
                    {#each unifiedLanguages as lang}
                      <option value={lang.languageCode}>
                        {lang.isOriginal
                          ? "● "
                          : ""}{lang.languageName}{lang.kind === "asr"
                          ? ` (${i18n("auto_generated")})`
                          : ""}
                      </option>
                    {/each}
                  </select>
                </div>

                <!-- Language ▼ (lower / bottom line in transcript) -->
                <div class="lang-section">
                  <label class="lang-label" for="ccplus-lang-lower"
                    >▼ {i18n("language_lower")}</label
                  >
                  <select
                    id="ccplus-lang-lower"
                    class="lang-select"
                    value={selectedLangLower}
                    onchange={(e) =>
                      handleLowerLangChange(
                        (e.target as HTMLSelectElement).value
                      )}
                  >
                    <option value="">{i18n("no_translation")}</option>
                    {#each unifiedLanguages as lang}
                      <option value={lang.languageCode}>
                        {lang.isOriginal
                          ? "● "
                          : ""}{lang.languageName}{lang.kind === "asr"
                          ? ` (${i18n("auto_generated")})`
                          : ""}
                      </option>
                    {/each}
                  </select>
                </div>
              </div>
            {/if}
          </div>
        {/if}

        <div class="font-size-control">
          <button
            class="ytp-button"
            style="width: 24px;height:24px;display: flex; align-items: center; justify-content: center;"
            aria-label={i18n("font_size")}
            title={i18n("font_size")}
            onclick={(e) => {
              e.stopPropagation();
              showFontSizePopup = !showFontSizePopup;
              showLangPopup = false;
            }}
          >
            <svg viewBox="0 0 24 24" height="18" width="18">
              <path
                fill="currentColor"
                d="M9 4v3h5v12h3V7h5V4H9zm-6 8h3v7h3v-7h3V9H3v3z"
              />
            </svg>
          </button>
          {#if showFontSizePopup}
            <div class="font-size-popup">
              <button
                class="font-size-btn"
                onclick={decreaseFontSize}
                disabled={fontSize <= MIN_FONT_SIZE}
                aria-label="decrease font size"
              >
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill="currentColor" d="M19 13H5v-2h14v2z" />
                </svg>
              </button>
              <span class="font-size-value">{fontSize}px</span>
              <button
                class="font-size-btn"
                onclick={increaseFontSize}
                disabled={fontSize >= MAX_FONT_SIZE}
                aria-label="increase font size"
              >
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path
                    fill="currentColor"
                    d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"
                  />
                </svg>
              </button>
            </div>
          {/if}
        </div>

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
          style={`font-size: ${fontSize}px;`}
          onmouseenter={handleMouseEnter}
          onmouseleave={handleMouseLeave}
        >
          {#each filteredCaption as { start, dur, content, secondContent }}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <div
              role="button"
              class="caption-line"
              id={`caption-line-${start}`}
              style={videoCurrentTime > Number(start) + Number(dur) / 2
                ? `opacity: 0.5;`
                : ``}
              tabindex="0"
              data-start={start}
              data-dur={dur}
              onclick={() => toTimeStamp(start)}
              onkeypress={(e) =>
                (e.key === "Enter" || e.key === " ") && toTimeStamp(start)}
            >
              <span class="timestamp">{formatTimestamp(start)}</span>
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
            {#if isLanguageSwitching}
              {i18n("loading_captions").split("...")[0]}...
            {:else}
              {i18n("loading_captions")}
            {/if}
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
    border: none;
    border-radius: 99px;
    height: 34px;
    width: calc(100% - 24px);
    margin-bottom: 12px;
    font-size: 14px;
    font-weight: 500;
    line-height: 34px;
    color: var(--yt-spec-text-primary);
    text-align: center;
    background-color: var(--yt-spec-additive-background);
    cursor: pointer;
    transition: background-color 0.15s;
  }

  .show-btn:hover {
    background-color: var(--yt-spec-button-chip-background-hover);
  }

  .transcript {
    overflow: auto;
    font-family: Arial, sans-serif;
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
    padding: 6px 4px;
    border-radius: 6px;
    transition: background-color 0.15s;
  }

  .caption-content {
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex: 1;
    line-height: 1.45;
  }

  .timestamp {
    flex-shrink: 0;
    min-width: 3.2em;
    margin-right: 8px;
    padding-top: 1px;
    color: var(--yt-spec-text-secondary, #aaa);
    font-size: 0.8em;
    font-family: "Roboto Mono", "SF Mono", "Menlo", monospace;
    font-variant-numeric: tabular-nums;
    text-align: right;
    user-select: none;
  }

  .text {
    color: var(--yt-spec-text-primary);
  }

  .text.secondary {
    color: var(--yt-spec-text-secondary);
    font-size: 0.88em;
    opacity: 0.8;
  }

  .caption-line:hover {
    background-color: var(
      --yt-spec-10-percent-layer,
      rgba(255, 255, 255, 0.08)
    );
    cursor: pointer;
  }

  .caption-line:active {
    background-color: var(
      --yt-spec-10-percent-layer,
      rgba(255, 255, 255, 0.08)
    );
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

  .font-size-control {
    position: relative;
  }

  .font-size-popup {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--yt-spec-menu-background, #282828);
    border: 1px solid var(--yt-spec-10-percent-layer);
    border-radius: 8px;
    padding: 8px 12px;
    z-index: 100;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .font-size-btn {
    background: transparent;
    border: none;
    color: var(--yt-spec-text-primary);
    cursor: pointer;
    padding: 6px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .font-size-btn:hover:not(:disabled) {
    background: var(--yt-spec-10-percent-layer);
  }

  .font-size-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .font-size-value {
    font-size: 12px;
    color: var(--yt-spec-text-secondary);
    min-width: 36px;
    text-align: center;
  }

  /* Language control styles */
  .lang-control {
    position: relative;
  }

  .lang-popup {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: var(--yt-spec-menu-background, #282828);
    border: 1px solid var(--yt-spec-10-percent-layer);
    border-radius: 8px;
    padding: 12px;
    z-index: 100;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    min-width: 200px;
  }

  .lang-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .lang-label {
    font-size: 11px;
    font-weight: 500;
    color: var(--yt-spec-text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .lang-select {
    background: var(--yt-spec-base-background, #0f0f0f);
    color: var(--yt-spec-text-primary);
    border: 1px solid var(--yt-spec-10-percent-layer);
    border-radius: 6px;
    padding: 6px 8px;
    font-size: 13px;
    cursor: pointer;
    outline: none;
    appearance: auto;
    max-width: 220px;
  }

  .lang-select:hover {
    border-color: var(--yt-spec-text-secondary);
  }

  .lang-select:focus {
    border-color: var(--yt-spec-call-to-action, #3ea6ff);
  }
</style>
