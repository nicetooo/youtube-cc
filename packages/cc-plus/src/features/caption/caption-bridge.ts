/**
 * Caption Bridge - Type Definitions
 *
 * Shared types for communication between the isolated content script
 * (CaptionList.svelte) and the main world bridge script (caption-bridge.content.ts).
 *
 * Protocol:
 *   Content Script → Bridge:
 *     { source: 'ccplus-caption', type: 'get-tracks' }
 *     { source: 'ccplus-caption', type: 'switch-track', languageCode, translationLanguageCode? }
 *
 *   Bridge → Content Script:
 *     { source: 'ccplus-bridge', type: 'tracks-data', captionTracks, translationLanguages }
 *     { source: 'ccplus-bridge', type: 'track-switched', success }
 */

export interface CaptionTrackInfo {
  languageCode: string;
  languageName: string;
  kind?: string; // "asr" for auto-generated
  isTranslatable: boolean;
}

export interface TranslationLanguageInfo {
  languageCode: string;
  languageName: string;
}
