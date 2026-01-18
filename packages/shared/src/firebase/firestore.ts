import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  increment,
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./config";
import type { Word, UserSettings, UserStats } from "../types";

// ============ Words ============

/**
 * Check if a word already exists from the same source
 * Uses Firestore query instead of fetching all documents for better performance
 */
async function checkDuplicateWord(
  wordsRef: ReturnType<typeof collection>,
  word: Omit<Word, "id" | "createdAt">
): Promise<boolean> {
  // Query by textLower field for case-insensitive matching
  const textLower = word.text.toLowerCase();
  const q = query(wordsRef, where("textLower", "==", textLower));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return false;
  }

  // Check if any matching word has the same source
  return snapshot.docs.some((docSnap) => {
    const existing = docSnap.data();

    if (
      word.source?.type === "youtube-caption" &&
      existing.source?.type === "youtube-caption"
    ) {
      return existing.source.videoId === word.source.videoId;
    }
    if (
      word.source?.type === "webpage" &&
      existing.source?.type === "webpage"
    ) {
      return existing.source.url === word.source.url;
    }
    return false;
  });
}

export async function addWord(
  userId: string,
  word: Omit<Word, "id" | "createdAt">,
  options: { skipDuplicateCheck?: boolean } = {}
): Promise<string> {
  const wordsRef = collection(db, "users", userId, "words");

  // Check for duplicates (same text from same source)
  if (!options.skipDuplicateCheck) {
    const isDuplicate = await checkDuplicateWord(wordsRef, word);
    if (isDuplicate) {
      throw new Error("Word already saved from this source");
    }
  }

  const wordDoc = doc(wordsRef);

  // Store textLower for efficient duplicate checking queries
  await setDoc(wordDoc, {
    ...word,
    textLower: word.text.toLowerCase(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Update user stats (don't block on failure)
  try {
    await incrementWordCount(userId);
  } catch (e) {
    console.warn("Failed to increment word count:", e);
  }

  return wordDoc.id;
}

export async function getWords(userId: string): Promise<Word[]> {
  const wordsRef = collection(db, "users", userId, "words");
  const q = query(wordsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: (doc.data().updatedAt as Timestamp)?.toDate(),
    nextReview: (doc.data().nextReview as Timestamp)?.toDate() || new Date(),
  })) as Word[];
}

export async function getWord(
  userId: string,
  wordId: string
): Promise<Word | null> {
  const wordRef = doc(db, "users", userId, "words", wordId);
  const snapshot = await getDoc(wordRef);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
    updatedAt: (data.updatedAt as Timestamp)?.toDate(),
    nextReview: (data.nextReview as Timestamp)?.toDate() || new Date(),
  } as Word;
}

export async function updateWord(
  userId: string,
  wordId: string,
  updates: Partial<Word>
): Promise<void> {
  const wordRef = doc(db, "users", userId, "words", wordId);
  await updateDoc(wordRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteWord(
  userId: string,
  wordId: string
): Promise<void> {
  const wordRef = doc(db, "users", userId, "words", wordId);
  await deleteDoc(wordRef);

  // Update user stats (don't block on failure)
  try {
    await decrementWordCount(userId);
  } catch (e) {
    console.warn("Failed to decrement word count:", e);
  }
}

export function subscribeToWords(
  userId: string,
  callback: (words: Word[]) => void
): Unsubscribe {
  const wordsRef = collection(db, "users", userId, "words");
  const q = query(wordsRef, orderBy("createdAt", "desc"));

  return onSnapshot(q, (snapshot) => {
    const words = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate(),
        nextReview: (data.nextReview as Timestamp)?.toDate() || new Date(),
      };
    }) as Word[];
    callback(words);
  });
}

// Get words due for review
export async function getWordsForReview(userId: string): Promise<Word[]> {
  const wordsRef = collection(db, "users", userId, "words");
  const now = new Date();
  const q = query(
    wordsRef,
    where("nextReview", "<=", Timestamp.fromDate(now)),
    orderBy("nextReview", "asc")
  );
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      updatedAt: (data.updatedAt as Timestamp)?.toDate(),
      nextReview: (data.nextReview as Timestamp)?.toDate() || new Date(),
    };
  }) as Word[];
}

// ============ User Settings ============

export async function getUserSettings(
  userId: string
): Promise<UserSettings | null> {
  const userRef = doc(db, "users", userId);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) return null;
  return snapshot.data().settings as UserSettings;
}

export async function updateUserSettings(
  userId: string,
  settings: Partial<UserSettings>
): Promise<void> {
  const userRef = doc(db, "users", userId);
  // Use dot notation to merge settings instead of overwriting
  const updates: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(settings)) {
    updates[`settings.${key}`] = value;
  }
  await updateDoc(userRef, updates);
}

// ============ User Stats ============

export async function getUserStats(userId: string): Promise<UserStats | null> {
  const userRef = doc(db, "users", userId);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) return null;
  return snapshot.data().stats as UserStats;
}

export async function updateUserStats(
  userId: string,
  stats: Partial<UserStats>
): Promise<void> {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    stats: stats,
  });
}

/**
 * Atomically increment word count using Firestore increment()
 * No read required - handles concurrent updates safely
 */
async function incrementWordCount(userId: string): Promise<void> {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    "stats.totalWords": increment(1),
  });
}

/**
 * Atomically decrement word count using Firestore increment()
 * Note: This can result in negative values if data is inconsistent,
 * but that's preferable to race conditions. UI should handle negative as 0.
 */
async function decrementWordCount(userId: string): Promise<void> {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    "stats.totalWords": increment(-1),
  });
}

// Update streak on review
export async function updateStreak(userId: string): Promise<void> {
  const userRef = doc(db, "users", userId);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) return;

  const stats = snapshot.data().stats as UserStats;
  const today = new Date().toISOString().split("T")[0];
  const lastStudyDate = stats.lastStudyDate;

  let newStreak = stats.streak || 0;

  if (lastStudyDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (lastStudyDate === yesterdayStr) {
      // Continue streak
      newStreak += 1;
    } else if (lastStudyDate !== today) {
      // Reset streak
      newStreak = 1;
    }

    await updateDoc(userRef, {
      "stats.streak": newStreak,
      "stats.lastStudyDate": today,
    });
  }
}

export { db };
