// Supported languages
export type Locale = "en" | "zh_CN" | "zh_TW" | "ja" | "ko";

export const localeNames: Record<Locale, string> = {
  en: "English",
  zh_CN: "简体中文",
  zh_TW: "繁體中文",
  ja: "日本語",
  ko: "한국어",
};

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
    stats_reviews_today: "Reviews Today",
    stats_vocabulary_growth: "Vocabulary Growth",
    stats_last_7_days: "Last 7 Days",

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
    stats_reviews_today: "今日复习",
    stats_vocabulary_growth: "词汇增长",
    stats_last_7_days: "最近 7 天",

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
    stats_reviews_today: "今日複習",
    stats_vocabulary_growth: "詞彙增長",
    stats_last_7_days: "最近 7 天",

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
    stats_reviews_today: "今日の復習",
    stats_vocabulary_growth: "語彙の成長",
    stats_last_7_days: "過去7日間",

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
    stats_reviews_today: "오늘 복습",
    stats_vocabulary_growth: "어휘 성장",
    stats_last_7_days: "지난 7일",

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
  },
} as const;

export type MessageKey = keyof (typeof messages)["en"];
