<script lang="ts">
  import { waitFor } from "./utils/wait";

  let { isAdRemoveOn } = $props();
  async function removeAd() {
    if (!isAdRemoveOn) {
      return;
    }

    if (location.pathname === "/") {
      //主页
      waitFor(
        () =>
          document.querySelectorAll(
            "ytd-rich-item-renderer:has(ytd-ad-slot-renderer)"
          )[0]
      ).then(() => {
        const ads = document.querySelectorAll(
          "ytd-rich-item-renderer:has(ytd-ad-slot-renderer)"
        );
        // console.log("remove ads ytd-rich-item-renderer");
        ads.forEach((a) => {
          a.remove();
        });
      });

      waitFor(() => document.getElementById("masthead-ad")).then(() => {
        const mastheadAd = document.getElementById("masthead-ad");
        if (mastheadAd) {
          // console.log("remove ads masthead-ad");
          mastheadAd.remove();
        }
      });
    }

    if (location.pathname === "/watch") {
      //视频详情页
      waitFor(() => document.querySelectorAll("ytd-ad-slot-renderer")[0]).then(
        () => {
          // console.log("remove ads ytd-ad-slot-renderer");
          const ads = document.querySelectorAll("ytd-ad-slot-renderer");
          ads.forEach((a) => {
            a.remove();
          });
        }
      );

      waitFor(() => document.getElementById("player-ads")).then(() => {
        const companion = document.getElementById("player-ads");
        if (companion) {
          // console.log("player-ads");
          companion.remove();
        }
      });
    }

    if (location.pathname === "/results") {
      // 搜索结果页
      waitFor(
        () =>
          document.querySelectorAll(
            "ytd-search-pyv-renderer:has(ytd-ad-slot-renderer)"
          )[0]
      ).then(() => {
        // console.log("remove ads ytd-search-pyv-renderer");
        const ads = document.querySelectorAll(
          "ytd-search-pyv-renderer:has(ytd-ad-slot-renderer)"
        );
        ads.forEach((a) => {
          a.remove();
        });
      });
    }
  }

  $effect(() => {
    if (isAdRemoveOn) {
      removeAd();
    }
  });

  onMount(() => {
    chrome.runtime.onMessage.addListener(
      function (message, sender, sendResponse) {
        switch (message.type) {
          case "url_change": {
            removeAd();
            break;
          }
          case "has_load_more": {
            removeAd();
            break;
          }
          default: {
            // console.log("unhandled", message);
            break;
          }
        }
      }
    );
  });
</script>

<div id="ads-remove"></div>
