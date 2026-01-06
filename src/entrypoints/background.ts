import { updateSelectorsFromGithub } from "@/features/ads/ad-selectors";

export default defineBackground(() => {
  const queue: Array<(p: chrome.runtime.Port) => void> = [];

  // --- Ad Selectors Sync Logic ---
  
  // Update every 6 hours
  chrome.alarms.create("update-selectors", { periodInMinutes: 6 * 60 });
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "update-selectors") {
      updateSelectorsFromGithub();
    }
  });

  // Run once on startup
  updateSelectorsFromGithub();

  // --- Runtime Messaging Logic ---

  chrome.runtime.onConnect.addListener((port) => {
    // Intercept timedtext requests
    chrome.webRequest.onBeforeRequest.addListener(
      (details) => {
        if (port) {
          handleRequest(details, port);
        } else {
          queue.push((p: chrome.runtime.Port) => handleRequest(details, p));
        }
      },
      { urls: ["*://www.youtube.com/*"] }
    );

    // Watch for internal YouTube URL changes (SPA navigation)
    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
      if (port) {
        handleUrlUpdate(tabId, changeInfo, tab, port);
      } else {
        queue.push((p: chrome.runtime.Port) =>
          handleUrlUpdate(tabId, changeInfo, tab, p)
        );
      }
    });

    // Process queued messages once connected
    if (port) {
      while (queue.length > 0) {
        const func = queue.pop();
        if (func) func(port);
      }
    }
  });
});

function handleRequest(
  details: chrome.webRequest.WebRequestDetails,
  port: chrome.runtime.Port
) {
  if (details.url && details.url.includes("/api/timedtext")) {
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
