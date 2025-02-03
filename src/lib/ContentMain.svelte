<script lang="ts">
  import AdSkip from "./AdSkip.svelte";
  import AdsRemove from "./AdsRemove.svelte";
  import CaptionList from "./CaptionList.svelte";
  import WideScreen from "./WideScreen.svelte";

  let isStorageLoad = false;
  let settings = $state({
    caption: false,
    wideScreen: false,
    skipAd: false,
    removeAds: false,
  });

  onMount(async () => {
    console.log("popup mount");

    const { settings: storageSettings } =
      await chrome.storage.local.get("settings");
    if (storageSettings) {
      settings = storageSettings;
    }
    isStorageLoad = true;

    chrome.storage.onChanged.addListener((changes) => {
      const { settings: storageSettings } = changes;

      if (storageSettings.newValue) {
        settings = storageSettings.newValue;
      }
    });
  });
</script>

<CaptionList isCaptionOn={settings.caption}></CaptionList>
<AdsRemove isAdRemoveOn={settings.removeAds}></AdsRemove>
<WideScreen isWideScreenOn={settings.wideScreen}></WideScreen>
<AdSkip isAdSkipOn={settings.skipAd}></AdSkip>
