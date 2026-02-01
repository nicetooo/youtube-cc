<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { observeNodeAdd } from "@/shared/utils/observe";
  import { i18n } from "@/shared/i18n/i18n";
  import { debounce } from "lodash-es";
  import { waitFor } from "@/shared/utils/wait";

  let {
    isCommentSearchOn,
    isSideComment,
  }: {
    isCommentSearchOn: boolean;
    isSideComment: boolean;
  } = $props();

  let commentShow: boolean = $state(false);
  let searchValue: string = $state("");

  /** Store original innerHTML for each yt-attributed-string to restore on clear */
  const originalHtmlMap = new WeakMap<HTMLElement, string>();

  /**
   * Highlight matching text in a DOM element.
   * Uses TreeWalker to find text nodes and wraps matches in <mark> tags.
   * Preserves the existing DOM structure (links, emoji, etc.).
   */
  function highlightElement(el: HTMLElement, query: string): void {
    // Save original HTML on first encounter
    if (!originalHtmlMap.has(el)) {
      originalHtmlMap.set(el, el.innerHTML);
    } else {
      // Restore original before re-highlighting
      el.innerHTML = originalHtmlMap.get(el)!;
    }

    if (!query) return;

    const lowerQuery = query.toLowerCase();
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    let node: Text | null;
    while ((node = walker.nextNode() as Text | null)) {
      textNodes.push(node);
    }

    for (const textNode of textNodes) {
      const text = textNode.textContent || "";
      const lowerText = text.toLowerCase();
      if (!lowerText.includes(lowerQuery)) continue;

      // Split and rebuild with <mark> wrappers
      const frag = document.createDocumentFragment();
      let lastIdx = 0;
      let idx = lowerText.indexOf(lowerQuery, lastIdx);
      while (idx !== -1) {
        // Text before match
        if (idx > lastIdx) {
          frag.appendChild(document.createTextNode(text.slice(lastIdx, idx)));
        }
        // Matched text in <mark>
        const mark = document.createElement("mark");
        mark.textContent = text.slice(idx, idx + query.length);
        frag.appendChild(mark);
        lastIdx = idx + query.length;
        idx = lowerText.indexOf(lowerQuery, lastIdx);
      }
      // Remaining text
      if (lastIdx < text.length) {
        frag.appendChild(document.createTextNode(text.slice(lastIdx)));
      }
      textNode.parentNode?.replaceChild(frag, textNode);
    }
  }

  function search() {
    document
      .querySelectorAll<HTMLDivElement>("ytd-comment-thread-renderer")
      .forEach((c) => {
        const contentString = c
          .querySelector("ytd-comment-view-model")
          ?.querySelector("yt-attributed-string") as HTMLDivElement | null;
        if (!contentString) {
          return;
        }
        if (!searchValue) {
          c.style.display = "block";
          // Restore original HTML when search is cleared
          highlightElement(contentString, "");
          return;
        }
        if (
          contentString.innerText
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        ) {
          c.style.display = "block";
          highlightElement(contentString, searchValue);
        } else {
          c.style.display = "none";
          // Restore hidden comments too
          highlightElement(contentString, "");
        }
      });
  }

  let disconnect: (() => void) | null = null;

  const setUpObserve = () => observeNodeAdd(search);

  $effect(() => {
    if (isCommentSearchOn) {
      disconnect = setUpObserve();
    } else {
      disconnect?.();
    }
  });

  async function setUpSearch() {
    const ytdComments = await waitFor<HTMLDivElement>(
      () =>
        document.querySelector(
          "#comments ytd-item-section-renderer"
        ) as HTMLDivElement
    );
    await waitFor(() =>
      document.querySelector("ytd-comment-thread-renderer yt-attributed-string")
    );
    const search = await waitFor<HTMLDivElement>(
      () => document.querySelector("#comment-search") as HTMLDivElement
    );
    commentShow = true;
    ytdComments.style.position = "relative";
    ytdComments.prepend(search);

    if (isCommentSearchOn) {
      disconnect = setUpObserve();
    }
  }

  onMount(() => {
    // console.log("Current UI Language:", browser.i18n.getUILanguage());
    setUpSearch();
  });

  onDestroy(() => {
    disconnect?.();
    disconnect = null;
  });
</script>

<div
  id="comment-search"
  style={`
    display: ${isCommentSearchOn && commentShow ? "block" : "none"};
    position: sticky;
    top: 0;
    padding-top: ${isSideComment ? "unset" : "10px"};
    background: ${window.getComputedStyle(document.documentElement).backgroundColor};
    z-index: 100;
    border-radius: 99px;
`}
>
  <div
    class="flex"
    style="height: 34px;border-radius: 99px; position: relative;"
  >
    <input
      type="text"
      class="flex-grow"
      style="padding-right: 32px;"
      tabindex={0}
      bind:value={searchValue}
      placeholder={i18n("search_comment")}
      onclick={(e) => e.stopPropagation()}
      onkeypress={(e) => e.stopPropagation()}
      oninput={debounce(search, 1000)}
    />
    {#if searchValue}
      <button
        class="clear-btn"
        aria-label="clear"
        title="clear"
        onclick={() => {
          searchValue = "";
          search();
        }}
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
</div>

<style>
  input {
    color: var(--yt-spec-text-primary);
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

  :global(ytd-comment-thread-renderer mark) {
    background-color: rgba(62, 166, 255, 0.3);
    color: inherit;
    border-radius: 2px;
    padding: 0 1px;
  }
</style>
