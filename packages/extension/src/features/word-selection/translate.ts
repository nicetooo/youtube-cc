// Google Translate API wrapper (free tier)
// Uses the unofficial Google Translate API endpoint

// Single word entry with synonyms
export interface WordEntry {
  word: string; // Translation word
  synonyms?: string[]; // Reverse translations (synonyms in source language)
}

// Dictionary entry with part of speech and terms
export interface DictEntry {
  pos: string; // Part of speech (noun, verb, adjective, etc.)
  terms: string[]; // Translation terms for this part of speech
  entries?: WordEntry[]; // Detailed entries with synonyms
}

export interface TranslateResult {
  text: string; // Original text
  translation: string; // Translated text
  detectedLang?: string; // Detected source language
  definitions?: DictEntry[]; // Dictionary definitions by part of speech
  srcTranslit?: string; // Source text transliteration (phonetic/pinyin)
  translit?: string; // Translation transliteration (phonetic/pinyin)
}

export interface TranslateError {
  message: string;
  code: "NETWORK_ERROR" | "API_ERROR" | "EMPTY_TEXT";
}

/**
 * Translate text using Google Translate API via background script
 * @param text - Text to translate
 * @param targetLang - Target language code (e.g., 'zh-CN', 'en')
 */
export async function translate(
  text: string,
  targetLang: string
): Promise<TranslateResult> {
  if (!text.trim()) {
    throw { message: "Empty text", code: "EMPTY_TEXT" } as TranslateError;
  }

  console.log("[CC Plus] Sending translate request:", text, targetLang);

  try {
    // Send request to background script to avoid CORS
    const response = await chrome.runtime.sendMessage({
      type: "translate",
      text,
      targetLang,
    });

    console.log("[CC Plus] Translate response:", response);

    if (response.error) {
      throw {
        message: response.error,
        code: "API_ERROR",
      } as TranslateError;
    }

    return {
      text,
      translation: response.translation,
      detectedLang: response.detectedLang,
      definitions: response.definitions,
      srcTranslit: response.srcTranslit,
      translit: response.translit,
    };
  } catch (error) {
    console.error("[CC Plus] Translate error:", error);
    if ((error as TranslateError).code) {
      throw error;
    }
    throw {
      message: error instanceof Error ? error.message : "Network error",
      code: "NETWORK_ERROR",
    } as TranslateError;
  }
}

// Language code mapping for speech synthesis
const SPEECH_LANG_MAP: Record<string, string> = {
  "zh-CN": "zh-CN",
  "zh-TW": "zh-TW",
  zh: "zh-CN",
  en: "en-US",
  ja: "ja-JP",
  ko: "ko-KR",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
  pt: "pt-PT",
  ru: "ru-RU",
  ar: "ar-SA",
  hi: "hi-IN",
  nl: "nl-NL",
  pl: "pl-PL",
  vi: "vi-VN",
  th: "th-TH",
  id: "id-ID",
  tr: "tr-TR",
};

// Cache for available voices
let cachedVoices: SpeechSynthesisVoice[] = [];
let voicesLoaded = false;

/**
 * Get available speech synthesis voices
 */
function getVoices(): SpeechSynthesisVoice[] {
  if (!("speechSynthesis" in window)) return [];

  if (voicesLoaded && cachedVoices.length > 0) {
    return cachedVoices;
  }

  cachedVoices = speechSynthesis.getVoices();
  if (cachedVoices.length > 0) {
    voicesLoaded = true;
  }
  return cachedVoices;
}

// Pre-load voices when module loads
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  // Voices may load asynchronously
  speechSynthesis.onvoiceschanged = () => {
    cachedVoices = speechSynthesis.getVoices();
    voicesLoaded = true;
  };
  // Try to get voices immediately (may work in some browsers)
  getVoices();
}

/**
 * Check if a language is supported for speech synthesis
 * @param lang - Language code to check
 * @returns true if the language has available voices
 */
export function canSpeak(lang?: string): boolean {
  if (!("speechSynthesis" in window)) return false;
  if (!lang) return false;

  const voices = getVoices();
  if (voices.length === 0) {
    // Voices not loaded yet, assume supported for common languages
    const commonLangs = [
      "en",
      "zh",
      "ja",
      "ko",
      "es",
      "fr",
      "de",
      "it",
      "pt",
      "ru",
    ];
    const baseLang = lang.split("-")[0].toLowerCase();
    return commonLangs.includes(baseLang);
  }

  const targetLang = SPEECH_LANG_MAP[lang] || lang;
  const baseLang = targetLang.split("-")[0].toLowerCase();

  // Check if any voice matches the language
  return voices.some((voice) => {
    const voiceLang = voice.lang.toLowerCase();
    return (
      voiceLang === targetLang.toLowerCase() ||
      voiceLang.startsWith(baseLang + "-") ||
      voiceLang === baseLang
    );
  });
}

/**
 * Speak text using browser's Speech Synthesis API
 * @param text - Text to speak
 * @param lang - Language code for speech
 */
export function speak(text: string, lang?: string): void {
  if (!("speechSynthesis" in window)) {
    console.warn("Speech Synthesis not supported");
    return;
  }

  // Cancel any ongoing speech
  speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // Map language codes to speech synthesis language
  if (lang) {
    utterance.lang = SPEECH_LANG_MAP[lang] || lang;
  }

  utterance.rate = 0.9; // Slightly slower for clarity
  utterance.pitch = 1;
  utterance.volume = 1;

  speechSynthesis.speak(utterance);
}

/**
 * Detect the language of text (uses first translation request)
 * @param text - Text to detect language
 */
export async function detectLanguage(
  text: string
): Promise<string | undefined> {
  try {
    const result = await translate(text, "en");
    return result.detectedLang;
  } catch {
    return undefined;
  }
}
