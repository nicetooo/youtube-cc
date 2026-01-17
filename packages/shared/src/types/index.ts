// Word/Vocabulary types for the collection feature
export interface Word {
  id: string;
  text: string;
  context: string; // The full subtitle line
  translation?: string; // Optional translation
  videoId: string;
  videoTitle?: string;
  timestamp: number; // Video timestamp in seconds

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

// Helper to create a new word with default SM-2 values
export function createWord(
  partial: Omit<
    Word,
    | "id"
    | "easeFactor"
    | "interval"
    | "repetitions"
    | "nextReview"
    | "status"
    | "createdAt"
  >
): Word {
  return {
    ...partial,
    id: crypto.randomUUID(),
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: new Date(),
    status: "new",
    createdAt: new Date(),
  };
}
