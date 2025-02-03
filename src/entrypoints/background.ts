export default defineBackground(() => {
  function syncSettings() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0].id;
      if (!activeTab) {
        return;
      }
      chrome.storage.local.get(["settings"], (result) => {
        console.log("State loaded:", result);
        if (result.settings) {
          chrome.tabs.sendMessage(
            activeTab,
            {
              type: "setting_init",
              data: result.setting,
            },
            (response) => {
              console.log("Response from content script:", response);
            }
          );
        }
      });
    });
  }

  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.url) {
      console.log("Tab URL: ", changeInfo.url);
      chrome.tabs.sendMessage(tabId, {
        type: "url_change",
        url: changeInfo.url,
      });
    }
  });

  chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      if (details.url.includes("/api/timedtext")) {
        console.log("Request detected:", details);
        chrome.tabs.sendMessage(details.tabId, {
          type: "timedtext_url",
          url: details.url,
        });
      }
      if (details.url.includes("/youtubei/v1/browse")) {
        console.log("has_load_more");
        chrome.tabs.sendMessage(details.tabId, {
          type: "has_load_more",
        });
      }
    },
    { urls: ["*://www.youtube.com/*"] }
  );

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message);
    const { type, data } = message;
    if (type === "content_script_ready") {
      console.log(type);
      chrome.storage.local.get(["settings"], (result) => {
        console.log("sending init settings", result.settings);
        chrome.runtime.sendMessage({
          type: "init_settings",
          data: result.settings,
        });
      });
    }
    // 注意 ⚠️，这个返回 true 很重要，不然sendResponse不能正常工作
    return true;
  });

  console.log("Hello background!", { id: browser.runtime.id });
});
