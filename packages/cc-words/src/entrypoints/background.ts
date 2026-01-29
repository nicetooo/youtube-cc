import {
  initSyncService,
  triggerSync,
  handleWebsiteAuth,
  handleWebsiteWordsResponse,
} from "@/shared/stores/sync";
import {
  hasAllUrlsPermission,
  onPermissionChange,
} from "@/shared/utils/permissions";

// Content script IDs for word selection
const SELECTION_SCRIPT_YOUTUBE = "ccplus-words-selection-youtube";
const SELECTION_SCRIPT_ALL = "ccplus-words-selection-all";

// Track registration state
let isYouTubeScriptRegistered = false;
let isAllSitesScriptRegistered = false;

/**
 * Clean up any legacy or stale registered scripts on startup
 * Dynamic content scripts persist across extension updates
 */
async function cleanupLegacyScripts(): Promise<void> {
  try {
    // Get all currently registered scripts
    const scripts = await chrome.scripting.getRegisteredContentScripts();
    const ourScriptIds = scripts
      .filter(
        (s) =>
          s.id.startsWith("ccplus-words-selection") ||
          s.id.startsWith("cc-plus-selection")
      )
      .map((s) => s.id);

    if (ourScriptIds.length > 0) {
      console.log("[CC Words] Cleaning up registered scripts:", ourScriptIds);
      await chrome.scripting.unregisterContentScripts({ ids: ourScriptIds });
    }

    // Reset state
    isYouTubeScriptRegistered = false;
    isAllSitesScriptRegistered = false;
  } catch (error) {
    console.error("[CC Words] Failed to cleanup scripts:", error);
  }
}

/**
 * Register selection script for YouTube only (no extra permission needed)
 */
async function registerYouTubeSelectionScript(): Promise<boolean> {
  if (isYouTubeScriptRegistered) return true;

  try {
    await chrome.scripting.registerContentScripts([
      {
        id: SELECTION_SCRIPT_YOUTUBE,
        matches: ["*://www.youtube.com/*", "*://youtube.com/*"],
        js: ["content-scripts/selection.js"],
        runAt: "document_end",
      },
    ]);
    isYouTubeScriptRegistered = true;
    console.log("[CC Words] YouTube selection script registered");
    return true;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Duplicate script ID")
    ) {
      isYouTubeScriptRegistered = true;
      return true;
    }
    console.error(
      "[CC Words] Failed to register YouTube selection script:",
      error
    );
    return false;
  }
}

/**
 * Register selection script for all sites (requires <all_urls> permission)
 */
async function registerAllSitesSelectionScript(): Promise<boolean> {
  if (isAllSitesScriptRegistered) return true;

  try {
    await chrome.scripting.registerContentScripts([
      {
        id: SELECTION_SCRIPT_ALL,
        matches: ["http://*/*", "https://*/*"],
        excludeMatches: ["*://www.youtube.com/*", "*://youtube.com/*"],
        js: ["content-scripts/selection.js"],
        runAt: "document_end",
      },
    ]);
    isAllSitesScriptRegistered = true;
    console.log("[CC Words] All sites selection script registered");
    return true;
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("Duplicate script ID")
    ) {
      isAllSitesScriptRegistered = true;
      return true;
    }
    console.error(
      "[CC Words] Failed to register all sites selection script:",
      error
    );
    return false;
  }
}

/**
 * Unregister YouTube selection script
 */
async function unregisterYouTubeSelectionScript(): Promise<boolean> {
  if (!isYouTubeScriptRegistered) return true;

  try {
    await chrome.scripting.unregisterContentScripts({
      ids: [SELECTION_SCRIPT_YOUTUBE],
    });
    isYouTubeScriptRegistered = false;
    console.log("[CC Words] YouTube selection script unregistered");
    return true;
  } catch (error) {
    console.error(
      "[CC Words] Failed to unregister YouTube selection script:",
      error
    );
    return false;
  }
}

/**
 * Unregister all sites selection script
 */
async function unregisterAllSitesSelectionScript(): Promise<boolean> {
  if (!isAllSitesScriptRegistered) return true;

  try {
    await chrome.scripting.unregisterContentScripts({
      ids: [SELECTION_SCRIPT_ALL],
    });
    isAllSitesScriptRegistered = false;
    console.log("[CC Words] All sites selection script unregistered");
    return true;
  } catch (error) {
    console.error(
      "[CC Words] Failed to unregister all sites selection script:",
      error
    );
    return false;
  }
}

/**
 * Inject selection script into existing tabs that match the pattern
 * This is needed because dynamically registered scripts only run on NEW page loads
 */
async function injectSelectionScriptIntoExistingTabs(
  patterns: string[]
): Promise<void> {
  try {
    // Query all tabs matching the patterns
    const tabs = await chrome.tabs.query({ url: patterns });

    for (const tab of tabs) {
      if (tab.id === undefined) continue;

      try {
        // Check if script is already injected by looking for our marker
        const [result] = await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: () =>
            !!(window as unknown as { __ccPlusSelectionInjected?: boolean })
              .__ccPlusSelectionInjected,
        });

        if (result?.result) {
          console.log(
            `[CC Words] Selection script already injected in tab ${tab.id}`
          );
          continue;
        }

        // Inject the script
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["content-scripts/selection.js"],
        });

        console.log(`[CC Words] Injected selection script into tab ${tab.id}`);
      } catch (error) {
        // Ignore errors for tabs we can't access (e.g., chrome:// pages)
        console.log(
          `[CC Words] Could not inject into tab ${tab.id}:`,
          error instanceof Error ? error.message : error
        );
      }
    }
  } catch (error) {
    console.error("[CC Words] Failed to inject into existing tabs:", error);
  }
}

/**
 * Update selection script registration based on permission and settings
 * - YouTube: always available when wordSelection is enabled
 * - All sites: only when user has granted <all_urls> permission
 */
async function updateSelectionScriptState(
  injectIntoExisting = false
): Promise<void> {
  const hasAllUrlsPerm = await hasAllUrlsPermission();
  const { settings } = await chrome.storage.local.get("settings");
  const wordSelectionEnabled = settings?.wordSelection ?? true;

  console.log("[CC Words] Updating selection scripts:", {
    wordSelectionEnabled,
    hasAllUrlsPerm,
    injectIntoExisting,
  });

  // YouTube selection script - no extra permission needed
  if (wordSelectionEnabled) {
    await registerYouTubeSelectionScript();
    // Inject into existing YouTube tabs if requested
    if (injectIntoExisting) {
      await injectSelectionScriptIntoExistingTabs([
        "*://www.youtube.com/*",
        "*://youtube.com/*",
      ]);
    }
  } else {
    await unregisterYouTubeSelectionScript();
  }

  // All sites selection script - requires <all_urls> permission
  if (wordSelectionEnabled && hasAllUrlsPerm) {
    await registerAllSitesSelectionScript();
    // Inject into existing tabs if requested (only non-YouTube since those are handled above)
    if (injectIntoExisting) {
      await injectSelectionScriptIntoExistingTabs([
        "http://*/*",
        "https://*/*",
      ]);
    }
  } else {
    await unregisterAllSitesSelectionScript();
  }
}

export default defineBackground(() => {
  // --- Word Selection Script Management ---

  // Clean up legacy scripts then initialize based on current permission/settings
  // Also inject into existing tabs on startup (e.g., after extension update)
  cleanupLegacyScripts().then(() => {
    updateSelectionScriptState(true); // Inject into existing tabs
  });

  // Listen for permission changes
  onPermissionChange((hasPermission) => {
    console.log("[CC Words] Permission changed:", hasPermission);
    // When permission is granted, inject into existing tabs
    updateSelectionScriptState(hasPermission);
  });

  // Listen for settings changes
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.settings) {
      const oldWordSelection = changes.settings.oldValue?.wordSelection;
      const newWordSelection = changes.settings.newValue?.wordSelection;
      if (oldWordSelection !== newWordSelection) {
        console.log(
          "[CC Words] wordSelection setting changed:",
          newWordSelection
        );
        // When word selection is enabled, inject into existing tabs
        updateSelectionScriptState(newWordSelection === true);
      }
    }
  });

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
      console.log("[CC Words] Upload response:", message.success);
      return false;
    }

    // Check if word selection permission is granted
    if (message.type === "check-word-selection-permission") {
      hasAllUrlsPermission()
        .then((hasPermission) => sendResponse({ hasPermission }))
        .catch(() => sendResponse({ hasPermission: false }));
      return true;
    }

    // Update selection script state (after permission granted/revoked)
    if (message.type === "update-selection-script") {
      updateSelectionScriptState(true)
        .then(() => sendResponse({ success: true }))
        .catch(() => sendResponse({ success: false }));
      return true;
    }

    // Default: don't keep channel open
    return false;
  });
});

// --- Translation Handler ---

// Single word entry with synonyms
interface WordEntry {
  word: string;
  synonyms?: string[];
}

// Dictionary entry from Google Translate API
interface DictEntry {
  pos: string;
  terms: string[];
  entries?: WordEntry[];
}

interface TranslateResponse {
  translation: string;
  detectedLang?: string;
  definitions?: DictEntry[];
  srcTranslit?: string;
  translit?: string;
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
    console.log("[CC Words] Google Translate raw response:", data);

    // Extract translation and transliteration from sentences
    let translation = "";
    let srcTranslit = "";
    let translit = "";
    if (data.sentences && Array.isArray(data.sentences)) {
      translation = data.sentences
        .filter((s: { trans?: string }) => s.trans)
        .map((s: { trans: string }) => s.trans)
        .join("");
      srcTranslit = data.sentences
        .filter((s: { src_translit?: string }) => s.src_translit)
        .map((s: { src_translit: string }) => s.src_translit)
        .join(" ");
      translit = data.sentences
        .filter((s: { translit?: string }) => s.translit)
        .map((s: { translit: string }) => s.translit)
        .join(" ");
    }

    // Extract dictionary definitions (bd parameter)
    const definitions: DictEntry[] = [];
    if (data.dict && Array.isArray(data.dict)) {
      for (const dictItem of data.dict) {
        if (dictItem.pos && dictItem.terms && Array.isArray(dictItem.terms)) {
          const entries: WordEntry[] = [];
          if (dictItem.entry && Array.isArray(dictItem.entry)) {
            for (const e of dictItem.entry.slice(0, 3)) {
              if (e.word) {
                entries.push({
                  word: e.word,
                  synonyms: e.reverse_translation?.slice(0, 4),
                });
              }
            }
          }

          definitions.push({
            pos: dictItem.pos,
            terms: dictItem.terms.slice(0, 5),
            entries: entries.length > 0 ? entries : undefined,
          });
        }
      }
    }

    return {
      translation: translation || text,
      detectedLang: data.src,
      definitions: definitions.length > 0 ? definitions : undefined,
      srcTranslit: srcTranslit || undefined,
      translit: translit || undefined,
    };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Network error" };
  }
}
