<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import {
    appStore,
    subscribeStorageChange,
    getBrowserLanguage,
  } from "@/shared/stores/settings.svelte";
  import { i18n } from "@/shared/i18n/i18n";
  import { fade } from "svelte/transition";
  import {
    signInWithGoogle,
    logout,
    onAuthChange,
    WEBSITE_USER_KEY,
  } from "@aspect/shared";
  import {
    hasAllUrlsPermission,
    requestAllUrlsPermission,
  } from "@/shared/utils/permissions";
  import MiniHeatmap from "./MiniHeatmap.svelte";

  // Simplified Firebase user info type
  interface AuthUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    isAnonymous: boolean;
  }

  // Auth state
  let currentUser = $state<AuthUser | null>(null);
  let authLoading = $state(true);
  let syncStatus = $state<"idle" | "syncing" | "success" | "error">("idle");
  let unsubscribeAuth: (() => void) | null = null;

  // Word selection permission state
  let hasWordSelectionPermission = $state(false);
  let permissionLoading = $state(false);

  onMount(async () => {
    subscribeStorageChange();

    // Check word selection permission
    hasWordSelectionPermission = await hasAllUrlsPermission();

    // First check for website user (logged in via website)
    const result = await chrome.storage.local.get(WEBSITE_USER_KEY);
    const websiteUser = result[WEBSITE_USER_KEY] as AuthUser | undefined;

    if (websiteUser) {
      currentUser = websiteUser;
      authLoading = false;
    }

    // Listen for auth state changes from Firebase (for popup login)
    unsubscribeAuth = onAuthChange(async (user) => {
      if (user) {
        currentUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          isAnonymous: user.isAnonymous,
        };
      } else {
        const stored = await chrome.storage.local.get(WEBSITE_USER_KEY);
        if (stored[WEBSITE_USER_KEY]) {
          currentUser = stored[WEBSITE_USER_KEY];
        } else {
          currentUser = null;
        }
      }
      authLoading = false;
    });

    // Listen for auth changes from background (website login/logout)
    chrome.runtime.onMessage.addListener(handleAuthMessage);

    // Listen for storage changes (website auth updates)
    chrome.storage.onChanged.addListener(handleStorageChange);
  });

  // Handle auth-changed messages from background
  function handleAuthMessage(message: { type: string; user?: AuthUser }) {
    if (message.type === "auth-changed") {
      currentUser = message.user || null;
      authLoading = false;
    }
  }

  // Handle storage changes (for website auth updates)
  function handleStorageChange(
    changes: { [key: string]: chrome.storage.StorageChange },
    areaName: string
  ) {
    if (areaName === "local" && changes[WEBSITE_USER_KEY]) {
      const newUser = changes[WEBSITE_USER_KEY].newValue as
        | AuthUser
        | undefined;
      if (newUser) {
        currentUser = newUser;
      } else {
        if (
          !currentUser ||
          currentUser.uid === changes[WEBSITE_USER_KEY].oldValue?.uid
        ) {
          currentUser = null;
        }
      }
      authLoading = false;
    }
  }

  onDestroy(() => {
    unsubscribeAuth?.();
    chrome.runtime.onMessage.removeListener(handleAuthMessage);
    chrome.storage.onChanged.removeListener(handleStorageChange);
  });

  // Handle Google sign in
  async function handleSignIn() {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign in failed:", error);
    }
  }

  // Handle sign out
  async function handleSignOut() {
    try {
      await logout();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  }

  // Handle manual sync
  async function handleSync() {
    if (syncStatus === "syncing") return;

    syncStatus = "syncing";
    try {
      const response = await chrome.runtime.sendMessage({
        type: "sync",
        forceAll: true,
      });
      syncStatus = response?.success ? "success" : "error";

      setTimeout(() => {
        syncStatus = "idle";
      }, 2000);
    } catch (error) {
      console.error("Sync failed:", error);
      syncStatus = "error";
      setTimeout(() => {
        syncStatus = "idle";
      }, 2000);
    }
  }

  // Toggle word selection
  function toggleWordSelection() {
    appStore.update((s) => ({
      ...s,
      settings: { ...s.settings, wordSelection: !s.settings.wordSelection },
    }));
    // Notify background to update script registration
    chrome.runtime.sendMessage({ type: "update-selection-script" });
  }

  // Toggle show activity chart
  function toggleShowActivityChart() {
    appStore.update((s) => ({
      ...s,
      settings: {
        ...s.settings,
        showActivityChart: !s.settings.showActivityChart,
      },
    }));
  }

  // Enable word selection on all websites (requires permission)
  async function enableAllSitesSelection() {
    if (hasWordSelectionPermission) return;

    permissionLoading = true;
    try {
      const granted = await requestAllUrlsPermission();
      if (granted) {
        hasWordSelectionPermission = true;
        chrome.runtime.sendMessage({ type: "update-selection-script" });
      }
    } catch (error) {
      console.error("[CC Plus Words] Failed to request permission:", error);
    } finally {
      permissionLoading = false;
    }
  }

  // Update target language
  function setTargetLanguage(lang: string) {
    appStore.update((s) => ({
      ...s,
      settings: {
        ...s.settings,
        targetLanguage: lang,
      },
    }));
  }

  // Update my language
  function setMyLanguage(lang: string) {
    appStore.update((s) => ({
      ...s,
      settings: {
        ...s.settings,
        myLanguage: lang,
      },
    }));
  }

  // Complete language list (Google Translate supported languages)
  const languages = [
    {
      code: "zh-CN",
      label: "简体中文",
      search: "chinese simplified zhongwen 中文",
    },
    {
      code: "zh-TW",
      label: "繁體中文",
      search: "chinese traditional zhongwen 中文",
    },
    { code: "en", label: "English", search: "english yingyu 英语" },
    { code: "ja", label: "日本語", search: "japanese riyu 日语" },
    { code: "ko", label: "한국어", search: "korean hanyu 韩语" },
    { code: "es", label: "Español", search: "spanish xibanyayu 西班牙语" },
    { code: "fr", label: "Français", search: "french fayu 法语" },
    { code: "de", label: "Deutsch", search: "german deyu 德语" },
    { code: "pt", label: "Português", search: "portuguese putaoyayu 葡萄牙语" },
    { code: "ru", label: "Русский", search: "russian eyu 俄语" },
    { code: "ar", label: "العربية", search: "arabic alaboyu 阿拉伯语" },
    { code: "hi", label: "हिन्दी", search: "hindi yindiyu 印地语" },
    { code: "it", label: "Italiano", search: "italian yidaliyu 意大利语" },
    { code: "nl", label: "Nederlands", search: "dutch helanyu 荷兰语" },
    { code: "pl", label: "Polski", search: "polish bolanyu 波兰语" },
    { code: "vi", label: "Tiếng Việt", search: "vietnamese yuenanyu 越南语" },
    { code: "th", label: "ไทย", search: "thai taiyu 泰语" },
    {
      code: "id",
      label: "Bahasa Indonesia",
      search: "indonesian yinniyu 印尼语",
    },
    { code: "ms", label: "Bahasa Melayu", search: "malay malaiyu 马来语" },
    { code: "tr", label: "Türkçe", search: "turkish tuerqiyu 土耳其语" },
    { code: "af", label: "Afrikaans", search: "afrikaans nanfeiyu" },
    { code: "sq", label: "Shqip", search: "albanian aerbaniyayu 阿尔巴尼亚语" },
    { code: "am", label: "አማርኛ", search: "amharic amuhalayou 阿姆哈拉语" },
    {
      code: "hy",
      label: "Հայdelays",
      search: "armenian yameiniyayu 亚美尼亚语",
    },
    {
      code: "az",
      label: "Azərbaycan",
      search: "azerbaijani asaibaijiangyu 阿塞拜疆语",
    },
    { code: "eu", label: "Euskara", search: "basque baskyu 巴斯克语" },
    {
      code: "be",
      label: "Беларуская",
      search: "belarusian baieluosiyu 白俄罗斯语",
    },
    { code: "bn", label: "বাংলা", search: "bengali mengjialayu 孟加拉语" },
    { code: "bs", label: "Bosanski", search: "bosnian bosiniyayu 波斯尼亚语" },
    {
      code: "bg",
      label: "Български",
      search: "bulgarian baojialiyayu 保加利亚语",
    },
    { code: "ca", label: "Català", search: "catalan jiatailanyu 加泰罗尼亚语" },
    { code: "ceb", label: "Cebuano", search: "cebuano subunyu 宿务语" },
    { code: "ny", label: "Chichewa", search: "chichewa qiqiewayu 齐切瓦语" },
    { code: "co", label: "Corsu", search: "corsican kexijiayu 科西嘉语" },
    {
      code: "hr",
      label: "Hrvatski",
      search: "croatian keluodiyayu 克罗地亚语",
    },
    { code: "cs", label: "Čeština", search: "czech jiekeyu 捷克语" },
    { code: "da", label: "Dansk", search: "danish danmaiyu 丹麦语" },
    { code: "eo", label: "Esperanto", search: "esperanto shijieyou 世界语" },
    { code: "et", label: "Eesti", search: "estonian aishaniyayu 爱沙尼亚语" },
    {
      code: "tl",
      label: "Filipino",
      search: "filipino feilubinyu 菲律宾语 tagalog",
    },
    { code: "fi", label: "Suomi", search: "finnish fenlanyu 芬兰语" },
    { code: "fy", label: "Frysk", search: "frisian feilisiyu 弗里西语" },
    { code: "gl", label: "Galego", search: "galician jialixiyayu 加利西亚语" },
    { code: "ka", label: "ქართული", search: "georgian gelajiyayu 格鲁吉亚语" },
    { code: "el", label: "Ελληνικά", search: "greek xilaiyu 希腊语" },
    { code: "gu", label: "ગુજરાતી", search: "gujarati gujilateyu 古吉拉特语" },
    {
      code: "ht",
      label: "Kreyòl Ayisyen",
      search: "haitian creole haidikeleaoeryu 海地克里奥尔语",
    },
    { code: "ha", label: "Hausa", search: "hausa haosayu 豪萨语" },
    {
      code: "haw",
      label: "ʻŌlelo Hawaiʻi",
      search: "hawaiian xiaweiyu 夏威夷语",
    },
    { code: "iw", label: "עברית", search: "hebrew xibilaiyu 希伯来语" },
    { code: "hmn", label: "Hmoob", search: "hmong miaoyu 苗语" },
    { code: "hu", label: "Magyar", search: "hungarian xiongyaliyu 匈牙利语" },
    { code: "is", label: "Íslenska", search: "icelandic bingdaoyu 冰岛语" },
    { code: "ig", label: "Igbo", search: "igbo yiboya 伊博语" },
    { code: "ga", label: "Gaeilge", search: "irish aierlanyu 爱尔兰语" },
    { code: "jw", label: "Jawa", search: "javanese zhuawayu 爪哇语" },
    { code: "kn", label: "ಕನ್ನಡ", search: "kannada kannadayu 卡纳达语" },
    { code: "kk", label: "Қазақ", search: "kazakh hasakyu 哈萨克语" },
    { code: "km", label: "ភាសាខ្មែរ", search: "khmer gaomianyu 高棉语" },
    {
      code: "rw",
      label: "Kinyarwanda",
      search: "kinyarwanda jiniyaluwangdayu 基尼亚卢旺达语",
    },
    { code: "ku", label: "Kurdî", search: "kurdish kuerdyu 库尔德语" },
    { code: "ky", label: "Кыргызча", search: "kyrgyz jierjisiyu 吉尔吉斯语" },
    { code: "lo", label: "ລາວ", search: "lao laowo 老挝语" },
    { code: "la", label: "Latina", search: "latin ladingyu 拉丁语" },
    {
      code: "lv",
      label: "Latviešu",
      search: "latvian latuoweiyayu 拉脱维亚语",
    },
    { code: "lt", label: "Lietuvių", search: "lithuanian litaowanyu 立陶宛语" },
    {
      code: "lb",
      label: "Lëtzebuergesch",
      search: "luxembourgish lusenbaoyu 卢森堡语",
    },
    {
      code: "mk",
      label: "Македонски",
      search: "macedonian maqidunyu 马其顿语",
    },
    { code: "mg", label: "Malagasy", search: "malagasy malagasiyu 马尔加什语" },
    {
      code: "ml",
      label: "മലയാളം",
      search: "malayalam malayalamuyu 马拉雅拉姆语",
    },
    { code: "mt", label: "Malti", search: "maltese maertayu 马耳他语" },
    { code: "mi", label: "Māori", search: "maori maaoliyu 毛利语" },
    { code: "mr", label: "मराठी", search: "marathi malatiyu 马拉地语" },
    { code: "mn", label: "Монгол", search: "mongolian mengguyu 蒙古语" },
    {
      code: "my",
      label: "မြန်မာ",
      search: "myanmar burmese miandianyou 缅甸语",
    },
    { code: "ne", label: "नेपाली", search: "nepali niboeryu 尼泊尔语" },
    { code: "no", label: "Norsk", search: "norwegian nuoweiyu 挪威语" },
    { code: "or", label: "ଓଡ଼ିଆ", search: "odia odiya aoliyayu 奥里亚语" },
    { code: "ps", label: "پښتو", search: "pashto putushituyu 普什图语" },
    { code: "fa", label: "فارسی", search: "persian farsi bosiyu 波斯语" },
    { code: "pa", label: "ਪੰਜਾਬੀ", search: "punjabi pangzhapuyu 旁遮普语" },
    { code: "ro", label: "Română", search: "romanian luomaniyayu 罗马尼亚语" },
    { code: "sm", label: "Gagana Samoa", search: "samoan samoayu 萨摩亚语" },
    {
      code: "gd",
      label: "Gàidhlig",
      search: "scots gaelic sugailangaiyu 苏格兰盖尔语",
    },
    { code: "sr", label: "Српски", search: "serbian saiwieryu 塞尔维亚语" },
    { code: "st", label: "Sesotho", search: "sesotho sutuoyu 塞索托语" },
    { code: "sn", label: "Shona", search: "shona xiaona 绍纳语" },
    { code: "sd", label: "سنڌي", search: "sindhi xindeyu 信德语" },
    { code: "si", label: "සිංහල", search: "sinhala sengjialayu 僧伽罗语" },
    {
      code: "sk",
      label: "Slovenčina",
      search: "slovak siluofakeyu 斯洛伐克语",
    },
    {
      code: "sl",
      label: "Slovenščina",
      search: "slovenian siluowenniyayu 斯洛文尼亚语",
    },
    { code: "so", label: "Soomaali", search: "somali suomaliyu 索马里语" },
    { code: "su", label: "Basa Sunda", search: "sundanese xundayu 巽他语" },
    { code: "sw", label: "Kiswahili", search: "swahili siwahiliyu 斯瓦希里语" },
    { code: "sv", label: "Svenska", search: "swedish ruidianyu 瑞典语" },
    { code: "tg", label: "Тоҷикӣ", search: "tajik tajikeyu 塔吉克语" },
    { code: "ta", label: "தமிழ்", search: "tamil tamilyu 泰米尔语" },
    { code: "tt", label: "Татар", search: "tatar tataeryu 鞑靼语" },
    { code: "te", label: "తెలుగు", search: "telugu tailuguyu 泰卢固语" },
    { code: "tk", label: "Türkmen", search: "turkmen tukumanyu 土库曼语" },
    { code: "uk", label: "Українська", search: "ukrainian wukelanyu 乌克兰语" },
    { code: "ur", label: "اردو", search: "urdu wuerduyu 乌尔都语" },
    { code: "ug", label: "ئۇيغۇرچە", search: "uyghur weiwueryu 维吾尔语" },
    { code: "uz", label: "O'zbek", search: "uzbek wuzibeikeyu 乌兹别克语" },
    { code: "cy", label: "Cymraeg", search: "welsh weiershiyu 威尔士语" },
    { code: "xh", label: "isiXhosa", search: "xhosa keisayu 科萨语" },
    { code: "yi", label: "ייִדיש", search: "yiddish yidixuyu 意第绪语" },
    { code: "yo", label: "Yorùbá", search: "yoruba yuelubayu 约鲁巴语" },
    { code: "zu", label: "isiZulu", search: "zulu zuluyu 祖鲁语" },
  ];

  // Default language based on browser
  const defaultMyLanguage = getBrowserLanguage();

  // Target language dropdown state
  let showTargetLangDropdown = $state(false);
  let targetLangSearch = $state("");
  let targetLangInputRef = $state<HTMLInputElement | null>(null);

  function toggleTargetLangDropdown() {
    showTargetLangDropdown = !showTargetLangDropdown;
    showMyLangDropdown = false;
    if (showTargetLangDropdown) {
      targetLangSearch = "";
      setTimeout(() => targetLangInputRef?.focus(), 50);
    }
  }

  function selectTargetLanguage(code: string) {
    setTargetLanguage(code);
    showTargetLangDropdown = false;
    targetLangSearch = "";
  }

  // My language dropdown state
  let showMyLangDropdown = $state(false);
  let myLangSearch = $state("");
  let myLangInputRef = $state<HTMLInputElement | null>(null);

  function toggleMyLangDropdown() {
    showMyLangDropdown = !showMyLangDropdown;
    showTargetLangDropdown = false;
    if (showMyLangDropdown) {
      myLangSearch = "";
      setTimeout(() => myLangInputRef?.focus(), 50);
    }
  }

  function selectMyLanguage(code: string) {
    setMyLanguage(code);
    showMyLangDropdown = false;
    myLangSearch = "";
  }

  // Filter languages based on search query
  function filterLanguages(query: string) {
    if (!query.trim()) return languages;
    const lowerQuery = query.toLowerCase().trim();
    return languages.filter(
      (lang) =>
        lang.label.toLowerCase().includes(lowerQuery) ||
        lang.code.toLowerCase().includes(lowerQuery) ||
        lang.search.toLowerCase().includes(lowerQuery)
    );
  }

  // Filtered language lists (reactive)
  let filteredTargetLanguages = $derived(filterLanguages(targetLangSearch));
  let filteredMyLanguages = $derived(filterLanguages(myLangSearch));

  // Get current language label
  function getCurrentLangLabel(code: string): string {
    return languages.find((l) => l.code === code)?.label ?? "简体中文";
  }
</script>

<main
  class="cc-plus-style-root w-[340px] bg-[var(--cc-bg)] text-[var(--cc-text)] flex flex-col h-auto font-sans selection:bg-[var(--cc-selection)]"
>
  <!-- Header -->
  <header
    class="sticky top-0 z-50 px-6 py-5 bg-[var(--cc-bg-secondary)]/80 backdrop-blur-md border-b border-[var(--cc-border)] flex items-center justify-between"
  >
    <div class="flex items-center gap-3">
      <div class="relative group">
        <div
          class="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"
        ></div>
        <div
          class="relative w-9 h-9 bg-[var(--cc-bg-secondary)] rounded-lg flex items-center justify-center border border-[var(--cc-border-hover)]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-5 h-5 text-emerald-500"
          >
            <path
              d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"
            />
          </svg>
        </div>
      </div>
      <div>
        <h1 class="text-base font-bold tracking-tight">CC Words</h1>
        <p class="text-[10px] text-[var(--cc-text-muted)] font-medium">
          Select, Translate, Learn
        </p>
      </div>
    </div>
    <div
      class="px-2 py-0.5 rounded-full bg-[var(--cc-bg-hover)] border border-[var(--cc-border-hover)] text-[9px] font-bold text-[var(--cc-text-secondary)] uppercase tracking-tighter"
    >
      v{__APP_VERSION__}
    </div>
  </header>

  <!-- Scrollable Content -->
  <div class="p-4 flex flex-col gap-4 custom-scrollbar">
    <!-- Section: Vocabulary -->
    <section transition:fade>
      <div class="flex items-center gap-2 mb-4">
        <div class="w-1 h-3 bg-emerald-500 rounded-full"></div>
        <h2
          class="text-[11px] font-bold text-[var(--cc-text-secondary)] uppercase tracking-[0.2em]"
        >
          Vocabulary
        </h2>
      </div>

      <div class="space-y-3">
        <!-- Word Selection Toggle -->
        <button
          onclick={toggleWordSelection}
          class="w-full flex items-center justify-between p-3.5 rounded-xl bg-[var(--cc-bg-secondary)] border border-[var(--cc-border)] hover:border-[var(--cc-border-hover)] hover:bg-[var(--cc-bg-hover)] transition-all group"
        >
          <div class="flex flex-col text-left">
            <span
              class="text-sm font-semibold text-[var(--cc-text-secondary)] group-hover:text-[var(--cc-text)] transition-colors"
              >{i18n("word_selection")}</span
            >
            <span class="text-xs text-[var(--cc-text-muted)]"
              >{i18n("word_selection_sub")}</span
            >
          </div>
          <div
            class={`w-10 h-5 rounded-full relative transition-colors duration-300 ${($appStore.settings.wordSelection ?? true) ? "bg-[var(--cc-accent)]" : "bg-[var(--cc-toggle-off)]"}`}
          >
            <div
              class={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${($appStore.settings.wordSelection ?? true) ? "left-6" : "left-1"}`}
            ></div>
          </div>
        </button>

        <!-- Translation-related settings (only show when word selection is enabled) -->
        {#if $appStore.settings.wordSelection ?? true}
          <!-- All Sites Word Selection (requires permission) -->
          <button
            onclick={enableAllSitesSelection}
            disabled={permissionLoading || hasWordSelectionPermission}
            class="w-full flex items-center justify-between p-3.5 rounded-xl bg-[var(--cc-bg-secondary)] border border-[var(--cc-border)] hover:border-[var(--cc-border-hover)] hover:bg-[var(--cc-bg-hover)] transition-all group disabled:opacity-60"
          >
            <div class="flex flex-col text-left">
              <span
                class="text-sm font-semibold text-[var(--cc-text-secondary)] group-hover:text-[var(--cc-text)] transition-colors"
                >{i18n("all_sites_selection")}</span
              >
              <span class="text-xs text-[var(--cc-text-muted)]"
                >{i18n("all_sites_selection_sub")}</span
              >
            </div>
            {#if permissionLoading}
              <div
                class="w-5 h-5 border-2 border-[var(--cc-text-muted)] border-t-transparent rounded-full animate-spin"
              ></div>
            {:else if hasWordSelectionPermission}
              <svg
                class="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            {:else}
              <svg
                class="w-5 h-5 text-[var(--cc-text-muted)] group-hover:text-[var(--cc-text)] transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            {/if}
          </button>

          <!-- My Language Selector -->
          <div class="relative lang-dropdown">
            <button
              onclick={toggleMyLangDropdown}
              class="w-full flex items-center justify-between p-3.5 rounded-xl bg-[var(--cc-bg-secondary)] border border-[var(--cc-border)] hover:border-[var(--cc-border-hover)] hover:bg-[var(--cc-bg-hover)] transition-all group"
            >
              <div class="flex flex-col text-left">
                <span
                  class="text-sm font-semibold text-[var(--cc-text-secondary)] group-hover:text-[var(--cc-text)] transition-colors"
                  >{i18n("my_language")}</span
                >
                <span class="text-xs text-[var(--cc-text-muted)]"
                  >{i18n("my_language_sub")}</span
                >
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm text-[var(--cc-text-secondary)]">
                  {getCurrentLangLabel(
                    $appStore.settings.myLanguage ?? defaultMyLanguage
                  )}
                </span>
                <svg
                  class={`w-4 h-4 text-[var(--cc-text-muted)] transition-transform ${showMyLangDropdown ? "-rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>

            {#if showMyLangDropdown}
              <div
                class="absolute bottom-full left-0 right-0 mb-2 rounded-xl bg-[var(--cc-bg-secondary)] border border-[var(--cc-border-hover)] shadow-xl z-50 overflow-hidden flex flex-col"
                style="max-height: 320px;"
                transition:fade={{ duration: 150 }}
              >
                <div class="p-2 border-b border-[var(--cc-border)]">
                  <div class="relative">
                    <svg
                      class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--cc-text-muted)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      bind:this={myLangInputRef}
                      bind:value={myLangSearch}
                      type="text"
                      placeholder={i18n("search_language")}
                      class="w-full pl-8 pr-3 py-2 text-sm bg-[var(--cc-bg)] border border-[var(--cc-border)] rounded-lg text-[var(--cc-text)] placeholder-[var(--cc-text-muted)] focus:outline-none focus:border-[var(--cc-accent)]"
                      onclick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                <div class="overflow-y-auto flex-1 custom-scrollbar">
                  {#each filteredMyLanguages as lang}
                    {@const isSelected =
                      ($appStore.settings.myLanguage ?? defaultMyLanguage) ===
                      lang.code}
                    <button
                      onclick={() => selectMyLanguage(lang.code)}
                      style="padding: 10px 16px; font-size: 14px; {isSelected
                        ? 'background: var(--cc-accent); color: white;'
                        : 'color: var(--cc-text);'}"
                      class="block w-full text-left transition-colors lang-option"
                    >
                      {lang.label}
                    </button>
                  {/each}
                  {#if filteredMyLanguages.length === 0}
                    <div
                      class="px-4 py-3 text-sm text-[var(--cc-text-muted)] text-center"
                    >
                      {i18n("no_results")}
                    </div>
                  {/if}
                </div>
              </div>
            {/if}
          </div>

          <!-- Target Language Selector -->
          <div class="relative lang-dropdown">
            <button
              onclick={toggleTargetLangDropdown}
              class="w-full flex items-center justify-between p-3.5 rounded-xl bg-[var(--cc-bg-secondary)] border border-[var(--cc-border)] hover:border-[var(--cc-border-hover)] hover:bg-[var(--cc-bg-hover)] transition-all group"
            >
              <div class="flex flex-col text-left">
                <span
                  class="text-sm font-semibold text-[var(--cc-text-secondary)] group-hover:text-[var(--cc-text)] transition-colors"
                  >{i18n("target_language")}</span
                >
                <span class="text-xs text-[var(--cc-text-muted)]"
                  >{i18n("target_language_sub")}</span
                >
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm text-[var(--cc-text-secondary)]">
                  {getCurrentLangLabel(
                    $appStore.settings.targetLanguage ?? "en"
                  )}
                </span>
                <svg
                  class={`w-4 h-4 text-[var(--cc-text-muted)] transition-transform ${showTargetLangDropdown ? "-rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>

            {#if showTargetLangDropdown}
              <div
                class="absolute bottom-full left-0 right-0 mb-2 rounded-xl bg-[var(--cc-bg-secondary)] border border-[var(--cc-border-hover)] shadow-xl z-50 overflow-hidden flex flex-col"
                style="max-height: 320px;"
                transition:fade={{ duration: 150 }}
              >
                <div class="p-2 border-b border-[var(--cc-border)]">
                  <div class="relative">
                    <svg
                      class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--cc-text-muted)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      bind:this={targetLangInputRef}
                      bind:value={targetLangSearch}
                      type="text"
                      placeholder={i18n("search_language")}
                      class="w-full pl-8 pr-3 py-2 text-sm bg-[var(--cc-bg)] border border-[var(--cc-border)] rounded-lg text-[var(--cc-text)] placeholder-[var(--cc-text-muted)] focus:outline-none focus:border-[var(--cc-accent)]"
                      onclick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                <div class="overflow-y-auto flex-1 custom-scrollbar">
                  {#each filteredTargetLanguages as lang}
                    {@const isSelected =
                      ($appStore.settings.targetLanguage ?? "en") === lang.code}
                    <button
                      onclick={() => selectTargetLanguage(lang.code)}
                      style="padding: 10px 16px; font-size: 14px; {isSelected
                        ? 'background: var(--cc-accent); color: white;'
                        : 'color: var(--cc-text);'}"
                      class="block w-full text-left transition-colors lang-option"
                    >
                      {lang.label}
                    </button>
                  {/each}
                  {#if filteredTargetLanguages.length === 0}
                    <div
                      class="px-4 py-3 text-sm text-[var(--cc-text-muted)] text-center"
                    >
                      {i18n("no_results")}
                    </div>
                  {/if}
                </div>
              </div>
            {/if}
          </div>
        {/if}

        <!-- View Words Button -->
        <button
          onclick={() =>
            chrome.tabs.create({ url: `${__WEBSITE_URL__}/words` })}
          class="w-full flex items-center justify-between p-3.5 rounded-xl bg-[var(--cc-bg-secondary)] border border-[var(--cc-border)] hover:border-[var(--cc-border-hover)] hover:bg-[var(--cc-bg-hover)] transition-all group"
        >
          <div class="flex flex-col text-left">
            <span
              class="text-sm font-semibold text-[var(--cc-text-secondary)] group-hover:text-[var(--cc-text)] transition-colors"
              >{i18n("view_words")}</span
            >
            <span class="text-xs text-[var(--cc-text-muted)]"
              >{i18n("view_words_sub")}</span
            >
          </div>
          <svg
            class="w-5 h-5 text-[var(--cc-text-muted)] group-hover:text-[var(--cc-text)] transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </button>
      </div>
    </section>

    <!-- Section: Activity -->
    {#if $appStore.settings.wordSelection}
      <section transition:fade>
        <div class="flex items-center gap-2 mb-4">
          <div class="w-1 h-3 bg-green-500 rounded-full"></div>
          <h2
            class="text-[11px] font-bold text-[var(--cc-text-secondary)] uppercase tracking-[0.2em]"
          >
            {i18n("activity_title")}
          </h2>
        </div>

        <div class="space-y-3">
          <button
            onclick={toggleShowActivityChart}
            class="w-full flex items-center justify-between p-3.5 rounded-xl bg-[var(--cc-bg-secondary)] border border-[var(--cc-border)] hover:border-[var(--cc-border-hover)] hover:bg-[var(--cc-bg-hover)] transition-all group"
          >
            <div class="flex flex-col text-left">
              <span
                class="text-sm font-semibold text-[var(--cc-text-secondary)] group-hover:text-[var(--cc-text)] transition-colors"
                >{i18n("show_activity")}</span
              >
              <span class="text-xs text-[var(--cc-text-muted)]"
                >{i18n("show_activity_sub")}</span
              >
            </div>
            <div
              class={`w-10 h-5 rounded-full relative transition-colors duration-300 ${($appStore.settings.showActivityChart ?? true) ? "bg-[var(--cc-accent)]" : "bg-[var(--cc-toggle-off)]"}`}
            >
              <div
                class={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${($appStore.settings.showActivityChart ?? true) ? "left-6" : "left-1"}`}
              ></div>
            </div>
          </button>

          {#if $appStore.settings.showActivityChart ?? true}
            <MiniHeatmap />
          {/if}
        </div>
      </section>
    {/if}

    <!-- Section: Account -->
    <section transition:fade>
      <div class="flex items-center gap-2 mb-4">
        <div class="w-1 h-3 bg-purple-500 rounded-full"></div>
        <h2
          class="text-[11px] font-bold text-[var(--cc-text-secondary)] uppercase tracking-[0.2em]"
        >
          {i18n("account")}
        </h2>
      </div>

      <div class="space-y-3">
        {#if authLoading}
          <div
            class="w-full flex items-center justify-center p-4 rounded-xl bg-[var(--cc-bg-secondary)] border border-[var(--cc-border)]"
          >
            <div
              class="w-5 h-5 border-2 border-[var(--cc-text-muted)] border-t-transparent rounded-full animate-spin"
            ></div>
          </div>
        {:else if currentUser && !currentUser.isAnonymous}
          <div
            class="w-full p-3.5 rounded-xl bg-[var(--cc-bg-secondary)] border border-[var(--cc-border)]"
          >
            <div class="flex items-center gap-3 mb-3">
              {#if currentUser.photoURL}
                <img
                  src={currentUser.photoURL}
                  alt="Avatar"
                  class="w-9 h-9 rounded-full"
                  referrerpolicy="no-referrer"
                />
              {:else}
                <div
                  class="w-9 h-9 rounded-full bg-[var(--cc-accent)] flex items-center justify-center text-white font-semibold text-sm"
                >
                  {(currentUser.displayName || currentUser.email || "U")
                    .charAt(0)
                    .toUpperCase()}
                </div>
              {/if}
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-[var(--cc-text)] truncate">
                  {currentUser.displayName || currentUser.email || "User"}
                </p>
                <p class="text-xs text-[var(--cc-text-muted)] truncate">
                  {currentUser.email || ""}
                </p>
              </div>
            </div>

            <div class="flex gap-2">
              <button
                onclick={handleSync}
                disabled={syncStatus === "syncing"}
                class="flex-1 px-3 py-2 rounded-lg bg-[var(--cc-bg-hover)] border border-[var(--cc-border)] hover:border-[var(--cc-border-hover)] text-xs font-medium text-[var(--cc-text-secondary)] hover:text-[var(--cc-text)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              >
                {#if syncStatus === "syncing"}
                  <div
                    class="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"
                  ></div>
                  {i18n("syncing")}
                {:else if syncStatus === "success"}
                  <svg
                    class="w-3.5 h-3.5 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {i18n("sync_success")}
                {:else}
                  <svg
                    class="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  {i18n("sync_now")}
                {/if}
              </button>
              <button
                onclick={handleSignOut}
                class="px-3 py-2 rounded-lg bg-[var(--cc-bg-hover)] border border-[var(--cc-border)] hover:border-red-500/50 text-xs font-medium text-[var(--cc-text-muted)] hover:text-red-400 transition-all"
              >
                {i18n("sign_out")}
              </button>
            </div>
          </div>
        {:else}
          <button
            onclick={handleSignIn}
            class="w-full flex items-center justify-center gap-2.5 p-3.5 rounded-xl bg-[var(--cc-bg-secondary)] border border-[var(--cc-border)] hover:border-[var(--cc-border-hover)] hover:bg-[var(--cc-bg-hover)] transition-all group"
          >
            <svg class="w-4.5 h-4.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span
              class="text-sm font-semibold text-[var(--cc-text-secondary)] group-hover:text-[var(--cc-text)] transition-colors"
            >
              {i18n("sign_in_google")}
            </span>
          </button>
        {/if}
      </div>
    </section>
  </div>
</main>

<style>
  :global(html),
  :global(body) {
    width: fit-content;
    margin: 0;
    padding: 0;
    background-color: var(--cc-bg);
    overflow: hidden;
  }

  :global(#app) {
    display: contents;
  }

  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: var(--cc-scrollbar) transparent;
  }

  .custom-scrollbar::-webkit-scrollbar {
    width: 4px;
  }

  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: var(--cc-scrollbar);
    border-radius: 10px;
  }

  button div {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
</style>
