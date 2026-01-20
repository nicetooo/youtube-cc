import { browser } from "$app/environment";
import { processReview } from "$lib/sm2/algorithm";
import type { Word, SimpleRating } from "@aspect/shared/types";
import {
  getAllWords as getIndexedDBWords,
  putWords as putIndexedDBWords,
  putWord as putIndexedDBWord,
  deleteWord as deleteIndexedDBWord,
} from "./indexeddb";

function createWordsStore() {
  let words = $state<Word[]>([]);
  let loading = $state(false);
  let syncing = $state(false);
  let searchQuery = $state("");
  let selectedVideoId = $state<string | null>(null);
  let currentUserId: string | null = null;
  let isAnonymous: boolean = false;

  // Fetch words - always from IndexedDB first, then sync with Firebase for logged in users
  async function setUser(userId: string | null, anonymous: boolean = false) {
    if (!browser) return;

    if (currentUserId === userId && isAnonymous === anonymous) return;
    currentUserId = userId;
    isAnonymous = anonymous;

    if (userId) {
      loading = true;
      try {
        // Always load from IndexedDB first (fast, offline-capable)
        console.log("[WordsStore] Loading from IndexedDB...");
        words = await getIndexedDBWords();
        loading = false;

        // For logged in users, sync with Firebase in background
        if (!anonymous) {
          syncWithFirebase(userId);
        }
      } catch (e) {
        console.error("Failed to fetch words:", e);
        words = [];
        loading = false;
      }
    } else {
      words = [];
      loading = false;
    }
  }

  // Background sync with Firebase (for logged in users)
  async function syncWithFirebase(userId: string) {
    if (syncing) return;
    syncing = true;

    try {
      console.log("[WordsStore] Syncing with Firebase...");
      const { getWords: getFirebaseWords, addWord: addFirebaseWord } =
        await import("@aspect/shared/firebase");

      // 1. Get Firebase words
      const firebaseWords = await getFirebaseWords(userId);
      const firebaseWordIds = new Set(firebaseWords.map((w) => w.id));
      const firebaseWordTexts = new Map(
        firebaseWords.map((w) => [w.text.toLowerCase(), w])
      );

      // 2. Upload local words that don't exist in Firebase
      const localWords = await getIndexedDBWords();
      let uploadCount = 0;
      for (const localWord of localWords) {
        // Skip if already in Firebase (by ID or text)
        if (firebaseWordIds.has(localWord.id)) continue;
        if (firebaseWordTexts.has(localWord.text.toLowerCase())) continue;

        try {
          await addFirebaseWord(userId, localWord, {
            skipDuplicateCheck: true,
          });
          uploadCount++;
        } catch (e) {
          console.warn(
            "[WordsStore] Failed to upload word:",
            localWord.text,
            e
          );
        }
      }
      if (uploadCount > 0) {
        console.log("[WordsStore] Uploaded", uploadCount, "words to Firebase");
      }

      // 3. Download Firebase words that don't exist locally
      const localWordIds = new Set(localWords.map((w) => w.id));
      const localWordTexts = new Set(
        localWords.map((w) => w.text.toLowerCase())
      );
      const newWords = firebaseWords.filter(
        (fw) =>
          !localWordIds.has(fw.id) && !localWordTexts.has(fw.text.toLowerCase())
      );

      if (newWords.length > 0) {
        console.log(
          "[WordsStore] Downloading",
          newWords.length,
          "words from Firebase"
        );
        await putIndexedDBWords(newWords);
      }

      // 4. Refresh local state with merged data
      words = await getIndexedDBWords();
      console.log("[WordsStore] Sync complete, total words:", words.length);
    } catch (e) {
      console.error("[WordsStore] Firebase sync failed:", e);
    } finally {
      syncing = false;
    }
  }

  // Refresh words from IndexedDB and optionally sync with Firebase
  async function refresh() {
    // Always try to refresh from IndexedDB, even without userId
    // This allows extension sync to populate words before user is set
    loading = true;
    try {
      words = await getIndexedDBWords();
      // Trigger background sync for logged in non-anonymous users
      if (currentUserId && !isAnonymous) {
        syncWithFirebase(currentUserId);
      }
    } catch (e) {
      console.error("Failed to refresh words:", e);
    } finally {
      loading = false;
    }
  }

  // Derived state
  const filtered = $derived(() => {
    let result = words;

    if (selectedVideoId) {
      result = result.filter((w) => {
        if (!w.source) return false;
        if (w.source.type === "youtube-caption") {
          return w.source.videoId === selectedVideoId;
        } else {
          try {
            const url = new URL(w.source.url);
            return url.hostname === selectedVideoId;
          } catch {
            return w.source.url === selectedVideoId;
          }
        }
      });
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (w) =>
          w.text.toLowerCase().includes(query) ||
          w.context.toLowerCase().includes(query) ||
          w.translation?.toLowerCase().includes(query)
      );
    }

    return result;
  });

  const videos = $derived(() => {
    const sourceMap = new Map<
      string,
      { id: string; title: string; wordCount: number }
    >();

    for (const word of words) {
      if (!word.source) continue;

      let id: string;
      let title: string;

      if (word.source.type === "youtube-caption") {
        id = word.source.videoId;
        title = word.source.videoTitle || "YouTube Video";
      } else {
        try {
          const url = new URL(word.source.url);
          id = url.hostname;
          title = word.source.pageTitle || url.hostname;
        } catch {
          id = word.source.url;
          title = word.source.pageTitle || "Webpage";
        }
      }

      const existing = sourceMap.get(id);
      if (existing) {
        existing.wordCount++;
      } else {
        sourceMap.set(id, { id, title, wordCount: 1 });
      }
    }

    return Array.from(sourceMap.values()).sort(
      (a, b) => b.wordCount - a.wordCount
    );
  });

  const stats = $derived(() => {
    const now = new Date();
    return {
      total: words.length,
      new: words.filter((w) => w.status === "new").length,
      learning: words.filter((w) => w.status === "learning").length,
      mastered: words.filter((w) => w.status === "mastered").length,
      dueToday: words.filter((w) => new Date(w.nextReview) <= now).length,
    };
  });

  const dueForReview = $derived(() => {
    const now = new Date();
    return words
      .filter((w) => new Date(w.nextReview) <= now)
      .sort(
        (a, b) =>
          new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime()
      );
  });

  async function addWord(word: Omit<Word, "id" | "createdAt">) {
    if (!currentUserId) return;

    // Create word with ID
    const newWord: Word = {
      ...word,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    } as Word;

    // Always save to IndexedDB first
    await putIndexedDBWord(newWord);
    words = [...words, newWord];

    // For logged in users, also save to Firebase (background)
    if (!isAnonymous) {
      import("@aspect/shared/firebase").then(
        ({ addWord: addWordToFirebase }) => {
          addWordToFirebase(currentUserId!, word, {
            skipDuplicateCheck: true,
          }).catch((e) =>
            console.error("[WordsStore] Failed to sync add to Firebase:", e)
          );
        }
      );
    }
  }

  async function updateWord(id: string, updates: Partial<Word>) {
    if (!currentUserId) return;

    // Update local state immediately
    const updatedWord = words.find((w) => w.id === id);
    if (!updatedWord) return;

    const newWord = { ...updatedWord, ...updates, updatedAt: new Date() };
    words = words.map((w) => (w.id === id ? newWord : w));

    // Save to IndexedDB
    await putIndexedDBWord(newWord);

    // For logged in users, also update Firebase (background)
    if (!isAnonymous) {
      import("@aspect/shared/firebase").then(
        ({ updateWord: updateWordInFirebase }) => {
          updateWordInFirebase(currentUserId!, id, updates).catch((e) =>
            console.error("[WordsStore] Failed to sync update to Firebase:", e)
          );
        }
      );
    }
  }

  async function deleteWord(id: string) {
    if (!currentUserId) return;

    // Update local state immediately
    words = words.filter((w) => w.id !== id);

    // Delete from IndexedDB
    await deleteIndexedDBWord(id);

    // For logged in users, also delete from Firebase (background)
    if (!isAnonymous) {
      import("@aspect/shared/firebase").then(
        ({ deleteWord: deleteWordFromFirebase }) => {
          deleteWordFromFirebase(currentUserId!, id).catch((e) =>
            console.error("[WordsStore] Failed to sync delete to Firebase:", e)
          );
        }
      );
    }
  }

  async function reviewWord(id: string, rating: SimpleRating) {
    if (!currentUserId) return;

    const word = words.find((w) => w.id === id);
    if (!word) return;

    const updates = processReview(word, rating);
    const newWord = { ...word, ...updates, updatedAt: new Date() };

    // Update local state immediately
    words = words.map((w) => (w.id === id ? newWord : w));

    // Save to IndexedDB
    await putIndexedDBWord(newWord);

    // For logged in users, also update Firebase (background)
    if (!isAnonymous) {
      import("@aspect/shared/firebase").then(
        async ({ updateWord: updateWordInFirebase, updateStreak }) => {
          try {
            await updateWordInFirebase(currentUserId!, id, updates);
            await updateStreak(currentUserId!);
          } catch (e) {
            console.error("[WordsStore] Failed to sync review to Firebase:", e);
          }
        }
      );
    }
  }

  function setSearch(query: string) {
    searchQuery = query;
  }

  function setVideoFilter(videoId: string | null) {
    selectedVideoId = videoId;
  }

  return {
    get words() {
      return words;
    },
    get loading() {
      return loading;
    },
    get syncing() {
      return syncing;
    },
    get filtered() {
      return filtered();
    },
    get videos() {
      return videos();
    },
    get stats() {
      return stats();
    },
    get dueForReview() {
      return dueForReview();
    },
    get searchQuery() {
      return searchQuery;
    },
    get selectedVideoId() {
      return selectedVideoId;
    },
    setUser,
    refresh,
    addWord,
    updateWord,
    deleteWord,
    reviewWord,
    setSearch,
    setVideoFilter,
  };
}

export const wordsStore = createWordsStore();
