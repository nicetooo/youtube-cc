import { browser } from "$app/environment";
import { processReview } from "$lib/sm2/algorithm";
import type { Word, SimpleRating } from "@aspect/shared/types";

function createWordsStore() {
  let words = $state<Word[]>([]);
  let loading = $state(false);
  let searchQuery = $state("");
  let selectedVideoId = $state<string | null>(null);
  let currentUserId: string | null = null;

  // Fetch words once (no realtime subscription)
  async function setUser(userId: string | null) {
    if (!browser) return;

    if (currentUserId === userId) return;
    currentUserId = userId;

    if (userId) {
      loading = true;
      try {
        const { getWords } = await import("@aspect/shared/firebase");
        words = await getWords(userId);
      } catch (e) {
        console.error("Failed to fetch words:", e);
        words = [];
      } finally {
        loading = false;
      }
    } else {
      words = [];
      loading = false;
    }
  }

  // Refresh words from server
  async function refresh() {
    if (!currentUserId) return;

    loading = true;
    try {
      const { getWords } = await import("@aspect/shared/firebase");
      words = await getWords(currentUserId);
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
      result = result.filter((w) => w.videoId === selectedVideoId);
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
    const videoMap = new Map<
      string,
      { id: string; title: string; wordCount: number }
    >();

    for (const word of words) {
      const existing = videoMap.get(word.videoId);
      if (existing) {
        existing.wordCount++;
      } else {
        videoMap.set(word.videoId, {
          id: word.videoId,
          title: word.videoTitle || word.videoId,
          wordCount: 1,
        });
      }
    }

    return Array.from(videoMap.values()).sort(
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

    const { addWord: addWordToFirebase } =
      await import("@aspect/shared/firebase");
    await addWordToFirebase(currentUserId, word);
    // Update local state
    await refresh();
  }

  async function updateWord(id: string, updates: Partial<Word>) {
    if (!currentUserId) return;

    const { updateWord: updateWordInFirebase } =
      await import("@aspect/shared/firebase");
    await updateWordInFirebase(currentUserId, id, updates);
    // Update local state immediately
    words = words.map((w) => (w.id === id ? { ...w, ...updates } : w));
  }

  async function deleteWord(id: string) {
    if (!currentUserId) return;

    const { deleteWord: deleteWordFromFirebase } =
      await import("@aspect/shared/firebase");
    await deleteWordFromFirebase(currentUserId, id);
    // Update local state immediately
    words = words.filter((w) => w.id !== id);
  }

  async function reviewWord(id: string, rating: SimpleRating) {
    if (!currentUserId) return;

    const word = words.find((w) => w.id === id);
    if (!word) return;

    const updates = processReview(word, rating);
    const { updateWord: updateWordInFirebase, updateStreak } =
      await import("@aspect/shared/firebase");
    await updateWordInFirebase(currentUserId, id, updates);
    await updateStreak(currentUserId);
    // Update local state immediately
    words = words.map((w) => (w.id === id ? { ...w, ...updates } : w));
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
