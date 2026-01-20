/**
 * Speak text using browser's Speech Synthesis API
 * @param text - Text to speak
 * @param lang - Language code for speech (optional, auto-detected if not provided)
 */
export function speak(text: string, lang?: string): void {
  if (!("speechSynthesis" in window)) {
    console.warn("[CC Plus] Speech Synthesis not supported");
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
 * Check if speech synthesis is supported
 */
export function isSpeechSupported(): boolean {
  return "speechSynthesis" in window;
}
