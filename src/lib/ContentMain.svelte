<script lang="ts">
  import AdSkip from "./AdSkip.svelte";
  import AdsRemove from "./AdsRemove.svelte";
  import CaptionList from "./CaptionList.svelte";
  import SideComment from "./SideComment.svelte";
  import WideScreen from "./WideScreen.svelte";
  import "svelte-material-ui/themes/fixation-dark.css";
  import { appStore, subscribeStorageChange } from "./store/settings.svelte";
  import CommentSearch from "./CommentSearch.svelte";

  const port = chrome.runtime.connect();

  $inspect({
    $appStore,
  });

  onMount(() => {
    subscribeStorageChange();
  });
</script>

{#if $appStore.isStorageLoad}
  <SideComment isSideComment={$appStore.settings.sideComment} {port}
  ></SideComment>
  <CaptionList isCaptionOn={$appStore.settings.caption} {port}></CaptionList>
  <AdsRemove isAdRemoveOn={$appStore.settings.removeAds} {port}></AdsRemove>
  <WideScreen isWideScreenOn={$appStore.settings.wideScreen} {port}
  ></WideScreen>
  <AdSkip isAdSkipOn={$appStore.settings.skipAd} {port}></AdSkip>
  <CommentSearch
    isCommentSearchOn={$appStore.settings.commentSearch}
    isSideComment={$appStore.settings.sideComment}
  ></CommentSearch>
{/if}
