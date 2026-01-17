import { browser } from "$app/environment";

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

class ThemeStore {
  theme = $state<Theme>("dark");
  resolved = $state<ResolvedTheme>("dark");

  constructor() {
    if (browser) {
      // Initialize from localStorage or default to dark
      const stored = localStorage.getItem("theme") as Theme | null;
      if (stored && ["light", "dark", "system"].includes(stored)) {
        this.theme = stored;
      } else {
        this.theme = "dark"; // Default to dark like YouTube
      }
      this.resolved = this.resolveTheme(this.theme);
      this.applyTheme(this.resolved);

      // Listen for system theme changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", () => {
        if (this.theme === "system") {
          this.resolved = this.resolveTheme("system");
          this.applyTheme(this.resolved);
        }
      });
    }
  }

  private resolveTheme(t: Theme): ResolvedTheme {
    if (t === "system") {
      if (browser) {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      }
      return "dark";
    }
    return t;
  }

  private applyTheme(t: ResolvedTheme) {
    if (browser) {
      document.documentElement.setAttribute("data-theme", t);
    }
  }

  set(newTheme: Theme) {
    this.theme = newTheme;
    this.resolved = this.resolveTheme(newTheme);
    this.applyTheme(this.resolved);
    if (browser) {
      localStorage.setItem("theme", newTheme);
    }
  }

  toggle() {
    const next = this.resolved === "dark" ? "light" : "dark";
    this.set(next);
  }
}

export const themeStore = new ThemeStore();
