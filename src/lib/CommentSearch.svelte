<script lang="ts">
  import { observeNodeAdd } from "./utils/observe";
  import { i18n } from "./i18n";
  import { debounce } from "lodash-es";
  import { waitFor } from "./utils/wait";

  let {
    isCommentSearchOn,
    isSideComment,
  }: {
    isCommentSearchOn: boolean;
    isSideComment: boolean;
  } = $props();

  let commentSearch: HTMLDivElement | null = $state(null);
  let commentShow: boolean = $state(false);
  let input: HTMLInputElement | null = $state(null);
  let searchValue: string = $state("");

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
        if (
          contentString.innerText
            .toLowerCase()
            .includes(searchValue.toLowerCase())
        ) {
          c.style.display = "block";
        } else {
          c.style.display = "none";
        }
      });
  }

  let disconnect: () => void | null;

  const setUpObserve = () => observeNodeAdd(search);

  $effect(() => {
    if (isCommentSearchOn) {
      disconnect = setUpObserve();
    } else {
      disconnect?.();
    }
  });

  async function setUpSearch() {
    const ytdComments = await waitFor<HTMLDivElement>(() =>
      document.querySelector("#comments ytd-item-section-renderer"),
    );
    await waitFor(() =>
      document.querySelector(
        "ytd-comment-thread-renderer yt-attributed-string",
      ),
    );
    const search = await waitFor<HTMLDivElement>(() =>
      document.querySelector("#comment-search"),
    );
    commentShow = true;
    ytdComments.style.position = "relative";
    ytdComments.prepend(search);

    if (isCommentSearchOn) {
      disconnect = setUpObserve();
    }
  }

  $inspect({ isCommentSearchOn });
  onMount(() => {
    console.log("Current UI Language:", browser.i18n.getUILanguage());
    setUpSearch();
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
  bind:this={commentSearch}
>
  <div class="flex" style="height: 34px;border-radius: 99px;">
    <input
      type="text"
      class="flex-grow"
      tabindex={0}
      bind:this={input}
      bind:value={searchValue}
      placeholder={i18n("search_comment")}
      onclick={(e) => e.stopPropagation()}
      onkeypress={(e) => e.stopPropagation()}
      oninput={debounce(search, 1000)}
    />
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
</style>
