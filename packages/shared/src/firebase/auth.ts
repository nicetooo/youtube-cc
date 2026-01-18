import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  linkWithPopup,
  linkWithCredential,
  EmailAuthProvider,
  sendPasswordResetEmail,
  updateProfile,
  type User,
  type Unsubscribe,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./config";

// Google provider
const googleProvider = new GoogleAuthProvider();

// Auth functions
export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  // Don't block on document creation
  ensureUserDocument(result.user).catch(console.error);
  return result.user;
}

export async function signInWithEmail(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  // Don't block on document creation
  ensureUserDocument(result.user).catch(console.error);
  return result.user;
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string
) {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(result.user, { displayName });
  }
  // Don't block on document creation
  ensureUserDocument(result.user).catch(console.error);
  return result.user;
}

export async function signInAnon() {
  const result = await signInAnonymously(auth);
  // Don't block on document creation
  ensureUserDocument(result.user).catch(console.error);
  return result.user;
}

export async function logout() {
  await signOut(auth);
}

// Link anonymous account to Google
export async function linkAnonymousToGoogle() {
  const user = auth.currentUser;
  if (!user || !user.isAnonymous) {
    throw new Error("No anonymous user to link");
  }
  const result = await linkWithPopup(user, googleProvider);
  return result.user;
}

// Link anonymous account to email/password
export async function linkAnonymousToEmail(email: string, password: string) {
  const user = auth.currentUser;
  if (!user || !user.isAnonymous) {
    throw new Error("No anonymous user to link");
  }
  const credential = EmailAuthProvider.credential(email, password);
  const result = await linkWithCredential(user, credential);
  return result.user;
}

// Password reset
export async function resetPassword(email: string) {
  await sendPasswordResetEmail(auth, email);
}

// Auth state listener
export function onAuthChange(
  callback: (user: User | null) => void
): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

// Get current user
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

// Ensure user document exists in Firestore
async function ensureUserDocument(user: User) {
  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    // Create new user document
    await setDoc(userRef, {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      isAnonymous: user.isAnonymous,
      createdAt: serverTimestamp(),
      settings: {
        theme: "system",
        dailyGoal: 10,
        syncEnabled: true,
      },
      stats: {
        streak: 0,
        lastStudyDate: null,
        totalWords: 0,
        masteredWords: 0,
        reviewsToday: 0,
      },
    });
  }
}

export { auth };
