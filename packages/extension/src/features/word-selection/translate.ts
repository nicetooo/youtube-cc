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
    const langMap: Record<string, string> = {
      "zh-CN": "zh-CN",
      "zh-TW": "zh-TW",
      en: "en-US",
      ja: "ja-JP",
      ko: "ko-KR",
    };
    utterance.lang = langMap[lang] || lang;
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
