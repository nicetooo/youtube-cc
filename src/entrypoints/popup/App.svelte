<script lang="ts">
  import "carbon-components-svelte/css/g90.css";
  import { Toggle } from "carbon-components-svelte";
  import {
    appStore,
    subscribeStorageChange,
  } from "../../lib/store/settings.svelte";

  $inspect({ $appStore });
  onMount(() => {
    subscribeStorageChange();
  });
</script>

<main>
  <div class="flex flex-col gap-9" style="width: 250px;">
    <div class="flex justify-between">
      <Toggle
        labelText={browser.i18n.getMessage("transcription")}
        labelA={browser.i18n.getMessage("label_a")}
        labelB={browser.i18n.getMessage("label_b")}
        bind:toggled={$appStore.settings.caption}
      />
      <Toggle
        labelText={browser.i18n.getMessage("wide_screen")}
        labelA={browser.i18n.getMessage("label_a")}
        labelB={browser.i18n.getMessage("label_b")}
        bind:toggled={$appStore.settings.wideScreen}
      />
    </div>
    <div class="flex justify-between">
      <Toggle
        labelText={browser.i18n.getMessage("skip_video_ads")}
        labelA={browser.i18n.getMessage("label_a")}
        labelB={browser.i18n.getMessage("label_b")}
        bind:toggled={$appStore.settings.skipAd}
      />
      <Toggle
        labelText={browser.i18n.getMessage("remove_ad_items")}
        labelA={browser.i18n.getMessage("label_a")}
        labelB={browser.i18n.getMessage("label_b")}
        bind:toggled={$appStore.settings.removeAds}
      />
    </div>
  </div>
</main>

<style>
</style>
