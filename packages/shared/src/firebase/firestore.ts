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
  type Unsubscribe,
} from "firebase/firestore";
import { db } from "./config";
import type { Word, UserSettings, UserStats } from "../types";

// ============ Words ============

export async function addWord(
  userId: string,
  word: Omit<Word, "id" | "createdAt">
): Promise<string> {
  const wordsRef = collection(db, "users", userId, "words");
  const wordDoc = doc(wordsRef);

  await setDoc(wordDoc, {
    ...word,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // Update user stats
  await incrementWordCount(userId);

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

  // Update user stats
  await decrementWordCount(userId);
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
  await updateDoc(userRef, {
    settings: settings,
  });
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

async function incrementWordCount(userId: string): Promise<void> {
  const userRef = doc(db, "users", userId);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    const currentStats = snapshot.data().stats as UserStats;
    await updateDoc(userRef, {
      "stats.totalWords": (currentStats.totalWords || 0) + 1,
    });
  }
}

async function decrementWordCount(userId: string): Promise<void> {
  const userRef = doc(db, "users", userId);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    const currentStats = snapshot.data().stats as UserStats;
    await updateDoc(userRef, {
      "stats.totalWords": Math.max(0, (currentStats.totalWords || 0) - 1),
    });
  }
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
