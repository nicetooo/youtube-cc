import type { Word, SimpleRating } from "@aspect/shared/types";

/**
 * Safely convert a Date or string to Date object
 * Handles JSON deserialization where Date becomes string
 */
function toDate(date: Date | string): Date {
  if (date instanceof Date) {
    return date;
  }
  return new Date(date);
}

/**
 * SM-2 Algorithm Implementation
 *
 * The SM-2 algorithm calculates the optimal interval for reviewing items.
 * It adjusts the ease factor based on how well the user remembers the item.
 *
 * Rating mapping:
 * - again (0): Complete failure, reset to beginning
 * - hard (3): Correct but with difficulty
 * - good (4): Correct with some hesitation
 * - easy (5): Perfect response
 */

// Convert simple rating to SM-2 quality (0-5)
function ratingToQuality(rating: SimpleRating): number {
  switch (rating) {
    case "again":
      return 0;
    case "hard":
      return 3;
    case "good":
      return 4;
    case "easy":
      return 5;
  }
}

// Calculate new ease factor
function calculateEaseFactor(oldEF: number, quality: number): number {
  // SM-2 formula: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  const newEF = oldEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  // Minimum ease factor is 1.3
  return Math.max(1.3, newEF);
}

// Calculate next interval in days
function calculateInterval(
  repetitions: number,
  interval: number,
  easeFactor: number,
  quality: number
): number {
  if (quality < 3) {
    // Failed review - reset
    return 0;
  }

  if (repetitions === 0) {
    return 1; // First successful review: 1 day
  } else if (repetitions === 1) {
    return 6; // Second successful review: 6 days
  } else {
    // Subsequent reviews: multiply by ease factor
    return Math.round(interval * easeFactor);
  }
}

// Get next review date
function getNextReviewDate(intervalDays: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + intervalDays);
  date.setHours(0, 0, 0, 0); // Reset to start of day
  return date;
}

// Determine word status based on repetitions and interval
function determineStatus(
  repetitions: number,
  interval: number
): Word["status"] {
  if (repetitions === 0) return "new";
  if (interval >= 21) return "mastered"; // 3+ weeks interval = mastered
  return "learning";
}

export interface ReviewUpdate {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: Date;
  status: Word["status"];
  updatedAt: Date;
}

/**
 * Process a review and return updated word properties
 */
export function processReview(word: Word, rating: SimpleRating): ReviewUpdate {
  const quality = ratingToQuality(rating);

  let newRepetitions: number;
  let newInterval: number;
  let newEaseFactor: number;

  if (quality < 3) {
    // Failed - reset repetitions but keep ease factor
    newRepetitions = 0;
    newInterval = 0;
    newEaseFactor = Math.max(1.3, word.easeFactor - 0.2); // Slight penalty
  } else {
    // Success - increment repetitions
    newRepetitions = word.repetitions + 1;
    newEaseFactor = calculateEaseFactor(word.easeFactor, quality);
    newInterval = calculateInterval(
      word.repetitions,
      word.interval,
      newEaseFactor,
      quality
    );
  }

  return {
    easeFactor: newEaseFactor,
    interval: newInterval,
    repetitions: newRepetitions,
    nextReview: getNextReviewDate(newInterval),
    status: determineStatus(newRepetitions, newInterval),
    updatedAt: new Date(),
  };
}

/**
 * Get preview of next review intervals for each rating
 */
export function getIntervalPreview(word: Word): Record<SimpleRating, string> {
  const ratings: SimpleRating[] = ["again", "hard", "good", "easy"];
  const result: Record<SimpleRating, string> = {} as Record<
    SimpleRating,
    string
  >;

  for (const rating of ratings) {
    const update = processReview(word, rating);
    result[rating] = formatInterval(update.interval);
  }

  return result;
}

/**
 * Format interval as human-readable string
 */
export function formatInterval(days: number): string {
  if (days === 0) return "<1min";
  if (days === 1) return "1day";
  if (days < 7) return `${days}days`;
  if (days < 30) {
    const weeks = Math.round(days / 7);
    return weeks === 1 ? "1week" : `${weeks}weeks`;
  }
  const months = Math.round(days / 30);
  return months === 1 ? "1month" : `${months}months`;
}

/**
 * Check if a word is due for review
 */
export function isDue(word: Word): boolean {
  return toDate(word.nextReview) <= new Date();
}

/**
 * Sort words by review priority (most urgent first)
 */
export function sortByPriority(words: Word[]): Word[] {
  return [...words].sort((a, b) => {
    // Due words first
    const aDue = isDue(a);
    const bDue = isDue(b);
    if (aDue && !bDue) return -1;
    if (!aDue && bDue) return 1;

    // Then by next review date
    return toDate(a.nextReview).getTime() - toDate(b.nextReview).getTime();
  });
}
