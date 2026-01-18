import { browser } from "$app/environment";
import {
  messages,
  localeNames,
  type Locale,
  type MessageKey,
} from "./messages";
import { LOCALE_KEY } from "@aspect/shared";

const DEFAULT_LOCALE: Locale = "en";

function detectLocale(): Locale {
  if (!browser) return DEFAULT_LOCALE;

  // Check localStorage first
  const stored = localStorage.getItem(LOCALE_KEY);
  if (stored && isValidLocale(stored)) {
    return stored;
  }

  // Detect from browser
  const browserLang = navigator.language.replace("-", "_");

  // Direct match
  if (isValidLocale(browserLang)) {
    return browserLang;
  }

  // Handle zh variants
  if (browserLang.startsWith("zh")) {
    if (browserLang.includes("TW") || browserLang.includes("HK")) {
      return "zh_TW";
    }
    return "zh_CN";
  }

  // Base language match (e.g., en-GB -> en)
  const baseLang = browserLang.split("_")[0];
  if (isValidLocale(baseLang)) {
    return baseLang;
  }

  return DEFAULT_LOCALE;
}

function isValidLocale(locale: string): locale is Locale {
  return locale in messages;
}

function createI18nStore() {
  let locale = $state<Locale>(DEFAULT_LOCALE);

  // Initialize on browser
  if (browser) {
    locale = detectLocale();
  }

  function setLocale(newLocale: Locale) {
    locale = newLocale;
    if (browser) {
      localStorage.setItem(LOCALE_KEY, newLocale);
    }
  }

  function t(
    key: MessageKey,
    params?: Record<string, string | number>
  ): string {
    const message =
      messages[locale][key] || messages[DEFAULT_LOCALE][key] || key;

    if (!params) return message;

    // Replace {key} placeholders
    return message.replace(/\{(\w+)\}/g, (_, k) =>
      String(params[k] ?? `{${k}}`)
    );
  }

  return {
    get locale() {
      return locale;
    },
    get locales() {
      return Object.keys(messages) as Locale[];
    },
    get localeNames() {
      return localeNames;
    },
    setLocale,
    t,
  };
}

export const i18n = createI18nStore();
export { type Locale, type MessageKey, localeNames };
