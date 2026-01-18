// Firebase sync service for words
// Syncs local words to Firebase when user is logged in

import {
  onAuthChange,
  addWord,
  getWords as getFirebaseWords,
} from "@aspect/shared";
import type { Word } from "@aspect/shared";
import {
  getWords as getLocalWords,
  getWordsToSync,
  clearPendingSync,
  saveWord,
} from "./words.svelte";

const LAST_SYNC_KEY = "cc_plus_last_sync";
const SYNC_USER_KEY = "cc_plus_sync_user";
const WEBSITE_USER_KEY = "cc_plus_website_user";

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
let currentUserId: string | null = null;

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
      currentUserId = user.uid;

      // Save user ID to storage for content scripts
      await chrome.storage.local.set({ [SYNC_USER_KEY]: user.uid });

      // Trigger sync on login
      await syncWords(user.uid);
    } else {
      console.log("[CC Plus Sync] User logged out");
      currentUserId = null;
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
 */
export async function syncWords(userId: string): Promise<void> {
  if (currentSyncStatus === "syncing") {
    console.log("[CC Plus Sync] Sync already in progress");
    return;
  }

  console.log("[CC Plus Sync] Starting sync for user:", userId);
  currentSyncStatus = "syncing";

  try {
    // 1. Upload pending local words to Firebase
    await uploadPendingWords(userId);

    // 2. Download words from Firebase that we don't have locally
    await downloadNewWords(userId);

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
 * Upload pending local words to Firebase
 */
async function uploadPendingWords(userId: string): Promise<void> {
  const wordsToSync = await getWordsToSync();

  if (wordsToSync.length === 0) {
    console.log("[CC Plus Sync] No pending words to upload");
    return;
  }

  console.log(
    "[CC Plus Sync] Uploading",
    wordsToSync.length,
    "words to Firebase"
  );

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

      await addWord(userId, firebaseWord);
      console.log("[CC Plus Sync] Uploaded word:", word.text);
    } catch (error) {
      console.error("[CC Plus Sync] Failed to upload word:", word.text, error);
      // Continue with other words even if one fails
    }
  }

  // Clear pending sync queue after successful upload
  await clearPendingSync();
}

/**
 * Download words from Firebase that we don't have locally
 */
async function downloadNewWords(userId: string): Promise<void> {
  const firebaseWords = await getFirebaseWords(userId);
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
 */
export async function triggerSync(): Promise<boolean> {
  const userId = await getCurrentUserId();

  if (!userId) {
    console.log("[CC Plus Sync] Cannot sync - user not logged in");
    return false;
  }

  await syncWords(userId);
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

    // Update current user ID
    currentUserId = user.uid;
    await chrome.storage.local.set({ [SYNC_USER_KEY]: user.uid });

    // Trigger sync
    await syncWords(user.uid);

    // Notify popup to update UI
    chrome.runtime.sendMessage({ type: "auth-changed", user }).catch(() => {
      // Popup might not be open, ignore error
    });
  } else if (action === "logout") {
    console.log("[CC Plus Sync] Website logout detected");

    // Clear website user info
    await chrome.storage.local.remove([WEBSITE_USER_KEY, SYNC_USER_KEY]);
    currentUserId = null;

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
