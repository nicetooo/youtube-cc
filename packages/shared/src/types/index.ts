// Word/Vocabulary types for the collection feature
export interface Word {
  id: string;
  text: string;
  context: string; // The full subtitle line
  translation?: string; // Optional translation
  videoId: string;
  videoTitle?: string;
  timestamp: number; // Video timestamp in seconds
  createdAt: Date;
  updatedAt?: Date;
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

  // Sync settings
  syncEnabled: boolean;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  subscription?: {
    plan: "free" | "premium";
    expiresAt?: Date;
  };
}
