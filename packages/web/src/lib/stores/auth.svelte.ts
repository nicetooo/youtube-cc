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

    onAuthChange((fbUser) => {
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

        // Load settings/stats in background
        Promise.all([
          getUserSettings(fbUser.uid).catch(() => null),
          getUserStats(fbUser.uid).catch(() => null),
        ]).then(([settings, stats]) => {
          if (user && user.uid === fbUser.uid) {
            user = { ...user, settings, stats };
          }
        });
      } else {
        user = null;
      }

      loading = false;
    });
  }

  // Auto-init on browser
  if (browser) {
    init();
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
