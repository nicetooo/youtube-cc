export default defineBackground(() => {
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
    },
    { urls: ["*://www.youtube.com/*"] }
  );

  console.log("Hello background!", { id: browser.runtime.id });
});
