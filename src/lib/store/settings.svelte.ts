import { writable } from "svelte/store";
import { isEqual } from "lodash";

/** sync store between popup & content.js */
export const appStore = writable({
  isStorageLoad: false,
  settings: {
    caption: false,
    skipAd: false,
    removeAds: true,
    wideScreen: false,
    sideComment: false,
    commentSearch: true,
  },
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
      appStore.update(({ settings }) => {
        return {
          settings,
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

export function subscribeStorageChange() {
  // console.log("sub");
  chrome.storage.onChanged.addListener((changes) => {
    const { settings } = changes;
    // console.log("change", settings);
    if (settings && isEqual(settings.newValue, settings.oldValue)) {
      // console.log("is equal");
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
  });
}
