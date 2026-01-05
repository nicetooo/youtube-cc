/**
 * YouTube Ad Selectors configuration
 * This file contains rules for identifying and removing/skipping advertisements.
 */

export const AD_REMOVAL_SELECTORS = {
  // Rules applied on the homepage (/)
  HOME: ["ytd-rich-item-renderer:has(ytd-ad-slot-renderer)", "#masthead-ad"],
  // Rules applied on the watch page (/watch)
  WATCH: [
    "ytd-ad-slot-renderer",
    "#player-ads",
    "ytd-engagement-panel-section-list-renderer:has(ytd-ad-slot-renderer)", // Added a common one often used
  ],
  // Rules applied on the search results page (/results)
  RESULTS: ["ytd-ad-slot-renderer"],
  // Global ad containers that might appear anywhere
  GLOBAL: ["ytd-ad-slot-renderer", "ytd-promoted-sparkles-web-renderer"],
};

export const AD_SKIP_SELECTORS = {
  // Selector used to detect when an ad is playing in the video player
  OVERLAY: ".ytp-ad-player-overlay-layout",
  // Selector for the "Skip Ad" button
  SKIP_BUTTON: ".ytp-ad-skip-button, .ytp-skip-ad-button",
};
