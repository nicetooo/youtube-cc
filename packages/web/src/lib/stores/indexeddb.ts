// IndexedDB operations for offline word storage
// This allows the website to cache words locally for faster access and offline support

import { browser } from "$app/environment";
import type { Word } from "@aspect/shared/types";

const DB_NAME = "ccplus-words";
const DB_VERSION = 1;
const STORE_NAME = "words";

let dbPromise: Promise<IDBDatabase> | null = null;

/**
 * Open or create the IndexedDB database
 */
function openDB(): Promise<IDBDatabase> {
  if (!browser) {
    return Promise.reject(new Error("IndexedDB is not available in SSR"));
  }

  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error("[IndexedDB] Failed to open database:", request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      console.log("[IndexedDB] Database opened successfully");
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      console.log("[IndexedDB] Upgrading database...");
      const db = (event.target as IDBOpenDBRequest).result;

      // Create words object store with id as key
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        // Create indexes for common queries
        store.createIndex("text", "text", { unique: false });
        store.createIndex("createdAt", "createdAt", { unique: false });
        store.createIndex("nextReview", "nextReview", { unique: false });
        store.createIndex("status", "status", { unique: false });
      }
    };
  });

  return dbPromise;
}

/**
 * Get all words from IndexedDB
 */
export async function getAllWords(): Promise<Word[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const words = request.result.map((word: Word) => ({
        ...word,
        nextReview: new Date(word.nextReview),
        createdAt: new Date(word.createdAt),
        updatedAt: word.updatedAt ? new Date(word.updatedAt) : undefined,
      }));
      resolve(words);
    };

    request.onerror = () => {
      console.error("[IndexedDB] Failed to get words:", request.error);
      reject(request.error);
    };
  });
}

/**
 * Get a single word by ID
 */
export async function getWord(id: string): Promise<Word | null> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      if (request.result) {
        const word = {
          ...request.result,
          nextReview: new Date(request.result.nextReview),
          createdAt: new Date(request.result.createdAt),
          updatedAt: request.result.updatedAt
            ? new Date(request.result.updatedAt)
            : undefined,
        };
        resolve(word);
      } else {
        resolve(null);
      }
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Safely convert a date value to ISO string
 */
function toISOStringSafe(value: unknown): string {
  if (!value) return new Date().toISOString();

  if (value instanceof Date) {
    return isNaN(value.getTime())
      ? new Date().toISOString()
      : value.toISOString();
  }

  if (typeof value === "string") {
    const date = new Date(value);
    return isNaN(date.getTime()) ? new Date().toISOString() : value;
  }

  if (typeof value === "number") {
    const date = new Date(value);
    return isNaN(date.getTime())
      ? new Date().toISOString()
      : date.toISOString();
  }

  return new Date().toISOString();
}

/**
 * Add or update a single word
 */
export async function putWord(word: Word): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    // Convert dates to ISO strings for storage (with safe handling)
    const wordToStore = {
      ...word,
      nextReview: toISOStringSafe(word.nextReview),
      createdAt: toISOStringSafe(word.createdAt),
      updatedAt: word.updatedAt ? toISOStringSafe(word.updatedAt) : undefined,
    };

    const request = store.put(wordToStore);

    request.onsuccess = () => resolve();
    request.onerror = () => {
      console.error("[IndexedDB] Failed to put word:", request.error);
      reject(request.error);
    };
  });
}

/**
 * Add or update multiple words (batch operation)
 */
export async function putWords(words: Word[]): Promise<void> {
  if (words.length === 0) return;

  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    let completed = 0;
    let hasError = false;

    for (const word of words) {
      const wordToStore = {
        ...word,
        nextReview: toISOStringSafe(word.nextReview),
        createdAt: toISOStringSafe(word.createdAt),
        updatedAt: word.updatedAt ? toISOStringSafe(word.updatedAt) : undefined,
      };

      const request = store.put(wordToStore);

      request.onsuccess = () => {
        completed++;
        if (completed === words.length && !hasError) {
          resolve();
        }
      };

      request.onerror = () => {
        if (!hasError) {
          hasError = true;
          console.error("[IndexedDB] Failed to put word:", request.error);
          reject(request.error);
        }
      };
    }

    transaction.oncomplete = () => {
      console.log("[IndexedDB] Batch put completed:", words.length, "words");
    };
  });
}

/**
 * Delete a word by ID
 */
export async function deleteWord(id: string): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => {
      console.error("[IndexedDB] Failed to delete word:", request.error);
      reject(request.error);
    };
  });
}

/**
 * Clear all words from IndexedDB
 */
export async function clearAllWords(): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => {
      console.log("[IndexedDB] All words cleared");
      resolve();
    };
    request.onerror = () => {
      console.error("[IndexedDB] Failed to clear words:", request.error);
      reject(request.error);
    };
  });
}

/**
 * Get the count of words in IndexedDB
 */
export async function getWordCount(): Promise<number> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.count();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Sync words from extension to IndexedDB
 * Only adds words that don't exist locally (by ID)
 */
export async function syncFromExtension(extensionWords: Word[]): Promise<{
  added: number;
  updated: number;
  skipped: number;
}> {
  console.log(
    "[IndexedDB] syncFromExtension called with",
    extensionWords.length,
    "words"
  );

  const localWords = await getAllWords();
  console.log("[IndexedDB] Local words count:", localWords.length);

  const localWordIds = new Set(localWords.map((w) => w.id));
  const localWordTexts = new Map(
    localWords.map((w) => [w.text.toLowerCase(), w])
  );

  let added = 0;
  let updated = 0;
  let skipped = 0;

  const wordsToAdd: Word[] = [];

  for (const extWord of extensionWords) {
    // Check if word exists by ID
    if (localWordIds.has(extWord.id)) {
      console.log("[IndexedDB] Skipping (by ID):", extWord.text);
      skipped++;
      continue;
    }

    // Check if word exists by text (different ID but same word)
    const existingByText = localWordTexts.get(extWord.text.toLowerCase());
    if (existingByText) {
      console.log("[IndexedDB] Skipping (by text):", extWord.text);
      // Could merge/update here if needed
      skipped++;
      continue;
    }

    console.log("[IndexedDB] Adding word:", extWord.text);
    wordsToAdd.push(extWord);
    added++;
  }

  if (wordsToAdd.length > 0) {
    console.log("[IndexedDB] Putting", wordsToAdd.length, "words to IndexedDB");
    await putWords(wordsToAdd);
  }

  console.log(
    `[IndexedDB] Sync complete - Added: ${added}, Updated: ${updated}, Skipped: ${skipped}`
  );

  return { added, updated, skipped };
}
