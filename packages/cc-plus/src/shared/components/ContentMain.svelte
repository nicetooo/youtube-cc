<script lang="ts">
  import { onMount } from "svelte";
  import AdSkip from "@/features/ads/AdSkip.svelte";
  import AdSkipEnlarge from "@/features/ads/AdSkipEnlarge.svelte";
  import AdsRemove from "@/features/ads/AdsRemove.svelte";
  import CaptionList from "@/features/caption/CaptionList.svelte";
  import SideComment from "@/features/comments/SideComment.svelte";
  import WideScreen from "@/features/player/WideScreen.svelte";

  import {
    appStore,
    subscribeStorageChange,
  } from "@/shared/stores/settings.svelte";
  import CommentSearch from "@/features/comments/CommentSearch.svelte";

  const port = chrome.runtime.connect();

  $inspect({
    $appStore,
  });

  onMount(() => {
    subscribeStorageChange();
  });

  function handleFontSizeChange(size: number) {
    appStore.update((v) => ({
      ...v,
      settings: {
        ...v.settings,
        captionFontSize: size,
      },
    }));
  }

  function handleLangChange(primary: string, secondary: string) {
    appStore.update((v) => ({
      ...v,
      settings: {
        ...v.settings,
        captionPrimaryLang: primary,
        captionSecondaryLang: secondary,
      },
    }));
  }
</script>

{#if $appStore.isStorageLoad}
  <div id="cc-plus-container" class="cc-plus-style-root">
    <CaptionList
      isCaptionOn={$appStore.settings.caption}
      {port}
      fontSize={$appStore.settings.captionFontSize ?? 14}
      onFontSizeChange={handleFontSizeChange}
      preferredPrimaryLang={$appStore.settings.captionPrimaryLang ?? ""}
      preferredSecondaryLang={$appStore.settings.captionSecondaryLang ?? ""}
      onLangChange={handleLangChange}
    ></CaptionList>
    <SideComment isSideComment={$appStore.settings.sideComment} {port}
    ></SideComment>
    <AdsRemove isAdRemoveOn={$appStore.settings.removeAds} {port}></AdsRemove>
    <WideScreen isWideScreenOn={$appStore.settings.wideScreen} {port}
    ></WideScreen>
    <AdSkip isAdSkipOn={$appStore.settings.skipAd} {port}></AdSkip>
    <AdSkipEnlarge
      isEnlargeSkipButtonOn={$appStore.settings.enlargeSkipButton ?? false}
    ></AdSkipEnlarge>
    <CommentSearch
      isCommentSearchOn={$appStore.settings.commentSearch}
      isSideComment={$appStore.settings.sideComment}
    ></CommentSearch>
  </div>
{/if}
