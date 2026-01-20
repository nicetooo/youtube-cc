import { browser } from "$app/environment";
import type { User as FirebaseUser } from "firebase/auth";
import type { UserSettings, UserStats } from "@aspect/shared/types";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
  settings: UserSettings | null;
  stats: UserStats | null;
}

function createAuthStore() {
  let user = $state<AuthUser | null>(null);
  let firebaseUser = $state<FirebaseUser | null>(null);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let initialized = false;

  // Initialize Firebase auth listener (browser only)
  async function init() {
    if (!browser || initialized) return;
    initialized = true;

    const { onAuthChange, getUserSettings, getUserStats } =
      await import("@aspect/shared/firebase");

    onAuthChange(async (fbUser) => {
      firebaseUser = fbUser;

      if (fbUser) {
        // Set user immediately without waiting for Firestore
        user = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName,
          photoURL: fbUser.photoURL,
          isAnonymous: fbUser.isAnonymous,
          settings: null,
          stats: null,
        };

        // Broadcast auth state to extension via postMessage (works across worlds)
        if (browser) {
          try {
            const token = await fbUser.getIdToken();
            console.log(
              "[CC Plus Web] Broadcasting login to extension:",
              fbUser.email
            );
            window.postMessage(
              {
                source: "ccplus-web",
                type: "login",
                token,
                user: {
                  uid: fbUser.uid,
                  email: fbUser.email,
                  displayName: fbUser.displayName,
                  photoURL: fbUser.photoURL,
                  isAnonymous: fbUser.isAnonymous,
                },
              },
              "*"
            );
          } catch (e) {
            console.error("Failed to broadcast auth to extension:", e);
          }
        }

        // Load settings/stats in background
        Promise.all([
          getUserSettings(fbUser.uid).catch(() => null),
          getUserStats(fbUser.uid).catch(() => null),
        ]).then(([settings, stats]) => {
          if (user && user.uid === fbUser.uid) {
            user = { ...user, settings, stats };
          }
        });

        loading = false;
      } else {
        user = null;
        // Broadcast logout to extension
        if (browser) {
          window.postMessage({ source: "ccplus-web", type: "logout" }, "*");
        }

        // Auto sign in anonymously if no user
        loading = true;
        try {
          const { signInAnon } = await import("@aspect/shared/firebase");
          console.log("[CC Plus Web] Auto signing in anonymously...");
          await signInAnon();
          // onAuthChange will be called again with the new user
        } catch (e) {
          console.error("Failed to auto sign in anonymously:", e);
          loading = false;
        }
      }
    });

    // Listen for requests from extension via postMessage
    window.addEventListener("message", async (event) => {
      if (event.data?.source !== "ccplus-extension") return;

      // Handle auth state request
      if (event.data?.type === "auth-request") {
        console.log("[CC Plus Web] Extension requested auth state");
        if (firebaseUser) {
          try {
            const token = await firebaseUser.getIdToken();
            window.postMessage(
              {
                source: "ccplus-web",
                type: "login",
                token,
                user: {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email,
                  displayName: firebaseUser.displayName,
                  photoURL: firebaseUser.photoURL,
                  isAnonymous: firebaseUser.isAnonymous,
                },
              },
              "*"
            );
          } catch (e) {
            console.error("Failed to broadcast auth to extension:", e);
          }
        }
      }

      // Handle fetch-words request
      if (event.data?.type === "fetch-words") {
        console.log("[CC Plus Web] Extension requested words");
        if (firebaseUser) {
          try {
            const { getWords } = await import("@aspect/shared/firebase");
            const words = await getWords(firebaseUser.uid);
            console.log(
              "[CC Plus Web] Sending",
              words.length,
              "words to extension"
            );
            window.postMessage(
              {
                source: "ccplus-web",
                type: "words-response",
                words,
                success: true,
              },
              "*"
            );
          } catch (e) {
            console.error("Failed to fetch words for extension:", e);
            window.postMessage(
              {
                source: "ccplus-web",
                type: "words-response",
                words: [],
                success: false,
                error: (e as Error).message,
              },
              "*"
            );
          }
        } else {
          window.postMessage(
            {
              source: "ccplus-web",
              type: "words-response",
              words: [],
              success: false,
              error: "Not logged in",
            },
            "*"
          );
        }
      }

      // Handle upload-word request
      if (event.data?.type === "upload-word" && event.data?.word) {
        console.log(
          "[CC Plus Web] Extension uploading word:",
          event.data.word.text,
          "for user:",
          firebaseUser?.uid
        );
        if (firebaseUser) {
          try {
            const { addWord } = await import("@aspect/shared/firebase");
            // Convert date strings back to Date objects for Firestore
            const wordData = {
              ...event.data.word,
              nextReview: event.data.word.nextReview
                ? new Date(event.data.word.nextReview)
                : new Date(),
            };
            console.log("[CC Plus Web] Adding word to Firebase:", wordData);
            const wordId = await addWord(firebaseUser.uid, wordData);
            console.log("[CC Plus Web] Word added successfully, id:", wordId);
            window.postMessage(
              {
                source: "ccplus-web",
                type: "upload-word-response",
                success: true,
                wordId,
              },
              "*"
            );
          } catch (e) {
            console.error("[CC Plus Web] Failed to upload word:", e);
            window.postMessage(
              {
                source: "ccplus-web",
                type: "upload-word-response",
                success: false,
                error: (e as Error).message,
              },
              "*"
            );
          }
        }
      }
    });
  }

  // Auto-init on browser
  if (browser) {
    init();

    // Initialize extension sync (detect extension and sync words to IndexedDB)
    import("./extension-sync.svelte").then(
      ({ initExtensionSync, onExtensionSyncComplete }) => {
        // When extension sync completes, refresh the words store
        onExtensionSyncComplete(() => {
          import("./words.svelte").then(({ wordsStore }) => {
            console.log(
              "[CC Plus Web] Extension sync complete, refreshing words..."
            );
            wordsStore.refresh();
          });
        });
        initExtensionSync();
      }
    );
  }

  // Login methods
  async function loginWithGoogle() {
    error = null;
    try {
      const { signInWithGoogle } = await import("@aspect/shared/firebase");
      await signInWithGoogle();
    } catch (e) {
      error = (e as Error).message;
      throw e;
    }
  }

  async function loginWithEmail(email: string, password: string) {
    error = null;
    try {
      const { signInWithEmail } = await import("@aspect/shared/firebase");
      await signInWithEmail(email, password);
    } catch (e) {
      error = (e as Error).message;
      throw e;
    }
  }

  async function registerWithEmail(
    email: string,
    password: string,
    displayName?: string
  ) {
    error = null;
    try {
      const { signUpWithEmail } = await import("@aspect/shared/firebase");
      await signUpWithEmail(email, password, displayName);
    } catch (e) {
      error = (e as Error).message;
      throw e;
    }
  }

  async function loginAnonymously() {
    error = null;
    try {
      const { signInAnon } = await import("@aspect/shared/firebase");
      await signInAnon();
    } catch (e) {
      error = (e as Error).message;
      throw e;
    }
  }

  async function logout() {
    error = null;
    try {
      const { logout: firebaseLogout } =
        await import("@aspect/shared/firebase");
      await firebaseLogout();
    } catch (e) {
      error = (e as Error).message;
      throw e;
    }
  }

  async function linkToGoogle() {
    error = null;
    try {
      const { linkAnonymousToGoogle } = await import("@aspect/shared/firebase");
      await linkAnonymousToGoogle();
    } catch (e) {
      error = (e as Error).message;
      throw e;
    }
  }

  async function linkToEmail(email: string, password: string) {
    error = null;
    try {
      const { linkAnonymousToEmail } = await import("@aspect/shared/firebase");
      await linkAnonymousToEmail(email, password);
    } catch (e) {
      error = (e as Error).message;
      throw e;
    }
  }

  async function sendPasswordReset(email: string) {
    error = null;
    try {
      const { resetPassword } = await import("@aspect/shared/firebase");
      await resetPassword(email);
    } catch (e) {
      error = (e as Error).message;
      throw e;
    }
  }

  async function updateSettings(updates: Partial<UserSettings>) {
    if (!user) return;

    try {
      const { updateUserSettings } = await import("@aspect/shared/firebase");
      await updateUserSettings(user.uid, updates);
      user = {
        ...user,
        settings: { ...user.settings, ...updates } as UserSettings,
      };
    } catch (e) {
      error = (e as Error).message;
      throw e;
    }
  }

  async function updateStats(updates: Partial<UserStats>) {
    if (!user) return;

    try {
      const { updateUserStats } = await import("@aspect/shared/firebase");
      await updateUserStats(user.uid, updates);
      user = { ...user, stats: { ...user.stats, ...updates } as UserStats };
    } catch (e) {
      error = (e as Error).message;
      throw e;
    }
  }

  return {
    get user() {
      return user;
    },
    get firebaseUser() {
      return firebaseUser;
    },
    get loading() {
      return loading;
    },
    get error() {
      return error;
    },
    get isLoggedIn() {
      return !!user;
    },
    get isAnonymous() {
      return user?.isAnonymous ?? false;
    },
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    loginAnonymously,
    logout,
    linkToGoogle,
    linkToEmail,
    sendPasswordReset,
    updateSettings,
    updateStats,
  };
}

export const authStore = createAuthStore();
