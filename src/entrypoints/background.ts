export default defineBackground(() => {
  const queue: Array<(p: chrome.runtime.Port) => void> = [];

  chrome.runtime.onConnect.addListener((port) => {
    chrome.webRequest.onBeforeRequest.addListener(
      (details) => {
        if (port) {
          handleRequest(details, port);
        } else {
          queue.push((p: chrome.runtime.Port) => handleRequest(details, p));
        }
      },
      {
        urls: ["*://www.youtube.com/*"],
      }
    );

    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
      if (port) {
        handleUrlUpdate(tabId, changeInfo, tab, port);
      } else {
        queue.push((p: chrome.runtime.Port) =>
          handleUrlUpdate(tabId, changeInfo, tab, p)
        );
      }
    });

    if (port) {
      while (queue.length > 0) {
        const func = queue.pop();
        if (func) {
          func(port);
        }
      }
    }
  });
});

function handleRequest(
  details: chrome.webRequest.WebRequestDetails,
  port: chrome.runtime.Port
) {
  if (details.url && details.url.includes("/api/timedtext")) {
    console.log("[Background] Timedtext URL intercepted:", details.url);
    port.postMessage({
      type: "timedtext_url",
      url: details.url,
    });
  }
}

function handleUrlUpdate(
  _tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  _tab: chrome.tabs.Tab,
  port: chrome.runtime.Port
) {
  if (changeInfo.url) {
    port.postMessage({
      type: "url_change",
      url: changeInfo.url,
    });
  }
}
