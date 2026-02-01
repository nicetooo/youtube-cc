import { writable } from "svelte/store";
import { isEqual } from "lodash-es";

// Extension settings type (YouTube features only)
export interface ExtensionSettings {
  caption: boolean;
  skipAd: boolean;
  removeAds: boolean;
  wideScreen: boolean;
  sideComment: boolean;
  commentSearch: boolean;
  captionFontSize: number;
  // Enlarge skip ad button
  enlargeSkipButton: boolean;
  // Caption language preferences
  captionPrimaryLang: string;
  captionSecondaryLang: string;
}

// App store state type
export interface AppStoreState {
  isStorageLoad: boolean;
  settings: ExtensionSettings;
}

// Default settings
const defaultSettings: ExtensionSettings = {
  caption: false,
  skipAd: false,
  removeAds: true,
  wideScreen: false,
  sideComment: false,
  commentSearch: true,
  captionFontSize: 14,
  enlargeSkipButton: false,
  captionPrimaryLang: "",
  captionSecondaryLang: "",
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
