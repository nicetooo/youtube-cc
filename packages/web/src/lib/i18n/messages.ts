// Supported languages
export type Locale =
  | "en"
  | "zh_CN"
  | "zh_TW"
  | "ja"
  | "ko"
  | "hi"
  | "es"
  | "fr"
  | "ar"
  | "bn"
  | "pt"
  | "ru";

export const localeNames: Record<Locale, string> = {
  en: "English",
  zh_CN: "简体中文",
  zh_TW: "繁體中文",
  ja: "日本語",
  ko: "한국어",
  hi: "हिन्दी",
  es: "Español",
  fr: "Français",
  ar: "العربية",
  bn: "বাংলা",
  pt: "Português",
  ru: "Русский",
};

// RTL (right-to-left) languages
export const rtlLocales: Locale[] = ["ar"];

export const messages = {
  en: {
    // Nav
    nav_home: "Home",
    nav_words: "Words",
    nav_review: "Review",
    nav_stats: "Stats",
    nav_settings: "Settings",

    // Home page
    home_title: "Learn Languages with YouTube",
    home_subtitle:
      "Save vocabulary from videos, review with spaced repetition, and master new words effortlessly.",
    home_get_extension: "Get Extension",
    home_view_words: "View My Words",
    home_feature_captions: "Interactive Captions",
    home_feature_captions_desc:
      "Click any word in subtitles to save it instantly",
    home_feature_sync: "Cloud Sync",
    home_feature_sync_desc:
      "Your vocabulary syncs across extension and website",
    home_feature_review: "Smart Review",
    home_feature_review_desc:
      "SM-2 algorithm schedules reviews at optimal intervals",
    home_feature_wide_screen: "Wide Screen",
    home_feature_wide_screen_desc: "Maximize immersion with theater mode",
    home_feature_clean: "Clean Interface",
    home_feature_clean_desc: "Remove ads and distractions for focused viewing",
    home_feature_side_comments: "Side Comments",
    home_feature_side_comments_desc:
      "Move comments to the right for better layout",
    home_feature_comment_search: "Comment Search",
    home_feature_comment_search_desc: "Search and filter comments easily",
    home_feature_word_selection: "Word Selection",
    home_feature_word_selection_desc:
      "Select any text to translate and save words",

    // Words page
    words_title: "My Vocabulary",
    words_search_placeholder: "Search words...",
    words_filter_all: "All",
    words_filter_new: "New",
    words_filter_learning: "Learning",
    words_filter_mastered: "Mastered",
    words_empty: "No words found",
    words_empty_hint: "Start saving words from YouTube videos!",
    words_count: "{count} words",

    // Review page
    review_title: "Review",
    review_due_today: "Due Today",
    review_start: "Start Review",
    review_no_cards: "No cards due for review",
    review_no_cards_hint: "Great job! Come back later for more reviews.",
    review_show_answer: "Show Answer",
    review_again: "Again",
    review_hard: "Hard",
    review_good: "Good",
    review_easy: "Easy",
    review_complete: "Review Complete!",
    review_complete_message: "You reviewed {count} cards today.",
    review_back_home: "Back to Home",

    // Stats page
    stats_title: "Statistics",
    stats_streak: "Day Streak",
    stats_total_words: "Total Words",
    stats_mastered: "Mastered",
    stats_due_today: "Due Today",
    stats_vocabulary_growth: "Vocabulary Growth",
    stats_last_7_days: "Last 7 Days",
    stats_30_days_ago: "30 days ago",
    stats_today: "Today",
    stats_mastery_distribution: "Mastery Distribution",
    stats_videos_studied: "Videos Studied",
    stats_no_videos: "No videos yet",
    stats_word_count: "{count} words",
    stats_activity_title: "Learning Activity",
    stats_activity_total: "{count} words added in the last year",
    stats_activity_words: "words",
    stats_activity_less: "Less",
    stats_activity_more: "More",

    // Settings page
    settings_title: "Settings",
    settings_account: "Account",
    settings_email: "Email",
    settings_member_since: "Member since",
    settings_appearance: "Appearance",
    settings_theme: "Theme",
    settings_theme_light: "Light",
    settings_theme_dark: "Dark",
    settings_theme_system: "System",
    settings_language: "Language",
    settings_learning: "Learning",
    settings_daily_goal: "Daily Goal",
    settings_daily_goal_unit: "words/day",
    settings_sync: "Sync",
    settings_sync_enabled: "Sync Enabled",
    settings_sync_desc: "Sync vocabulary between extension and website",
    settings_logout: "Log Out",
    settings_login_hint: "Sign in to sync your vocabulary across devices",
    settings_google_login: "Sign in with Google",
    settings_data: "Data",
    settings_export: "Export Data",
    settings_export_desc: "Download all {count} words as JSON file",
    settings_export_btn: "Export",
    settings_danger: "Danger Zone",
    settings_delete_account: "Delete Account",
    settings_delete_account_desc:
      "Permanently delete your account and all data",

    // Word card
    word_context: "Context",
    word_from_video: "From video",
    word_added: "Added",

    // Common
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    close: "Close",

    // Privacy page
    privacy_title: "Privacy Policy",
    privacy_updated: "Last updated: January 2025",
    privacy_intro_title: "Introduction",
    privacy_intro_text:
      "CC Plus is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our browser extension and website.",
    privacy_collect_title: "Data We Collect",
    privacy_collect_vocab: "Vocabulary Data",
    privacy_collect_vocab_desc:
      "Words you save, including context sentences and video sources. Stored locally in your browser by default.",
    privacy_collect_account: "Account Information",
    privacy_collect_account_desc:
      "If you sign in with Google, we receive your email and profile name for authentication purposes only.",
    privacy_collect_analytics: "Usage Analytics",
    privacy_collect_analytics_desc:
      "We use Google Analytics to collect anonymous usage statistics to improve our service.",
    privacy_storage_title: "Data Storage",
    privacy_storage_local: "Local Storage",
    privacy_storage_local_desc:
      "Your vocabulary is stored locally in IndexedDB and works offline.",
    privacy_storage_cloud: "Cloud Sync",
    privacy_storage_cloud_desc:
      "If you sign in, data syncs to Firebase for cross-device access.",
    privacy_sharing_title: "Data Sharing",
    privacy_sharing_text:
      "We do not sell or share your personal data, except with these service providers:",
    privacy_sharing_firebase: "Firebase (Google) - Auth & Storage",
    privacy_sharing_analytics: "Google Analytics - Usage Stats",
    privacy_rights_title: "Your Rights",
    privacy_rights_export: "Export your data",
    privacy_rights_delete: "Delete your account",
    privacy_rights_no_account: "Use without account",
    privacy_contact_title: "Questions?",
    privacy_contact_text:
      "If you have questions about this Privacy Policy, contact us:",
    privacy_back: "Back to Settings",

    // Terms page
    terms_title: "Terms of Service",
    terms_updated: "Last updated: January 2025",
    terms_accept_title: "Acceptance of Terms",
    terms_accept_text:
      "By using CC Plus browser extension and website, you agree to these Terms of Service. If you do not agree, please do not use our services.",
    terms_service_title: "Description of Service",
    terms_service_text:
      "CC Plus is a language learning tool that helps you save vocabulary from YouTube videos, review words using spaced repetition, and sync your progress across devices.",
    terms_responsibility_title: "User Responsibilities",
    terms_responsibility_1: "Maintain the security of your account",
    terms_responsibility_2: "Do not misuse or abuse our services",
    terms_responsibility_3: "Comply with YouTube's Terms of Service",
    terms_ip_title: "Intellectual Property",
    terms_ip_text:
      "The CC Plus extension, website, and associated content are protected by copyright. You may not copy, modify, or distribute our software without permission.",
    terms_data_title: "Your Data",
    terms_data_text:
      "You retain ownership of the vocabulary data you create. We only store and process your data to provide the service.",
    terms_disclaimer_title: "Disclaimer",
    terms_disclaimer_text:
      'CC Plus is provided "as is" without warranties of any kind. We are not affiliated with YouTube or Google.',
    terms_liability_title: "Limitation of Liability",
    terms_liability_text:
      "To the maximum extent permitted by law, CC Plus shall not be liable for any indirect, incidental, or consequential damages.",
    terms_termination_title: "Termination",
    terms_termination_text:
      "We reserve the right to suspend or terminate access to our services at any time. You may stop using our services at any time.",
    terms_changes_title: "Changes to Terms",
    terms_changes_text:
      "We may update these Terms from time to time. Continued use of the service after changes constitutes acceptance.",
    terms_back: "Back to Settings",

    // PWA Install
    pwa_install_title: "Install CC Plus",
    pwa_install_hint: "Add to home screen for quick access",
    pwa_install_button: "Install",
    pwa_install_ios_hint: "Add to home screen for the best experience",
    pwa_install_ios_step1: "Tap the share button",
    pwa_install_ios_step2: 'Select "Add to Home Screen"',
  },

  zh_CN: {
    // Nav
    nav_home: "首页",
    nav_words: "生词",
    nav_review: "复习",
    nav_stats: "统计",
    nav_settings: "设置",

    // Home page
    home_title: "用 YouTube 学语言",
    home_subtitle: "从视频中收藏生词，用间隔重复复习，轻松掌握新词汇。",
    home_get_extension: "获取扩展",
    home_view_words: "查看生词",
    home_feature_captions: "互动字幕",
    home_feature_captions_desc: "点击字幕中的任意单词即可保存",
    home_feature_sync: "云同步",
    home_feature_sync_desc: "生词在扩展和网站之间自动同步",
    home_feature_review: "智能复习",
    home_feature_review_desc: "SM-2 算法在最佳时间安排复习",
    home_feature_wide_screen: "宽屏模式",
    home_feature_wide_screen_desc: "剧院模式最大化沉浸体验",
    home_feature_clean: "界面净化",
    home_feature_clean_desc: "移除广告和干扰，专注观看",
    home_feature_side_comments: "侧边评论",
    home_feature_side_comments_desc: "将评论移至右侧，优化布局",
    home_feature_comment_search: "评论搜索",
    home_feature_comment_search_desc: "轻松搜索和过滤评论",
    home_feature_word_selection: "划词翻译",
    home_feature_word_selection_desc: "选中文字即可翻译并保存生词",

    // Words page
    words_title: "我的生词",
    words_search_placeholder: "搜索单词...",
    words_filter_all: "全部",
    words_filter_new: "新词",
    words_filter_learning: "学习中",
    words_filter_mastered: "已掌握",
    words_empty: "没有找到单词",
    words_empty_hint: "开始从 YouTube 视频中收藏生词吧！",
    words_count: "{count} 个单词",

    // Review page
    review_title: "复习",
    review_due_today: "今日待复习",
    review_start: "开始复习",
    review_no_cards: "没有待复习的卡片",
    review_no_cards_hint: "太棒了！稍后再来复习。",
    review_show_answer: "显示答案",
    review_again: "重来",
    review_hard: "困难",
    review_good: "良好",
    review_easy: "简单",
    review_complete: "复习完成！",
    review_complete_message: "今天复习了 {count} 张卡片。",
    review_back_home: "返回首页",

    // Stats page
    stats_title: "统计",
    stats_streak: "连续天数",
    stats_total_words: "总单词数",
    stats_mastered: "已掌握",
    stats_due_today: "今日待复习",
    stats_vocabulary_growth: "词汇增长",
    stats_last_7_days: "最近 7 天",
    stats_30_days_ago: "30 天前",
    stats_today: "今天",
    stats_mastery_distribution: "掌握程度分布",
    stats_videos_studied: "学习过的视频",
    stats_no_videos: "暂无视频",
    stats_word_count: "{count} 个单词",
    stats_activity_title: "学习活跃度",
    stats_activity_total: "过去一年添加了 {count} 个单词",
    stats_activity_words: "个单词",
    stats_activity_less: "少",
    stats_activity_more: "多",

    // Settings page
    settings_title: "设置",
    settings_account: "账户",
    settings_email: "邮箱",
    settings_member_since: "注册时间",
    settings_appearance: "外观",
    settings_theme: "主题",
    settings_theme_light: "浅色",
    settings_theme_dark: "深色",
    settings_theme_system: "跟随系统",
    settings_language: "语言",
    settings_learning: "学习",
    settings_daily_goal: "每日目标",
    settings_daily_goal_unit: "单词/天",
    settings_sync: "同步",
    settings_sync_enabled: "启用同步",
    settings_sync_desc: "在扩展和网站之间同步生词",
    settings_logout: "退出登录",
    settings_login_hint: "登录以在设备间同步生词",
    settings_google_login: "使用 Google 登录",
    settings_data: "数据",
    settings_export: "导出数据",
    settings_export_desc: "下载全部 {count} 个单词为 JSON 文件",
    settings_export_btn: "导出",
    settings_danger: "危险区域",
    settings_delete_account: "删除账户",
    settings_delete_account_desc: "永久删除您的账户和所有数据",

    // Word card
    word_context: "上下文",
    word_from_video: "来自视频",
    word_added: "添加于",

    // Common
    loading: "加载中...",
    save: "保存",
    cancel: "取消",
    delete: "删除",
    edit: "编辑",
    close: "关闭",

    // Privacy page
    privacy_title: "隐私政策",
    privacy_updated: "最后更新：2025年1月",
    privacy_intro_title: "简介",
    privacy_intro_text:
      "CC Plus 致力于保护您的隐私。本隐私政策说明我们如何收集、使用和保护您在使用浏览器扩展和网站时的信息。",
    privacy_collect_title: "我们收集的数据",
    privacy_collect_vocab: "词汇数据",
    privacy_collect_vocab_desc:
      "您保存的单词，包括上下文句子和视频来源。默认存储在浏览器本地。",
    privacy_collect_account: "账户信息",
    privacy_collect_account_desc:
      "如果您使用 Google 登录，我们会获取您的邮箱和个人资料名称，仅用于身份验证。",
    privacy_collect_analytics: "使用统计",
    privacy_collect_analytics_desc:
      "我们使用 Google Analytics 收集匿名使用统计数据，以改进我们的服务。",
    privacy_storage_title: "数据存储",
    privacy_storage_local: "本地存储",
    privacy_storage_local_desc:
      "您的词汇存储在本地 IndexedDB 中，支持离线使用。",
    privacy_storage_cloud: "云同步",
    privacy_storage_cloud_desc:
      "如果您登录，数据将同步到 Firebase 以实现跨设备访问。",
    privacy_sharing_title: "数据共享",
    privacy_sharing_text:
      "我们不会出售或分享您的个人数据，除了以下服务提供商：",
    privacy_sharing_firebase: "Firebase (Google) - 认证和存储",
    privacy_sharing_analytics: "Google Analytics - 使用统计",
    privacy_rights_title: "您的权利",
    privacy_rights_export: "导出您的数据",
    privacy_rights_delete: "删除您的账户",
    privacy_rights_no_account: "无需账户使用",
    privacy_contact_title: "有疑问？",
    privacy_contact_text: "如果您对本隐私政策有疑问，请联系我们：",
    privacy_back: "返回设置",

    // Terms page
    terms_title: "服务条款",
    terms_updated: "最后更新：2025年1月",
    terms_accept_title: "条款接受",
    terms_accept_text:
      "使用 CC Plus 浏览器扩展和网站即表示您同意本服务条款。如果您不同意，请勿使用我们的服务。",
    terms_service_title: "服务说明",
    terms_service_text:
      "CC Plus 是一款语言学习工具，帮助您从 YouTube 视频中保存词汇、使用间隔重复复习单词，并在设备间同步进度。",
    terms_responsibility_title: "用户责任",
    terms_responsibility_1: "维护账户安全",
    terms_responsibility_2: "不得滥用我们的服务",
    terms_responsibility_3: "遵守 YouTube 服务条款",
    terms_ip_title: "知识产权",
    terms_ip_text:
      "CC Plus 扩展、网站及相关内容受版权保护。未经许可，您不得复制、修改或分发我们的软件。",
    terms_data_title: "您的数据",
    terms_data_text:
      "您保留所创建词汇数据的所有权。我们仅存储和处理您的数据以提供服务。",
    terms_disclaimer_title: "免责声明",
    terms_disclaimer_text:
      "CC Plus 按「原样」提供，不提供任何形式的保证。我们与 YouTube 或 Google 无关联。",
    terms_liability_title: "责任限制",
    terms_liability_text:
      "在法律允许的最大范围内，CC Plus 不对任何间接、附带或后果性损害承担责任。",
    terms_termination_title: "终止",
    terms_termination_text:
      "我们保留随时暂停或终止服务访问的权利。您可以随时停止使用我们的服务。",
    terms_changes_title: "条款变更",
    terms_changes_text:
      "我们可能会不时更新这些条款。在变更后继续使用服务即表示接受新条款。",
    terms_back: "返回设置",

    // PWA Install
    pwa_install_title: "安装 CC Plus",
    pwa_install_hint: "添加到主屏幕，快速访问",
    pwa_install_button: "安装",
    pwa_install_ios_hint: "添加到主屏幕以获得最佳体验",
    pwa_install_ios_step1: "点击分享按钮",
    pwa_install_ios_step2: "选择「添加到主屏幕」",
  },

  zh_TW: {
    // Nav
    nav_home: "首頁",
    nav_words: "生詞",
    nav_review: "複習",
    nav_stats: "統計",
    nav_settings: "設定",

    // Home page
    home_title: "用 YouTube 學語言",
    home_subtitle: "從影片中收藏生詞，用間隔重複複習，輕鬆掌握新詞彙。",
    home_get_extension: "取得擴充",
    home_view_words: "查看生詞",
    home_feature_captions: "互動字幕",
    home_feature_captions_desc: "點擊字幕中的任意單字即可儲存",
    home_feature_sync: "雲端同步",
    home_feature_sync_desc: "生詞在擴充和網站之間自動同步",
    home_feature_review: "智慧複習",
    home_feature_review_desc: "SM-2 演算法在最佳時間安排複習",
    home_feature_wide_screen: "寬屏模式",
    home_feature_wide_screen_desc: "劇院模式最大化沉浸體驗",
    home_feature_clean: "介面淨化",
    home_feature_clean_desc: "移除廣告和干擾，專注觀看",
    home_feature_side_comments: "側邊評論",
    home_feature_side_comments_desc: "將評論移至右側，優化佈局",
    home_feature_comment_search: "評論搜尋",
    home_feature_comment_search_desc: "輕鬆搜尋和過濾評論",
    home_feature_word_selection: "劃詞翻譯",
    home_feature_word_selection_desc: "選中文字即可翻譯並保存生詞",

    // Words page
    words_title: "我的生詞",
    words_search_placeholder: "搜尋單字...",
    words_filter_all: "全部",
    words_filter_new: "新詞",
    words_filter_learning: "學習中",
    words_filter_mastered: "已掌握",
    words_empty: "沒有找到單字",
    words_empty_hint: "開始從 YouTube 影片中收藏生詞吧！",
    words_count: "{count} 個單字",

    // Review page
    review_title: "複習",
    review_due_today: "今日待複習",
    review_start: "開始複習",
    review_no_cards: "沒有待複習的卡片",
    review_no_cards_hint: "太棒了！稍後再來複習。",
    review_show_answer: "顯示答案",
    review_again: "重來",
    review_hard: "困難",
    review_good: "良好",
    review_easy: "簡單",
    review_complete: "複習完成！",
    review_complete_message: "今天複習了 {count} 張卡片。",
    review_back_home: "返回首頁",

    // Stats page
    stats_title: "統計",
    stats_streak: "連續天數",
    stats_total_words: "總單字數",
    stats_mastered: "已掌握",
    stats_due_today: "今日待複習",
    stats_vocabulary_growth: "詞彙增長",
    stats_last_7_days: "最近 7 天",
    stats_30_days_ago: "30 天前",
    stats_today: "今天",
    stats_mastery_distribution: "掌握程度分布",
    stats_videos_studied: "學習過的影片",
    stats_no_videos: "暫無影片",
    stats_word_count: "{count} 個單字",
    stats_activity_title: "學習活躍度",
    stats_activity_total: "過去一年添加了 {count} 個單字",
    stats_activity_words: "個單字",
    stats_activity_less: "少",
    stats_activity_more: "多",

    // Settings page
    settings_title: "設定",
    settings_account: "帳戶",
    settings_email: "電子郵件",
    settings_member_since: "註冊時間",
    settings_appearance: "外觀",
    settings_theme: "主題",
    settings_theme_light: "淺色",
    settings_theme_dark: "深色",
    settings_theme_system: "跟隨系統",
    settings_language: "語言",
    settings_learning: "學習",
    settings_daily_goal: "每日目標",
    settings_daily_goal_unit: "單字/天",
    settings_sync: "同步",
    settings_sync_enabled: "啟用同步",
    settings_sync_desc: "在擴充和網站之間同步生詞",
    settings_logout: "登出",
    settings_login_hint: "登入以在裝置間同步生詞",
    settings_google_login: "使用 Google 登入",
    settings_data: "資料",
    settings_export: "匯出資料",
    settings_export_desc: "下載全部 {count} 個單字為 JSON 檔案",
    settings_export_btn: "匯出",
    settings_danger: "危險區域",
    settings_delete_account: "刪除帳戶",
    settings_delete_account_desc: "永久刪除您的帳戶和所有資料",

    // Word card
    word_context: "上下文",
    word_from_video: "來自影片",
    word_added: "新增於",

    // Common
    loading: "載入中...",
    save: "儲存",
    cancel: "取消",
    delete: "刪除",
    edit: "編輯",
    close: "關閉",

    // Privacy page
    privacy_title: "隱私政策",
    privacy_updated: "最後更新：2025年1月",
    privacy_intro_title: "簡介",
    privacy_intro_text:
      "CC Plus 致力於保護您的隱私。本隱私政策說明我們如何收集、使用和保護您在使用瀏覽器擴充和網站時的資訊。",
    privacy_collect_title: "我們收集的資料",
    privacy_collect_vocab: "詞彙資料",
    privacy_collect_vocab_desc:
      "您儲存的單字，包括上下文句子和影片來源。預設儲存在瀏覽器本地。",
    privacy_collect_account: "帳戶資訊",
    privacy_collect_account_desc:
      "如果您使用 Google 登入，我們會取得您的電子郵件和個人資料名稱，僅用於身份驗證。",
    privacy_collect_analytics: "使用統計",
    privacy_collect_analytics_desc:
      "我們使用 Google Analytics 收集匿名使用統計資料，以改進我們的服務。",
    privacy_storage_title: "資料儲存",
    privacy_storage_local: "本地儲存",
    privacy_storage_local_desc:
      "您的詞彙儲存在本地 IndexedDB 中，支援離線使用。",
    privacy_storage_cloud: "雲端同步",
    privacy_storage_cloud_desc:
      "如果您登入，資料將同步到 Firebase 以實現跨裝置存取。",
    privacy_sharing_title: "資料分享",
    privacy_sharing_text:
      "我們不會出售或分享您的個人資料，除了以下服務提供商：",
    privacy_sharing_firebase: "Firebase (Google) - 認證和儲存",
    privacy_sharing_analytics: "Google Analytics - 使用統計",
    privacy_rights_title: "您的權利",
    privacy_rights_export: "匯出您的資料",
    privacy_rights_delete: "刪除您的帳戶",
    privacy_rights_no_account: "無需帳戶使用",
    privacy_contact_title: "有疑問？",
    privacy_contact_text: "如果您對本隱私政策有疑問，請聯繫我們：",
    privacy_back: "返回設定",

    // Terms page
    terms_title: "服務條款",
    terms_updated: "最後更新：2025年1月",
    terms_accept_title: "條款接受",
    terms_accept_text:
      "使用 CC Plus 瀏覽器擴充和網站即表示您同意本服務條款。如果您不同意，請勿使用我們的服務。",
    terms_service_title: "服務說明",
    terms_service_text:
      "CC Plus 是一款語言學習工具，幫助您從 YouTube 影片中儲存詞彙、使用間隔重複複習單字，並在裝置間同步進度。",
    terms_responsibility_title: "使用者責任",
    terms_responsibility_1: "維護帳戶安全",
    terms_responsibility_2: "不得濫用我們的服務",
    terms_responsibility_3: "遵守 YouTube 服務條款",
    terms_ip_title: "智慧財產權",
    terms_ip_text:
      "CC Plus 擴充、網站及相關內容受版權保護。未經許可，您不得複製、修改或散布我們的軟體。",
    terms_data_title: "您的資料",
    terms_data_text:
      "您保留所建立詞彙資料的所有權。我們僅儲存和處理您的資料以提供服務。",
    terms_disclaimer_title: "免責聲明",
    terms_disclaimer_text:
      "CC Plus 按「原樣」提供，不提供任何形式的保證。我們與 YouTube 或 Google 無關聯。",
    terms_liability_title: "責任限制",
    terms_liability_text:
      "在法律允許的最大範圍內，CC Plus 不對任何間接、附帶或後果性損害承擔責任。",
    terms_termination_title: "終止",
    terms_termination_text:
      "我們保留隨時暫停或終止服務存取的權利。您可以隨時停止使用我們的服務。",
    terms_changes_title: "條款變更",
    terms_changes_text:
      "我們可能會不時更新這些條款。在變更後繼續使用服務即表示接受新條款。",
    terms_back: "返回設定",

    // PWA Install
    pwa_install_title: "安裝 CC Plus",
    pwa_install_hint: "新增到主畫面，快速存取",
    pwa_install_button: "安裝",
    pwa_install_ios_hint: "新增到主畫面以獲得最佳體驗",
    pwa_install_ios_step1: "點擊分享按鈕",
    pwa_install_ios_step2: "選擇「加入主畫面」",
  },

  ja: {
    // Nav
    nav_home: "ホーム",
    nav_words: "単語",
    nav_review: "復習",
    nav_stats: "統計",
    nav_settings: "設定",

    // Home page
    home_title: "YouTubeで言語を学ぶ",
    home_subtitle:
      "動画から単語を保存し、間隔反復で復習し、新しい単語を楽に習得。",
    home_get_extension: "拡張機能を入手",
    home_view_words: "単語を見る",
    home_feature_captions: "インタラクティブ字幕",
    home_feature_captions_desc: "字幕の任意の単語をクリックして保存",
    home_feature_sync: "クラウド同期",
    home_feature_sync_desc: "単語は拡張機能とウェブサイト間で同期",
    home_feature_review: "スマート復習",
    home_feature_review_desc:
      "SM-2アルゴリズムが最適な間隔で復習をスケジュール",
    home_feature_wide_screen: "ワイドスクリーン",
    home_feature_wide_screen_desc: "シアターモードで没入感を最大化",
    home_feature_clean: "インターフェース浄化",
    home_feature_clean_desc: "広告や邪魔を排除して集中視聴",
    home_feature_side_comments: "サイドコメント",
    home_feature_side_comments_desc: "コメントを右側に移動してレイアウト最適化",
    home_feature_comment_search: "コメント検索",
    home_feature_comment_search_desc: "コメントを簡単に検索・フィルタリング",
    home_feature_word_selection: "選択翻訳",
    home_feature_word_selection_desc: "テキストを選択して翻訳・単語保存",

    // Words page
    words_title: "私の単語",
    words_search_placeholder: "単語を検索...",
    words_filter_all: "すべて",
    words_filter_new: "新規",
    words_filter_learning: "学習中",
    words_filter_mastered: "習得済み",
    words_empty: "単語が見つかりません",
    words_empty_hint: "YouTube動画から単語を保存しましょう！",
    words_count: "{count} 単語",

    // Review page
    review_title: "復習",
    review_due_today: "今日の復習",
    review_start: "復習を開始",
    review_no_cards: "復習するカードがありません",
    review_no_cards_hint: "素晴らしい！後でまた復習しましょう。",
    review_show_answer: "答えを見る",
    review_again: "もう一度",
    review_hard: "難しい",
    review_good: "良い",
    review_easy: "簡単",
    review_complete: "復習完了！",
    review_complete_message: "今日は {count} 枚のカードを復習しました。",
    review_back_home: "ホームに戻る",

    // Stats page
    stats_title: "統計",
    stats_streak: "連続日数",
    stats_total_words: "総単語数",
    stats_mastered: "習得済み",
    stats_due_today: "今日の復習予定",
    stats_vocabulary_growth: "語彙の成長",
    stats_last_7_days: "過去7日間",
    stats_30_days_ago: "30日前",
    stats_today: "今日",
    stats_mastery_distribution: "習得状況",
    stats_videos_studied: "学習した動画",
    stats_no_videos: "動画がありません",
    stats_word_count: "{count} 単語",
    stats_activity_title: "学習アクティビティ",
    stats_activity_total: "過去1年間で {count} 単語を追加",
    stats_activity_words: "単語",
    stats_activity_less: "少",
    stats_activity_more: "多",

    // Settings page
    settings_title: "設定",
    settings_account: "アカウント",
    settings_email: "メール",
    settings_member_since: "登録日",
    settings_appearance: "外観",
    settings_theme: "テーマ",
    settings_theme_light: "ライト",
    settings_theme_dark: "ダーク",
    settings_theme_system: "システム",
    settings_language: "言語",
    settings_learning: "学習",
    settings_daily_goal: "1日の目標",
    settings_daily_goal_unit: "単語/日",
    settings_sync: "同期",
    settings_sync_enabled: "同期を有効化",
    settings_sync_desc: "拡張機能とウェブサイト間で単語を同期",
    settings_logout: "ログアウト",
    settings_login_hint: "デバイス間で単語を同期するにはログイン",
    settings_google_login: "Googleでログイン",
    settings_data: "データ",
    settings_export: "データをエクスポート",
    settings_export_desc: "{count} 個の単語をJSONファイルでダウンロード",
    settings_export_btn: "エクスポート",
    settings_danger: "危険ゾーン",
    settings_delete_account: "アカウントを削除",
    settings_delete_account_desc: "アカウントとすべてのデータを完全に削除",

    // Word card
    word_context: "文脈",
    word_from_video: "動画から",
    word_added: "追加日",

    // Common
    loading: "読み込み中...",
    save: "保存",
    cancel: "キャンセル",
    delete: "削除",
    edit: "編集",
    close: "閉じる",

    // Privacy page
    privacy_title: "プライバシーポリシー",
    privacy_updated: "最終更新：2025年1月",
    privacy_intro_title: "はじめに",
    privacy_intro_text:
      "CC Plus はあなたのプライバシーを保護することをお約束します。このプライバシーポリシーでは、ブラウザ拡張機能とウェブサイトをご利用の際に、どのように情報を収集、使用、保護するかを説明します。",
    privacy_collect_title: "収集するデータ",
    privacy_collect_vocab: "語彙データ",
    privacy_collect_vocab_desc:
      "保存した単語、文脈の文章、動画ソースを含みます。デフォルトではブラウザにローカル保存されます。",
    privacy_collect_account: "アカウント情報",
    privacy_collect_account_desc:
      "Google でログインする場合、認証目的でのみメールアドレスとプロフィール名を取得します。",
    privacy_collect_analytics: "使用統計",
    privacy_collect_analytics_desc:
      "サービス向上のため、Google Analytics で匿名の使用統計を収集しています。",
    privacy_storage_title: "データの保存",
    privacy_storage_local: "ローカルストレージ",
    privacy_storage_local_desc:
      "語彙は IndexedDB にローカル保存され、オフラインでも使用できます。",
    privacy_storage_cloud: "クラウド同期",
    privacy_storage_cloud_desc:
      "ログインすると、Firebase に同期してデバイス間でアクセスできます。",
    privacy_sharing_title: "データの共有",
    privacy_sharing_text:
      "個人データを販売または共有することはありません。以下のサービスプロバイダーを除きます：",
    privacy_sharing_firebase: "Firebase (Google) - 認証とストレージ",
    privacy_sharing_analytics: "Google Analytics - 使用統計",
    privacy_rights_title: "あなたの権利",
    privacy_rights_export: "データのエクスポート",
    privacy_rights_delete: "アカウントの削除",
    privacy_rights_no_account: "アカウントなしで使用",
    privacy_contact_title: "ご質問は？",
    privacy_contact_text:
      "このプライバシーポリシーについてご質問がある場合は、お問い合わせください：",
    privacy_back: "設定に戻る",

    // Terms page
    terms_title: "利用規約",
    terms_updated: "最終更新：2025年1月",
    terms_accept_title: "規約への同意",
    terms_accept_text:
      "CC Plus ブラウザ拡張機能とウェブサイトを使用することにより、この利用規約に同意したものとみなされます。同意しない場合は、サービスを使用しないでください。",
    terms_service_title: "サービスの説明",
    terms_service_text:
      "CC Plus は、YouTube 動画から語彙を保存し、間隔反復で単語を復習し、デバイス間で進捗を同期する言語学習ツールです。",
    terms_responsibility_title: "ユーザーの責任",
    terms_responsibility_1: "アカウントのセキュリティを維持する",
    terms_responsibility_2: "サービスを悪用しない",
    terms_responsibility_3: "YouTube の利用規約を遵守する",
    terms_ip_title: "知的財産権",
    terms_ip_text:
      "CC Plus 拡張機能、ウェブサイト、関連コンテンツは著作権で保護されています。許可なくソフトウェアをコピー、変更、配布することはできません。",
    terms_data_title: "あなたのデータ",
    terms_data_text:
      "作成した語彙データの所有権はあなたにあります。サービス提供のためにのみデータを保存・処理します。",
    terms_disclaimer_title: "免責事項",
    terms_disclaimer_text:
      "CC Plus は「現状のまま」提供され、いかなる保証もありません。YouTube や Google とは関係ありません。",
    terms_liability_title: "責任の制限",
    terms_liability_text:
      "法律で許可される最大限の範囲で、CC Plus は間接的、付随的、または結果的な損害に対して責任を負いません。",
    terms_termination_title: "終了",
    terms_termination_text:
      "当社はいつでもサービスへのアクセスを一時停止または終了する権利を留保します。いつでもサービスの使用を停止できます。",
    terms_changes_title: "規約の変更",
    terms_changes_text:
      "これらの規約は随時更新される場合があります。変更後もサービスを継続使用することで、新しい規約に同意したものとみなされます。",
    terms_back: "設定に戻る",

    // PWA Install
    pwa_install_title: "CC Plus をインストール",
    pwa_install_hint: "ホーム画面に追加してすばやくアクセス",
    pwa_install_button: "インストール",
    pwa_install_ios_hint: "ホーム画面に追加して最高の体験を",
    pwa_install_ios_step1: "共有ボタンをタップ",
    pwa_install_ios_step2: "「ホーム画面に追加」を選択",
  },

  ko: {
    // Nav
    nav_home: "홈",
    nav_words: "단어",
    nav_review: "복습",
    nav_stats: "통계",
    nav_settings: "설정",

    // Home page
    home_title: "YouTube로 언어 배우기",
    home_subtitle:
      "동영상에서 단어를 저장하고, 간격 반복으로 복습하며, 새로운 단어를 쉽게 습득하세요.",
    home_get_extension: "확장 프로그램 설치",
    home_view_words: "내 단어 보기",
    home_feature_captions: "인터랙티브 자막",
    home_feature_captions_desc: "자막의 아무 단어나 클릭하여 저장",
    home_feature_sync: "클라우드 동기화",
    home_feature_sync_desc: "단어가 확장 프로그램과 웹사이트 간에 동기화",
    home_feature_review: "스마트 복습",
    home_feature_review_desc: "SM-2 알고리즘이 최적의 간격으로 복습 일정 관리",
    home_feature_wide_screen: "와이드 스크린",
    home_feature_wide_screen_desc: "시어터 모드로 몰입감 극대화",
    home_feature_clean: "인터페이스 정화",
    home_feature_clean_desc: "광고와 방해 요소를 제거하여 집중 시청",
    home_feature_side_comments: "사이드 댓글",
    home_feature_side_comments_desc:
      "댓글을 오른쪽으로 이동하여 레이아웃 최적화",
    home_feature_comment_search: "댓글 검색",
    home_feature_comment_search_desc: "댓글을 쉽게 검색하고 필터링",
    home_feature_word_selection: "선택 번역",
    home_feature_word_selection_desc: "텍스트를 선택하여 번역하고 단어 저장",

    // Words page
    words_title: "내 단어장",
    words_search_placeholder: "단어 검색...",
    words_filter_all: "전체",
    words_filter_new: "새 단어",
    words_filter_learning: "학습 중",
    words_filter_mastered: "습득 완료",
    words_empty: "단어를 찾을 수 없습니다",
    words_empty_hint: "YouTube 동영상에서 단어를 저장해 보세요!",
    words_count: "{count}개 단어",

    // Review page
    review_title: "복습",
    review_due_today: "오늘 복습",
    review_start: "복습 시작",
    review_no_cards: "복습할 카드가 없습니다",
    review_no_cards_hint: "잘했어요! 나중에 다시 복습하세요.",
    review_show_answer: "정답 보기",
    review_again: "다시",
    review_hard: "어려움",
    review_good: "좋음",
    review_easy: "쉬움",
    review_complete: "복습 완료!",
    review_complete_message: "오늘 {count}개의 카드를 복습했습니다.",
    review_back_home: "홈으로 돌아가기",

    // Stats page
    stats_title: "통계",
    stats_streak: "연속 일수",
    stats_total_words: "총 단어 수",
    stats_mastered: "습득 완료",
    stats_due_today: "오늘 복습 예정",
    stats_vocabulary_growth: "어휘 성장",
    stats_last_7_days: "지난 7일",
    stats_30_days_ago: "30일 전",
    stats_today: "오늘",
    stats_mastery_distribution: "습득 현황",
    stats_videos_studied: "학습한 동영상",
    stats_no_videos: "동영상이 없습니다",
    stats_word_count: "{count}개 단어",
    stats_activity_title: "학습 활동",
    stats_activity_total: "지난 1년간 {count}개 단어 추가",
    stats_activity_words: "개 단어",
    stats_activity_less: "적음",
    stats_activity_more: "많음",

    // Settings page
    settings_title: "설정",
    settings_account: "계정",
    settings_email: "이메일",
    settings_member_since: "가입일",
    settings_appearance: "외관",
    settings_theme: "테마",
    settings_theme_light: "라이트",
    settings_theme_dark: "다크",
    settings_theme_system: "시스템",
    settings_language: "언어",
    settings_learning: "학습",
    settings_daily_goal: "일일 목표",
    settings_daily_goal_unit: "단어/일",
    settings_sync: "동기화",
    settings_sync_enabled: "동기화 활성화",
    settings_sync_desc: "확장 프로그램과 웹사이트 간에 단어 동기화",
    settings_logout: "로그아웃",
    settings_login_hint: "기기 간 단어 동기화를 위해 로그인",
    settings_google_login: "Google로 로그인",
    settings_data: "데이터",
    settings_export: "데이터 내보내기",
    settings_export_desc: "{count}개의 단어를 JSON 파일로 다운로드",
    settings_export_btn: "내보내기",
    settings_danger: "위험 영역",
    settings_delete_account: "계정 삭제",
    settings_delete_account_desc: "계정과 모든 데이터를 영구적으로 삭제",

    // Word card
    word_context: "문맥",
    word_from_video: "동영상에서",
    word_added: "추가일",

    // Common
    loading: "로딩 중...",
    save: "저장",
    cancel: "취소",
    delete: "삭제",
    edit: "편집",
    close: "닫기",

    // Privacy page
    privacy_title: "개인정보 처리방침",
    privacy_updated: "최종 업데이트: 2025년 1월",
    privacy_intro_title: "소개",
    privacy_intro_text:
      "CC Plus는 여러분의 개인정보를 보호하기 위해 노력합니다. 이 개인정보 처리방침은 브라우저 확장 프로그램과 웹사이트를 사용할 때 정보를 어떻게 수집, 사용, 보호하는지 설명합니다.",
    privacy_collect_title: "수집하는 데이터",
    privacy_collect_vocab: "어휘 데이터",
    privacy_collect_vocab_desc:
      "저장한 단어, 문맥 문장, 동영상 출처를 포함합니다. 기본적으로 브라우저에 로컬 저장됩니다.",
    privacy_collect_account: "계정 정보",
    privacy_collect_account_desc:
      "Google로 로그인하면 인증 목적으로만 이메일과 프로필 이름을 받습니다.",
    privacy_collect_analytics: "사용 통계",
    privacy_collect_analytics_desc:
      "서비스 개선을 위해 Google Analytics를 사용하여 익명의 사용 통계를 수집합니다.",
    privacy_storage_title: "데이터 저장",
    privacy_storage_local: "로컬 저장소",
    privacy_storage_local_desc:
      "어휘는 IndexedDB에 로컬 저장되며 오프라인에서도 사용할 수 있습니다.",
    privacy_storage_cloud: "클라우드 동기화",
    privacy_storage_cloud_desc:
      "로그인하면 Firebase에 동기화하여 여러 기기에서 접근할 수 있습니다.",
    privacy_sharing_title: "데이터 공유",
    privacy_sharing_text:
      "개인 데이터를 판매하거나 공유하지 않습니다. 다음 서비스 제공업체는 예외입니다:",
    privacy_sharing_firebase: "Firebase (Google) - 인증 및 저장소",
    privacy_sharing_analytics: "Google Analytics - 사용 통계",
    privacy_rights_title: "귀하의 권리",
    privacy_rights_export: "데이터 내보내기",
    privacy_rights_delete: "계정 삭제",
    privacy_rights_no_account: "계정 없이 사용",
    privacy_contact_title: "궁금한 점이 있으신가요?",
    privacy_contact_text:
      "이 개인정보 처리방침에 대해 궁금한 점이 있으시면 연락해 주세요:",
    privacy_back: "설정으로 돌아가기",

    // Terms page
    terms_title: "서비스 약관",
    terms_updated: "최종 업데이트: 2025년 1월",
    terms_accept_title: "약관 동의",
    terms_accept_text:
      "CC Plus 브라우저 확장 프로그램과 웹사이트를 사용함으로써 이 서비스 약관에 동의하는 것으로 간주됩니다. 동의하지 않으시면 서비스를 사용하지 마세요.",
    terms_service_title: "서비스 설명",
    terms_service_text:
      "CC Plus는 YouTube 동영상에서 어휘를 저장하고, 간격 반복으로 단어를 복습하며, 기기 간 진행 상황을 동기화하는 언어 학습 도구입니다.",
    terms_responsibility_title: "사용자 책임",
    terms_responsibility_1: "계정 보안 유지",
    terms_responsibility_2: "서비스 남용 금지",
    terms_responsibility_3: "YouTube 서비스 약관 준수",
    terms_ip_title: "지적 재산권",
    terms_ip_text:
      "CC Plus 확장 프로그램, 웹사이트 및 관련 콘텐츠는 저작권으로 보호됩니다. 허가 없이 소프트웨어를 복사, 수정, 배포할 수 없습니다.",
    terms_data_title: "귀하의 데이터",
    terms_data_text:
      "생성한 어휘 데이터의 소유권은 귀하에게 있습니다. 서비스 제공을 위해서만 데이터를 저장하고 처리합니다.",
    terms_disclaimer_title: "면책 조항",
    terms_disclaimer_text:
      "CC Plus는 어떠한 보증도 없이 '있는 그대로' 제공됩니다. YouTube나 Google과 관련이 없습니다.",
    terms_liability_title: "책임 제한",
    terms_liability_text:
      "법률이 허용하는 최대 범위 내에서 CC Plus는 간접적, 부수적 또는 결과적 손해에 대해 책임을 지지 않습니다.",
    terms_termination_title: "종료",
    terms_termination_text:
      "당사는 언제든지 서비스 접근을 일시 중지하거나 종료할 권리를 보유합니다. 언제든지 서비스 사용을 중단할 수 있습니다.",
    terms_changes_title: "약관 변경",
    terms_changes_text:
      "이 약관은 수시로 업데이트될 수 있습니다. 변경 후에도 서비스를 계속 사용하면 새로운 약관에 동의하는 것으로 간주됩니다.",
    terms_back: "설정으로 돌아가기",

    // PWA Install
    pwa_install_title: "CC Plus 설치",
    pwa_install_hint: "홈 화면에 추가하여 빠르게 접근",
    pwa_install_button: "설치",
    pwa_install_ios_hint: "홈 화면에 추가하여 최고의 경험을",
    pwa_install_ios_step1: "공유 버튼을 탭하세요",
    pwa_install_ios_step2: '"홈 화면에 추가" 선택',
  },

  hi: {
    // Nav
    nav_home: "होम",
    nav_words: "शब्द",
    nav_review: "समीक्षा",
    nav_stats: "आँकड़े",
    nav_settings: "सेटिंग्स",

    // Home page
    home_title: "YouTube के साथ भाषाएं सीखें",
    home_subtitle:
      "वीडियो से शब्दावली सहेजें, स्पेस्ड रिपीटिशन के साथ समीक्षा करें, और आसानी से नए शब्द सीखें।",
    home_get_extension: "एक्सटेंशन प्राप्त करें",
    home_view_words: "मेरे शब्द देखें",
    home_feature_captions: "इंटरैक्टिव कैप्शन",
    home_feature_captions_desc: "सबटाइटल में किसी भी शब्द पर क्लिक करके सहेजें",
    home_feature_sync: "क्लाउड सिंक",
    home_feature_sync_desc:
      "आपकी शब्दावली एक्सटेंशन और वेबसाइट पर सिंक होती है",
    home_feature_review: "स्मार्ट समीक्षा",
    home_feature_review_desc:
      "SM-2 एल्गोरिथम इष्टतम अंतराल पर समीक्षा शेड्यूल करता है",
    home_feature_wide_screen: "वाइड स्क्रीन",
    home_feature_wide_screen_desc: "थिएटर मोड से इमर्शन अधिकतम करें",
    home_feature_clean: "इंटरफ़ेस साफ़ करें",
    home_feature_clean_desc: "विज्ञापन और विकर्षण हटाएं, केंद्रित देखें",
    home_feature_side_comments: "साइड टिप्पणियां",
    home_feature_side_comments_desc:
      "बेहतर लेआउट के लिए टिप्पणियां दाईं ओर ले जाएं",
    home_feature_comment_search: "टिप्पणी खोजें",
    home_feature_comment_search_desc:
      "आसानी से टिप्पणियां खोजें और फ़िल्टर करें",
    home_feature_word_selection: "शब्द चयन",
    home_feature_word_selection_desc:
      "अनुवाद और शब्द सहेजने के लिए टेक्स्ट चुनें",

    // Words page
    words_title: "मेरी शब्दावली",
    words_search_placeholder: "शब्द खोजें...",
    words_filter_all: "सभी",
    words_filter_new: "नया",
    words_filter_learning: "सीख रहे हैं",
    words_filter_mastered: "महारत हासिल",
    words_empty: "कोई शब्द नहीं मिला",
    words_empty_hint: "YouTube वीडियो से शब्द सहेजना शुरू करें!",
    words_count: "{count} शब्द",

    // Review page
    review_title: "समीक्षा",
    review_due_today: "आज देय",
    review_start: "समीक्षा शुरू करें",
    review_no_cards: "समीक्षा के लिए कोई कार्ड नहीं",
    review_no_cards_hint: "बढ़िया! और समीक्षाओं के लिए बाद में आएं।",
    review_show_answer: "उत्तर दिखाएं",
    review_again: "फिर से",
    review_hard: "कठिन",
    review_good: "अच्छा",
    review_easy: "आसान",
    review_complete: "समीक्षा पूर्ण!",
    review_complete_message: "आज आपने {count} कार्ड की समीक्षा की।",
    review_back_home: "होम पर वापस जाएं",

    // Stats page
    stats_title: "आँकड़े",
    stats_streak: "दिन की स्ट्रीक",
    stats_total_words: "कुल शब्द",
    stats_mastered: "महारत हासिल",
    stats_due_today: "आज देय",
    stats_vocabulary_growth: "शब्दावली वृद्धि",
    stats_last_7_days: "पिछले 7 दिन",
    stats_30_days_ago: "30 दिन पहले",
    stats_today: "आज",
    stats_mastery_distribution: "महारत वितरण",
    stats_videos_studied: "अध्ययन किए गए वीडियो",
    stats_no_videos: "अभी तक कोई वीडियो नहीं",
    stats_word_count: "{count} शब्द",
    stats_activity_title: "सीखने की गतिविधि",
    stats_activity_total: "पिछले वर्ष में {count} शब्द जोड़े",
    stats_activity_words: "शब्द",
    stats_activity_less: "कम",
    stats_activity_more: "अधिक",

    // Settings page
    settings_title: "सेटिंग्स",
    settings_account: "खाता",
    settings_email: "ईमेल",
    settings_member_since: "सदस्य बने",
    settings_appearance: "दिखावट",
    settings_theme: "थीम",
    settings_theme_light: "लाइट",
    settings_theme_dark: "डार्क",
    settings_theme_system: "सिस्टम",
    settings_language: "भाषा",
    settings_learning: "सीखना",
    settings_daily_goal: "दैनिक लक्ष्य",
    settings_daily_goal_unit: "शब्द/दिन",
    settings_sync: "सिंक",
    settings_sync_enabled: "सिंक सक्षम",
    settings_sync_desc: "एक्सटेंशन और वेबसाइट के बीच शब्दावली सिंक करें",
    settings_logout: "लॉग आउट",
    settings_login_hint:
      "अपनी शब्दावली को डिवाइस पर सिंक करने के लिए साइन इन करें",
    settings_google_login: "Google से साइन इन करें",
    settings_data: "डेटा",
    settings_export: "डेटा निर्यात करें",
    settings_export_desc:
      "सभी {count} शब्दों को JSON फ़ाइल के रूप में डाउनलोड करें",
    settings_export_btn: "निर्यात करें",
    settings_danger: "खतरनाक क्षेत्र",
    settings_delete_account: "खाता हटाएं",
    settings_delete_account_desc: "अपना खाता और सभी डेटा स्थायी रूप से हटाएं",

    // Word card
    word_context: "संदर्भ",
    word_from_video: "वीडियो से",
    word_added: "जोड़ा गया",

    // Common
    loading: "लोड हो रहा है...",
    save: "सहेजें",
    cancel: "रद्द करें",
    delete: "हटाएं",
    edit: "संपादित करें",
    close: "बंद करें",

    // Privacy page
    privacy_title: "गोपनीयता नीति",
    privacy_updated: "अंतिम अपडेट: जनवरी 2025",
    privacy_intro_title: "परिचय",
    privacy_intro_text:
      "CC Plus आपकी गोपनीयता की रक्षा के लिए प्रतिबद्ध है। यह गोपनीयता नीति बताती है कि हम आपके ब्राउज़र एक्सटेंशन और वेबसाइट का उपयोग करते समय आपकी जानकारी कैसे एकत्र, उपयोग और सुरक्षित करते हैं।",
    privacy_collect_title: "हम जो डेटा एकत्र करते हैं",
    privacy_collect_vocab: "शब्दावली डेटा",
    privacy_collect_vocab_desc:
      "आपके द्वारा सहेजे गए शब्द, संदर्भ वाक्य और वीडियो स्रोत सहित। डिफ़ॉल्ट रूप से आपके ब्राउज़र में स्थानीय रूप से संग्रहीत।",
    privacy_collect_account: "खाता जानकारी",
    privacy_collect_account_desc:
      "यदि आप Google से साइन इन करते हैं, तो हमें केवल प्रमाणीकरण उद्देश्यों के लिए आपका ईमेल और प्रोफ़ाइल नाम प्राप्त होता है।",
    privacy_collect_analytics: "उपयोग विश्लेषण",
    privacy_collect_analytics_desc:
      "हम अपनी सेवा को बेहतर बनाने के लिए अनाम उपयोग आँकड़े एकत्र करने के लिए Google Analytics का उपयोग करते हैं।",
    privacy_storage_title: "डेटा संग्रहण",
    privacy_storage_local: "स्थानीय संग्रहण",
    privacy_storage_local_desc:
      "आपकी शब्दावली IndexedDB में स्थानीय रूप से संग्रहीत है और ऑफ़लाइन काम करती है।",
    privacy_storage_cloud: "क्लाउड सिंक",
    privacy_storage_cloud_desc:
      "यदि आप साइन इन करते हैं, तो क्रॉस-डिवाइस एक्सेस के लिए डेटा Firebase में सिंक होता है।",
    privacy_sharing_title: "डेटा साझाकरण",
    privacy_sharing_text:
      "हम आपका व्यक्तिगत डेटा नहीं बेचते या साझा नहीं करते, इन सेवा प्रदाताओं को छोड़कर:",
    privacy_sharing_firebase: "Firebase (Google) - प्रमाणीकरण और संग्रहण",
    privacy_sharing_analytics: "Google Analytics - उपयोग आँकड़े",
    privacy_rights_title: "आपके अधिकार",
    privacy_rights_export: "अपना डेटा निर्यात करें",
    privacy_rights_delete: "अपना खाता हटाएं",
    privacy_rights_no_account: "खाते के बिना उपयोग करें",
    privacy_contact_title: "प्रश्न?",
    privacy_contact_text:
      "यदि आपके पास इस गोपनीयता नीति के बारे में प्रश्न हैं, तो हमसे संपर्क करें:",
    privacy_back: "सेटिंग्स पर वापस जाएं",

    // Terms page
    terms_title: "सेवा की शर्तें",
    terms_updated: "अंतिम अपडेट: जनवरी 2025",
    terms_accept_title: "शर्तों की स्वीकृति",
    terms_accept_text:
      "CC Plus ब्राउज़र एक्सटेंशन और वेबसाइट का उपयोग करके, आप इन सेवा की शर्तों से सहमत हैं। यदि आप सहमत नहीं हैं, तो कृपया हमारी सेवाओं का उपयोग न करें।",
    terms_service_title: "सेवा का विवरण",
    terms_service_text:
      "CC Plus एक भाषा सीखने का उपकरण है जो आपको YouTube वीडियो से शब्दावली सहेजने, स्पेस्ड रिपीटिशन का उपयोग करके शब्दों की समीक्षा करने और डिवाइस पर अपनी प्रगति सिंक करने में मदद करता है।",
    terms_responsibility_title: "उपयोगकर्ता जिम्मेदारियां",
    terms_responsibility_1: "अपने खाते की सुरक्षा बनाए रखें",
    terms_responsibility_2: "हमारी सेवाओं का दुरुपयोग न करें",
    terms_responsibility_3: "YouTube की सेवा की शर्तों का पालन करें",
    terms_ip_title: "बौद्धिक संपदा",
    terms_ip_text:
      "CC Plus एक्सटेंशन, वेबसाइट और संबंधित सामग्री कॉपीराइट द्वारा संरक्षित है। आप बिना अनुमति के हमारे सॉफ़्टवेयर को कॉपी, संशोधित या वितरित नहीं कर सकते।",
    terms_data_title: "आपका डेटा",
    terms_data_text:
      "आप अपने द्वारा बनाए गए शब्दावली डेटा का स्वामित्व बनाए रखते हैं। हम केवल सेवा प्रदान करने के लिए आपके डेटा को संग्रहीत और संसाधित करते हैं।",
    terms_disclaimer_title: "अस्वीकरण",
    terms_disclaimer_text:
      'CC Plus किसी भी प्रकार की वारंटी के बिना "जैसा है" प्रदान किया जाता है। हम YouTube या Google से संबद्ध नहीं हैं।',
    terms_liability_title: "दायित्व की सीमा",
    terms_liability_text:
      "कानून द्वारा अनुमत अधिकतम सीमा तक, CC Plus किसी भी अप्रत्यक्ष, आकस्मिक या परिणामी क्षति के लिए उत्तरदायी नहीं होगा।",
    terms_termination_title: "समाप्ति",
    terms_termination_text:
      "हम किसी भी समय हमारी सेवाओं तक पहुंच को निलंबित या समाप्त करने का अधिकार सुरक्षित रखते हैं। आप किसी भी समय हमारी सेवाओं का उपयोग बंद कर सकते हैं।",
    terms_changes_title: "शर्तों में परिवर्तन",
    terms_changes_text:
      "हम समय-समय पर इन शर्तों को अपडेट कर सकते हैं। परिवर्तनों के बाद सेवा का निरंतर उपयोग स्वीकृति का गठन करता है।",
    terms_back: "सेटिंग्स पर वापस जाएं",

    // PWA Install
    pwa_install_title: "CC Plus इंस्टॉल करें",
    pwa_install_hint: "त्वरित पहुंच के लिए होम स्क्रीन में जोड़ें",
    pwa_install_button: "इंस्टॉल करें",
    pwa_install_ios_hint: "बेहतर अनुभव के लिए होम स्क्रीन में जोड़ें",
    pwa_install_ios_step1: "शेयर बटन पर टैप करें",
    pwa_install_ios_step2: '"होम स्क्रीन में जोड़ें" चुनें',
  },

  es: {
    // Nav
    nav_home: "Inicio",
    nav_words: "Palabras",
    nav_review: "Revisar",
    nav_stats: "Estadísticas",
    nav_settings: "Configuración",

    // Home page
    home_title: "Aprende idiomas con YouTube",
    home_subtitle:
      "Guarda vocabulario de videos, repasa con repetición espaciada y domina palabras nuevas sin esfuerzo.",
    home_get_extension: "Obtener Extensión",
    home_view_words: "Ver Mis Palabras",
    home_feature_captions: "Subtítulos Interactivos",
    home_feature_captions_desc:
      "Haz clic en cualquier palabra de los subtítulos para guardarla",
    home_feature_sync: "Sincronización en la Nube",
    home_feature_sync_desc:
      "Tu vocabulario se sincroniza entre la extensión y el sitio web",
    home_feature_review: "Repaso Inteligente",
    home_feature_review_desc:
      "El algoritmo SM-2 programa repasos en intervalos óptimos",
    home_feature_wide_screen: "Pantalla Ancha",
    home_feature_wide_screen_desc: "Maximiza la inmersión con modo teatro",
    home_feature_clean: "Interfaz Limpia",
    home_feature_clean_desc:
      "Elimina anuncios y distracciones para ver enfocado",
    home_feature_side_comments: "Comentarios Laterales",
    home_feature_side_comments_desc:
      "Mueve los comentarios a la derecha para mejor diseño",
    home_feature_comment_search: "Buscar Comentarios",
    home_feature_comment_search_desc: "Busca y filtra comentarios fácilmente",
    home_feature_word_selection: "Selección de Palabras",
    home_feature_word_selection_desc:
      "Selecciona texto para traducir y guardar palabras",

    // Words page
    words_title: "Mi Vocabulario",
    words_search_placeholder: "Buscar palabras...",
    words_filter_all: "Todas",
    words_filter_new: "Nuevas",
    words_filter_learning: "Aprendiendo",
    words_filter_mastered: "Dominadas",
    words_empty: "No se encontraron palabras",
    words_empty_hint: "¡Empieza a guardar palabras de videos de YouTube!",
    words_count: "{count} palabras",

    // Review page
    review_title: "Revisar",
    review_due_today: "Pendientes Hoy",
    review_start: "Iniciar Repaso",
    review_no_cards: "No hay tarjetas pendientes",
    review_no_cards_hint: "¡Buen trabajo! Vuelve más tarde para más repasos.",
    review_show_answer: "Mostrar Respuesta",
    review_again: "Otra vez",
    review_hard: "Difícil",
    review_good: "Bien",
    review_easy: "Fácil",
    review_complete: "¡Repaso Completado!",
    review_complete_message: "Hoy repasaste {count} tarjetas.",
    review_back_home: "Volver al Inicio",

    // Stats page
    stats_title: "Estadísticas",
    stats_streak: "Racha de Días",
    stats_total_words: "Total de Palabras",
    stats_mastered: "Dominadas",
    stats_due_today: "Pendientes Hoy",
    stats_vocabulary_growth: "Crecimiento del Vocabulario",
    stats_last_7_days: "Últimos 7 Días",
    stats_30_days_ago: "Hace 30 días",
    stats_today: "Hoy",
    stats_mastery_distribution: "Distribución de Dominio",
    stats_videos_studied: "Videos Estudiados",
    stats_no_videos: "Aún no hay videos",
    stats_word_count: "{count} palabras",
    stats_activity_title: "Actividad de Aprendizaje",
    stats_activity_total: "{count} palabras añadidas en el último año",
    stats_activity_words: "palabras",
    stats_activity_less: "Menos",
    stats_activity_more: "Más",

    // Settings page
    settings_title: "Configuración",
    settings_account: "Cuenta",
    settings_email: "Correo",
    settings_member_since: "Miembro desde",
    settings_appearance: "Apariencia",
    settings_theme: "Tema",
    settings_theme_light: "Claro",
    settings_theme_dark: "Oscuro",
    settings_theme_system: "Sistema",
    settings_language: "Idioma",
    settings_learning: "Aprendizaje",
    settings_daily_goal: "Meta Diaria",
    settings_daily_goal_unit: "palabras/día",
    settings_sync: "Sincronización",
    settings_sync_enabled: "Sincronización Activada",
    settings_sync_desc: "Sincroniza vocabulario entre extensión y sitio web",
    settings_logout: "Cerrar Sesión",
    settings_login_hint:
      "Inicia sesión para sincronizar tu vocabulario entre dispositivos",
    settings_google_login: "Iniciar sesión con Google",
    settings_data: "Datos",
    settings_export: "Exportar Datos",
    settings_export_desc:
      "Descargar todas las {count} palabras como archivo JSON",
    settings_export_btn: "Exportar",
    settings_danger: "Zona de Peligro",
    settings_delete_account: "Eliminar Cuenta",
    settings_delete_account_desc:
      "Elimina permanentemente tu cuenta y todos los datos",

    // Word card
    word_context: "Contexto",
    word_from_video: "Del video",
    word_added: "Añadida",

    // Common
    loading: "Cargando...",
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    close: "Cerrar",

    // Privacy page
    privacy_title: "Política de Privacidad",
    privacy_updated: "Última actualización: Enero 2025",
    privacy_intro_title: "Introducción",
    privacy_intro_text:
      "CC Plus está comprometido con proteger tu privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos y protegemos tu información cuando usas nuestra extensión de navegador y sitio web.",
    privacy_collect_title: "Datos que Recopilamos",
    privacy_collect_vocab: "Datos de Vocabulario",
    privacy_collect_vocab_desc:
      "Palabras que guardas, incluyendo oraciones de contexto y fuentes de video. Almacenadas localmente en tu navegador por defecto.",
    privacy_collect_account: "Información de Cuenta",
    privacy_collect_account_desc:
      "Si inicias sesión con Google, recibimos tu correo y nombre de perfil solo para autenticación.",
    privacy_collect_analytics: "Análisis de Uso",
    privacy_collect_analytics_desc:
      "Usamos Google Analytics para recopilar estadísticas de uso anónimas para mejorar nuestro servicio.",
    privacy_storage_title: "Almacenamiento de Datos",
    privacy_storage_local: "Almacenamiento Local",
    privacy_storage_local_desc:
      "Tu vocabulario se almacena localmente en IndexedDB y funciona sin conexión.",
    privacy_storage_cloud: "Sincronización en la Nube",
    privacy_storage_cloud_desc:
      "Si inicias sesión, los datos se sincronizan con Firebase para acceso entre dispositivos.",
    privacy_sharing_title: "Compartir Datos",
    privacy_sharing_text:
      "No vendemos ni compartimos tus datos personales, excepto con estos proveedores de servicios:",
    privacy_sharing_firebase:
      "Firebase (Google) - Autenticación y Almacenamiento",
    privacy_sharing_analytics: "Google Analytics - Estadísticas de Uso",
    privacy_rights_title: "Tus Derechos",
    privacy_rights_export: "Exportar tus datos",
    privacy_rights_delete: "Eliminar tu cuenta",
    privacy_rights_no_account: "Usar sin cuenta",
    privacy_contact_title: "¿Preguntas?",
    privacy_contact_text:
      "Si tienes preguntas sobre esta Política de Privacidad, contáctanos:",
    privacy_back: "Volver a Configuración",

    // Terms page
    terms_title: "Términos de Servicio",
    terms_updated: "Última actualización: Enero 2025",
    terms_accept_title: "Aceptación de Términos",
    terms_accept_text:
      "Al usar la extensión de navegador y sitio web CC Plus, aceptas estos Términos de Servicio. Si no estás de acuerdo, por favor no uses nuestros servicios.",
    terms_service_title: "Descripción del Servicio",
    terms_service_text:
      "CC Plus es una herramienta de aprendizaje de idiomas que te ayuda a guardar vocabulario de videos de YouTube, repasar palabras usando repetición espaciada y sincronizar tu progreso entre dispositivos.",
    terms_responsibility_title: "Responsabilidades del Usuario",
    terms_responsibility_1: "Mantener la seguridad de tu cuenta",
    terms_responsibility_2: "No hacer mal uso de nuestros servicios",
    terms_responsibility_3: "Cumplir con los Términos de Servicio de YouTube",
    terms_ip_title: "Propiedad Intelectual",
    terms_ip_text:
      "La extensión CC Plus, sitio web y contenido asociado están protegidos por derechos de autor. No puedes copiar, modificar o distribuir nuestro software sin permiso.",
    terms_data_title: "Tus Datos",
    terms_data_text:
      "Conservas la propiedad de los datos de vocabulario que creas. Solo almacenamos y procesamos tus datos para proporcionar el servicio.",
    terms_disclaimer_title: "Descargo de Responsabilidad",
    terms_disclaimer_text:
      'CC Plus se proporciona "tal cual" sin garantías de ningún tipo. No estamos afiliados con YouTube o Google.',
    terms_liability_title: "Limitación de Responsabilidad",
    terms_liability_text:
      "En la máxima medida permitida por la ley, CC Plus no será responsable de ningún daño indirecto, incidental o consecuente.",
    terms_termination_title: "Terminación",
    terms_termination_text:
      "Nos reservamos el derecho de suspender o terminar el acceso a nuestros servicios en cualquier momento. Puedes dejar de usar nuestros servicios en cualquier momento.",
    terms_changes_title: "Cambios a los Términos",
    terms_changes_text:
      "Podemos actualizar estos Términos de vez en cuando. El uso continuado del servicio después de los cambios constituye aceptación.",
    terms_back: "Volver a Configuración",

    // PWA Install
    pwa_install_title: "Instalar CC Plus",
    pwa_install_hint: "Agregar a la pantalla de inicio para acceso rápido",
    pwa_install_button: "Instalar",
    pwa_install_ios_hint:
      "Agregar a la pantalla de inicio para mejor experiencia",
    pwa_install_ios_step1: "Toca el botón de compartir",
    pwa_install_ios_step2: 'Selecciona "Agregar a pantalla de inicio"',
  },

  fr: {
    // Nav
    nav_home: "Accueil",
    nav_words: "Mots",
    nav_review: "Réviser",
    nav_stats: "Statistiques",
    nav_settings: "Paramètres",

    // Home page
    home_title: "Apprenez les langues avec YouTube",
    home_subtitle:
      "Enregistrez du vocabulaire depuis des vidéos, révisez avec la répétition espacée et maîtrisez de nouveaux mots facilement.",
    home_get_extension: "Obtenir l'Extension",
    home_view_words: "Voir Mes Mots",
    home_feature_captions: "Sous-titres Interactifs",
    home_feature_captions_desc:
      "Cliquez sur n'importe quel mot des sous-titres pour l'enregistrer",
    home_feature_sync: "Synchronisation Cloud",
    home_feature_sync_desc:
      "Votre vocabulaire se synchronise entre l'extension et le site web",
    home_feature_review: "Révision Intelligente",
    home_feature_review_desc:
      "L'algorithme SM-2 planifie les révisions à intervalles optimaux",
    home_feature_wide_screen: "Écran Large",
    home_feature_wide_screen_desc: "Maximisez l'immersion avec le mode cinéma",
    home_feature_clean: "Interface Épurée",
    home_feature_clean_desc:
      "Supprimez les publicités et distractions pour une vue concentrée",
    home_feature_side_comments: "Commentaires Latéraux",
    home_feature_side_comments_desc:
      "Déplacez les commentaires à droite pour une meilleure mise en page",
    home_feature_comment_search: "Recherche de Commentaires",
    home_feature_comment_search_desc:
      "Recherchez et filtrez les commentaires facilement",
    home_feature_word_selection: "Sélection de Mots",
    home_feature_word_selection_desc:
      "Sélectionnez du texte pour traduire et sauvegarder des mots",

    // Words page
    words_title: "Mon Vocabulaire",
    words_search_placeholder: "Rechercher des mots...",
    words_filter_all: "Tous",
    words_filter_new: "Nouveaux",
    words_filter_learning: "En apprentissage",
    words_filter_mastered: "Maîtrisés",
    words_empty: "Aucun mot trouvé",
    words_empty_hint:
      "Commencez à enregistrer des mots depuis des vidéos YouTube !",
    words_count: "{count} mots",

    // Review page
    review_title: "Réviser",
    review_due_today: "À réviser aujourd'hui",
    review_start: "Commencer la Révision",
    review_no_cards: "Aucune carte à réviser",
    review_no_cards_hint:
      "Excellent ! Revenez plus tard pour d'autres révisions.",
    review_show_answer: "Afficher la Réponse",
    review_again: "Encore",
    review_hard: "Difficile",
    review_good: "Bien",
    review_easy: "Facile",
    review_complete: "Révision Terminée !",
    review_complete_message: "Vous avez révisé {count} cartes aujourd'hui.",
    review_back_home: "Retour à l'Accueil",

    // Stats page
    stats_title: "Statistiques",
    stats_streak: "Jours Consécutifs",
    stats_total_words: "Total des Mots",
    stats_mastered: "Maîtrisés",
    stats_due_today: "À réviser aujourd'hui",
    stats_vocabulary_growth: "Croissance du Vocabulaire",
    stats_last_7_days: "7 Derniers Jours",
    stats_30_days_ago: "Il y a 30 jours",
    stats_today: "Aujourd'hui",
    stats_mastery_distribution: "Distribution de Maîtrise",
    stats_videos_studied: "Vidéos Étudiées",
    stats_no_videos: "Pas encore de vidéos",
    stats_word_count: "{count} mots",
    stats_activity_title: "Activité d'Apprentissage",
    stats_activity_total: "{count} mots ajoutés l'année dernière",
    stats_activity_words: "mots",
    stats_activity_less: "Moins",
    stats_activity_more: "Plus",

    // Settings page
    settings_title: "Paramètres",
    settings_account: "Compte",
    settings_email: "Email",
    settings_member_since: "Membre depuis",
    settings_appearance: "Apparence",
    settings_theme: "Thème",
    settings_theme_light: "Clair",
    settings_theme_dark: "Sombre",
    settings_theme_system: "Système",
    settings_language: "Langue",
    settings_learning: "Apprentissage",
    settings_daily_goal: "Objectif Quotidien",
    settings_daily_goal_unit: "mots/jour",
    settings_sync: "Synchronisation",
    settings_sync_enabled: "Synchronisation Activée",
    settings_sync_desc:
      "Synchroniser le vocabulaire entre l'extension et le site web",
    settings_logout: "Déconnexion",
    settings_login_hint:
      "Connectez-vous pour synchroniser votre vocabulaire entre appareils",
    settings_google_login: "Se connecter avec Google",
    settings_data: "Données",
    settings_export: "Exporter les Données",
    settings_export_desc: "Télécharger les {count} mots en fichier JSON",
    settings_export_btn: "Exporter",
    settings_danger: "Zone Dangereuse",
    settings_delete_account: "Supprimer le Compte",
    settings_delete_account_desc:
      "Supprimer définitivement votre compte et toutes les données",

    // Word card
    word_context: "Contexte",
    word_from_video: "De la vidéo",
    word_added: "Ajouté",

    // Common
    loading: "Chargement...",
    save: "Enregistrer",
    cancel: "Annuler",
    delete: "Supprimer",
    edit: "Modifier",
    close: "Fermer",

    // Privacy page
    privacy_title: "Politique de Confidentialité",
    privacy_updated: "Dernière mise à jour : Janvier 2025",
    privacy_intro_title: "Introduction",
    privacy_intro_text:
      "CC Plus s'engage à protéger votre vie privée. Cette Politique de Confidentialité explique comment nous collectons, utilisons et protégeons vos informations lorsque vous utilisez notre extension de navigateur et notre site web.",
    privacy_collect_title: "Données que Nous Collectons",
    privacy_collect_vocab: "Données de Vocabulaire",
    privacy_collect_vocab_desc:
      "Les mots que vous enregistrez, y compris les phrases de contexte et les sources vidéo. Stockées localement dans votre navigateur par défaut.",
    privacy_collect_account: "Informations de Compte",
    privacy_collect_account_desc:
      "Si vous vous connectez avec Google, nous recevons votre email et nom de profil uniquement à des fins d'authentification.",
    privacy_collect_analytics: "Analyses d'Utilisation",
    privacy_collect_analytics_desc:
      "Nous utilisons Google Analytics pour collecter des statistiques d'utilisation anonymes afin d'améliorer notre service.",
    privacy_storage_title: "Stockage des Données",
    privacy_storage_local: "Stockage Local",
    privacy_storage_local_desc:
      "Votre vocabulaire est stocké localement dans IndexedDB et fonctionne hors ligne.",
    privacy_storage_cloud: "Synchronisation Cloud",
    privacy_storage_cloud_desc:
      "Si vous vous connectez, les données se synchronisent avec Firebase pour un accès multi-appareils.",
    privacy_sharing_title: "Partage des Données",
    privacy_sharing_text:
      "Nous ne vendons ni ne partageons vos données personnelles, sauf avec ces fournisseurs de services :",
    privacy_sharing_firebase:
      "Firebase (Google) - Authentification et Stockage",
    privacy_sharing_analytics: "Google Analytics - Statistiques d'Utilisation",
    privacy_rights_title: "Vos Droits",
    privacy_rights_export: "Exporter vos données",
    privacy_rights_delete: "Supprimer votre compte",
    privacy_rights_no_account: "Utiliser sans compte",
    privacy_contact_title: "Questions ?",
    privacy_contact_text:
      "Si vous avez des questions sur cette Politique de Confidentialité, contactez-nous :",
    privacy_back: "Retour aux Paramètres",

    // Terms page
    terms_title: "Conditions d'Utilisation",
    terms_updated: "Dernière mise à jour : Janvier 2025",
    terms_accept_title: "Acceptation des Conditions",
    terms_accept_text:
      "En utilisant l'extension de navigateur et le site web CC Plus, vous acceptez ces Conditions d'Utilisation. Si vous n'êtes pas d'accord, veuillez ne pas utiliser nos services.",
    terms_service_title: "Description du Service",
    terms_service_text:
      "CC Plus est un outil d'apprentissage des langues qui vous aide à enregistrer du vocabulaire depuis des vidéos YouTube, réviser des mots avec la répétition espacée et synchroniser vos progrès entre appareils.",
    terms_responsibility_title: "Responsabilités de l'Utilisateur",
    terms_responsibility_1: "Maintenir la sécurité de votre compte",
    terms_responsibility_2: "Ne pas abuser de nos services",
    terms_responsibility_3: "Respecter les Conditions d'Utilisation de YouTube",
    terms_ip_title: "Propriété Intellectuelle",
    terms_ip_text:
      "L'extension CC Plus, le site web et le contenu associé sont protégés par le droit d'auteur. Vous ne pouvez pas copier, modifier ou distribuer notre logiciel sans autorisation.",
    terms_data_title: "Vos Données",
    terms_data_text:
      "Vous conservez la propriété des données de vocabulaire que vous créez. Nous ne stockons et traitons vos données que pour fournir le service.",
    terms_disclaimer_title: "Avertissement",
    terms_disclaimer_text:
      'CC Plus est fourni "tel quel" sans garantie d\'aucune sorte. Nous ne sommes pas affiliés à YouTube ou Google.',
    terms_liability_title: "Limitation de Responsabilité",
    terms_liability_text:
      "Dans toute la mesure permise par la loi, CC Plus ne sera pas responsable des dommages indirects, accessoires ou consécutifs.",
    terms_termination_title: "Résiliation",
    terms_termination_text:
      "Nous nous réservons le droit de suspendre ou de résilier l'accès à nos services à tout moment. Vous pouvez cesser d'utiliser nos services à tout moment.",
    terms_changes_title: "Modifications des Conditions",
    terms_changes_text:
      "Nous pouvons mettre à jour ces Conditions de temps en temps. L'utilisation continue du service après les modifications constitue une acceptation.",
    terms_back: "Retour aux Paramètres",

    // PWA Install
    pwa_install_title: "Installer CC Plus",
    pwa_install_hint: "Ajouter à l'écran d'accueil pour un accès rapide",
    pwa_install_button: "Installer",
    pwa_install_ios_hint:
      "Ajouter à l'écran d'accueil pour une meilleure expérience",
    pwa_install_ios_step1: "Appuyez sur le bouton de partage",
    pwa_install_ios_step2: "Sélectionnez \"Sur l'écran d'accueil\"",
  },

  ar: {
    // Nav
    nav_home: "الرئيسية",
    nav_words: "الكلمات",
    nav_review: "المراجعة",
    nav_stats: "الإحصائيات",
    nav_settings: "الإعدادات",

    // Home page
    home_title: "تعلم اللغات مع YouTube",
    home_subtitle:
      "احفظ المفردات من الفيديوهات، راجع بالتكرار المتباعد، وأتقن كلمات جديدة بسهولة.",
    home_get_extension: "احصل على الإضافة",
    home_view_words: "عرض كلماتي",
    home_feature_captions: "ترجمات تفاعلية",
    home_feature_captions_desc: "انقر على أي كلمة في الترجمات لحفظها فوراً",
    home_feature_sync: "مزامنة سحابية",
    home_feature_sync_desc: "تتم مزامنة مفرداتك بين الإضافة والموقع",
    home_feature_review: "مراجعة ذكية",
    home_feature_review_desc: "خوارزمية SM-2 تجدول المراجعات بفترات مثالية",
    home_feature_wide_screen: "شاشة عريضة",
    home_feature_wide_screen_desc: "عظّم الانغماس مع وضع المسرح",
    home_feature_clean: "واجهة نظيفة",
    home_feature_clean_desc: "أزل الإعلانات والمشتتات للمشاهدة المركزة",
    home_feature_side_comments: "التعليقات الجانبية",
    home_feature_side_comments_desc: "انقل التعليقات إلى اليمين لتخطيط أفضل",
    home_feature_comment_search: "البحث في التعليقات",
    home_feature_comment_search_desc: "ابحث وفلتر التعليقات بسهولة",
    home_feature_word_selection: "تحديد الكلمات",
    home_feature_word_selection_desc: "حدد النص للترجمة وحفظ الكلمات",

    // Words page
    words_title: "مفرداتي",
    words_search_placeholder: "البحث عن كلمات...",
    words_filter_all: "الكل",
    words_filter_new: "جديد",
    words_filter_learning: "قيد التعلم",
    words_filter_mastered: "متقن",
    words_empty: "لم يتم العثور على كلمات",
    words_empty_hint: "ابدأ بحفظ الكلمات من فيديوهات YouTube!",
    words_count: "{count} كلمة",

    // Review page
    review_title: "المراجعة",
    review_due_today: "مستحق اليوم",
    review_start: "بدء المراجعة",
    review_no_cards: "لا توجد بطاقات للمراجعة",
    review_no_cards_hint: "أحسنت! عد لاحقاً لمزيد من المراجعات.",
    review_show_answer: "إظهار الإجابة",
    review_again: "مرة أخرى",
    review_hard: "صعب",
    review_good: "جيد",
    review_easy: "سهل",
    review_complete: "اكتملت المراجعة!",
    review_complete_message: "راجعت {count} بطاقة اليوم.",
    review_back_home: "العودة للرئيسية",

    // Stats page
    stats_title: "الإحصائيات",
    stats_streak: "أيام متتالية",
    stats_total_words: "إجمالي الكلمات",
    stats_mastered: "متقن",
    stats_due_today: "مستحق اليوم",
    stats_vocabulary_growth: "نمو المفردات",
    stats_last_7_days: "آخر 7 أيام",
    stats_30_days_ago: "قبل 30 يوماً",
    stats_today: "اليوم",
    stats_mastery_distribution: "توزيع الإتقان",
    stats_videos_studied: "الفيديوهات المدروسة",
    stats_no_videos: "لا توجد فيديوهات بعد",
    stats_word_count: "{count} كلمة",
    stats_activity_title: "نشاط التعلم",
    stats_activity_total: "تم إضافة {count} كلمة في العام الماضي",
    stats_activity_words: "كلمة",
    stats_activity_less: "أقل",
    stats_activity_more: "أكثر",

    // Settings page
    settings_title: "الإعدادات",
    settings_account: "الحساب",
    settings_email: "البريد الإلكتروني",
    settings_member_since: "عضو منذ",
    settings_appearance: "المظهر",
    settings_theme: "السمة",
    settings_theme_light: "فاتح",
    settings_theme_dark: "داكن",
    settings_theme_system: "النظام",
    settings_language: "اللغة",
    settings_learning: "التعلم",
    settings_daily_goal: "الهدف اليومي",
    settings_daily_goal_unit: "كلمة/يوم",
    settings_sync: "المزامنة",
    settings_sync_enabled: "المزامنة مفعلة",
    settings_sync_desc: "مزامنة المفردات بين الإضافة والموقع",
    settings_logout: "تسجيل الخروج",
    settings_login_hint: "سجل الدخول لمزامنة مفرداتك عبر الأجهزة",
    settings_google_login: "تسجيل الدخول بـ Google",
    settings_data: "البيانات",
    settings_export: "تصدير البيانات",
    settings_export_desc: "تحميل جميع الـ {count} كلمة كملف JSON",
    settings_export_btn: "تصدير",
    settings_danger: "منطقة خطرة",
    settings_delete_account: "حذف الحساب",
    settings_delete_account_desc: "حذف حسابك وجميع البيانات نهائياً",

    // Word card
    word_context: "السياق",
    word_from_video: "من الفيديو",
    word_added: "أضيف",

    // Common
    loading: "جاري التحميل...",
    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    edit: "تعديل",
    close: "إغلاق",

    // Privacy page
    privacy_title: "سياسة الخصوصية",
    privacy_updated: "آخر تحديث: يناير 2025",
    privacy_intro_title: "مقدمة",
    privacy_intro_text:
      "CC Plus ملتزم بحماية خصوصيتك. توضح سياسة الخصوصية هذه كيف نجمع ونستخدم ونحمي معلوماتك عند استخدام إضافة المتصفح والموقع.",
    privacy_collect_title: "البيانات التي نجمعها",
    privacy_collect_vocab: "بيانات المفردات",
    privacy_collect_vocab_desc:
      "الكلمات التي تحفظها، بما في ذلك جمل السياق ومصادر الفيديو. مخزنة محلياً في متصفحك افتراضياً.",
    privacy_collect_account: "معلومات الحساب",
    privacy_collect_account_desc:
      "إذا سجلت الدخول بـ Google، نستلم بريدك الإلكتروني واسم الملف الشخصي لأغراض المصادقة فقط.",
    privacy_collect_analytics: "تحليلات الاستخدام",
    privacy_collect_analytics_desc:
      "نستخدم Google Analytics لجمع إحصاءات استخدام مجهولة لتحسين خدمتنا.",
    privacy_storage_title: "تخزين البيانات",
    privacy_storage_local: "التخزين المحلي",
    privacy_storage_local_desc:
      "مفرداتك مخزنة محلياً في IndexedDB وتعمل بدون اتصال.",
    privacy_storage_cloud: "المزامنة السحابية",
    privacy_storage_cloud_desc:
      "إذا سجلت الدخول، تتم مزامنة البيانات مع Firebase للوصول عبر الأجهزة.",
    privacy_sharing_title: "مشاركة البيانات",
    privacy_sharing_text:
      "لا نبيع أو نشارك بياناتك الشخصية، باستثناء مع مقدمي الخدمات هؤلاء:",
    privacy_sharing_firebase: "Firebase (Google) - المصادقة والتخزين",
    privacy_sharing_analytics: "Google Analytics - إحصاءات الاستخدام",
    privacy_rights_title: "حقوقك",
    privacy_rights_export: "تصدير بياناتك",
    privacy_rights_delete: "حذف حسابك",
    privacy_rights_no_account: "الاستخدام بدون حساب",
    privacy_contact_title: "أسئلة؟",
    privacy_contact_text:
      "إذا كانت لديك أسئلة حول سياسة الخصوصية هذه، تواصل معنا:",
    privacy_back: "العودة للإعدادات",

    // Terms page
    terms_title: "شروط الخدمة",
    terms_updated: "آخر تحديث: يناير 2025",
    terms_accept_title: "قبول الشروط",
    terms_accept_text:
      "باستخدام إضافة المتصفح والموقع CC Plus، فإنك توافق على شروط الخدمة هذه. إذا لم توافق، يرجى عدم استخدام خدماتنا.",
    terms_service_title: "وصف الخدمة",
    terms_service_text:
      "CC Plus هو أداة لتعلم اللغات تساعدك على حفظ المفردات من فيديوهات YouTube، مراجعة الكلمات باستخدام التكرار المتباعد، ومزامنة تقدمك عبر الأجهزة.",
    terms_responsibility_title: "مسؤوليات المستخدم",
    terms_responsibility_1: "الحفاظ على أمان حسابك",
    terms_responsibility_2: "عدم إساءة استخدام خدماتنا",
    terms_responsibility_3: "الامتثال لشروط خدمة YouTube",
    terms_ip_title: "الملكية الفكرية",
    terms_ip_text:
      "إضافة CC Plus والموقع والمحتوى المرتبط محمية بحقوق النشر. لا يجوز لك نسخ أو تعديل أو توزيع برنامجنا دون إذن.",
    terms_data_title: "بياناتك",
    terms_data_text:
      "تحتفظ بملكية بيانات المفردات التي تنشئها. نقوم فقط بتخزين ومعالجة بياناتك لتقديم الخدمة.",
    terms_disclaimer_title: "إخلاء المسؤولية",
    terms_disclaimer_text:
      'يتم تقديم CC Plus "كما هو" دون أي ضمانات. نحن غير تابعين لـ YouTube أو Google.',
    terms_liability_title: "حدود المسؤولية",
    terms_liability_text:
      "إلى أقصى حد يسمح به القانون، لن يكون CC Plus مسؤولاً عن أي أضرار غير مباشرة أو عرضية أو تبعية.",
    terms_termination_title: "الإنهاء",
    terms_termination_text:
      "نحتفظ بالحق في تعليق أو إنهاء الوصول إلى خدماتنا في أي وقت. يمكنك التوقف عن استخدام خدماتنا في أي وقت.",
    terms_changes_title: "تغييرات الشروط",
    terms_changes_text:
      "قد نقوم بتحديث هذه الشروط من وقت لآخر. الاستمرار في استخدام الخدمة بعد التغييرات يشكل قبولاً.",
    terms_back: "العودة للإعدادات",

    // PWA Install
    pwa_install_title: "تثبيت CC Plus",
    pwa_install_hint: "أضف إلى الشاشة الرئيسية للوصول السريع",
    pwa_install_button: "تثبيت",
    pwa_install_ios_hint: "أضف إلى الشاشة الرئيسية لأفضل تجربة",
    pwa_install_ios_step1: "اضغط على زر المشاركة",
    pwa_install_ios_step2: 'اختر "إضافة إلى الشاشة الرئيسية"',
  },

  bn: {
    // Nav
    nav_home: "হোম",
    nav_words: "শব্দ",
    nav_review: "পর্যালোচনা",
    nav_stats: "পরিসংখ্যান",
    nav_settings: "সেটিংস",

    // Home page
    home_title: "YouTube দিয়ে ভাষা শিখুন",
    home_subtitle:
      "ভিডিও থেকে শব্দভাণ্ডার সংরক্ষণ করুন, স্পেসড রিপিটিশন দিয়ে পর্যালোচনা করুন এবং সহজেই নতুন শব্দ আয়ত্ত করুন।",
    home_get_extension: "এক্সটেনশন পান",
    home_view_words: "আমার শব্দ দেখুন",
    home_feature_captions: "ইন্টারঅ্যাক্টিভ ক্যাপশন",
    home_feature_captions_desc:
      "সাবটাইটেলে যেকোনো শব্দে ক্লিক করে সংরক্ষণ করুন",
    home_feature_sync: "ক্লাউড সিঙ্ক",
    home_feature_sync_desc:
      "আপনার শব্দভাণ্ডার এক্সটেনশন এবং ওয়েবসাইটে সিঙ্ক হয়",
    home_feature_review: "স্মার্ট পর্যালোচনা",
    home_feature_review_desc:
      "SM-2 অ্যালগরিদম সর্বোত্তম বিরতিতে পর্যালোচনা নির্ধারণ করে",
    home_feature_wide_screen: "ওয়াইড স্ক্রিন",
    home_feature_wide_screen_desc: "থিয়েটার মোডে ইমার্শন সর্বাধিক করুন",
    home_feature_clean: "ক্লিন ইন্টারফেস",
    home_feature_clean_desc:
      "বিজ্ঞাপন এবং বিভ্রান্তি সরিয়ে মনোযোগ দিয়ে দেখুন",
    home_feature_side_comments: "সাইড মন্তব্য",
    home_feature_side_comments_desc: "ভালো লেআউটের জন্য মন্তব্য ডানদিকে সরান",
    home_feature_comment_search: "মন্তব্য অনুসন্ধান",
    home_feature_comment_search_desc:
      "সহজেই মন্তব্য অনুসন্ধান এবং ফিল্টার করুন",
    home_feature_word_selection: "শব্দ নির্বাচন",
    home_feature_word_selection_desc:
      "অনুবাদ এবং শব্দ সংরক্ষণ করতে টেক্সট নির্বাচন করুন",

    // Words page
    words_title: "আমার শব্দভাণ্ডার",
    words_search_placeholder: "শব্দ খুঁজুন...",
    words_filter_all: "সব",
    words_filter_new: "নতুন",
    words_filter_learning: "শেখা হচ্ছে",
    words_filter_mastered: "আয়ত্ত",
    words_empty: "কোনো শব্দ পাওয়া যায়নি",
    words_empty_hint: "YouTube ভিডিও থেকে শব্দ সংরক্ষণ শুরু করুন!",
    words_count: "{count}টি শব্দ",

    // Review page
    review_title: "পর্যালোচনা",
    review_due_today: "আজ বাকি",
    review_start: "পর্যালোচনা শুরু করুন",
    review_no_cards: "পর্যালোচনার জন্য কোনো কার্ড নেই",
    review_no_cards_hint: "দারুণ! আরও পর্যালোচনার জন্য পরে আসুন।",
    review_show_answer: "উত্তর দেখান",
    review_again: "আবার",
    review_hard: "কঠিন",
    review_good: "ভালো",
    review_easy: "সহজ",
    review_complete: "পর্যালোচনা সম্পূর্ণ!",
    review_complete_message: "আজ আপনি {count}টি কার্ড পর্যালোচনা করেছেন।",
    review_back_home: "হোমে ফিরে যান",

    // Stats page
    stats_title: "পরিসংখ্যান",
    stats_streak: "দিনের ধারা",
    stats_total_words: "মোট শব্দ",
    stats_mastered: "আয়ত্ত",
    stats_due_today: "আজ বাকি",
    stats_vocabulary_growth: "শব্দভাণ্ডার বৃদ্ধি",
    stats_last_7_days: "গত ৭ দিন",
    stats_30_days_ago: "৩০ দিন আগে",
    stats_today: "আজ",
    stats_mastery_distribution: "আয়ত্ত বিতরণ",
    stats_videos_studied: "অধ্যয়নকৃত ভিডিও",
    stats_no_videos: "এখনো কোনো ভিডিও নেই",
    stats_word_count: "{count}টি শব্দ",
    stats_activity_title: "শেখার কার্যকলাপ",
    stats_activity_total: "গত বছরে {count}টি শব্দ যোগ করা হয়েছে",
    stats_activity_words: "টি শব্দ",
    stats_activity_less: "কম",
    stats_activity_more: "বেশি",

    // Settings page
    settings_title: "সেটিংস",
    settings_account: "অ্যাকাউন্ট",
    settings_email: "ইমেইল",
    settings_member_since: "সদস্য হয়েছেন",
    settings_appearance: "চেহারা",
    settings_theme: "থিম",
    settings_theme_light: "লাইট",
    settings_theme_dark: "ডার্ক",
    settings_theme_system: "সিস্টেম",
    settings_language: "ভাষা",
    settings_learning: "শেখা",
    settings_daily_goal: "দৈনিক লক্ষ্য",
    settings_daily_goal_unit: "শব্দ/দিন",
    settings_sync: "সিঙ্ক",
    settings_sync_enabled: "সিঙ্ক সক্রিয়",
    settings_sync_desc:
      "এক্সটেনশন এবং ওয়েবসাইটের মধ্যে শব্দভাণ্ডার সিঙ্ক করুন",
    settings_logout: "লগ আউট",
    settings_login_hint:
      "ডিভাইস জুড়ে আপনার শব্দভাণ্ডার সিঙ্ক করতে সাইন ইন করুন",
    settings_google_login: "Google দিয়ে সাইন ইন",
    settings_data: "ডেটা",
    settings_export: "ডেটা এক্সপোর্ট করুন",
    settings_export_desc: "সমস্ত {count}টি শব্দ JSON ফাইল হিসাবে ডাউনলোড করুন",
    settings_export_btn: "এক্সপোর্ট",
    settings_danger: "বিপদ এলাকা",
    settings_delete_account: "অ্যাকাউন্ট মুছুন",
    settings_delete_account_desc:
      "স্থায়ীভাবে আপনার অ্যাকাউন্ট এবং সমস্ত ডেটা মুছুন",

    // Word card
    word_context: "প্রসঙ্গ",
    word_from_video: "ভিডিও থেকে",
    word_added: "যোগ করা হয়েছে",

    // Common
    loading: "লোড হচ্ছে...",
    save: "সংরক্ষণ",
    cancel: "বাতিল",
    delete: "মুছুন",
    edit: "সম্পাদনা",
    close: "বন্ধ",

    // Privacy page
    privacy_title: "গোপনীয়তা নীতি",
    privacy_updated: "সর্বশেষ আপডেট: জানুয়ারি ২০২৫",
    privacy_intro_title: "ভূমিকা",
    privacy_intro_text:
      "CC Plus আপনার গোপনীয়তা রক্ষা করতে প্রতিশ্রুতিবদ্ধ। এই গোপনীয়তা নীতি ব্যাখ্যা করে যে আমরা কীভাবে আপনার ব্রাউজার এক্সটেনশন এবং ওয়েবসাইট ব্যবহার করার সময় আপনার তথ্য সংগ্রহ, ব্যবহার এবং সুরক্ষিত করি।",
    privacy_collect_title: "আমরা যে ডেটা সংগ্রহ করি",
    privacy_collect_vocab: "শব্দভাণ্ডার ডেটা",
    privacy_collect_vocab_desc:
      "আপনার সংরক্ষিত শব্দ, প্রসঙ্গ বাক্য এবং ভিডিও উৎস সহ। ডিফল্টরূপে আপনার ব্রাউজারে স্থানীয়ভাবে সংরক্ষিত।",
    privacy_collect_account: "অ্যাকাউন্ট তথ্য",
    privacy_collect_account_desc:
      "আপনি যদি Google দিয়ে সাইন ইন করেন, আমরা শুধুমাত্র প্রমাণীকরণের উদ্দেশ্যে আপনার ইমেইল এবং প্রোফাইল নাম পাই।",
    privacy_collect_analytics: "ব্যবহার বিশ্লেষণ",
    privacy_collect_analytics_desc:
      "আমাদের সেবা উন্নত করতে বেনামে ব্যবহারের পরিসংখ্যান সংগ্রহ করতে আমরা Google Analytics ব্যবহার করি।",
    privacy_storage_title: "ডেটা সংরক্ষণ",
    privacy_storage_local: "স্থানীয় সংরক্ষণ",
    privacy_storage_local_desc:
      "আপনার শব্দভাণ্ডার IndexedDB-তে স্থানীয়ভাবে সংরক্ষিত এবং অফলাইনে কাজ করে।",
    privacy_storage_cloud: "ক্লাউড সিঙ্ক",
    privacy_storage_cloud_desc:
      "আপনি সাইন ইন করলে, ক্রস-ডিভাইস অ্যাক্সেসের জন্য ডেটা Firebase-এ সিঙ্ক হয়।",
    privacy_sharing_title: "ডেটা শেয়ারিং",
    privacy_sharing_text:
      "আমরা আপনার ব্যক্তিগত ডেটা বিক্রি বা শেয়ার করি না, এই সেবা প্রদানকারীদের ছাড়া:",
    privacy_sharing_firebase: "Firebase (Google) - প্রমাণীকরণ এবং সংরক্ষণ",
    privacy_sharing_analytics: "Google Analytics - ব্যবহার পরিসংখ্যান",
    privacy_rights_title: "আপনার অধিকার",
    privacy_rights_export: "আপনার ডেটা এক্সপোর্ট করুন",
    privacy_rights_delete: "আপনার অ্যাকাউন্ট মুছুন",
    privacy_rights_no_account: "অ্যাকাউন্ট ছাড়া ব্যবহার করুন",
    privacy_contact_title: "প্রশ্ন আছে?",
    privacy_contact_text:
      "এই গোপনীয়তা নীতি সম্পর্কে আপনার প্রশ্ন থাকলে, আমাদের সাথে যোগাযোগ করুন:",
    privacy_back: "সেটিংসে ফিরে যান",

    // Terms page
    terms_title: "সেবার শর্তাবলী",
    terms_updated: "সর্বশেষ আপডেট: জানুয়ারি ২০২৫",
    terms_accept_title: "শর্তাবলী গ্রহণ",
    terms_accept_text:
      "CC Plus ব্রাউজার এক্সটেনশন এবং ওয়েবসাইট ব্যবহার করে, আপনি এই সেবার শর্তাবলীতে সম্মত হন। আপনি সম্মত না হলে, দয়া করে আমাদের সেবা ব্যবহার করবেন না।",
    terms_service_title: "সেবার বিবরণ",
    terms_service_text:
      "CC Plus একটি ভাষা শেখার টুল যা আপনাকে YouTube ভিডিও থেকে শব্দভাণ্ডার সংরক্ষণ করতে, স্পেসড রিপিটিশন ব্যবহার করে শব্দ পর্যালোচনা করতে এবং ডিভাইস জুড়ে আপনার অগ্রগতি সিঙ্ক করতে সাহায্য করে।",
    terms_responsibility_title: "ব্যবহারকারীর দায়িত্ব",
    terms_responsibility_1: "আপনার অ্যাকাউন্টের নিরাপত্তা বজায় রাখুন",
    terms_responsibility_2: "আমাদের সেবার অপব্যবহার করবেন না",
    terms_responsibility_3: "YouTube-এর সেবার শর্তাবলী মেনে চলুন",
    terms_ip_title: "মেধা সম্পত্তি",
    terms_ip_text:
      "CC Plus এক্সটেনশন, ওয়েবসাইট এবং সংশ্লিষ্ট বিষয়বস্তু কপিরাইট দ্বারা সুরক্ষিত। অনুমতি ছাড়া আপনি আমাদের সফ্টওয়্যার কপি, পরিবর্তন বা বিতরণ করতে পারবেন না।",
    terms_data_title: "আপনার ডেটা",
    terms_data_text:
      "আপনি আপনার তৈরি শব্দভাণ্ডার ডেটার মালিকানা বজায় রাখেন। আমরা শুধুমাত্র সেবা প্রদানের জন্য আপনার ডেটা সংরক্ষণ এবং প্রক্রিয়া করি।",
    terms_disclaimer_title: "দাবিত্যাগ",
    terms_disclaimer_text:
      'CC Plus কোনো ধরনের ওয়ারেন্টি ছাড়াই "যেমন আছে" প্রদান করা হয়। আমরা YouTube বা Google-এর সাথে সম্পর্কিত নই।',
    terms_liability_title: "দায়বদ্ধতার সীমাবদ্ধতা",
    terms_liability_text:
      "আইন দ্বারা অনুমোদিত সর্বাধিক পরিমাণে, CC Plus কোনো পরোক্ষ, আকস্মিক বা পরিণতিমূলক ক্ষতির জন্য দায়ী থাকবে না।",
    terms_termination_title: "সমাপ্তি",
    terms_termination_text:
      "আমরা যেকোনো সময় আমাদের সেবায় অ্যাক্সেস স্থগিত বা সমাপ্ত করার অধিকার সংরক্ষণ করি। আপনি যেকোনো সময় আমাদের সেবা ব্যবহার বন্ধ করতে পারেন।",
    terms_changes_title: "শর্তাবলী পরিবর্তন",
    terms_changes_text:
      "আমরা সময়ে সময়ে এই শর্তাবলী আপডেট করতে পারি। পরিবর্তনের পরে সেবার অব্যাহত ব্যবহার গ্রহণযোগ্যতা গঠন করে।",
    terms_back: "সেটিংসে ফিরে যান",

    // PWA Install
    pwa_install_title: "CC Plus ইনস্টল করুন",
    pwa_install_hint: "দ্রুত অ্যাক্সেসের জন্য হোম স্ক্রিনে যোগ করুন",
    pwa_install_button: "ইনস্টল করুন",
    pwa_install_ios_hint: "সেরা অভিজ্ঞতার জন্য হোম স্ক্রিনে যোগ করুন",
    pwa_install_ios_step1: "শেয়ার বোতামে ট্যাপ করুন",
    pwa_install_ios_step2: '"হোম স্ক্রিনে যোগ করুন" নির্বাচন করুন',
  },

  pt: {
    // Nav
    nav_home: "Início",
    nav_words: "Palavras",
    nav_review: "Revisar",
    nav_stats: "Estatísticas",
    nav_settings: "Configurações",

    // Home page
    home_title: "Aprenda idiomas com o YouTube",
    home_subtitle:
      "Salve vocabulário de vídeos, revise com repetição espaçada e domine novas palavras sem esforço.",
    home_get_extension: "Obter Extensão",
    home_view_words: "Ver Minhas Palavras",
    home_feature_captions: "Legendas Interativas",
    home_feature_captions_desc:
      "Clique em qualquer palavra nas legendas para salvá-la",
    home_feature_sync: "Sincronização na Nuvem",
    home_feature_sync_desc:
      "Seu vocabulário sincroniza entre a extensão e o site",
    home_feature_review: "Revisão Inteligente",
    home_feature_review_desc:
      "O algoritmo SM-2 agenda revisões em intervalos ideais",
    home_feature_wide_screen: "Tela Ampla",
    home_feature_wide_screen_desc: "Maximize a imersão com modo cinema",
    home_feature_clean: "Interface Limpa",
    home_feature_clean_desc:
      "Remova anúncios e distrações para visualização focada",
    home_feature_side_comments: "Comentários Laterais",
    home_feature_side_comments_desc:
      "Mova comentários para a direita para melhor layout",
    home_feature_comment_search: "Buscar Comentários",
    home_feature_comment_search_desc: "Busque e filtre comentários facilmente",
    home_feature_word_selection: "Seleção de Palavras",
    home_feature_word_selection_desc:
      "Selecione texto para traduzir e salvar palavras",

    // Words page
    words_title: "Meu Vocabulário",
    words_search_placeholder: "Buscar palavras...",
    words_filter_all: "Todas",
    words_filter_new: "Novas",
    words_filter_learning: "Aprendendo",
    words_filter_mastered: "Dominadas",
    words_empty: "Nenhuma palavra encontrada",
    words_empty_hint: "Comece a salvar palavras de vídeos do YouTube!",
    words_count: "{count} palavras",

    // Review page
    review_title: "Revisar",
    review_due_today: "Pendentes Hoje",
    review_start: "Iniciar Revisão",
    review_no_cards: "Nenhum cartão para revisar",
    review_no_cards_hint:
      "Ótimo trabalho! Volte mais tarde para mais revisões.",
    review_show_answer: "Mostrar Resposta",
    review_again: "De novo",
    review_hard: "Difícil",
    review_good: "Bom",
    review_easy: "Fácil",
    review_complete: "Revisão Concluída!",
    review_complete_message: "Você revisou {count} cartões hoje.",
    review_back_home: "Voltar ao Início",

    // Stats page
    stats_title: "Estatísticas",
    stats_streak: "Sequência de Dias",
    stats_total_words: "Total de Palavras",
    stats_mastered: "Dominadas",
    stats_due_today: "Pendentes Hoje",
    stats_vocabulary_growth: "Crescimento do Vocabulário",
    stats_last_7_days: "Últimos 7 Dias",
    stats_30_days_ago: "30 dias atrás",
    stats_today: "Hoje",
    stats_mastery_distribution: "Distribuição de Domínio",
    stats_videos_studied: "Vídeos Estudados",
    stats_no_videos: "Nenhum vídeo ainda",
    stats_word_count: "{count} palavras",
    stats_activity_title: "Atividade de Aprendizado",
    stats_activity_total: "{count} palavras adicionadas no último ano",
    stats_activity_words: "palavras",
    stats_activity_less: "Menos",
    stats_activity_more: "Mais",

    // Settings page
    settings_title: "Configurações",
    settings_account: "Conta",
    settings_email: "Email",
    settings_member_since: "Membro desde",
    settings_appearance: "Aparência",
    settings_theme: "Tema",
    settings_theme_light: "Claro",
    settings_theme_dark: "Escuro",
    settings_theme_system: "Sistema",
    settings_language: "Idioma",
    settings_learning: "Aprendizado",
    settings_daily_goal: "Meta Diária",
    settings_daily_goal_unit: "palavras/dia",
    settings_sync: "Sincronização",
    settings_sync_enabled: "Sincronização Ativada",
    settings_sync_desc: "Sincronizar vocabulário entre extensão e site",
    settings_logout: "Sair",
    settings_login_hint:
      "Entre para sincronizar seu vocabulário entre dispositivos",
    settings_google_login: "Entrar com Google",
    settings_data: "Dados",
    settings_export: "Exportar Dados",
    settings_export_desc: "Baixar todas as {count} palavras como arquivo JSON",
    settings_export_btn: "Exportar",
    settings_danger: "Zona de Perigo",
    settings_delete_account: "Excluir Conta",
    settings_delete_account_desc:
      "Exclua permanentemente sua conta e todos os dados",

    // Word card
    word_context: "Contexto",
    word_from_video: "Do vídeo",
    word_added: "Adicionada",

    // Common
    loading: "Carregando...",
    save: "Salvar",
    cancel: "Cancelar",
    delete: "Excluir",
    edit: "Editar",
    close: "Fechar",

    // Privacy page
    privacy_title: "Política de Privacidade",
    privacy_updated: "Última atualização: Janeiro de 2025",
    privacy_intro_title: "Introdução",
    privacy_intro_text:
      "O CC Plus está comprometido em proteger sua privacidade. Esta Política de Privacidade explica como coletamos, usamos e protegemos suas informações quando você usa nossa extensão de navegador e site.",
    privacy_collect_title: "Dados que Coletamos",
    privacy_collect_vocab: "Dados de Vocabulário",
    privacy_collect_vocab_desc:
      "Palavras que você salva, incluindo frases de contexto e fontes de vídeo. Armazenadas localmente no seu navegador por padrão.",
    privacy_collect_account: "Informações da Conta",
    privacy_collect_account_desc:
      "Se você entrar com o Google, recebemos seu email e nome de perfil apenas para autenticação.",
    privacy_collect_analytics: "Análise de Uso",
    privacy_collect_analytics_desc:
      "Usamos o Google Analytics para coletar estatísticas de uso anônimas para melhorar nosso serviço.",
    privacy_storage_title: "Armazenamento de Dados",
    privacy_storage_local: "Armazenamento Local",
    privacy_storage_local_desc:
      "Seu vocabulário é armazenado localmente no IndexedDB e funciona offline.",
    privacy_storage_cloud: "Sincronização na Nuvem",
    privacy_storage_cloud_desc:
      "Se você entrar, os dados sincronizam com o Firebase para acesso entre dispositivos.",
    privacy_sharing_title: "Compartilhamento de Dados",
    privacy_sharing_text:
      "Não vendemos nem compartilhamos seus dados pessoais, exceto com estes provedores de serviços:",
    privacy_sharing_firebase:
      "Firebase (Google) - Autenticação e Armazenamento",
    privacy_sharing_analytics: "Google Analytics - Estatísticas de Uso",
    privacy_rights_title: "Seus Direitos",
    privacy_rights_export: "Exportar seus dados",
    privacy_rights_delete: "Excluir sua conta",
    privacy_rights_no_account: "Usar sem conta",
    privacy_contact_title: "Dúvidas?",
    privacy_contact_text:
      "Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato:",
    privacy_back: "Voltar às Configurações",

    // Terms page
    terms_title: "Termos de Serviço",
    terms_updated: "Última atualização: Janeiro de 2025",
    terms_accept_title: "Aceitação dos Termos",
    terms_accept_text:
      "Ao usar a extensão de navegador e o site CC Plus, você concorda com estes Termos de Serviço. Se você não concordar, por favor não use nossos serviços.",
    terms_service_title: "Descrição do Serviço",
    terms_service_text:
      "O CC Plus é uma ferramenta de aprendizado de idiomas que ajuda você a salvar vocabulário de vídeos do YouTube, revisar palavras usando repetição espaçada e sincronizar seu progresso entre dispositivos.",
    terms_responsibility_title: "Responsabilidades do Usuário",
    terms_responsibility_1: "Manter a segurança da sua conta",
    terms_responsibility_2: "Não fazer mau uso dos nossos serviços",
    terms_responsibility_3: "Cumprir os Termos de Serviço do YouTube",
    terms_ip_title: "Propriedade Intelectual",
    terms_ip_text:
      "A extensão CC Plus, site e conteúdo associado são protegidos por direitos autorais. Você não pode copiar, modificar ou distribuir nosso software sem permissão.",
    terms_data_title: "Seus Dados",
    terms_data_text:
      "Você mantém a propriedade dos dados de vocabulário que cria. Apenas armazenamos e processamos seus dados para fornecer o serviço.",
    terms_disclaimer_title: "Isenção de Responsabilidade",
    terms_disclaimer_text:
      'O CC Plus é fornecido "como está" sem garantias de qualquer tipo. Não somos afiliados ao YouTube ou Google.',
    terms_liability_title: "Limitação de Responsabilidade",
    terms_liability_text:
      "Na máxima extensão permitida por lei, o CC Plus não será responsável por quaisquer danos indiretos, incidentais ou consequenciais.",
    terms_termination_title: "Rescisão",
    terms_termination_text:
      "Reservamos o direito de suspender ou encerrar o acesso aos nossos serviços a qualquer momento. Você pode parar de usar nossos serviços a qualquer momento.",
    terms_changes_title: "Alterações nos Termos",
    terms_changes_text:
      "Podemos atualizar estes Termos de tempos em tempos. O uso continuado do serviço após as alterações constitui aceitação.",
    terms_back: "Voltar às Configurações",

    // PWA Install
    pwa_install_title: "Instalar CC Plus",
    pwa_install_hint: "Adicionar à tela inicial para acesso rápido",
    pwa_install_button: "Instalar",
    pwa_install_ios_hint: "Adicionar à tela inicial para melhor experiência",
    pwa_install_ios_step1: "Toque no botão de compartilhar",
    pwa_install_ios_step2: 'Selecione "Adicionar à Tela de Início"',
  },

  ru: {
    // Nav
    nav_home: "Главная",
    nav_words: "Слова",
    nav_review: "Повторение",
    nav_stats: "Статистика",
    nav_settings: "Настройки",

    // Home page
    home_title: "Изучайте языки с YouTube",
    home_subtitle:
      "Сохраняйте словарный запас из видео, повторяйте с интервальным повторением и легко осваивайте новые слова.",
    home_get_extension: "Получить расширение",
    home_view_words: "Мои слова",
    home_feature_captions: "Интерактивные субтитры",
    home_feature_captions_desc:
      "Нажмите на любое слово в субтитрах, чтобы сохранить его",
    home_feature_sync: "Облачная синхронизация",
    home_feature_sync_desc:
      "Ваш словарь синхронизируется между расширением и сайтом",
    home_feature_review: "Умное повторение",
    home_feature_review_desc:
      "Алгоритм SM-2 планирует повторения с оптимальными интервалами",
    home_feature_wide_screen: "Широкий экран",
    home_feature_wide_screen_desc: "Максимум погружения в режиме театра",
    home_feature_clean: "Чистый интерфейс",
    home_feature_clean_desc:
      "Удалите рекламу и отвлечения для сосредоточенного просмотра",
    home_feature_side_comments: "Боковые комментарии",
    home_feature_side_comments_desc:
      "Переместите комментарии вправо для лучшей компоновки",
    home_feature_comment_search: "Поиск комментариев",
    home_feature_comment_search_desc: "Легко ищите и фильтруйте комментарии",
    home_feature_word_selection: "Выделение слов",
    home_feature_word_selection_desc:
      "Выделите текст для перевода и сохранения слов",

    // Words page
    words_title: "Мой словарь",
    words_search_placeholder: "Поиск слов...",
    words_filter_all: "Все",
    words_filter_new: "Новые",
    words_filter_learning: "Изучаемые",
    words_filter_mastered: "Освоенные",
    words_empty: "Слова не найдены",
    words_empty_hint: "Начните сохранять слова из видео YouTube!",
    words_count: "{count} слов",

    // Review page
    review_title: "Повторение",
    review_due_today: "На сегодня",
    review_start: "Начать повторение",
    review_no_cards: "Нет карточек для повторения",
    review_no_cards_hint: "Отлично! Возвращайтесь позже для новых повторений.",
    review_show_answer: "Показать ответ",
    review_again: "Снова",
    review_hard: "Сложно",
    review_good: "Хорошо",
    review_easy: "Легко",
    review_complete: "Повторение завершено!",
    review_complete_message: "Сегодня вы повторили {count} карточек.",
    review_back_home: "На главную",

    // Stats page
    stats_title: "Статистика",
    stats_streak: "Дней подряд",
    stats_total_words: "Всего слов",
    stats_mastered: "Освоено",
    stats_due_today: "На сегодня",
    stats_vocabulary_growth: "Рост словаря",
    stats_last_7_days: "Последние 7 дней",
    stats_30_days_ago: "30 дней назад",
    stats_today: "Сегодня",
    stats_mastery_distribution: "Распределение освоения",
    stats_videos_studied: "Изученные видео",
    stats_no_videos: "Пока нет видео",
    stats_word_count: "{count} слов",
    stats_activity_title: "Активность обучения",
    stats_activity_total: "Добавлено {count} слов за последний год",
    stats_activity_words: "слов",
    stats_activity_less: "Меньше",
    stats_activity_more: "Больше",

    // Settings page
    settings_title: "Настройки",
    settings_account: "Аккаунт",
    settings_email: "Email",
    settings_member_since: "Участник с",
    settings_appearance: "Внешний вид",
    settings_theme: "Тема",
    settings_theme_light: "Светлая",
    settings_theme_dark: "Тёмная",
    settings_theme_system: "Системная",
    settings_language: "Язык",
    settings_learning: "Обучение",
    settings_daily_goal: "Дневная цель",
    settings_daily_goal_unit: "слов/день",
    settings_sync: "Синхронизация",
    settings_sync_enabled: "Синхронизация включена",
    settings_sync_desc: "Синхронизировать словарь между расширением и сайтом",
    settings_logout: "Выйти",
    settings_login_hint:
      "Войдите, чтобы синхронизировать словарь между устройствами",
    settings_google_login: "Войти через Google",
    settings_data: "Данные",
    settings_export: "Экспорт данных",
    settings_export_desc: "Скачать все {count} слов в формате JSON",
    settings_export_btn: "Экспорт",
    settings_danger: "Опасная зона",
    settings_delete_account: "Удалить аккаунт",
    settings_delete_account_desc: "Навсегда удалить ваш аккаунт и все данные",

    // Word card
    word_context: "Контекст",
    word_from_video: "Из видео",
    word_added: "Добавлено",

    // Common
    loading: "Загрузка...",
    save: "Сохранить",
    cancel: "Отмена",
    delete: "Удалить",
    edit: "Редактировать",
    close: "Закрыть",

    // Privacy page
    privacy_title: "Политика конфиденциальности",
    privacy_updated: "Последнее обновление: Январь 2025",
    privacy_intro_title: "Введение",
    privacy_intro_text:
      "CC Plus стремится защитить вашу конфиденциальность. Эта Политика конфиденциальности объясняет, как мы собираем, используем и защищаем вашу информацию при использовании расширения браузера и сайта.",
    privacy_collect_title: "Данные, которые мы собираем",
    privacy_collect_vocab: "Данные словаря",
    privacy_collect_vocab_desc:
      "Сохранённые слова, включая контекстные предложения и источники видео. По умолчанию хранятся локально в браузере.",
    privacy_collect_account: "Информация об аккаунте",
    privacy_collect_account_desc:
      "При входе через Google мы получаем ваш email и имя профиля только для аутентификации.",
    privacy_collect_analytics: "Аналитика использования",
    privacy_collect_analytics_desc:
      "Мы используем Google Analytics для сбора анонимной статистики использования для улучшения сервиса.",
    privacy_storage_title: "Хранение данных",
    privacy_storage_local: "Локальное хранилище",
    privacy_storage_local_desc:
      "Ваш словарь хранится локально в IndexedDB и работает офлайн.",
    privacy_storage_cloud: "Облачная синхронизация",
    privacy_storage_cloud_desc:
      "При входе данные синхронизируются с Firebase для доступа с разных устройств.",
    privacy_sharing_title: "Передача данных",
    privacy_sharing_text:
      "Мы не продаём и не передаём ваши личные данные, за исключением этих поставщиков услуг:",
    privacy_sharing_firebase: "Firebase (Google) - Аутентификация и хранение",
    privacy_sharing_analytics: "Google Analytics - Статистика использования",
    privacy_rights_title: "Ваши права",
    privacy_rights_export: "Экспортировать данные",
    privacy_rights_delete: "Удалить аккаунт",
    privacy_rights_no_account: "Использовать без аккаунта",
    privacy_contact_title: "Вопросы?",
    privacy_contact_text:
      "Если у вас есть вопросы об этой Политике конфиденциальности, свяжитесь с нами:",
    privacy_back: "Назад к настройкам",

    // Terms page
    terms_title: "Условия использования",
    terms_updated: "Последнее обновление: Январь 2025",
    terms_accept_title: "Принятие условий",
    terms_accept_text:
      "Используя расширение браузера и сайт CC Plus, вы соглашаетесь с этими Условиями использования. Если вы не согласны, пожалуйста, не используйте наши услуги.",
    terms_service_title: "Описание сервиса",
    terms_service_text:
      "CC Plus — это инструмент для изучения языков, который помогает сохранять словарный запас из видео YouTube, повторять слова с помощью интервального повторения и синхронизировать прогресс между устройствами.",
    terms_responsibility_title: "Обязанности пользователя",
    terms_responsibility_1: "Обеспечивать безопасность аккаунта",
    terms_responsibility_2: "Не злоупотреблять нашими услугами",
    terms_responsibility_3: "Соблюдать Условия использования YouTube",
    terms_ip_title: "Интеллектуальная собственность",
    terms_ip_text:
      "Расширение CC Plus, сайт и связанный контент защищены авторским правом. Вы не можете копировать, изменять или распространять наше программное обеспечение без разрешения.",
    terms_data_title: "Ваши данные",
    terms_data_text:
      "Вы сохраняете право собственности на созданные данные словаря. Мы храним и обрабатываем ваши данные только для предоставления услуги.",
    terms_disclaimer_title: "Отказ от ответственности",
    terms_disclaimer_text:
      'CC Plus предоставляется "как есть" без каких-либо гарантий. Мы не связаны с YouTube или Google.',
    terms_liability_title: "Ограничение ответственности",
    terms_liability_text:
      "В максимальной степени, разрешённой законом, CC Plus не несёт ответственности за любые косвенные, случайные или последующие убытки.",
    terms_termination_title: "Прекращение",
    terms_termination_text:
      "Мы оставляем за собой право приостановить или прекратить доступ к нашим услугам в любое время. Вы можете прекратить использование наших услуг в любое время.",
    terms_changes_title: "Изменение условий",
    terms_changes_text:
      "Мы можем время от времени обновлять эти Условия. Продолжение использования сервиса после изменений означает принятие.",
    terms_back: "Назад к настройкам",

    // PWA Install
    pwa_install_title: "Установить CC Plus",
    pwa_install_hint: "Добавить на главный экран для быстрого доступа",
    pwa_install_button: "Установить",
    pwa_install_ios_hint: "Добавить на главный экран для лучшего опыта",
    pwa_install_ios_step1: "Нажмите кнопку «Поделиться»",
    pwa_install_ios_step2: "Выберите «На экран Домой»",
  },
} as const;

export type MessageKey = keyof (typeof messages)["en"];
