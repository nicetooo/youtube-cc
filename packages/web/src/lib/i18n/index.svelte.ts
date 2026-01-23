import { browser } from "$app/environment";
import {
  messages,
  localeNames,
  rtlLocales,
  type Locale,
  type MessageKey,
} from "./messages";
import { LOCALE_KEY } from "@aspect/shared";

const DEFAULT_LOCALE: Locale = "en";

function detectBrowserLocale(): Locale {
  if (!browser) return DEFAULT_LOCALE;

  // Get browser language and normalize
  let lang = navigator.language.replace("-", "_");

  // Handle zh variants (match extension behavior)
  if (lang === "zh" || lang.startsWith("zh_Hans")) {
    return "zh_CN";
  }
  if (
    lang.startsWith("zh_Hant") ||
    lang.includes("TW") ||
    lang.includes("HK")
  ) {
    return "zh_TW";
  }
  if (lang.startsWith("zh")) {
    return "zh_CN"; // Default Chinese to Simplified
  }

  // Direct match
  if (isValidLocale(lang)) {
    return lang;
  }

  // Base language match (e.g., en_GB -> en)
  const baseLang = lang.split("_")[0];
  if (isValidLocale(baseLang)) {
    return baseLang;
  }

  return DEFAULT_LOCALE;
}

function detectLocale(): Locale {
  if (!browser) return DEFAULT_LOCALE;

  // Check localStorage first (user's explicit choice)
  const stored = localStorage.getItem(LOCALE_KEY);
  if (stored && isValidLocale(stored)) {
    return stored;
  }

  // Auto-detect from browser
  return detectBrowserLocale();
}

function isValidLocale(locale: string): locale is Locale {
  return locale in messages;
}

function isRtlLocale(locale: Locale): boolean {
  return rtlLocales.includes(locale);
}

function updateDocumentDirection(locale: Locale) {
  if (!browser) return;
  const dir = isRtlLocale(locale) ? "rtl" : "ltr";
  document.documentElement.dir = dir;
  document.documentElement.lang = locale.replace("_", "-");
}

function createI18nStore() {
  let locale = $state<Locale>(DEFAULT_LOCALE);

  // Initialize on browser
  if (browser) {
    locale = detectLocale();
    updateDocumentDirection(locale);
  }

  function setLocale(newLocale: Locale) {
    locale = newLocale;
    if (browser) {
      localStorage.setItem(LOCALE_KEY, newLocale);
      updateDocumentDirection(newLocale);
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
    get isRtl() {
      return isRtlLocale(locale);
    },
    setLocale,
    t,
  };
}

export const i18n = createI18nStore();
export { type Locale, type MessageKey, localeNames };
