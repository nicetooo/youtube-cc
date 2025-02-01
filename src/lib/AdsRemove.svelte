<script lang="ts">
  import { waitFor } from "./utils/wait";

  const isAdRemoveOn = $state(true);
  async function removeAd() {
    if (!isAdRemoveOn) {
      return;
    }
    if (location.pathname === "/") {
      await waitFor(
        () =>
          document.querySelectorAll(
            "ytd-rich-item-renderer:has(ytd-ad-slot-renderer)"
          )[0]
      );
      const ads = document.querySelectorAll(
        "ytd-rich-item-renderer:has(ytd-ad-slot-renderer)"
      );
      ads.forEach((a) => {
        a.remove();
      });

      const mastheadAd = document.getElementById("masthead-ad");
      if (mastheadAd) {
        mastheadAd.remove();
      }
    }

    if (location.pathname === "/watch") {
      await waitFor(() => document.querySelectorAll("ytd-ad-slot-renderer")[0]);
      const ads = document.querySelectorAll("ytd-ad-slot-renderer");
      ads.forEach((a) => {
        a.remove();
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
    // removeAd();
  });
</script>

<div id="ads-remove"></div>
