import { updateSelectorsFromGithub } from "@/features/ads/ad-selectors";
import {
  initSyncService,
  triggerSync,
  handleWebsiteAuth,
  handleWebsiteWordsResponse,
} from "@/shared/stores/sync";

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

  // --- Firebase Sync Service ---
  initSyncService();

  // --- Message Handlers ---
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    // Translation handler
    if (message.type === "translate") {
      handleTranslate(message.text, message.targetLang)
        .then(sendResponse)
        .catch((err) => sendResponse({ error: err.message }));
      return true; // Keep channel open for async response
    }

    // Manual sync trigger (forceAll uploads all local words, not just pending)
    if (message.type === "sync") {
      const forceAll = message.forceAll === true;
      triggerSync(forceAll)
        .then((success) => sendResponse({ success }))
        .catch((err) => sendResponse({ success: false, error: err.message }));
      return true;
    }

    // Website auth bridge - receive auth state from website
    if (message.type === "website-auth") {
      handleWebsiteAuth(message.action, message.user, message.token)
        .then(() => sendResponse({ success: true }))
        .catch((err) => sendResponse({ success: false, error: err.message }));
      return true;
    }

    // Website words response - from content script bridge
    if (message.type === "website-words-response") {
      handleWebsiteWordsResponse(message.words, message.success, message.error);
      return false;
    }

    // Website upload response - from content script bridge
    if (message.type === "website-upload-response") {
      // This is handled by the pending promise in uploadWordToWebsite
      // Just log for debugging
      console.log("[CC Plus] Upload response:", message.success);
      return false;
    }

    // Default: don't keep channel open
    return false;
  });

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

// --- Translation Handler ---

// Single word entry with synonyms
interface WordEntry {
  word: string; // Translation word
  synonyms?: string[]; // Reverse translations (synonyms in source language)
}

// Dictionary entry from Google Translate API
interface DictEntry {
  pos: string; // Part of speech (noun, verb, etc.)
  terms: string[]; // Translation terms
  entries?: WordEntry[]; // Detailed entries with synonyms
}

interface TranslateResponse {
  translation: string;
  detectedLang?: string;
  definitions?: DictEntry[]; // Dictionary definitions by part of speech
}

async function handleTranslate(
  text: string,
  targetLang: string
): Promise<TranslateResponse | { error: string }> {
  const LANG_CODE_MAP: Record<string, string> = {
    "zh-CN": "zh-CN",
    "zh-TW": "zh-TW",
    en: "en",
    ja: "ja",
    ko: "ko",
  };

  const target = LANG_CODE_MAP[targetLang] || targetLang;

  try {
    const url = new URL("https://translate.googleapis.com/translate_a/single");
    url.searchParams.set("client", "gtx");
    url.searchParams.set("sl", "auto");
    url.searchParams.set("tl", target);
    url.searchParams.append("dt", "t"); // Translation
    url.searchParams.append("dt", "bd"); // Dictionary (basic)
    url.searchParams.append("dt", "rm"); // Transliteration/phonetic
    url.searchParams.set("dj", "1"); // JSON format
    url.searchParams.set("q", text);

    const response = await fetch(url.toString());

    if (!response.ok) {
      return { error: `API returned ${response.status}` };
    }

    const data = await response.json();
    console.log("[CC Plus] Google Translate raw response:", data);

    // Extract translation from sentences
    let translation = "";
    if (data.sentences && Array.isArray(data.sentences)) {
      translation = data.sentences
        .filter((s: { trans?: string }) => s.trans)
        .map((s: { trans: string }) => s.trans)
        .join("");
    }

    // Extract dictionary definitions (bd parameter)
    // Format: dict: [{ pos: "noun", terms: ["word1", "word2"], entry: [...] }, ...]
    const definitions: DictEntry[] = [];
    if (data.dict && Array.isArray(data.dict)) {
      for (const dictItem of data.dict) {
        if (dictItem.pos && dictItem.terms && Array.isArray(dictItem.terms)) {
          // Extract detailed entries with synonyms (reverse_translation)
          const entries: WordEntry[] = [];
          if (dictItem.entry && Array.isArray(dictItem.entry)) {
            for (const e of dictItem.entry.slice(0, 3)) {
              // Top 3 entries
              if (e.word) {
                entries.push({
                  word: e.word,
                  synonyms: e.reverse_translation?.slice(0, 4), // Top 4 synonyms
                });
              }
            }
          }

          definitions.push({
            pos: dictItem.pos,
            terms: dictItem.terms.slice(0, 5), // Limit to 5 terms per pos
            entries: entries.length > 0 ? entries : undefined,
          });
        }
      }
    }

    return {
      translation: translation || text,
      detectedLang: data.src,
      definitions: definitions.length > 0 ? definitions : undefined,
    };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Network error" };
  }
}
