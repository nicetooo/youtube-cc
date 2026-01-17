import DEFAULT_SELECTORS from "./ad-selectors.json";

export type AdSelectors = typeof DEFAULT_SELECTORS;

export const SELECTORS_STORAGE_KEY = "ad_selectors_data";
export const SELECTORS_GITHUB_URL = "https://raw.githubusercontent.com/nicetooo/youtube-cc/main/src/features/ads/ad-selectors.json";

/**
 * Get current selectors from storage or return defaults
 */
export async function getAdSelectors(): Promise<AdSelectors> {
  try {
    const storage = await chrome.storage.local.get(SELECTORS_STORAGE_KEY);
    return storage[SELECTORS_STORAGE_KEY] || DEFAULT_SELECTORS;
  } catch (e) {
    return DEFAULT_SELECTORS;
  }
}

/**
 * Fetch latest selectors from GitHub and update local storage
 */
export async function updateSelectorsFromGithub(): Promise<AdSelectors | null> {
  try {
    const response = await fetch(SELECTORS_GITHUB_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    // Basic validation
    if (data && data.AD_REMOVAL_SELECTORS && data.AD_SKIP_SELECTORS) {
      await chrome.storage.local.set({ [SELECTORS_STORAGE_KEY]: data });
      console.log("[AdSelectors] Rules updated from GitHub");
      return data;
    }
    return null;
  } catch (error) {
    console.warn("[AdSelectors] Failed to update from GitHub, using cached/default rules");
    return null;
  }
}
