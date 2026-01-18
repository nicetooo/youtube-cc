// Theme color definitions for light/dark mode
// Used by both Popup and Content Script (SelectionPopup)

export const theme = {
  dark: {
    // Background colors
    bg: "#0f0f0f",
    bgSecondary: "#1a1a1a",
    bgHover: "#222222",

    // Text colors
    text: "#f1f1f1",
    textSecondary: "#9ca3af", // gray-400
    textMuted: "#6b7280", // gray-500

    // Border colors
    border: "rgba(255, 255, 255, 0.05)",
    borderHover: "rgba(255, 255, 255, 0.1)",

    // Accent colors
    accent: "#dc2626", // red-600
    accentHover: "#b91c1c", // red-700

    // Toggle off state
    toggleOff: "#333333",

    // Scrollbar
    scrollbar: "#333333",

    // Selection highlight
    selection: "rgba(239, 68, 68, 0.3)", // red-500/30
  },
  light: {
    // Background colors
    bg: "#ffffff",
    bgSecondary: "#f5f5f5",
    bgHover: "#e5e5e5",

    // Text colors
    text: "#1a1a1a",
    textSecondary: "#4b5563", // gray-600
    textMuted: "#9ca3af", // gray-400

    // Border colors
    border: "rgba(0, 0, 0, 0.05)",
    borderHover: "rgba(0, 0, 0, 0.1)",

    // Accent colors
    accent: "#dc2626", // red-600
    accentHover: "#b91c1c", // red-700

    // Toggle off state
    toggleOff: "#d1d5db", // gray-300

    // Scrollbar
    scrollbar: "#d1d5db", // gray-300

    // Selection highlight
    selection: "rgba(239, 68, 68, 0.2)", // red-500/20
  },
} as const;

export type Theme = typeof theme.dark;
export type ThemeMode = "dark" | "light";

// Helper to get current system theme
export function getSystemTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

// Helper to get theme colors based on mode
export function getThemeColors(mode?: ThemeMode): Theme {
  const currentMode = mode ?? getSystemTheme();
  return theme[currentMode];
}

// CSS variable names mapping
export const cssVarNames = {
  bg: "--cc-bg",
  bgSecondary: "--cc-bg-secondary",
  bgHover: "--cc-bg-hover",
  text: "--cc-text",
  textSecondary: "--cc-text-secondary",
  textMuted: "--cc-text-muted",
  border: "--cc-border",
  borderHover: "--cc-border-hover",
  accent: "--cc-accent",
  accentHover: "--cc-accent-hover",
  toggleOff: "--cc-toggle-off",
  scrollbar: "--cc-scrollbar",
  selection: "--cc-selection",
} as const;

// Generate CSS variables string for a theme
export function generateCSSVariables(mode: ThemeMode): string {
  const colors = theme[mode];
  return Object.entries(cssVarNames)
    .map(([key, varName]) => `${varName}: ${colors[key as keyof Theme]};`)
    .join("\n  ");
}
