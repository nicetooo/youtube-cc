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
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    console.log(
      sender.tab
        ? "from a content script:" + sender.tab.url
        : "from the extension"
    );
    if (request.greeting === "hello") sendResponse({ farewell: "goodbye" });
  });
  console.log("Hello background!", { id: browser.runtime.id });
});
