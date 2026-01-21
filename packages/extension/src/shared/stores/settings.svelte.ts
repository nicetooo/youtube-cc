import { writable } from "svelte/store";
import { isEqual } from "lodash-es";

// Supported languages
const SUPPORTED_LANGUAGES = ["zh-CN", "zh-TW", "en", "ja", "ko"];

// Get browser language and map to supported language
export function getBrowserLanguage(): string {
  const browserLang = navigator.language;

  // Direct match
  if (SUPPORTED_LANGUAGES.includes(browserLang)) {
    return browserLang;
  }

  // Handle zh variants
  if (browserLang.startsWith("zh")) {
    // zh-HK, zh-MO -> zh-TW (Traditional)
    if (browserLang === "zh-HK" || browserLang === "zh-MO") {
      return "zh-TW";
    }
    // Default to Simplified Chinese for other zh variants
    return "zh-CN";
  }

  // Match base language (e.g., en-US -> en, ja-JP -> ja)
  const baseLang = browserLang.split("-")[0];
  if (SUPPORTED_LANGUAGES.includes(baseLang)) {
    return baseLang;
  }

  // Default fallback
  return "en";
}

// Extension settings type
export interface ExtensionSettings {
  caption: boolean;
  skipAd: boolean;
  removeAds: boolean;
  wideScreen: boolean;
  sideComment: boolean;
  commentSearch: boolean;
  captionFontSize: number;
  // Word selection / translation settings
  wordSelection: boolean;
  targetLanguage: string;
  myLanguage: string;
}

// App store state type
export interface AppStoreState {
  isStorageLoad: boolean;
  settings: ExtensionSettings;
}

// Get default my language from browser
const defaultMyLanguage =
  typeof navigator !== "undefined" ? getBrowserLanguage() : "en";

// Default settings
const defaultSettings: ExtensionSettings = {
  caption: false,
  skipAd: false,
  removeAds: true,
  wideScreen: false,
  sideComment: false,
  commentSearch: true,
  captionFontSize: 14,
  wordSelection: true, // YouTube works without extra permission
  targetLanguage: "en",
  myLanguage: defaultMyLanguage,
};

/** sync store between popup & content.js */
export const appStore = writable<AppStoreState>({
  isStorageLoad: false,
  settings: defaultSettings,
});

appStore.subscribe(async (value) => {
  if (!value.isStorageLoad) {
    /** init populate store with storage */
    const { settings } = await chrome.storage.local.get("settings");
    if (settings) {
      /** if has storage populate store with storage */
      appStore.update((v) => {
        return {
          settings: {
            ...v.settings,
            ...settings,
          },
          isStorageLoad: true,
        };
      });
    } else {
      /** if has no storage populate store with default setting */
      appStore.update((v) => {
        return {
          settings: v.settings,
          isStorageLoad: true,
        };
      });
    }
    return;
  }

  const { settings } = await chrome.storage.local.get("settings");

  if (settings && isEqual(settings, value.settings)) {
    return;
  }

  // console.log("settings storage in subscribe", value);
  chrome.storage.local.set({ settings: value.settings }, () => {});
});

let isSubscribed = false;
let storageChangeHandler:
  | ((changes: { [key: string]: chrome.storage.StorageChange }) => void)
  | null = null;

export function subscribeStorageChange() {
  if (isSubscribed) return;
  isSubscribed = true;

  storageChangeHandler = (changes) => {
    const { settings } = changes;
    if (!settings) return;

    if (settings && isEqual(settings.newValue, settings.oldValue)) {
      return;
    }

    if (settings) {
      appStore.update((v) => {
        return {
          ...v,
          settings: {
            ...v.settings,
            ...settings.newValue,
          },
        };
      });
    }
  };
  chrome.storage.onChanged.addListener(storageChangeHandler);
}

export function unsubscribeStorageChange() {
  if (storageChangeHandler) {
    chrome.storage.onChanged.removeListener(storageChangeHandler);
    storageChangeHandler = null;
    isSubscribed = false;
  }
}
