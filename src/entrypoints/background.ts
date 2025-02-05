export default defineBackground(() => {
  const queue: any = [];

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
      // console.log("connected run queue");
      while (!!queue.length) {
        const func = queue.pop();
        func(port);
      }
    }
  });
});

function handleRequest(details: any, port: chrome.runtime.Port) {
  if (details.url.includes("/api/timedtext")) {
    // console.log("more text request");
    port.postMessage({
      type: "timedtext_url",
      url: details.url,
    });
  }
}

function handleUrlUpdate(
  tabId: any,
  changeInfo: any,
  tab: any,
  port: chrome.runtime.Port
) {
  if (changeInfo.url) {
    port.postMessage({
      type: "url_change",
      url: changeInfo.url,
    });
  }
}
