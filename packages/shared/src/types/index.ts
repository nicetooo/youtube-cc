// Word source types - supports multiple origins
export type WordSource =
  | {
      type: "youtube-caption";
      videoId: string;
      videoTitle?: string;
      timestamp: number; // Video timestamp in seconds
    }
  | {
      type: "webpage";
      url: string;
      pageTitle?: string;
    };

// Single word entry with synonyms
export interface WordEntry {
  word: string; // Translation word
  synonyms?: string[]; // Reverse translations (synonyms in source language)
}

// Dictionary entry with part of speech and terms
export interface DictEntry {
  pos: string; // Part of speech (noun, verb, adjective, etc.)
  terms: string[]; // Translation terms for this part of speech
  entries?: WordEntry[]; // Detailed entries with synonyms
}

// Word/Vocabulary types for the collection feature
export interface Word {
  id: string;
  text: string;
  context: string; // The full sentence/paragraph containing the word
  translation?: string; // Optional translation
  source: WordSource; // Where the word was collected from

  // Translation metadata
  detectedLang?: string; // Detected source language (e.g., "en", "ja")
  definitions?: DictEntry[]; // Dictionary definitions by part of speech

  // SM-2 spaced repetition fields
  easeFactor: number; // Default 2.5, minimum 1.3
  interval: number; // Days until next review
  repetitions: number; // Number of successful reviews
  nextReview: Date; // Next review date
  status: "new" | "learning" | "mastered";

  // AI generated examples
  examples?: string[];

  createdAt: Date;
  updatedAt?: Date;
}

// Legacy Word type for migration (deprecated)
export interface LegacyWord {
  id: string;
  text: string;
  context: string;
  translation?: string;
  videoId: string;
  videoTitle?: string;
  timestamp: number;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: Date;
  status: "new" | "learning" | "mastered";
  examples?: string[];
  createdAt: Date;
  updatedAt?: Date;
}

// Helper to migrate legacy word to new format
export function migrateLegacyWord(legacy: LegacyWord): Word {
  return {
    id: legacy.id,
    text: legacy.text,
    context: legacy.context,
    translation: legacy.translation,
    source: {
      type: "youtube-caption",
      videoId: legacy.videoId,
      videoTitle: legacy.videoTitle,
      timestamp: legacy.timestamp,
    },
    easeFactor: legacy.easeFactor,
    interval: legacy.interval,
    repetitions: legacy.repetitions,
    nextReview: legacy.nextReview,
    status: legacy.status,
    examples: legacy.examples,
    createdAt: legacy.createdAt,
    updatedAt: legacy.updatedAt,
  };
}

// Check if a word is in legacy format
export function isLegacyWord(word: unknown): word is LegacyWord {
  return (
    typeof word === "object" &&
    word !== null &&
    "videoId" in word &&
    !("source" in word)
  );
}

// SM-2 review quality ratings
export type ReviewRating = 0 | 1 | 2 | 3 | 4 | 5;
// 0 - Complete blackout
// 1 - Incorrect, but remembered upon seeing answer
// 2 - Incorrect, but easy to recall
// 3 - Correct with serious difficulty
// 4 - Correct with hesitation
// 5 - Perfect response

// Simplified rating for UI
export type SimpleRating = "again" | "hard" | "good" | "easy";

export interface ReviewResult {
  wordId: string;
  rating: SimpleRating;
  reviewedAt: Date;
}

export interface UserSettings {
  // Extension settings
  caption: boolean;
  skipAd: boolean;
  removeAds: boolean;
  wideScreen: boolean;
  sideComment: boolean;
  commentSearch: boolean;
  captionFontSize?: number;

  // Word selection settings
  wordSelection?: boolean;
  targetLanguage?: string;

  // Web settings
  theme: "light" | "dark" | "system";
  dailyGoal: number;

  // Sync settings
  syncEnabled: boolean;
}

export interface UserStats {
  streak: number;
  lastStudyDate: string; // YYYY-MM-DD
  totalWords: number;
  masteredWords: number;
  reviewsToday: number;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  settings: UserSettings;
  stats: UserStats;
  subscription?: {
    plan: "free" | "premium";
    expiresAt?: Date;
  };
}

// Input type for creating a new word
export type CreateWordInput = {
  text: string;
  context: string;
  translation?: string;
  source: WordSource;
  detectedLang?: string;
  definitions?: DictEntry[];
};

// Helper to create a new word with default SM-2 values
export function createWord(input: CreateWordInput): Word {
  return {
    ...input,
    id: crypto.randomUUID(),
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: new Date(),
    status: "new",
    createdAt: new Date(),
  };
}

// Helper to create a YouTube caption word
export function createYouTubeWord(
  text: string,
  context: string,
  videoId: string,
  timestamp: number,
  videoTitle?: string,
  translation?: string
): Word {
  return createWord({
    text,
    context,
    translation,
    source: {
      type: "youtube-caption",
      videoId,
      videoTitle,
      timestamp,
    },
  });
}

// Helper to create a webpage word
export function createWebpageWord(
  text: string,
  context: string,
  url: string,
  pageTitle?: string,
  translation?: string
): Word {
  return createWord({
    text,
    context,
    translation,
    source: {
      type: "webpage",
      url,
      pageTitle,
    },
  });
}
