<script lang="ts">
  let {
    isAdRemoveOn,
  }: {
    isAdRemoveOn: boolean;
    port: chrome.runtime.Port;
  } = $props();

  let needAdsCheck = true;
  const observe = () => {
    const observer = new MutationObserver((mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          if (mutation.addedNodes.length) {
            needAdsCheck = true;
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true, // 监听子元素的添加/删除
      subtree: true, // 监听整个 DOM 树的变化
    });
  };

  function checkElement() {
    if (!needAdsCheck || !isAdRemoveOn) {
      requestAnimationFrame(checkElement);
      return;
    }

    console.log("ads check");
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

    needAdsCheck = false;
    requestAnimationFrame(checkElement);
  }

  $inspect({ isAdRemoveOn });
  onMount(() => {
    observe();
    checkElement();
  });
</script>

<div id="ads-remove"></div>
