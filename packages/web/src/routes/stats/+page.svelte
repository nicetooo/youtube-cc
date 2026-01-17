<script lang="ts">
  import { wordsStore } from "$lib/stores/words.svelte";
  import { authStore } from "$lib/stores/auth.svelte";
  import { i18n } from "$lib/i18n/index.svelte";

  const stats = $derived(wordsStore.stats);
  const videos = $derived(wordsStore.videos);
  const userStats = $derived(authStore.user?.stats);

  // Generate mock data for the chart
  function generateChartData() {
    const data = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      // Mock: random growth
      const baseValue = stats.total - i * 2 + Math.floor(Math.random() * 5);
      data.push({
        date: date.toISOString().split("T")[0],
        value: Math.max(0, baseValue),
      });
    }
    return data;
  }

  const chartData = $derived(generateChartData());
  const maxValue = $derived(Math.max(...chartData.map((d) => d.value)));

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
</script>

<svelte:head>
  <title>{i18n.t("stats_title")} - CC Plus</title>
</svelte:head>

<div class="max-w-3xl mx-auto px-4 py-6">
  <h1 class="text-2xl font-bold mb-6">{i18n.t("stats_title")}</h1>

  <!-- Streak and overview -->
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
    <div class="card text-center">
      <div class="text-3xl font-bold text-[var(--warning)] mb-1">
        {userStats?.streak || 15}
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
      <div class="text-sm text-secondary">{i18n.t("stats_reviews_today")}</div>
    </div>
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
      <span>30 days ago</span>
      <span>Today</span>
    </div>
  </div>

  <!-- Mastery distribution -->
  <div class="card mb-8">
    <h2 class="text-sm font-medium text-secondary mb-4">
      {i18n.t("words_filter_all")}
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
            style="width: {(stats.new / stats.total) *
              100}%; background-color: #3b82f6;"
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
            style="width: {(stats.learning / stats.total) *
              100}%; background-color: #f59e0b;"
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
            style="width: {(stats.mastered / stats.total) *
              100}%; background-color: #22c55e;"
          ></div>
        </div>
      </div>
    </div>
  </div>

  <!-- Videos -->
  <div class="card">
    <h2 class="text-sm font-medium text-secondary mb-4">Videos Studied</h2>
    {#if videos.length === 0}
      <p class="text-tertiary text-sm">No videos yet</p>
    {:else}
      <div class="space-y-3">
        {#each videos.sort((a, b) => b.wordCount - a.wordCount) as video}
          <div class="flex items-center justify-between">
            <span class="text-sm truncate max-w-[70%]">{video.title}</span>
            <span class="text-sm text-secondary">{video.wordCount} words</span>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
