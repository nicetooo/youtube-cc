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
 * Chrome may grant permission as <all_urls> OR as http + https wildcards
 * depending on how user granted it (via extension UI vs Chrome settings)
 */
export async function hasAllUrlsPermission(): Promise<boolean> {
  try {
    // First check for <all_urls>
    const hasAllUrls = await chrome.permissions.contains(ALL_URLS_PERMISSION);
    if (hasAllUrls) return true;

    // Also check for http://*/* and https://*/* which Chrome uses
    // when user grants "On all sites" permission via Chrome's extension settings
    const hasHttpHttps = await chrome.permissions.contains({
      origins: ["http://*/*", "https://*/*"],
    });
    if (hasHttpHttps) {
      console.log(
        "[CC Plus] Permission granted via http/https wildcards instead of <all_urls>"
      );
      return true;
    }

    return false;
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
 * Check if origins include all-sites permission
 * (either <all_urls> or http/https wildcards)
 */
function hasAllSitesOrigins(origins: string[] | undefined): boolean {
  if (!origins) return false;
  return (
    origins.includes("<all_urls>") ||
    (origins.includes("http://*/*") && origins.includes("https://*/*"))
  );
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
    if (hasAllSitesOrigins(permissions.origins)) {
      console.log("[CC Plus] All sites permission added:", permissions.origins);
      callback(true);
    }
  };

  const onRemoved = (permissions: chrome.permissions.Permissions) => {
    if (hasAllSitesOrigins(permissions.origins)) {
      console.log(
        "[CC Plus] All sites permission removed:",
        permissions.origins
      );
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
