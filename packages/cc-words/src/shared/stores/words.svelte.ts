// Local word storage for the extension
// Words are stored in chrome.storage.local and synced to Firebase when user logs in

import type { Word, CreateWordInput, DailyActivityMap } from "@aspect/shared";
import {
  createWord,
  WORDS_KEY,
  PENDING_SYNC_KEY,
  DAILY_ACTIVITY_KEY,
} from "@aspect/shared";

export interface LocalWordStore {
  words: Word[];
  pendingSync: string[]; // Word IDs that need to be synced to Firebase
}

/**
 * Get all words from local storage
 */
export async function getWords(): Promise<Word[]> {
  try {
    const result = await chrome.storage.local.get(WORDS_KEY);
    const words = result[WORDS_KEY] || [];
    // Convert date strings back to Date objects
    return words.map((word: Word) => ({
      ...word,
      nextReview: new Date(word.nextReview),
      createdAt: new Date(word.createdAt),
      updatedAt: word.updatedAt ? new Date(word.updatedAt) : undefined,
    }));
  } catch (error) {
    console.error("Failed to get words from storage:", error);
    return [];
  }
}

/**
 * Save a new word to local storage
 */
export async function saveWord(input: CreateWordInput): Promise<Word> {
  const word = createWord(input);

  try {
    const words = await getWords();

    // Check for duplicates (same text from same source)
    const isDuplicate = words.some((w) => {
      if (w.text.toLowerCase() !== word.text.toLowerCase()) return false;

      if (
        w.source.type === "youtube-caption" &&
        word.source.type === "youtube-caption"
      ) {
        return w.source.videoId === word.source.videoId;
      }
      if (w.source.type === "webpage" && word.source.type === "webpage") {
        return w.source.url === word.source.url;
      }
      return false;
    });

    if (isDuplicate) {
      throw new Error("Word already saved from this source");
    }

    words.push(word);
    await chrome.storage.local.set({ [WORDS_KEY]: words });

    // Add to pending sync queue
    await addToPendingSync(word.id);

    // Increment daily wordsAdded count
    await incrementWordsAddedCount();

    return word;
  } catch (error) {
    console.error("Failed to save word:", error);
    throw error;
  }
}

/**
 * Update an existing word
 */
export async function updateWord(
  id: string,
  updates: Partial<Omit<Word, "id" | "createdAt">>
): Promise<Word | null> {
  try {
    const words = await getWords();
    const index = words.findIndex((w) => w.id === id);

    if (index === -1) return null;

    const updatedWord = {
      ...words[index],
      ...updates,
      updatedAt: new Date(),
    };

    words[index] = updatedWord;
    await chrome.storage.local.set({ [WORDS_KEY]: words });

    // Add to pending sync queue
    await addToPendingSync(id);

    return updatedWord;
  } catch (error) {
    console.error("Failed to update word:", error);
    throw error;
  }
}

/**
 * Delete a word from local storage
 */
export async function deleteWord(id: string): Promise<boolean> {
  try {
    const words = await getWords();
    const filteredWords = words.filter((w) => w.id !== id);

    if (filteredWords.length === words.length) return false;

    await chrome.storage.local.set({ [WORDS_KEY]: filteredWords });

    // Remove from pending sync queue (or add delete operation to sync)
    await removeFromPendingSync(id);

    return true;
  } catch (error) {
    console.error("Failed to delete word:", error);
    throw error;
  }
}

/**
 * Get a single word by ID
 */
export async function getWordById(id: string): Promise<Word | null> {
  const words = await getWords();
  return words.find((w) => w.id === id) || null;
}

/**
 * Search words by text
 */
export async function searchWords(query: string): Promise<Word[]> {
  const words = await getWords();
  const lowerQuery = query.toLowerCase();

  return words.filter(
    (w) =>
      w.text.toLowerCase().includes(lowerQuery) ||
      w.context.toLowerCase().includes(lowerQuery) ||
      w.translation?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Get words due for review
 */
export async function getWordsDueForReview(): Promise<Word[]> {
  const words = await getWords();
  const now = new Date();

  return words.filter((w) => w.nextReview <= now && w.status !== "mastered");
}

/**
 * Get word statistics
 */
export async function getWordStats(): Promise<{
  total: number;
  new: number;
  learning: number;
  mastered: number;
  dueToday: number;
}> {
  const words = await getWords();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

  return {
    total: words.length,
    new: words.filter((w) => w.status === "new").length,
    learning: words.filter((w) => w.status === "learning").length,
    mastered: words.filter((w) => w.status === "mastered").length,
    dueToday: words.filter(
      (w) => w.nextReview >= today && w.nextReview < tomorrow
    ).length,
  };
}

// ============ Daily Activity Tracking ============

/**
 * Increment the wordsAdded count for today
 */
async function incrementWordsAddedCount(): Promise<void> {
  try {
    const today = new Date().toISOString().split("T")[0];
    const result = await chrome.storage.local.get(DAILY_ACTIVITY_KEY);
    const activityMap: DailyActivityMap = result[DAILY_ACTIVITY_KEY] || {};

    if (!activityMap[today]) {
      activityMap[today] = {
        date: today,
        selectionCount: 0,
        wordsAdded: 0,
      };
    }

    activityMap[today].wordsAdded += 1;

    await chrome.storage.local.set({ [DAILY_ACTIVITY_KEY]: activityMap });
    console.log(
      "[CC Plus] Words added for",
      today,
      ":",
      activityMap[today].wordsAdded
    );
  } catch (error) {
    console.error("[CC Plus] Failed to increment words added count:", error);
  }
}

/**
 * Get daily activity data
 */
export async function getDailyActivity(): Promise<DailyActivityMap> {
  try {
    const result = await chrome.storage.local.get(DAILY_ACTIVITY_KEY);
    return result[DAILY_ACTIVITY_KEY] || {};
  } catch (error) {
    console.error("[CC Plus] Failed to get daily activity:", error);
    return {};
  }
}

// ============ Pending Sync Queue ============

/**
 * Add a word ID to the pending sync queue
 */
async function addToPendingSync(wordId: string): Promise<void> {
  try {
    const result = await chrome.storage.local.get(PENDING_SYNC_KEY);
    const pendingSync: string[] = result[PENDING_SYNC_KEY] || [];

    if (!pendingSync.includes(wordId)) {
      pendingSync.push(wordId);
      await chrome.storage.local.set({ [PENDING_SYNC_KEY]: pendingSync });
    }
  } catch (error) {
    console.error("Failed to add to pending sync:", error);
  }
}

/**
 * Remove a word ID from the pending sync queue
 */
async function removeFromPendingSync(wordId: string): Promise<void> {
  try {
    const result = await chrome.storage.local.get(PENDING_SYNC_KEY);
    const pendingSync: string[] = result[PENDING_SYNC_KEY] || [];

    const filtered = pendingSync.filter((id) => id !== wordId);
    await chrome.storage.local.set({ [PENDING_SYNC_KEY]: filtered });
  } catch (error) {
    console.error("Failed to remove from pending sync:", error);
  }
}

/**
 * Get all word IDs that need to be synced
 */
export async function getPendingSyncIds(): Promise<string[]> {
  try {
    const result = await chrome.storage.local.get(PENDING_SYNC_KEY);
    return result[PENDING_SYNC_KEY] || [];
  } catch (error) {
    console.error("Failed to get pending sync IDs:", error);
    return [];
  }
}

/**
 * Clear the pending sync queue (after successful sync)
 */
export async function clearPendingSync(): Promise<void> {
  try {
    await chrome.storage.local.set({ [PENDING_SYNC_KEY]: [] });
  } catch (error) {
    console.error("Failed to clear pending sync:", error);
  }
}

/**
 * Get words that need to be synced
 */
export async function getWordsToSync(): Promise<Word[]> {
  const pendingIds = await getPendingSyncIds();
  if (pendingIds.length === 0) return [];

  const words = await getWords();
  return words.filter((w) => pendingIds.includes(w.id));
}

// ============ Storage Change Listener ============

type WordsChangeCallback = (words: Word[]) => void;
const changeCallbacks: Set<WordsChangeCallback> = new Set();

/**
 * Subscribe to word storage changes
 */
export function subscribeToWords(callback: WordsChangeCallback): () => void {
  changeCallbacks.add(callback);

  // Set up storage listener if not already
  if (changeCallbacks.size === 1) {
    chrome.storage.onChanged.addListener(handleStorageChange);
  }

  // Return unsubscribe function
  return () => {
    changeCallbacks.delete(callback);
    if (changeCallbacks.size === 0) {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    }
  };
}

function handleStorageChange(
  changes: { [key: string]: chrome.storage.StorageChange },
  areaName: string
): void {
  if (areaName !== "local") return;
  if (!changes[WORDS_KEY]) return;

  const newWords = (changes[WORDS_KEY].newValue || []).map((word: Word) => ({
    ...word,
    nextReview: new Date(word.nextReview),
    createdAt: new Date(word.createdAt),
    updatedAt: word.updatedAt ? new Date(word.updatedAt) : undefined,
  }));

  changeCallbacks.forEach((callback) => callback(newWords));
}
