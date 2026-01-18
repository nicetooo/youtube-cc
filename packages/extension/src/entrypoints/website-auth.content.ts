// Content script that runs on CC Plus website to sync auth state
// This allows the extension to detect when user logs in on the website
//
// Architecture:
// - Website posts message via window.postMessage (works across worlds)
// - Content script listens on window "message" event
// - Content script sends message to background via chrome.runtime

export default defineContentScript({
  matches: [
    "http://localhost:5173/*",
    "http://localhost:5174/*",
    "https://youtubecc.com/*",
    "https://www.youtubecc.com/*",
  ],
  runAt: "document_idle",

  main() {
    console.log("[CC Plus] Website auth bridge initialized");

    // Listen for postMessage from website (works across worlds)
    window.addEventListener("message", (event) => {
      const data = event.data;
      // Only accept messages with our specific source identifier
      if (!data || data.source !== "ccplus-web") return;

      if (data.type === "login") {
        console.log("[CC Plus] Detected login on website:", data.user?.email);
        chrome.runtime.sendMessage({
          type: "website-auth",
          action: "login",
          token: data.token,
          user: data.user,
        });
      } else if (data.type === "logout") {
        console.log("[CC Plus] Detected logout on website");
        chrome.runtime.sendMessage({
          type: "website-auth",
          action: "logout",
        });
      }
    });

    // Request current auth state from website (with retry for timing issues)
    function requestAuthState() {
      window.postMessage(
        { source: "ccplus-extension", type: "auth-request" },
        "*"
      );
    }

    // Retry a few times in case website's listener isn't ready yet
    setTimeout(requestAuthState, 500);
    setTimeout(requestAuthState, 1500);
    setTimeout(requestAuthState, 3000);
  },
});
