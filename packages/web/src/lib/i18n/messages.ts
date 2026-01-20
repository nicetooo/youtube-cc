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
  },
} as const;

export type MessageKey = keyof (typeof messages)["en"];
