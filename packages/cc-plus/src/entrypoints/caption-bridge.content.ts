/**
 * Caption Bridge - Main World Content Script
 *
 * Runs in YouTube's MAIN world to access player API and ytInitialPlayerResponse.
 * Communicates with the isolated content script via window.postMessage.
 */
export default defineContentScript({
  matches: ["*://www.youtube.com/*", "*://youtube.com/*"],
  runAt: "document_end",
  world: "MAIN",

  main() {
    const SOURCE = "ccplus-bridge";
    const LISTEN_SOURCE = "ccplus-caption";

    function getTracksData() {
      try {
        const player = document.querySelector(
          "#movie_player"
        ) as HTMLElement & {
          getOption?: (module: string, option: string) => any;
          setOption?: (module: string, option: string, value: any) => void;
          isSubtitlesOn?: () => boolean;
          toggleSubtitlesOn?: () => void;
        };

        let captionTracks: Array<{
          languageCode: string;
          languageName: string;
          kind?: string;
          isTranslatable: boolean;
        }> = [];
        let translationLanguages: Array<{
          languageCode: string;
          languageName: string;
        }> = [];

        // Method 1: player.getOption (most reliable after player init)
        if (player?.getOption) {
          const tracklist = player.getOption("captions", "tracklist");
          if (tracklist && tracklist.length > 0) {
            captionTracks = tracklist.map(
              (t: {
                languageCode: string;
                languageName?: string;
                displayName?: string;
                kind?: string;
                is_translateable?: boolean;
              }) => ({
                languageCode: t.languageCode,
                languageName: t.languageName || t.displayName || t.languageCode,
                kind: t.kind || undefined,
                isTranslatable: t.is_translateable || false,
              })
            );
          }
        }

        // Method 2: ytInitialPlayerResponse (has translation languages)
        const response = (window as any).ytInitialPlayerResponse;
        if (response?.captions) {
          const renderer = response.captions.playerCaptionsTracklistRenderer;

          // Get caption tracks if not already found via player API
          if (captionTracks.length === 0 && renderer.captionTracks) {
            captionTracks = renderer.captionTracks.map(
              (t: {
                languageCode: string;
                name?: { simpleText: string };
                kind?: string;
                isTranslatable?: boolean;
              }) => ({
                languageCode: t.languageCode,
                languageName: t.name ? t.name.simpleText : t.languageCode,
                kind: t.kind || undefined,
                isTranslatable: t.isTranslatable || false,
              })
            );
          }

          // Translation languages (only from ytInitialPlayerResponse)
          if (renderer.translationLanguages) {
            translationLanguages = renderer.translationLanguages.map(
              (t: {
                languageCode: string;
                languageName?: { simpleText: string };
              }) => ({
                languageCode: t.languageCode,
                languageName: t.languageName
                  ? t.languageName.simpleText
                  : t.languageCode,
              })
            );
          }
        }

        return { captionTracks, translationLanguages };
      } catch (e) {
        console.error("[CC Plus Bridge] Error getting tracks:", e);
        return { captionTracks: [], translationLanguages: [] };
      }
    }

    function switchTrack(
      languageCode: string,
      translationLanguageCode?: string
    ): boolean {
      try {
        const player = document.querySelector(
          "#movie_player"
        ) as HTMLElement & {
          setOption?: (module: string, option: string, value: any) => void;
          isSubtitlesOn?: () => boolean;
          toggleSubtitlesOn?: () => void;
        };

        if (!player?.setOption) {
          console.error(
            "[CC Plus Bridge] Player not found or setOption unavailable"
          );
          return false;
        }

        // Ensure subtitles are on
        if (player.isSubtitlesOn && !player.isSubtitlesOn()) {
          player.toggleSubtitlesOn?.();
        }

        const trackOption: {
          languageCode: string;
          translationLanguage?: { languageCode: string };
        } = { languageCode };

        if (translationLanguageCode) {
          trackOption.translationLanguage = {
            languageCode: translationLanguageCode,
          };
        }

        player.setOption("captions", "track", trackOption);
        return true;
      } catch (e) {
        console.error("[CC Plus Bridge] Error switching track:", e);
        return false;
      }
    }

    // Listen for messages from isolated content script
    window.addEventListener("message", (event: MessageEvent) => {
      if (event.source !== window) return;
      if (!event.data || event.data.source !== LISTEN_SOURCE) return;

      const msg = event.data;

      switch (msg.type) {
        case "get-tracks": {
          const data = getTracksData();
          window.postMessage(
            {
              source: SOURCE,
              type: "tracks-data",
              captionTracks: data.captionTracks,
              translationLanguages: data.translationLanguages,
            },
            "*"
          );
          break;
        }
        case "switch-track": {
          const success = switchTrack(
            msg.languageCode,
            msg.translationLanguageCode
          );
          window.postMessage(
            {
              source: SOURCE,
              type: "track-switched",
              success,
            },
            "*"
          );
          break;
        }
      }
    });

    // Auto-send tracks data on YouTube SPA navigation
    document.addEventListener("yt-navigate-finish", () => {
      setTimeout(() => {
        const data = getTracksData();
        window.postMessage(
          {
            source: SOURCE,
            type: "tracks-data",
            captionTracks: data.captionTracks,
            translationLanguages: data.translationLanguages,
          },
          "*"
        );
      }, 1500);
    });

    // Send initial data after player is ready
    setTimeout(() => {
      const data = getTracksData();
      if (data.captionTracks.length > 0) {
        window.postMessage(
          {
            source: SOURCE,
            type: "tracks-data",
            captionTracks: data.captionTracks,
            translationLanguages: data.translationLanguages,
          },
          "*"
        );
      }
    }, 2000);
  },
});
