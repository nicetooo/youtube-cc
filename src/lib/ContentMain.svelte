<script lang="ts">
  import AdSkip from "./AdSkip.svelte";
  import AdsRemove from "./AdsRemove.svelte";
  import CaptionList from "./CaptionList.svelte";
  import WideScreen from "./WideScreen.svelte";

  let isStorageLoad = $state(false);
  let caption = $state(true);
  let wideScreen = $state(true);
  let skipAd = $state(true);
  let removeAds = $state(true);

  onMount(async () => {
    console.log("content mount");

    const { settings } = await chrome.storage.local.get("settings");
    if (settings) {
      caption = settings.caption;
      wideScreen = settings.wideScreen;
      skipAd = settings.skipAd;
      removeAds = settings.removeAds;
    }
    isStorageLoad = true;

    chrome.storage.onChanged.addListener((changes) => {
      const { settings } = changes;

      if (settings.newValue) {
        caption = settings.newValue.caption;
        wideScreen = settings.newValue.wideScreen;
        skipAd = settings.newValue.skipAd;
        removeAds = settings.newValue.removeAds;
      }
    });
  });
</script>

<CaptionList isCaptionOn={caption}></CaptionList>
<AdsRemove isAdRemoveOn={removeAds}></AdsRemove>
<WideScreen isWideScreenOn={wideScreen}></WideScreen>
<AdSkip isAdSkipOn={skipAd}></AdSkip>
