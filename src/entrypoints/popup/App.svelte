<script lang="ts">
  import "carbon-components-svelte/css/g90.css";
  import { Toggle } from "carbon-components-svelte";
  let isStorageLoad = false;
  let caption = $state(true);
  let wideScreen = $state(true);
  let skipAd = $state(true);
  let removeAds = $state(true);

  $effect(() => {
    const settings = { caption, wideScreen, skipAd, removeAds };
    if (!isStorageLoad) {
      return;
    }
    chrome.storage.local.set({ settings }, () => {
      console.log("State saved");
    });
  });

  onMount(() => {
    console.log("popup mount");
    document.addEventListener("DOMContentLoaded", async () => {
      const { settings } = await chrome.storage.local.get("settings");
      console.log("init settings", settings);
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

<main>
  <div class="flex flex-col gap-9" style="width: 250px;">
    <div class="flex justify-between">
      <Toggle
        labelText={browser.i18n.getMessage("transcription")}
        labelA={browser.i18n.getMessage("label_a")}
        labelB={browser.i18n.getMessage("label_b")}
        bind:toggled={caption}
      />
      <Toggle
        labelText={browser.i18n.getMessage("wide_screen")}
        labelA={browser.i18n.getMessage("label_a")}
        labelB={browser.i18n.getMessage("label_b")}
        bind:toggled={wideScreen}
      />
    </div>
    <div class="flex justify-between">
      <Toggle
        labelText={browser.i18n.getMessage("skip_video_ads")}
        labelA={browser.i18n.getMessage("label_a")}
        labelB={browser.i18n.getMessage("label_b")}
        bind:toggled={skipAd}
      />
      <Toggle
        labelText={browser.i18n.getMessage("remove_ad_items")}
        labelA={browser.i18n.getMessage("label_a")}
        labelB={browser.i18n.getMessage("label_b")}
        bind:toggled={removeAds}
      />
    </div>
  </div>
</main>

<style>
</style>
