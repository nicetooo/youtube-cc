// Firebase configuration
export { app, auth, db, firebaseConfig } from "./config";

// Auth functions
export {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signInAnon,
  logout,
  linkAnonymousToGoogle,
  linkAnonymousToEmail,
  resetPassword,
  onAuthChange,
  getCurrentUser,
  type FirebaseUser,
} from "./auth";

// Firestore functions
export {
  addWord,
  getWords,
  getWord,
  updateWord,
  deleteWord,
  subscribeToWords,
  getWordsForReview,
  getUserSettings,
  updateUserSettings,
  getUserStats,
  updateUserStats,
  updateStreak,
} from "./firestore";
