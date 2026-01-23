// Extension sync module for detecting extension and syncing words
// This module handles communication with the CC Plus browser extension

import { browser } from "$app/environment";
import type { Word, DailyActivityMap } from "@aspect/shared/types";
import { syncFromExtension } from "./indexeddb";

// Extension detection state
let extensionDetected = $state(false);
let extensionChecked = $state(false);
let syncing = $state(false);
let lastSyncResult = $state<{
  added: number;
  updated: number;
  skipped: number;
} | null>(null);

// Pending promise resolvers for async operations
let pendingPongResolve: ((detected: boolean) => void) | null = null;
let pendingWordsResolve: ((words: Word[]) => void) | null = null;
let pendingWordsReject: ((error: Error) => void) | null = null;
let pendingActivityResolve: ((activity: DailyActivityMap) => void) | null =
  null;
let pendingActivityReject: ((error: Error) => void) | null = null;

// Callback for when sync completes
let onSyncCompleteCallback: (() => void) | null = null;

/**
 * Set a callback to be called when extension sync completes
 */
export function onExtensionSyncComplete(callback: () => void) {
  onSyncCompleteCallback = callback;
}

/**
 * Initialize the extension sync listener
 * This should be called once when the app starts
 */
export function initExtensionSync() {
  if (!browser) return;

  console.log("[ExtensionSync] Initializing extension sync...");
  console.log("[ExtensionSync] Current URL:", window.location.href);

  // Listen for messages from extension's content script
  window.addEventListener("message", handleExtensionMessage);

  // Also listen for all messages temporarily for debugging
  window.addEventListener("message", (event) => {
    if (event.data?.source?.startsWith("ccplus")) {
      console.log("[ExtensionSync] Raw message received:", event.data);
    }
  });

  // Auto-detect extension on init
  detectExtension().then((detected) => {
    console.log("[ExtensionSync] Detection result:", detected);
    if (detected) {
      console.log("[ExtensionSync] Extension detected, starting auto-sync...");
      syncWordsFromExtension();
    } else {
      console.log("[ExtensionSync] Extension NOT detected after timeout");
    }
  });
}

/**
 * Handle messages from the extension
 */
function handleExtensionMessage(event: MessageEvent) {
  const data = event.data;
  if (!data || data.source !== "ccplus-extension") return;

  if (data.type === "pong" || data.type === "extension-ready") {
    console.log("[ExtensionSync] Extension detected via:", data.type);
    extensionDetected = true;
    extensionChecked = true;
    if (pendingPongResolve) {
      pendingPongResolve(true);
      pendingPongResolve = null;
    }
    // If extension just became ready and we already checked, trigger sync
    if (data.type === "extension-ready" && !syncing) {
      console.log("[ExtensionSync] Extension ready, starting sync...");
      syncWordsFromExtension();
    }
  }

  if (data.type === "extension-words-response") {
    console.log(
      "[ExtensionSync] Received words from extension:",
      data.words?.length,
      "success:",
      data.success
    );
    console.log("[ExtensionSync] Raw words data:", data.words);
    console.log(
      "[ExtensionSync] pendingWordsResolve exists:",
      !!pendingWordsResolve
    );
    if (data.success && pendingWordsResolve) {
      // Convert date strings to Date objects (with safe handling for invalid dates)
      const words = (data.words || []).map((word: Word) => {
        const parseDate = (value: unknown): Date => {
          if (!value) return new Date();
          const date = new Date(value as string | number | Date);
          return isNaN(date.getTime()) ? new Date() : date;
        };

        return {
          ...word,
          nextReview: parseDate(word.nextReview),
          createdAt: parseDate(word.createdAt),
          updatedAt: word.updatedAt ? parseDate(word.updatedAt) : undefined,
        };
      });
      console.log("[ExtensionSync] Processed words:", words.length);
      pendingWordsResolve(words);
      pendingWordsResolve = null;
      pendingWordsReject = null;
    } else if (!data.success && pendingWordsReject) {
      pendingWordsReject(new Error(data.error || "Failed to get words"));
      pendingWordsResolve = null;
      pendingWordsReject = null;
    }
  }

  if (data.type === "extension-activity-response") {
    console.log(
      "[ExtensionSync] Received activity from extension:",
      Object.keys(data.activity || {}).length,
      "days, success:",
      data.success
    );
    if (data.success && pendingActivityResolve) {
      pendingActivityResolve(data.activity || {});
      pendingActivityResolve = null;
      pendingActivityReject = null;
    } else if (!data.success && pendingActivityReject) {
      pendingActivityReject(new Error(data.error || "Failed to get activity"));
      pendingActivityResolve = null;
      pendingActivityReject = null;
    }
  }
}

/**
 * Detect if the extension is installed
 * Sends pings with retries and waits for pong response
 */
export async function detectExtension(timeout = 3000): Promise<boolean> {
  if (!browser) return false;

  // If already checked, return cached result
  if (extensionChecked) return extensionDetected;

  return new Promise((resolve) => {
    pendingPongResolve = resolve;

    // Set timeout for detection
    const timeoutId = setTimeout(() => {
      if (pendingPongResolve) {
        console.log("[ExtensionSync] Extension detection timeout");
        extensionDetected = false;
        extensionChecked = true;
        pendingPongResolve = null;
        resolve(false);
      }
    }, timeout);

    // If resolved before timeout, clear it
    const originalResolve = pendingPongResolve;
    pendingPongResolve = (detected: boolean) => {
      clearTimeout(timeoutId);
      originalResolve(detected);
    };

    // Send ping multiple times with delays (content script may not be ready yet)
    const sendPing = () => {
      console.log("[ExtensionSync] Sending ping to extension...");
      window.postMessage({ source: "ccplus-web", type: "ping" }, "*");
    };

    // Send immediately, then retry at intervals
    sendPing();
    setTimeout(sendPing, 500);
    setTimeout(sendPing, 1000);
    setTimeout(sendPing, 2000);
  });
}

/**
 * Request words from the extension
 */
export async function requestExtensionWords(timeout = 10000): Promise<Word[]> {
  if (!browser) return [];

  // Make sure extension is detected first
  const detected = await detectExtension();
  if (!detected) {
    console.log("[ExtensionSync] Extension not detected, cannot request words");
    return [];
  }

  return new Promise((resolve, reject) => {
    pendingWordsResolve = resolve;
    pendingWordsReject = reject;

    // Set timeout
    const timeoutId = setTimeout(() => {
      if (pendingWordsResolve) {
        console.log("[ExtensionSync] Words request timeout");
        pendingWordsResolve = null;
        pendingWordsReject = null;
        reject(new Error("Request timeout"));
      }
    }, timeout);

    // Override resolvers to clear timeout
    const originalResolve = pendingWordsResolve;
    const originalReject = pendingWordsReject;

    pendingWordsResolve = (words: Word[]) => {
      clearTimeout(timeoutId);
      originalResolve(words);
    };

    pendingWordsReject = (error: Error) => {
      clearTimeout(timeoutId);
      originalReject(error);
    };

    // Send request to extension
    console.log("[ExtensionSync] Requesting words from extension...");
    window.postMessage(
      { source: "ccplus-web", type: "request-extension-words" },
      "*"
    );
  });
}

/**
 * Request daily activity data from the extension
 */
export async function requestExtensionActivity(
  timeout = 10000
): Promise<DailyActivityMap> {
  if (!browser) return {};

  // Make sure extension is detected first
  const detected = await detectExtension();
  if (!detected) {
    console.log(
      "[ExtensionSync] Extension not detected, cannot request activity"
    );
    return {};
  }

  return new Promise((resolve, reject) => {
    pendingActivityResolve = resolve;
    pendingActivityReject = reject;

    // Set timeout
    const timeoutId = setTimeout(() => {
      if (pendingActivityResolve) {
        console.log("[ExtensionSync] Activity request timeout");
        pendingActivityResolve = null;
        pendingActivityReject = null;
        resolve({}); // Return empty on timeout instead of rejecting
      }
    }, timeout);

    // Override resolvers to clear timeout
    const originalResolve = pendingActivityResolve;
    const originalReject = pendingActivityReject;

    pendingActivityResolve = (activity: DailyActivityMap) => {
      clearTimeout(timeoutId);
      originalResolve(activity);
    };

    pendingActivityReject = (error: Error) => {
      clearTimeout(timeoutId);
      originalReject(error);
    };

    // Send request to extension
    console.log("[ExtensionSync] Requesting activity from extension...");
    window.postMessage(
      { source: "ccplus-web", type: "request-extension-activity" },
      "*"
    );
  });
}

/**
 * Sync words from extension to local IndexedDB
 */
export async function syncWordsFromExtension(): Promise<{
  added: number;
  updated: number;
  skipped: number;
} | null> {
  if (!browser || syncing) return null;

  try {
    syncing = true;
    console.log("[ExtensionSync] Starting sync from extension...");

    const extensionWords = await requestExtensionWords();
    if (extensionWords.length === 0) {
      console.log("[ExtensionSync] No words from extension");
      lastSyncResult = { added: 0, updated: 0, skipped: 0 };
      return lastSyncResult;
    }

    const result = await syncFromExtension(extensionWords);
    lastSyncResult = result;
    console.log("[ExtensionSync] Sync complete:", result);

    // Notify callback if set
    if (onSyncCompleteCallback && (result.added > 0 || result.updated > 0)) {
      onSyncCompleteCallback();
    }

    return result;
  } catch (error) {
    console.error("[ExtensionSync] Sync failed:", error);
    return null;
  } finally {
    syncing = false;
  }
}

/**
 * Clean up listener
 */
export function cleanupExtensionSync() {
  if (!browser) return;
  window.removeEventListener("message", handleExtensionMessage);
}

// Export reactive state
export function getExtensionSyncState() {
  return {
    get extensionDetected() {
      return extensionDetected;
    },
    get extensionChecked() {
      return extensionChecked;
    },
    get syncing() {
      return syncing;
    },
    get lastSyncResult() {
      return lastSyncResult;
    },
  };
}
