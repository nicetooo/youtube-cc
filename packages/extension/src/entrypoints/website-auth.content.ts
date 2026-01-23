// Content script that runs on CC Plus website to sync auth state and data
// This allows the extension to detect when user logs in on the website
// and to fetch/upload words through the authenticated website
//
// Architecture:
// - Website posts message via window.postMessage (works across worlds)
// - Content script listens on window "message" event
// - Content script sends message to background via chrome.runtime
// - Background can request data fetch through this content script

export default defineContentScript({
  matches: [
    "http://localhost/*",
    "http://localhost:5188/*",
    "http://localhost:5189/*",
    "http://localhost:5190/*",
    "http://localhost:5191/*",
    "http://localhost:5173/*", // Vite default
    "http://127.0.0.1:5188/*",
    "http://127.0.0.1:5191/*",
    "https://youtube-cc.com/*",
    "https://www.youtube-cc.com/*",
  ],
  runAt: "document_idle",

  main() {
    console.log("[CC Plus] Website bridge initialized");

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
      } else if (data.type === "words-response") {
        // Forward words response to background
        console.log(
          "[CC Plus] Received words from website:",
          data.words?.length
        );
        chrome.runtime.sendMessage({
          type: "website-words-response",
          words: data.words,
          success: data.success,
          error: data.error,
        });
      } else if (data.type === "upload-word-response") {
        // Forward upload response to background
        console.log(
          "[CC Plus Content] Word upload result:",
          data.success,
          data.error || ""
        );
        chrome.runtime.sendMessage({
          type: "website-upload-response",
          success: data.success,
          wordId: data.wordId,
          error: data.error,
        });
      } else if (data.type === "ping") {
        // Handle ping request (for extension detection)
        console.log("[CC Plus Content] Received ping from website");
        window.postMessage({ source: "ccplus-extension", type: "pong" }, "*");
      } else if (data.type === "request-extension-words") {
        // Handle request for extension's local words
        console.log("[CC Plus Content] Website requesting extension words");
        (async () => {
          try {
            const WORDS_KEY = "cc_plus_words";
            const result = await chrome.storage.local.get(WORDS_KEY);
            const words = result[WORDS_KEY] || [];
            console.log("[CC Plus Content] Storage result:", result);
            console.log(
              "[CC Plus Content] Sending",
              words.length,
              "words to website:",
              words.map((w: { text: string }) => w.text)
            );
            window.postMessage(
              {
                source: "ccplus-extension",
                type: "extension-words-response",
                words,
                success: true,
              },
              "*"
            );
          } catch (e) {
            console.error(
              "[CC Plus Content] Failed to get extension words:",
              e
            );
            window.postMessage(
              {
                source: "ccplus-extension",
                type: "extension-words-response",
                words: [],
                success: false,
                error: (e as Error).message,
              },
              "*"
            );
          }
        })();
      } else if (data.type === "request-extension-activity") {
        // Handle request for extension's daily activity data
        console.log("[CC Plus Content] Website requesting extension activity");
        (async () => {
          try {
            const DAILY_ACTIVITY_KEY = "cc_plus_daily_activity";
            const result = await chrome.storage.local.get(DAILY_ACTIVITY_KEY);
            const activity = result[DAILY_ACTIVITY_KEY] || {};
            console.log(
              "[CC Plus Content] Sending activity data to website:",
              Object.keys(activity).length,
              "days"
            );
            window.postMessage(
              {
                source: "ccplus-extension",
                type: "extension-activity-response",
                activity,
                success: true,
              },
              "*"
            );
          } catch (e) {
            console.error(
              "[CC Plus Content] Failed to get extension activity:",
              e
            );
            window.postMessage(
              {
                source: "ccplus-extension",
                type: "extension-activity-response",
                activity: {},
                success: false,
                error: (e as Error).message,
              },
              "*"
            );
          }
        })();
      }
    });

    // Listen for requests from background script
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      if (message.type === "fetch-words") {
        console.log("[CC Plus Content] Requesting words from website");
        window.postMessage(
          { source: "ccplus-extension", type: "fetch-words" },
          "*"
        );
        sendResponse({ success: true });
      } else if (message.type === "upload-word") {
        console.log(
          "[CC Plus Content] Forwarding word upload to website:",
          message.word?.text
        );
        window.postMessage(
          {
            source: "ccplus-extension",
            type: "upload-word",
            word: message.word,
          },
          "*"
        );
        sendResponse({ success: true });
      }
      return false;
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

    // Proactively notify the website that extension is ready
    // This helps if the website's ping was sent before this script initialized
    console.log("[CC Plus] Sending extension-ready notification");
    window.postMessage(
      { source: "ccplus-extension", type: "extension-ready" },
      "*"
    );
  },
});
