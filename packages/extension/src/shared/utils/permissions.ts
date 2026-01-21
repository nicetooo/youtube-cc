/**
 * Permission utilities for optional host permissions
 * Used for word selection feature on all websites
 */

// The permission required for word selection on all websites
export const ALL_URLS_PERMISSION: chrome.permissions.Permissions = {
  origins: ["<all_urls>"],
};

/**
 * Check if the extension has permission for all URLs
 */
export async function hasAllUrlsPermission(): Promise<boolean> {
  try {
    return await chrome.permissions.contains(ALL_URLS_PERMISSION);
  } catch (error) {
    console.error("[CC Plus] Failed to check permission:", error);
    return false;
  }
}

/**
 * Request permission for all URLs
 * Must be called from a user gesture (e.g., button click)
 * @returns true if permission was granted, false otherwise
 */
export async function requestAllUrlsPermission(): Promise<boolean> {
  try {
    const granted = await chrome.permissions.request(ALL_URLS_PERMISSION);
    console.log("[CC Plus] Permission request result:", granted);
    return granted;
  } catch (error) {
    console.error("[CC Plus] Failed to request permission:", error);
    return false;
  }
}

/**
 * Remove permission for all URLs
 * @returns true if permission was removed, false otherwise
 */
export async function removeAllUrlsPermission(): Promise<boolean> {
  try {
    const removed = await chrome.permissions.remove(ALL_URLS_PERMISSION);
    console.log("[CC Plus] Permission removal result:", removed);
    return removed;
  } catch (error) {
    console.error("[CC Plus] Failed to remove permission:", error);
    return false;
  }
}

/**
 * Listen for permission changes
 * @param callback Called when permissions are added or removed
 * @returns Cleanup function to remove listeners
 */
export function onPermissionChange(
  callback: (hasPermission: boolean) => void
): () => void {
  const onAdded = (permissions: chrome.permissions.Permissions) => {
    if (permissions.origins?.includes("<all_urls>")) {
      callback(true);
    }
  };

  const onRemoved = (permissions: chrome.permissions.Permissions) => {
    if (permissions.origins?.includes("<all_urls>")) {
      callback(false);
    }
  };

  chrome.permissions.onAdded.addListener(onAdded);
  chrome.permissions.onRemoved.addListener(onRemoved);

  return () => {
    chrome.permissions.onAdded.removeListener(onAdded);
    chrome.permissions.onRemoved.removeListener(onRemoved);
  };
}
