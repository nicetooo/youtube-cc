import { updateSelectorsFromGithub } from "@/features/ads/ad-selectors";

export default defineBackground(() => {
  // 存储所有活跃的 port 连接
  const ports = new Map<number, chrome.runtime.Port>();

  // --- Ad Selectors Sync Logic ---

  // Update every 6 hours
  chrome.alarms.create("update-selectors", { periodInMinutes: 6 * 60 });
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "update-selectors") {
      updateSelectorsFromGithub().catch(console.error);
    }
  });

  // Run once on startup
  updateSelectorsFromGithub().catch(console.error);

  // --- Runtime Messaging Logic ---

  // 只注册一次 webRequest 监听器
  chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
      // 发送给所有连接的 port
      for (const port of ports.values()) {
        handleRequest(details, port);
      }
    },
    { urls: ["*://www.youtube.com/*"] }
  );

  // 只注册一次 tabs.onUpdated 监听器
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // 只发送给对应 tab 的 port
    const port = ports.get(tabId);
    if (port) {
      handleUrlUpdate(tabId, changeInfo, tab, port);
    }
  });

  // 处理连接和断开
  chrome.runtime.onConnect.addListener((port) => {
    // 获取 tab ID
    const tabId = port.sender?.tab?.id;
    if (tabId !== undefined) {
      ports.set(tabId, port);

      // 监听断开连接，清理 port
      port.onDisconnect.addListener(() => {
        ports.delete(tabId);
      });
    }
  });
});

function handleRequest(
  details: chrome.webRequest.WebRequestDetails,
  port: chrome.runtime.Port
) {
  if (details.url && details.url.includes("/api/timedtext")) {
    try {
      port.postMessage({
        type: "timedtext_url",
        url: details.url,
      });
    } catch {
      // port 可能已断开，忽略错误
    }
  }
}

function handleUrlUpdate(
  _tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  _tab: chrome.tabs.Tab,
  port: chrome.runtime.Port
) {
  if (changeInfo.url) {
    try {
      port.postMessage({
        type: "url_change",
        url: changeInfo.url,
      });
    } catch {
      // port 可能已断开，忽略错误
    }
  }
}
