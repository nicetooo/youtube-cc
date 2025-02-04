<script lang="ts">
  import AdSkip from "./AdSkip.svelte";
  import AdsRemove from "./AdsRemove.svelte";
  import CaptionList from "./CaptionList.svelte";
  import WideScreen from "./WideScreen.svelte";

  const port = chrome.runtime.connect();
  let isStorageLoad = $state(false);

  //settings
  let caption = $state(true);
  let skipAd = $state(true);
  let removeAds = $state(true);
  let wideScreen = $state(false);

  $effect(() => {
    if (isStorageLoad) {
      chrome.storage.onChanged.addListener((changes) => {
        const { settings } = changes;

        if (settings.newValue) {
          caption = settings.newValue.caption;
          wideScreen = settings.newValue.wideScreen;
          skipAd = settings.newValue.skipAd;
          removeAds = settings.newValue.removeAds;
        }
      });
    }
  });

  onMount(() => {
    chrome.storage.local.get("settings").then(({ settings }) => {
      if (settings) {
        caption = settings.caption;
        wideScreen = settings.wideScreen;
        skipAd = settings.skipAd;
        removeAds = settings.removeAds;
      }
      isStorageLoad = true;
    });
  });
</script>

<CaptionList isCaptionOn={caption} {port}></CaptionList>
<AdsRemove isAdRemoveOn={removeAds} {port}></AdsRemove>
<WideScreen isWideScreenOn={wideScreen} {port}></WideScreen>
<AdSkip isAdSkipOn={skipAd} {port}></AdSkip>
