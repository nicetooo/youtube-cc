// Firebase sync service for words
// Syncs local words to Firebase when user is logged in
// Uses website bridge for actual Firebase operations (since extension isn't authenticated)

import {
  onAuthChange,
  LAST_SYNC_KEY,
  SYNC_USER_KEY,
  WEBSITE_USER_KEY,
} from "@aspect/shared";
import type { Word, DailyActivityMap } from "@aspect/shared";
import { DAILY_ACTIVITY_KEY } from "@aspect/shared/constants";
import {
  getWords as getLocalWords,
  getWordsToSync,
  clearPendingSync,
  getDailyActivity as getLocalActivity,
} from "./words.svelte";

// Website URL patterns for finding the tab
const WEBSITE_PATTERNS = [
  "http://localhost:5188/*",
  "https://youtube-cc.com/*",
  "https://www.youtube-cc.com/*",
];

// Sync status
export type SyncStatus = "idle" | "syncing" | "success" | "error";

// User info from website
interface WebsiteUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}

let currentSyncStatus: SyncStatus = "idle";

/**
 * Get current sync status
 */
export function getSyncStatus(): SyncStatus {
  return currentSyncStatus;
}

/**
 * Initialize sync service - call this in background script
 */
export function initSyncService(): void {
  console.log("[CC Plus Sync] Initializing sync service");

  // Listen for auth state changes
  onAuthChange(async (user) => {
    if (user) {
      console.log("[CC Plus Sync] User logged in:", user.uid);

      // Save user ID to storage for content scripts
      await chrome.storage.local.set({ [SYNC_USER_KEY]: user.uid });

      // Trigger sync on login
      await syncWords(user.uid);
    } else {
      console.log("[CC Plus Sync] User logged out");
      await chrome.storage.local.remove(SYNC_USER_KEY);
    }
  });
}

/**
 * Get current user ID from storage
 */
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const result = await chrome.storage.local.get(SYNC_USER_KEY);
    return result[SYNC_USER_KEY] || null;
  } catch {
    return null;
  }
}

/**
 * Sync words between local storage and Firebase
 * @param userId - Firebase user ID
 * @param forceUploadAll - If true, upload all local words (not just pending)
 */
export async function syncWords(
  userId: string,
  forceUploadAll = false
): Promise<void> {
  if (currentSyncStatus === "syncing") {
    console.log("[CC Plus Sync] Sync already in progress");
    return;
  }

  console.log(
    "[CC Plus Sync] Starting sync for user:",
    userId,
    forceUploadAll ? "(force all)" : ""
  );
  currentSyncStatus = "syncing";

  try {
    // 1. Upload local words to Firebase
    await uploadPendingWords(userId, forceUploadAll);

    // 2. Download words from Firebase that we don't have locally
    await downloadNewWords(userId);

    // 3. Sync activity data (upload local, download remote, merge)
    await syncActivity();

    // Update last sync time
    await chrome.storage.local.set({ [LAST_SYNC_KEY]: Date.now() });

    currentSyncStatus = "success";
    console.log("[CC Plus Sync] Sync completed successfully");
  } catch (error) {
    console.error("[CC Plus Sync] Sync failed:", error);
    currentSyncStatus = "error";
  }
}

/**
 * Request word upload via website bridge
 */
async function uploadWordToWebsite(
  word: Omit<Word, "id" | "createdAt">
): Promise<boolean> {
  const tab = await findWebsiteTab();
  if (!tab || !tab.id) {
    console.warn("[CC Plus Sync] Website tab not found for upload");
    return false;
  }

  return new Promise((resolve) => {
    // Set timeout - don't block on upload failures (10 seconds)
    const timeout = setTimeout(() => {
      console.warn("[CC Plus Sync] Upload timeout for word");
      resolve(false);
    }, 10000);

    // Listen for response
    const handler = (message: { type: string; success?: boolean }) => {
      if (message.type === "website-upload-response") {
        clearTimeout(timeout);
        chrome.runtime.onMessage.removeListener(handler);
        resolve(message.success ?? false);
      }
    };
    chrome.runtime.onMessage.addListener(handler);

    // Send request to content script
    chrome.tabs
      .sendMessage(tab.id!, { type: "upload-word", word })
      .catch(() => {
        clearTimeout(timeout);
        chrome.runtime.onMessage.removeListener(handler);
        resolve(false);
      });
  });
}

/**
 * Upload pending local words to Firebase via website bridge
 * If forceAll is true, uploads ALL local words (not just pending)
 */
async function uploadPendingWords(
  _userId: string,
  forceAll = false
): Promise<void> {
  // Get words to upload - either pending only or all local words
  const wordsToSync = forceAll ? await getLocalWords() : await getWordsToSync();

  if (wordsToSync.length === 0) {
    console.log("[CC Plus Sync] No words to upload");
    return;
  }

  console.log(
    "[CC Plus Sync] Uploading",
    wordsToSync.length,
    "words to Firebase"
  );

  let successCount = 0;
  for (const word of wordsToSync) {
    try {
      // Convert local word format to Firebase format
      const firebaseWord = {
        text: word.text,
        context: word.context,
        translation: word.translation,
        source: word.source,
        easeFactor: word.easeFactor,
        interval: word.interval,
        repetitions: word.repetitions,
        nextReview: word.nextReview,
        status: word.status,
        examples: word.examples,
      };

      const success = await uploadWordToWebsite(firebaseWord);
      if (success) {
        console.log("[CC Plus Sync] Uploaded word:", word.text);
        successCount++;
      } else {
        console.warn("[CC Plus Sync] Failed to upload word:", word.text);
      }
    } catch (error) {
      console.error("[CC Plus Sync] Failed to upload word:", word.text, error);
      // Continue with other words even if one fails
    }
  }

  // Clear pending sync queue after upload attempts
  if (successCount > 0) {
    await clearPendingSync();
  }
}

/**
 * Find a tab with the website open
 */
async function findWebsiteTab(): Promise<chrome.tabs.Tab | null> {
  for (const pattern of WEBSITE_PATTERNS) {
    const tabs = await chrome.tabs.query({ url: pattern });
    if (tabs.length > 0) {
      return tabs[0];
    }
  }
  return null;
}

/**
 * Pending words response handler
 */
let pendingWordsResolve: ((words: Word[]) => void) | null = null;
let pendingWordsReject: ((error: Error) => void) | null = null;

/**
 * Handle words response from website (called by background script)
 */
export function handleWebsiteWordsResponse(
  words: Word[],
  success: boolean,
  error?: string
): void {
  if (success && pendingWordsResolve) {
    pendingWordsResolve(words);
  } else if (!success && pendingWordsReject) {
    pendingWordsReject(new Error(error || "Failed to fetch words"));
  }
  pendingWordsResolve = null;
  pendingWordsReject = null;
}

/**
 * Request words from website via content script bridge
 */
async function requestWordsFromWebsite(): Promise<Word[]> {
  const tab = await findWebsiteTab();
  if (!tab || !tab.id) {
    throw new Error("Website tab not found. Please open the CC Plus website.");
  }

  return new Promise((resolve, reject) => {
    pendingWordsResolve = resolve;
    pendingWordsReject = reject;

    // Set timeout
    const timeout = setTimeout(() => {
      pendingWordsResolve = null;
      pendingWordsReject = null;
      reject(new Error("Timeout waiting for words from website"));
    }, 10000);

    // Send request to content script
    chrome.tabs.sendMessage(tab.id!, { type: "fetch-words" }).catch((err) => {
      clearTimeout(timeout);
      pendingWordsResolve = null;
      pendingWordsReject = null;
      reject(err);
    });

    // Clear timeout on resolve/reject
    const originalResolve = pendingWordsResolve;
    const originalReject = pendingWordsReject;
    pendingWordsResolve = (words) => {
      clearTimeout(timeout);
      originalResolve?.(words);
    };
    pendingWordsReject = (error) => {
      clearTimeout(timeout);
      originalReject?.(error);
    };
  });
}

/**
 * Download words from Firebase via website bridge
 */
async function downloadNewWords(_userId: string): Promise<void> {
  console.log("[CC Plus Sync] Requesting words from website...");

  try {
    const firebaseWords = await requestWordsFromWebsite();
    const localWords = await getLocalWords();

    // Create a set of local word texts for quick lookup
    const localWordTexts = new Set(localWords.map((w) => w.text.toLowerCase()));

    // Find words that exist in Firebase but not locally
    const newWords = firebaseWords.filter(
      (fw) => !localWordTexts.has(fw.text.toLowerCase())
    );

    if (newWords.length === 0) {
      console.log("[CC Plus Sync] No new words to download");
      return;
    }

    console.log(
      "[CC Plus Sync] Downloading",
      newWords.length,
      "words from Firebase"
    );

    for (const word of newWords) {
      try {
        // Save to local storage without adding to pending sync
        await saveWordToLocalOnly(word);
        console.log("[CC Plus Sync] Downloaded word:", word.text);
      } catch (error) {
        console.error(
          "[CC Plus Sync] Failed to download word:",
          word.text,
          error
        );
      }
    }
  } catch (error) {
    console.error("[CC Plus Sync] Failed to download words:", error);
    throw error;
  }
}

/**
 * Save a word to local storage without adding to pending sync queue
 * Used for downloaded words from Firebase
 */
async function saveWordToLocalOnly(word: Word): Promise<void> {
  const STORAGE_KEY = "cc_plus_words";

  try {
    const result = await chrome.storage.local.get(STORAGE_KEY);
    const words: Word[] = result[STORAGE_KEY] || [];

    // Check for duplicates
    const exists = words.some(
      (w) => w.text.toLowerCase() === word.text.toLowerCase()
    );

    if (!exists) {
      words.push(word);
      await chrome.storage.local.set({ [STORAGE_KEY]: words });
    }
  } catch (error) {
    console.error("[CC Plus Sync] Failed to save word locally:", error);
    throw error;
  }
}

/**
 * Get last sync timestamp
 */
export async function getLastSyncTime(): Promise<number | null> {
  try {
    const result = await chrome.storage.local.get(LAST_SYNC_KEY);
    return result[LAST_SYNC_KEY] || null;
  } catch {
    return null;
  }
}

/**
 * Manual sync trigger - can be called from popup or content script
 * @param forceUploadAll - If true, upload all local words (not just pending)
 */
export async function triggerSync(forceUploadAll = false): Promise<boolean> {
  const userId = await getCurrentUserId();

  if (!userId) {
    console.log("[CC Plus Sync] Cannot sync - user not logged in");
    return false;
  }

  await syncWords(userId, forceUploadAll);
  return currentSyncStatus === "success";
}

/**
 * Handle auth state from website (via content script bridge)
 * This allows the extension to sync with the website's login state
 */
export async function handleWebsiteAuth(
  action: "login" | "logout",
  user?: WebsiteUser,
  _token?: string
): Promise<void> {
  if (action === "login" && user) {
    console.log("[CC Plus Sync] Website login detected:", user.email);

    // Store website user info
    await chrome.storage.local.set({ [WEBSITE_USER_KEY]: user });

    // Save user ID to storage
    await chrome.storage.local.set({ [SYNC_USER_KEY]: user.uid });

    // Only sync to Firebase for non-anonymous users
    if (!user.isAnonymous) {
      console.log("[CC Plus Sync] Non-anonymous user, triggering sync...");
      await syncWords(user.uid);
    } else {
      console.log("[CC Plus Sync] Anonymous user, skipping Firebase sync");
    }

    // Notify popup to update UI
    chrome.runtime.sendMessage({ type: "auth-changed", user }).catch(() => {
      // Popup might not be open, ignore error
    });
  } else if (action === "logout") {
    console.log("[CC Plus Sync] Website logout detected");

    // Clear website user info
    await chrome.storage.local.remove([WEBSITE_USER_KEY, SYNC_USER_KEY]);

    // Notify popup to update UI
    chrome.runtime
      .sendMessage({ type: "auth-changed", user: null })
      .catch(() => {
        // Popup might not be open, ignore error
      });
  }
}

/**
 * Get website user info from storage
 */
export async function getWebsiteUser(): Promise<WebsiteUser | null> {
  try {
    const result = await chrome.storage.local.get(WEBSITE_USER_KEY);
    return result[WEBSITE_USER_KEY] || null;
  } catch {
    return null;
  }
}

// ============ Activity Sync ============

/**
 * Sync activity data between local storage and Firebase
 * 1. Upload local activity to Firebase (merge with existing)
 * 2. Download Firebase activity and merge with local
 */
async function syncActivity(): Promise<void> {
  console.log("[CC Plus Sync] Syncing activity data...");

  try {
    // Get local activity data
    const localActivity = await getLocalActivity();

    if (Object.keys(localActivity).length > 0) {
      // Upload local activity to Firebase
      const uploadSuccess = await uploadActivityToWebsite(localActivity);
      if (uploadSuccess) {
        console.log("[CC Plus Sync] Activity uploaded successfully");
      } else {
        console.warn("[CC Plus Sync] Failed to upload activity");
      }
    }

    // Download and merge activity from Firebase
    const remoteActivity = await downloadActivityFromWebsite();
    if (remoteActivity && Object.keys(remoteActivity).length > 0) {
      await mergeActivityToLocal(localActivity, remoteActivity);
      console.log("[CC Plus Sync] Activity downloaded and merged");
    }
  } catch (error) {
    console.error("[CC Plus Sync] Activity sync failed:", error);
    // Don't throw - activity sync failure shouldn't block word sync
  }
}

/**
 * Upload activity data to Firebase via website bridge
 */
async function uploadActivityToWebsite(
  activity: DailyActivityMap
): Promise<boolean> {
  const tab = await findWebsiteTab();
  if (!tab || !tab.id) {
    console.warn("[CC Plus Sync] Website tab not found for activity upload");
    return false;
  }

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      console.warn("[CC Plus Sync] Activity upload timeout");
      resolve(false);
    }, 10000);

    const handler = (message: { type: string; success?: boolean }) => {
      if (message.type === "website-activity-upload-response") {
        clearTimeout(timeout);
        chrome.runtime.onMessage.removeListener(handler);
        resolve(message.success ?? false);
      }
    };
    chrome.runtime.onMessage.addListener(handler);

    chrome.tabs
      .sendMessage(tab.id!, { type: "upload-activity", activity })
      .catch(() => {
        clearTimeout(timeout);
        chrome.runtime.onMessage.removeListener(handler);
        resolve(false);
      });
  });
}

/**
 * Download activity data from Firebase via website bridge
 */
async function downloadActivityFromWebsite(): Promise<DailyActivityMap | null> {
  const tab = await findWebsiteTab();
  if (!tab || !tab.id) {
    console.warn("[CC Plus Sync] Website tab not found for activity download");
    return null;
  }

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      console.warn("[CC Plus Sync] Activity download timeout");
      resolve(null);
    }, 10000);

    const handler = (message: {
      type: string;
      activity?: DailyActivityMap;
      success?: boolean;
    }) => {
      if (message.type === "website-activity-download-response") {
        clearTimeout(timeout);
        chrome.runtime.onMessage.removeListener(handler);
        resolve(message.success ? message.activity || {} : null);
      }
    };
    chrome.runtime.onMessage.addListener(handler);

    chrome.tabs
      .sendMessage(tab.id!, { type: "download-activity" })
      .catch(() => {
        clearTimeout(timeout);
        chrome.runtime.onMessage.removeListener(handler);
        resolve(null);
      });
  });
}

/**
 * Merge remote activity with local activity
 * Takes the maximum values for each date to preserve all data
 */
async function mergeActivityToLocal(
  localActivity: DailyActivityMap,
  remoteActivity: DailyActivityMap
): Promise<void> {
  const merged: DailyActivityMap = { ...localActivity };

  for (const [date, remote] of Object.entries(remoteActivity)) {
    if (!merged[date]) {
      merged[date] = remote;
    } else {
      // Take maximum values
      merged[date] = {
        date,
        selectionCount: Math.max(
          merged[date].selectionCount || 0,
          remote.selectionCount || 0
        ),
        wordsAdded: Math.max(
          merged[date].wordsAdded || 0,
          remote.wordsAdded || 0
        ),
      };
    }
  }

  // Save merged data to local storage
  await chrome.storage.local.set({ [DAILY_ACTIVITY_KEY]: merged });
}
