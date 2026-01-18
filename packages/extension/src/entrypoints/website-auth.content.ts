// Content script that runs on CC Plus website to sync auth state
// This allows the extension to detect when user logs in on the website

export default defineContentScript({
  matches: [
    "http://localhost:5173/*",
    "http://localhost:5174/*",
    "https://youtubecc.com/*",
    "https://www.youtubecc.com/*",
  ],
  runAt: "document_start",

  main() {
    console.log("[CC Plus] Website auth bridge initialized");

    // Listen for auth events from the website
    window.addEventListener("ccplus-auth", ((event: CustomEvent) => {
      const detail = event.detail;

      if (detail.type === "login") {
        console.log("[CC Plus] Detected login on website:", detail.user?.email);
        // Send to background script
        chrome.runtime.sendMessage({
          type: "website-auth",
          action: "login",
          token: detail.token,
          user: detail.user,
        });
      } else if (detail.type === "logout") {
        console.log("[CC Plus] Detected logout on website");
        chrome.runtime.sendMessage({
          type: "website-auth",
          action: "logout",
        });
      }
    }) as EventListener);
  },
});
