import defaultSelectors from "./ad-selectors.json";

export type AdSelectors = typeof defaultSelectors;

export const SELECTORS_STORAGE_KEY = "ad_selectors_data";
export const SELECTORS_GITHUB_URL = "https://raw.githubusercontent.com/nicetooo/youtube-cc/main/src/features/ads/ad-selectors.json";

/**
 * Get the current selectors from storage or return defaults
 */
export async function getAdSelectors(): Promise<AdSelectors> {
  const storage = await chrome.storage.local.get(SELECTORS_STORAGE_KEY);
  return storage[SELECTORS_STORAGE_KEY] || defaultSelectors;
}

/**
 * Fetch latest selectors from GitHub and update storage
 */
export async function updateSelectorsFromGithub(): Promise<AdSelectors | null> {
  try {
    const response = await fetch(SELECTORS_GITHUB_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    // Basic validation to ensure it has required fields
    if (data.AD_REMOVAL_SELECTORS && data.AD_SKIP_SELECTORS) {
      await chrome.storage.local.set({ [SELECTORS_STORAGE_KEY]: data });
      console.log("[AdSelectors] Successfully updated from GitHub");
      return data;
    }
    throw new Error("Invalid selector data format");
  } catch (error) {
    console.error("[AdSelectors] Failed to update from GitHub:", error);
    return null;
  }
}

// For backward compatibility and initial synchronous access
export const AD_REMOVAL_SELECTORS = defaultSelectors.AD_REMOVAL_SELECTORS;
export const AD_SKIP_SELECTORS = defaultSelectors.AD_SKIP_SELECTORS;
