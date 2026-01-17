import {
  mockWords,
  getVideos,
  getWordsForReview,
  getWordStats,
} from "$lib/data/mock-words";
import { processReview } from "$lib/sm2/algorithm";
import type { Word, SimpleRating } from "@aspect/shared/types";

function createWordsStore() {
  let words = $state<Word[]>([...mockWords]);
  let searchQuery = $state("");
  let selectedVideoId = $state<string | null>(null);

  // Derived state
  const filtered = $derived(() => {
    let result = words;

    // Filter by video
    if (selectedVideoId) {
      result = result.filter((w) => w.videoId === selectedVideoId);
    }

    // Filter by search query
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

  const videos = $derived(getVideos(words));
  const stats = $derived(getWordStats(words));
  const dueForReview = $derived(getWordsForReview(words));

  function addWord(word: Word) {
    words = [word, ...words];
  }

  function updateWord(id: string, updates: Partial<Word>) {
    words = words.map((w) => (w.id === id ? { ...w, ...updates } : w));
  }

  function deleteWord(id: string) {
    words = words.filter((w) => w.id !== id);
  }

  function reviewWord(id: string, rating: SimpleRating) {
    const word = words.find((w) => w.id === id);
    if (!word) return;

    const updates = processReview(word, rating);
    updateWord(id, updates);
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
    get filtered() {
      return filtered();
    },
    get videos() {
      return videos;
    },
    get stats() {
      return stats;
    },
    get dueForReview() {
      return dueForReview;
    },
    get searchQuery() {
      return searchQuery;
    },
    get selectedVideoId() {
      return selectedVideoId;
    },
    addWord,
    updateWord,
    deleteWord,
    reviewWord,
    setSearch,
    setVideoFilter,
  };
}

export const wordsStore = createWordsStore();
