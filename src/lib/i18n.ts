export const messages = {
  en: {
    display_transcription: "Display Transcription",
    search_transcription: "Search Transcription",
    transcription: "Transcription",
    wide_screen: "Wide Screen",
    // skip_video_ads: "Skip Video Ads",
    remove_ad_items: "Clean Interface",
    side_comments: "Side Comments",
    search_comment: "Search Comment",
    transcription_sub: "Interactive sidebar transcript",
    wide_screen_sub: "Maximize immersion automatically",
    remove_ad_items_sub: "Optimize page layout",
    // skip_video_ads_sub: "Auto-skip video advertisements",
    side_comments_sub: "Shift comments to the right",
    search_comment_sub: "Search and filter comments",
  },
  zh_CN: {
    display_transcription: "显示转录",
    search_transcription: "搜索转录",
    transcription: "转录",
    wide_screen: "宽屏",
    // skip_video_ads: "跳过视频广告",
    remove_ad_items: "界面净化",
    side_comments: "侧边评论",
    search_comment: "搜索评论",
    transcription_sub: "交互式侧边栏转录",
    wide_screen_sub: "自动最大化沉浸感",
    remove_ad_items_sub: "优化页面布局显示",
    // skip_video_ads_sub: "自动跳过视频广告",
    side_comments_sub: "将评论移至右侧",
    search_comment_sub: "搜索和过滤评论",
  },
  zh_TW: {
    display_transcription: "顯示轉錄",
    search_transcription: "搜尋轉錄",
    transcription: "轉錄",
    wide_screen: "寬屏",
    // skip_video_ads: "跳過視頻廣告",
    remove_ad_items: "介面淨化",
    side_comments: "側邊評論",
    search_comment: "搜尋評論",
    transcription_sub: "互動式側邊欄轉錄",
    wide_screen_sub: "自動最大化沉浸感",
    remove_ad_items_sub: "優化頁面佈局顯示",
    // skip_video_ads_sub: "自動跳過視頻廣告",
    side_comments_sub: "將評論移至右側",
    search_comment_sub: "搜尋和過濾評論",
  },
  ja: {
    display_transcription: "文字起こしを表示",
    search_transcription: "文字起こしを検索",
    transcription: "文字起こし",
    wide_screen: "ワイドスクリーン",
    // skip_video_ads: "動画広告をスキップ",
    remove_ad_items: "インターフェース浄化",
    side_comments: "サイドコメント",
    search_comment: "コメントを検索",
    transcription_sub: "インタラクティブなサイドバー文字起こし",
    wide_screen_sub: "没入感を自動的に最大化",
    remove_ad_items_sub: "ページレイアウトを最適化",
    // skip_video_ads_sub: "動画広告を自動スキップ",
    side_comments_sub: "コメントを右側に移動",
    search_comment_sub: "コメントの検索とフィルタリング",
  },
  ko: {
    display_transcription: "전사 표시",
    search_transcription: "전사 검색",
    transcription: "전사",
    wide_screen: "와이드 스크린",
    // skip_video_ads: "동영상 광고 건너뛰기",
    remove_ad_items: "인터페이스 정화",
    side_comments: "사이드 댓글",
    search_comment: "댓글 검색",
    transcription_sub: "인터랙티브 사이드바 전사",
    wide_screen_sub: "몰입감 자동 극대화",
    remove_ad_items_sub: "페이지 레이아웃 최적화",
    // skip_video_ads_sub: "동영상 광고 자동 건너뛰기",
    side_comments_sub: "댓글을 오른쪽으로 이동",
    search_comment_sub: "댓글 검색 및 필터링",
  },
};

export const i18n = (
  key: keyof (typeof messages)["en"],
  language: string = navigator.language
) => {
  let lang = language.replace("-", "_");
  if (lang === "zh") {
    lang = "zh_CN";
  }

  // @ts-ignore
  if (messages[lang] && messages[lang][key]) {
    // @ts-ignore
    return messages[lang][key];
  }

  // Fallback for sub-languages (e.g., en-GB -> en)
  const baseLang = lang.split("_")[0];
  // @ts-ignore
  if (messages[baseLang] && messages[baseLang][key]) {
    // @ts-ignore
    return messages[baseLang][key];
  }
  
    // Fallback for zh-HK -> zh_TW etc if needed, but for now strict map

  return messages["en"][key];
};
