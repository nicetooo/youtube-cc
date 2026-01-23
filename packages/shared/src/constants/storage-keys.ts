/**
 * Centralized storage keys for Chrome extension and web app
 * Prevents typos and makes refactoring easier
 */

// ============ Extension Storage Keys (chrome.storage.local) ============

/** Saved words list */
export const WORDS_KEY = "cc_plus_words";

/** Words pending sync to Firebase */
export const PENDING_SYNC_KEY = "cc_plus_pending_sync";

/** Timestamp of last successful sync */
export const LAST_SYNC_KEY = "cc_plus_last_sync";

/** Current sync user ID */
export const SYNC_USER_KEY = "cc_plus_sync_user";

/** Website user info (synced from website login) */
export const WEBSITE_USER_KEY = "cc_plus_website_user";

/** Ad removal selectors data */
export const AD_SELECTORS_KEY = "ad_selectors_data";

/** Daily activity data (selection count per day) */
export const DAILY_ACTIVITY_KEY = "cc_plus_daily_activity";

// ============ Web Storage Keys (localStorage) ============

/** User's preferred locale */
export const LOCALE_KEY = "cc-plus-locale";
