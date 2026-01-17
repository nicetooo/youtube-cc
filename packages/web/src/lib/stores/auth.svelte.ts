import { browser } from "$app/environment";
import type { User, UserStats, UserSettings } from "@aspect/shared/types";

// Mock user for local development
const mockUser: User = {
  uid: "mock-user-123",
  email: "demo@example.com",
  displayName: "Demo User",
  photoURL: undefined,
  createdAt: new Date("2026-01-01"),
  settings: {
    caption: true,
    skipAd: false,
    removeAds: true,
    wideScreen: false,
    sideComment: false,
    commentSearch: true,
    theme: "system",
    dailyGoal: 10,
    syncEnabled: true,
  },
  stats: {
    streak: 15,
    lastStudyDate: new Date().toISOString().split("T")[0],
    totalWords: 234,
    masteredWords: 69,
    reviewsToday: 8,
  },
};

function createAuthStore() {
  let user = $state<User | null>(null);
  let loading = $state(true);

  // Auto "login" for local development
  if (browser) {
    setTimeout(() => {
      user = mockUser;
      loading = false;
    }, 500); // Simulate loading
  }

  function login() {
    // TODO: Implement Firebase Google login
    user = mockUser;
  }

  function logout() {
    // TODO: Implement Firebase logout
    user = null;
  }

  function updateStats(updates: Partial<UserStats>) {
    if (user) {
      user = { ...user, stats: { ...user.stats, ...updates } };
    }
  }

  function updateSettings(updates: Partial<UserSettings>) {
    if (user) {
      user = { ...user, settings: { ...user.settings, ...updates } };
    }
  }

  return {
    get user() {
      return user;
    },
    get loading() {
      return loading;
    },
    get isLoggedIn() {
      return !!user;
    },
    login,
    logout,
    updateStats,
    updateSettings,
  };
}

export const authStore = createAuthStore();
