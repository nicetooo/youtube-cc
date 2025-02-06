<script lang="ts">
  import { observeNodeAdd } from "./utils/observe";
  let {
    isAdRemoveOn,
  }: {
    isAdRemoveOn: boolean;
    port: chrome.runtime.Port;
  } = $props();

  let disconnect: () => void | null;

  const setUp = () =>
    observeNodeAdd(() => {
      //主页
      if (location.pathname === "/") {
        const ads = document.querySelectorAll(
          "ytd-rich-item-renderer:has(ytd-ad-slot-renderer)"
        );
        ads.forEach((a) => a.remove());

        const mastheadAd = document.getElementById("masthead-ad");
        mastheadAd?.remove();
      }

      //视频详情页
      if (location.pathname === "/watch") {
        const ads = document.querySelectorAll("ytd-ad-slot-renderer");
        ads.forEach((a) => {
          a.remove();
        });

        const companion = document.getElementById("player-ads");
        companion?.remove();
      }

      // 搜索结果页
      if (location.pathname === "/results") {
        const ads = document.querySelectorAll("ytd-ad-slot-renderer");
        ads.forEach((a: any) => {
          a.remove();
        });
      }
    });

  $effect(() => {
    if (isAdRemoveOn) {
      disconnect = setUp();
    } else {
      disconnect?.();
    }
  });

  $inspect({ isAdRemoveOn });
  onMount(() => {
    if (isAdRemoveOn) {
      disconnect = setUp();
    }
  });
</script>

<div id="ads-remove"></div>
