/**
 * Free Dictionary API wrapper
 * https://dictionaryapi.dev/
 */

export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
    }[];
  }[];
}

export interface DictionaryResult {
  word: string;
  phonetic?: string;
  examples: string[];
}

/**
 * Fetch word examples from Free Dictionary API
 * @param word - Word to look up
 * @returns Examples for the word, or empty array if not found
 */
export async function fetchWordExamples(word: string): Promise<string[]> {
  if (!word.trim()) return [];

  // Clean the word - take first word if multiple
  const cleanWord = word.trim().split(/\s+/)[0].toLowerCase();

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`
    );

    if (!response.ok) {
      console.warn(`[Dictionary] Word not found: ${cleanWord}`);
      return [];
    }

    const data: DictionaryEntry[] = await response.json();

    // Extract all examples from definitions
    const examples: string[] = [];
    for (const entry of data) {
      for (const meaning of entry.meanings) {
        for (const def of meaning.definitions) {
          if (def.example) {
            examples.push(def.example);
          }
        }
      }
    }

    // Return unique examples (max 5)
    return [...new Set(examples)].slice(0, 5);
  } catch (error) {
    console.error("[Dictionary] API error:", error);
    return [];
  }
}

/**
 * Fetch full dictionary entry
 * @param word - Word to look up
 */
export async function fetchDictionaryEntry(
  word: string
): Promise<DictionaryResult | null> {
  if (!word.trim()) return null;

  const cleanWord = word.trim().split(/\s+/)[0].toLowerCase();

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`
    );

    if (!response.ok) return null;

    const data: DictionaryEntry[] = await response.json();
    const entry = data[0];

    const examples: string[] = [];
    for (const meaning of entry.meanings) {
      for (const def of meaning.definitions) {
        if (def.example) {
          examples.push(def.example);
        }
      }
    }

    return {
      word: entry.word,
      phonetic: entry.phonetic,
      examples: [...new Set(examples)].slice(0, 5),
    };
  } catch (error) {
    console.error("[Dictionary] API error:", error);
    return null;
  }
}
