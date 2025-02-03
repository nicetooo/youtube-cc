<script lang="ts">
  import "carbon-components-svelte/css/g90.css";
  import { Toggle } from "carbon-components-svelte";
  let isStorageLoad = false;
  let settings = $state({
    caption: false,
    wideScreen: false,
    skipAd: false,
    removeAds: false,
  });

  $effect(() => {
    console.log({ ...settings });
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
      const { settings: storageSettings } =
        await chrome.storage.local.get("settings");
      if (storageSettings) {
        settings = storageSettings;
      }
      isStorageLoad = true;
    });
  });
</script>

<main>
  <div class="flex flex-col gap-3" style="width: 250px;">
    <div class="flex justify-between">
      <Toggle labelText="Caption" bind:toggled={settings.caption} />
      <Toggle labelText="WideScreen" bind:toggled={settings.wideScreen} />
    </div>
    <div class="flex justify-between">
      <Toggle labelText="Skip Video Ads" bind:toggled={settings.skipAd} />
      <Toggle labelText="Remove Ad Items" bind:toggled={settings.removeAds} />
    </div>
  </div>
</main>

<style>
</style>
