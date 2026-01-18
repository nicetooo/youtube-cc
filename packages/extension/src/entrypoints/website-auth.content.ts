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

    // Also check if there's an existing auth state when script loads
    // This is done by injecting a script that reads Firebase auth
    injectAuthChecker();
  },
});

// Inject a script to check current auth state
function injectAuthChecker() {
  const script = document.createElement("script");
  script.textContent = `
    (function() {
      // Wait for Firebase to be ready, then check auth state
      const checkAuth = () => {
        if (window.__FIREBASE_AUTH_USER__) {
          window.dispatchEvent(new CustomEvent('ccplus-auth', {
            detail: window.__FIREBASE_AUTH_USER__
          }));
        }
      };
      
      // Check after a short delay to allow Firebase to initialize
      setTimeout(checkAuth, 1000);
      setTimeout(checkAuth, 3000);
    })();
  `;
  document.documentElement.appendChild(script);
  script.remove();
}
