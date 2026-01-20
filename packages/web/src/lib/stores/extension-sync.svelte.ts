// Extension sync module for detecting extension and syncing words
// This module handles communication with the CC Plus browser extension

import { browser } from "$app/environment";
import type { Word } from "@aspect/shared/types";
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

/**
 * Initialize the extension sync listener
 * This should be called once when the app starts
 */
export function initExtensionSync() {
  if (!browser) return;

  // Listen for messages from extension's content script
  window.addEventListener("message", handleExtensionMessage);

  // Auto-detect extension on init
  detectExtension().then((detected) => {
    if (detected) {
      console.log("[ExtensionSync] Extension detected, starting auto-sync...");
      syncWordsFromExtension();
    }
  });
}

/**
 * Handle messages from the extension
 */
function handleExtensionMessage(event: MessageEvent) {
  const data = event.data;
  if (!data || data.source !== "ccplus-extension") return;

  if (data.type === "pong") {
    console.log("[ExtensionSync] Received pong from extension");
    extensionDetected = true;
    extensionChecked = true;
    if (pendingPongResolve) {
      pendingPongResolve(true);
      pendingPongResolve = null;
    }
  }

  if (data.type === "extension-words-response") {
    console.log(
      "[ExtensionSync] Received words from extension:",
      data.words?.length
    );
    if (data.success && pendingWordsResolve) {
      // Convert date strings to Date objects
      const words = (data.words || []).map((word: Word) => ({
        ...word,
        nextReview: new Date(word.nextReview),
        createdAt: new Date(word.createdAt),
        updatedAt: word.updatedAt ? new Date(word.updatedAt) : undefined,
      }));
      pendingWordsResolve(words);
      pendingWordsResolve = null;
      pendingWordsReject = null;
    } else if (!data.success && pendingWordsReject) {
      pendingWordsReject(new Error(data.error || "Failed to get words"));
      pendingWordsResolve = null;
      pendingWordsReject = null;
    }
  }
}

/**
 * Detect if the extension is installed
 * Sends a ping and waits for pong response
 */
export async function detectExtension(timeout = 2000): Promise<boolean> {
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

    // Send ping to extension
    console.log("[ExtensionSync] Sending ping to extension...");
    window.postMessage({ source: "ccplus-web", type: "ping" }, "*");

    // If resolved before timeout, clear it
    const originalResolve = pendingPongResolve;
    pendingPongResolve = (detected: boolean) => {
      clearTimeout(timeoutId);
      originalResolve(detected);
    };
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
