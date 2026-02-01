<script lang="ts">
  import { wordsStore } from "$lib/stores/words.svelte";
  import { authStore } from "$lib/stores/auth.svelte";
  import { i18n } from "$lib/i18n/index.svelte";
  import ActivityHeatmap from "$lib/components/ActivityHeatmap.svelte";
  import {
    requestExtensionActivity,
    getExtensionSyncState,
  } from "$lib/stores/extension-sync.svelte";
  import { onMount } from "svelte";

  // Daily activity data type
  type ActivityMap = Record<
    string,
    { date: string; selectionCount: number; wordsAdded: number }
  >;

  const words = $derived(wordsStore.words);
  const stats = $derived(wordsStore.stats);
  const videos = $derived(wordsStore.videos);
  const userStats = $derived(authStore.user?.stats);

  // Activity data from extension
  let activityData = $state<ActivityMap>({});

  // Load activity data from extension on mount
  onMount(async () => {
    const syncState = getExtensionSyncState();
    if (syncState.extensionDetected) {
      try {
        activityData = await requestExtensionActivity();
        console.log("[Stats] Loaded activity data:", activityData);
      } catch (e) {
        console.error("[Stats] Failed to load activity data:", e);
      }
    }
  });

  // Get local date string in YYYY-MM-DD format
  function toLocalDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Generate chart data from actual words based on createdAt dates
  function generateChartData() {
    const data: { date: string; value: number }[] = [];
    const now = new Date();
    now.setHours(23, 59, 59, 999);

    // Create a map of date -> cumulative word count
    const dateCountMap = new Map<string, number>();

    // Sort words by createdAt
    const sortedWords = [...words].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Calculate cumulative count for each day a word was added
    let cumulativeCount = 0;
    for (const word of sortedWords) {
      const date = toLocalDateString(new Date(word.createdAt));
      cumulativeCount++;
      dateCountMap.set(date, cumulativeCount);
    }

    // Generate data for last 30 days
    let lastKnownCount = 0;
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = toLocalDateString(date);

      // Find the cumulative count for this date or earlier
      if (dateCountMap.has(dateStr)) {
        lastKnownCount = dateCountMap.get(dateStr)!;
      } else {
        // Use the last known count before this date
        for (const [d, count] of dateCountMap) {
          if (d <= dateStr) {
            lastKnownCount = count;
          }
        }
      }

      data.push({
        date: dateStr,
        value: lastKnownCount,
      });
    }

    return data;
  }

  const chartData = $derived(generateChartData());
  const maxValue = $derived(
    Math.max(...chartData.map((d) => d.value), 1) // Ensure minimum of 1 to avoid division by zero
  );

  // SVG chart dimensions
  const chartWidth = 100;
  const chartHeight = 40;

  function getPath() {
    if (chartData.length === 0) return "";
    const points = chartData.map((d, i) => {
      const x = (i / (chartData.length - 1)) * chartWidth;
      const y = chartHeight - (d.value / maxValue) * chartHeight;
      return `${x},${y}`;
    });
    return `M ${points.join(" L ")}`;
  }

  function getAreaPath() {
    if (chartData.length === 0) return "";
    const points = chartData.map((d, i) => {
      const x = (i / (chartData.length - 1)) * chartWidth;
      const y = chartHeight - (d.value / maxValue) * chartHeight;
      return `${x},${y}`;
    });
    return `M 0,${chartHeight} L ${points.join(" L ")} L ${chartWidth},${chartHeight} Z`;
  }

  // Helper function for progress bar width calculation
  function getPercentage(value: number, total: number): number {
    return total > 0 ? (value / total) * 100 : 0;
  }
</script>

<svelte:head>
  <title>{i18n.t("stats_title")} - CC Words</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-6">
  <h1 class="text-2xl font-bold mb-6">{i18n.t("stats_title")}</h1>

  <!-- Streak and overview -->
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
    <div class="card text-center">
      <div class="text-3xl font-bold text-[var(--warning)] mb-1">
        {userStats?.streak ?? 0}
      </div>
      <div class="text-sm text-secondary">{i18n.t("stats_streak")}</div>
    </div>
    <div class="card text-center">
      <div class="text-3xl font-bold mb-1">{stats.total}</div>
      <div class="text-sm text-secondary">{i18n.t("stats_total_words")}</div>
    </div>
    <div class="card text-center">
      <div class="text-3xl font-bold text-[var(--success)] mb-1">
        {stats.mastered}
      </div>
      <div class="text-sm text-secondary">{i18n.t("stats_mastered")}</div>
    </div>
    <div class="card text-center">
      <div class="text-3xl font-bold text-accent mb-1">{stats.dueToday}</div>
      <div class="text-sm text-secondary">{i18n.t("stats_due_today")}</div>
    </div>
  </div>

  <!-- Activity heatmap -->
  <div class="card mb-8">
    <h2 class="text-sm font-medium text-secondary mb-4">
      {i18n.t("stats_activity_title")}
    </h2>
    <ActivityHeatmap {words} activity={activityData} />
  </div>

  <!-- Vocabulary growth chart -->
  <div class="card mb-8">
    <h2 class="text-sm font-medium text-secondary mb-4">
      {i18n.t("stats_vocabulary_growth")}
    </h2>
    <div class="h-32 relative">
      <svg
        viewBox="0 0 {chartWidth} {chartHeight}"
        preserveAspectRatio="none"
        class="w-full h-full"
      >
        <!-- Area fill -->
        <path d={getAreaPath()} fill="var(--accent)" fill-opacity="0.1" />
        <!-- Line -->
        <path
          d={getPath()}
          fill="none"
          stroke="var(--accent)"
          stroke-width="0.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <!-- Y axis labels -->
      <div class="absolute top-0 right-0 text-xs text-tertiary">{maxValue}</div>
      <div class="absolute bottom-0 right-0 text-xs text-tertiary">0</div>
    </div>
    <div class="flex justify-between text-xs text-tertiary mt-2">
      <span>{i18n.t("stats_30_days_ago")}</span>
      <span>{i18n.t("stats_today")}</span>
    </div>
  </div>

  <!-- Mastery distribution -->
  <div class="card mb-8">
    <h2 class="text-sm font-medium text-secondary mb-4">
      {i18n.t("stats_mastery_distribution")}
    </h2>
    <div class="space-y-3">
      <div>
        <div class="flex justify-between text-sm mb-1">
          <span>{i18n.t("words_filter_new")}</span>
          <span class="text-secondary">{stats.new}</span>
        </div>
        <div class="h-2 bg-tertiary rounded-full overflow-hidden">
          <div
            class="h-full rounded-full"
            style="width: {getPercentage(
              stats.new,
              stats.total
            )}%; background-color: #3b82f6;"
          ></div>
        </div>
      </div>
      <div>
        <div class="flex justify-between text-sm mb-1">
          <span>{i18n.t("words_filter_learning")}</span>
          <span class="text-secondary">{stats.learning}</span>
        </div>
        <div class="h-2 bg-tertiary rounded-full overflow-hidden">
          <div
            class="h-full rounded-full"
            style="width: {getPercentage(
              stats.learning,
              stats.total
            )}%; background-color: #f59e0b;"
          ></div>
        </div>
      </div>
      <div>
        <div class="flex justify-between text-sm mb-1">
          <span>{i18n.t("words_filter_mastered")}</span>
          <span class="text-secondary">{stats.mastered}</span>
        </div>
        <div class="h-2 bg-tertiary rounded-full overflow-hidden">
          <div
            class="h-full rounded-full"
            style="width: {getPercentage(
              stats.mastered,
              stats.total
            )}%; background-color: #22c55e;"
          ></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Videos -->
  <div class="card">
    <h2 class="text-sm font-medium text-secondary mb-4">
      {i18n.t("stats_videos_studied")}
    </h2>
    {#if videos.length === 0}
      <p class="text-tertiary text-sm">{i18n.t("stats_no_videos")}</p>
    {:else}
      <div class="space-y-3">
        {#each videos.sort((a, b) => b.wordCount - a.wordCount) as video}
          <div class="flex items-center justify-between">
            <span class="text-sm truncate max-w-[70%]">{video.title}</span>
            <span class="text-sm text-secondary"
              >{i18n.t("stats_word_count", { count: video.wordCount })}</span
            >
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
