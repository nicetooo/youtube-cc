<script lang="ts">
  import Switch from "@smui/switch";
  import FormField from "@smui/form-field";
  import Card, { Content } from "@smui/card";
  import "svelte-material-ui/themes/svelte-dark.css";
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
  <Card variant="outlined" padded>
    <div class="flex flex-col gap-3" style="width: 200px;">
      <FormField>
        <Switch bind:checked={$appStore.settings.caption} />
        {#snippet label()}
          {browser.i18n.getMessage("transcription")}
        {/snippet}
      </FormField>

      <FormField>
        <Switch bind:checked={$appStore.settings.wideScreen} />
        {#snippet label()}
          {browser.i18n.getMessage("wide_screen")}
        {/snippet}
      </FormField>
      <FormField>
        <Switch bind:checked={$appStore.settings.skipAd} />
        {#snippet label()}
          {browser.i18n.getMessage("skip_video_ads")}
        {/snippet}
      </FormField>
      <FormField>
        <Switch bind:checked={$appStore.settings.removeAds} />
        {#snippet label()}
          {browser.i18n.getMessage("remove_ad_items")}
        {/snippet}
      </FormField>
      <FormField>
        <Switch bind:checked={$appStore.settings.sideComment} />
        {#snippet label()}
          {browser.i18n.getMessage("side_comments")}
        {/snippet}
      </FormField>
      <FormField>
        <Switch bind:checked={$appStore.settings.commentSearch} />
        {#snippet label()}
          {browser.i18n.getMessage("search_comment")}
        {/snippet}
      </FormField>
    </div></Card
  >
</main>

<style>
</style>
