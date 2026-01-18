import type { Word } from "@aspect/shared/types";

// Helper to create dates relative to today
const daysAgo = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
};

const daysFromNow = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
};

export const mockWords: Word[] = [
  // New words (due for first review)
  {
    id: "1",
    text: "magnificent",
    context: "This is a magnificent view of the city skyline at sunset.",
    translation: "壮丽的，宏伟的",
    source: {
      type: "youtube-caption",
      videoId: "abc123",
      videoTitle: "English Listening Practice - City Life",
      timestamp: 125,
    },
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: new Date(),
    status: "new",
    createdAt: daysAgo(2),
  },
  {
    id: "2",
    text: "overwhelming",
    context: "The response from the community was overwhelming.",
    translation: "压倒性的，难以抗拒的",
    source: {
      type: "youtube-caption",
      videoId: "abc123",
      videoTitle: "English Listening Practice - City Life",
      timestamp: 245,
    },
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: new Date(),
    status: "new",
    createdAt: daysAgo(2),
  },
  {
    id: "3",
    text: "serendipity",
    context: "It was pure serendipity that we met at the coffee shop.",
    translation: "意外发现美好事物的运气",
    source: {
      type: "youtube-caption",
      videoId: "def456",
      videoTitle: "TED Talk: The Power of Luck",
      timestamp: 89,
    },
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: new Date(),
    status: "new",
    createdAt: daysAgo(1),
  },

  // Learning words (reviewed once or twice)
  {
    id: "4",
    text: "ephemeral",
    context: "Social media fame is often ephemeral.",
    translation: "短暂的，转瞬即逝的",
    source: {
      type: "youtube-caption",
      videoId: "def456",
      videoTitle: "TED Talk: The Power of Luck",
      timestamp: 312,
    },
    easeFactor: 2.5,
    interval: 1,
    repetitions: 1,
    nextReview: new Date(),
    status: "learning",
    createdAt: daysAgo(5),
  },
  {
    id: "5",
    text: "meticulous",
    context: "She was meticulous in her research methodology.",
    translation: "一丝不苟的，细致的",
    source: {
      type: "youtube-caption",
      videoId: "ghi789",
      videoTitle: "BBC Learning English - Academic Writing",
      timestamp: 156,
    },
    easeFactor: 2.6,
    interval: 3,
    repetitions: 2,
    nextReview: daysFromNow(1),
    status: "learning",
    createdAt: daysAgo(10),
  },
  {
    id: "6",
    text: "ubiquitous",
    context: "Smartphones have become ubiquitous in modern society.",
    translation: "无处不在的",
    source: {
      type: "webpage",
      url: "https://example.com/article",
      pageTitle: "Tech Trends 2024",
    },
    easeFactor: 2.4,
    interval: 2,
    repetitions: 2,
    nextReview: new Date(),
    status: "learning",
    createdAt: daysAgo(8),
  },

  // Mastered words
  {
    id: "7",
    text: "pragmatic",
    context: "We need a pragmatic approach to solve this problem.",
    translation: "务实的，实用主义的",
    source: {
      type: "youtube-caption",
      videoId: "jkl012",
      videoTitle: "Business English Vocabulary",
      timestamp: 67,
    },
    easeFactor: 2.7,
    interval: 21,
    repetitions: 5,
    nextReview: daysFromNow(15),
    status: "mastered",
    examples: [
      "The manager took a pragmatic view of the situation.",
      "Her pragmatic mindset helped the team succeed.",
      "Being pragmatic means focusing on what actually works.",
    ],
    createdAt: daysAgo(30),
  },
  {
    id: "8",
    text: "eloquent",
    context: "She gave an eloquent speech about climate change.",
    translation: "雄辩的，有口才的",
    source: {
      type: "youtube-caption",
      videoId: "jkl012",
      videoTitle: "Business English Vocabulary",
      timestamp: 234,
    },
    easeFactor: 2.8,
    interval: 30,
    repetitions: 6,
    nextReview: daysFromNow(20),
    status: "mastered",
    createdAt: daysAgo(45),
  },
  {
    id: "9",
    text: "resilient",
    context: "The most successful people are incredibly resilient.",
    translation: "有韧性的，能快速恢复的",
    source: {
      type: "webpage",
      url: "https://medium.com/success-stories",
      pageTitle: "Success Stories",
    },
    easeFactor: 2.6,
    interval: 14,
    repetitions: 4,
    nextReview: daysFromNow(7),
    status: "mastered",
    createdAt: daysAgo(25),
  },

  // More variety
  {
    id: "10",
    text: "ambiguous",
    context: "The instructions were ambiguous and hard to follow.",
    translation: "模棱两可的，含糊的",
    source: {
      type: "youtube-caption",
      videoId: "mno345",
      videoTitle: "Motivational Speech Collection",
      timestamp: 178,
    },
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: new Date(),
    status: "new",
    createdAt: daysAgo(1),
  },
  {
    id: "11",
    text: "conscientious",
    context: "He is a conscientious worker who always meets deadlines.",
    translation: "认真负责的，勤勉的",
    source: {
      type: "youtube-caption",
      videoId: "pqr678",
      videoTitle: "IELTS Vocabulary Masterclass",
      timestamp: 89,
    },
    easeFactor: 2.3,
    interval: 1,
    repetitions: 1,
    nextReview: new Date(),
    status: "learning",
    createdAt: daysAgo(4),
  },
  {
    id: "12",
    text: "indispensable",
    context: "Good communication skills are indispensable in business.",
    translation: "不可或缺的，必需的",
    source: {
      type: "webpage",
      url: "https://hbr.org/communication",
      pageTitle: "Harvard Business Review",
    },
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: new Date(),
    status: "new",
    createdAt: daysAgo(0),
  },
];

// Get unique sources from words (for filtering)
export function getSources(words: Word[]) {
  const sourceMap = new Map<
    string,
    { id: string; title: string; wordCount: number }
  >();

  words.forEach((word) => {
    if (!word.source) return;

    let id: string;
    let title: string;

    if (word.source.type === "youtube-caption") {
      id = word.source.videoId;
      title = word.source.videoTitle || "YouTube Video";
    } else {
      try {
        const url = new URL(word.source.url);
        id = url.hostname;
        title = word.source.pageTitle || url.hostname;
      } catch {
        id = word.source.url;
        title = word.source.pageTitle || "Webpage";
      }
    }

    const existing = sourceMap.get(id);
    if (existing) {
      existing.wordCount++;
    } else {
      sourceMap.set(id, { id, title, wordCount: 1 });
    }
  });

  return Array.from(sourceMap.values());
}

// Get words due for review
export function getWordsForReview(words: Word[]) {
  const now = new Date();
  return words.filter((w) => w.nextReview <= now);
}

// Get stats from words
export function getWordStats(words: Word[]) {
  return {
    total: words.length,
    new: words.filter((w) => w.status === "new").length,
    learning: words.filter((w) => w.status === "learning").length,
    mastered: words.filter((w) => w.status === "mastered").length,
    dueToday: getWordsForReview(words).length,
  };
}
