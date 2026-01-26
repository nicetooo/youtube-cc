/**
 * Robust dark mode detection that works on:
 * - System preference (prefers-color-scheme)
 * - YouTube dark mode (<html dark>)
 * - Tailwind dark mode (<html class="dark">)
 * - data-theme attribute (<html data-theme="dark">)
 */

/** Check if the current page is in dark mode */
export function detectDarkMode(): boolean {
  if (typeof window === "undefined") return false;

  const html = document.documentElement;

  // YouTube: <html dark>
  if (html.hasAttribute("dark")) return true;

  // Tailwind / common: <html class="dark">
  if (html.classList.contains("dark")) return true;

  // data-theme attribute
  const theme = html.getAttribute("data-theme");
  if (theme === "dark") return true;

  // Fallback: system preference
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

/**
 * Listen for dark mode changes.
 * Returns a cleanup function.
 */
export function onDarkModeChange(
  callback: (isDark: boolean) => void
): () => void {
  const cleanups: (() => void)[] = [];

  // System preference changes
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const handleMedia = () => callback(detectDarkMode());
  mediaQuery.addEventListener("change", handleMedia);
  cleanups.push(() => mediaQuery.removeEventListener("change", handleMedia));

  // DOM attribute changes (YouTube dark toggle, Tailwind class, data-theme)
  const observer = new MutationObserver(() => {
    callback(detectDarkMode());
  });
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["dark", "class", "data-theme"],
  });
  cleanups.push(() => observer.disconnect());

  return () => cleanups.forEach((fn) => fn());
}
