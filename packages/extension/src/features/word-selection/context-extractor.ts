// Context extraction utilities for word selection
// Extracts the sentence or paragraph containing the selected text

/**
 * Extract the sentence containing the selected text
 * @param selection - The current text selection
 * @returns The full sentence containing the selection
 */
export function extractSentenceContext(selection: Selection): string {
  if (!selection.rangeCount) return "";

  const range = selection.getRangeAt(0);
  const container = range.commonAncestorContainer;

  // Get the text content of the container
  let fullText = "";
  if (container.nodeType === Node.TEXT_NODE) {
    fullText = container.textContent || "";
  } else if (container.nodeType === Node.ELEMENT_NODE) {
    fullText = (container as Element).textContent || "";
  }

  if (!fullText) return selection.toString();

  const selectedText = selection.toString();
  const selectionStart = fullText.indexOf(selectedText);

  if (selectionStart === -1) return selectedText;

  // Find sentence boundaries
  // Sentence endings: . ! ? 。！？ followed by space or end of string
  const sentenceEndRegex = /[.!?。！？]+[\s\n]|[.!?。！？]+$/g;

  // Find the start of the sentence (look backwards)
  let sentenceStart = 0;
  const beforeSelection = fullText.substring(0, selectionStart);
  const beforeMatches = [...beforeSelection.matchAll(sentenceEndRegex)];
  if (beforeMatches.length > 0) {
    const lastMatch = beforeMatches[beforeMatches.length - 1];
    sentenceStart = (lastMatch.index || 0) + lastMatch[0].length;
  }

  // Find the end of the sentence (look forwards)
  let sentenceEnd = fullText.length;
  const afterSelection = fullText.substring(selectionStart);
  const afterMatch = afterSelection.match(sentenceEndRegex);
  if (afterMatch && afterMatch.index !== undefined) {
    sentenceEnd = selectionStart + afterMatch.index + afterMatch[0].length;
  }

  // Extract and clean the sentence
  let sentence = fullText.substring(sentenceStart, sentenceEnd).trim();

  // If the sentence is too long, truncate it intelligently
  const MAX_CONTEXT_LENGTH = 300;
  if (sentence.length > MAX_CONTEXT_LENGTH) {
    // Try to keep the selected text in the middle
    const selectionPosInSentence = sentence.indexOf(selectedText);
    if (selectionPosInSentence !== -1) {
      const halfLength = Math.floor(
        (MAX_CONTEXT_LENGTH - selectedText.length) / 2
      );
      const start = Math.max(0, selectionPosInSentence - halfLength);
      const end = Math.min(
        sentence.length,
        selectionPosInSentence + selectedText.length + halfLength
      );

      sentence =
        (start > 0 ? "..." : "") +
        sentence.substring(start, end) +
        (end < sentence.length ? "..." : "");
    } else {
      sentence = sentence.substring(0, MAX_CONTEXT_LENGTH) + "...";
    }
  }

  return sentence;
}

/**
 * Check if the selection is within a YouTube caption panel
 * @param selection - The current text selection
 * @returns True if selection is within YouTube caption panel
 */
export function isYouTubeCaptionSelection(selection: Selection): boolean {
  if (!selection.rangeCount) return false;

  const range = selection.getRangeAt(0);
  let node: Node | null = range.commonAncestorContainer;

  // Walk up the DOM tree to find caption-related elements
  while (node && node !== document.body) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;

      // Check for CC Plus caption panel
      if (
        element.classList.contains("cc-plus-caption") ||
        element.closest(".cc-plus-caption") ||
        element.closest("[data-cc-plus-caption]")
      ) {
        return true;
      }

      // Check for YouTube's native caption/transcript panel
      if (
        element.tagName === "YTD-TRANSCRIPT-SEGMENT-RENDERER" ||
        element.closest("ytd-transcript-segment-renderer") ||
        element.closest(
          "ytd-engagement-panel-section-list-renderer[target-id='engagement-panel-searchable-transcript']"
        )
      ) {
        return true;
      }
    }
    node = node.parentNode;
  }

  return false;
}

/**
 * Get the current page information
 * @returns Object with page URL and title
 */
export function getPageInfo(): { url: string; title: string } {
  return {
    url: window.location.href,
    title: document.title,
  };
}

/**
 * Check if current page is YouTube
 * @returns True if on YouTube
 */
export function isYouTubePage(): boolean {
  return window.location.hostname.includes("youtube.com");
}

/**
 * Extract YouTube video ID from current URL
 * @returns Video ID or null
 */
export function getYouTubeVideoId(): string | null {
  if (!isYouTubePage()) return null;

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("v");
}

/**
 * Get YouTube video title from page
 * @returns Video title or undefined
 */
export function getYouTubeVideoTitle(): string | undefined {
  if (!isYouTubePage()) return undefined;

  // Try different selectors for video title
  const titleElement =
    document.querySelector(
      "h1.ytd-video-primary-info-renderer yt-formatted-string"
    ) ||
    document.querySelector("h1.ytd-watch-metadata yt-formatted-string") ||
    document.querySelector('meta[name="title"]');

  if (titleElement) {
    if (titleElement.tagName === "META") {
      return (titleElement as HTMLMetaElement).content;
    }
    return titleElement.textContent || undefined;
  }

  return document.title.replace(" - YouTube", "").trim() || undefined;
}

/**
 * Get the current video timestamp (if on YouTube)
 * @returns Timestamp in seconds or 0
 */
export function getYouTubeTimestamp(): number {
  if (!isYouTubePage()) return 0;

  const video = document.querySelector("video");
  if (video) {
    return Math.floor(video.currentTime);
  }

  return 0;
}
