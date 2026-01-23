<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { DAILY_ACTIVITY_KEY } from "@aspect/shared";
  import { i18n } from "@/shared/i18n/i18n";

  // Daily activity data type
  interface DailyActivity {
    date: string;
    selectionCount: number;
    wordsAdded: number;
  }
  type DailyActivityMap = Record<string, DailyActivity>;
  type WeekData = { date: string; count: number }[];

  // State
  let loading = $state(true);
  let weeks = $state<WeekData[]>([]);
  let totalActivity = $state(0);
  let maxCount = $state(1);

  // Get local date string in YYYY-MM-DD format (same as storage)
  function toLocalDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Generate weeks data from activity map
  function computeWeeksData(activityData: DailyActivityMap) {
    const result: WeekData[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Start from 12 weeks ago, aligned to Sunday
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 83 - today.getDay());

    let currentWeek: { date: string; count: number }[] = [];
    let total = 0;
    let max = 0;

    for (let i = 0; i <= 83 + today.getDay(); i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = toLocalDateString(date); // Use local date, not UTC!
      const dayOfWeek = date.getDay();

      // Get activity count for this day
      const activity = activityData[dateStr];
      const count = activity ? activity.selectionCount || 0 : 0;

      total += count;
      if (count > max) max = count;

      currentWeek.push({ date: dateStr, count });

      if (dayOfWeek === 6) {
        result.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }

    return { weeks: result, total, max: Math.max(max, 1) };
  }

  // Load and update UI
  function updateFromData(activityData: DailyActivityMap) {
    const computed = computeWeeksData(activityData);
    weeks = computed.weeks;
    totalActivity = computed.total;
    maxCount = computed.max;
    console.log(
      "[MiniHeatmap] Updated UI - total:",
      computed.total,
      "max:",
      computed.max
    );
  }

  // Load activity data from storage
  async function loadActivityData() {
    try {
      const result = await chrome.storage.local.get(DAILY_ACTIVITY_KEY);
      console.log("[MiniHeatmap] Raw storage result:", result);
      const data: DailyActivityMap = result[DAILY_ACTIVITY_KEY] || {};
      console.log("[MiniHeatmap] Loaded activity data:", data);

      // Debug: show today's count
      const today = new Date().toISOString().split("T")[0];
      console.log(
        "[MiniHeatmap] Today:",
        today,
        "Count:",
        data[today]?.selectionCount || 0
      );

      updateFromData(data);
    } catch (e) {
      console.error("[MiniHeatmap] Failed to load activity:", e);
      updateFromData({});
    } finally {
      loading = false;
    }
  }

  // Listen for storage changes
  function handleStorageChange(
    changes: { [key: string]: chrome.storage.StorageChange },
    areaName: string
  ) {
    if (areaName === "local" && changes[DAILY_ACTIVITY_KEY]) {
      const data: DailyActivityMap = changes[DAILY_ACTIVITY_KEY].newValue || {};
      console.log("[MiniHeatmap] Activity data updated:", data);
      updateFromData(data);
    }
  }

  onMount(() => {
    loadActivityData();
    chrome.storage.onChanged.addListener(handleStorageChange);
  });

  onDestroy(() => {
    chrome.storage.onChanged.removeListener(handleStorageChange);
  });

  // Get color based on activity level
  function getColor(count: number): string {
    if (count === 0) return "var(--cc-bg-hover)";
    const ratio = count / maxCount;

    if (ratio <= 0.25) return "#0e4429";
    if (ratio <= 0.5) return "#006d32";
    if (ratio <= 0.75) return "#26a641";
    return "#39d353";
  }

  // Format date for tooltip
  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }
</script>

<div class="mini-heatmap">
  {#if loading}
    <div class="flex items-center justify-center h-16">
      <div
        class="w-4 h-4 border-2 border-[var(--cc-text-muted)] border-t-transparent rounded-full animate-spin"
      ></div>
    </div>
  {:else}
    <!-- Header -->
    <div class="flex items-center justify-between mb-2">
      <span class="text-xs text-[var(--cc-text-muted)]">
        {i18n("activity_last_weeks", { weeks: "12" })}
      </span>
      <span class="text-xs font-medium text-[var(--cc-accent)]">
        {totalActivity}
        {i18n("activity_selections")}
      </span>
    </div>

    <!-- Heatmap grid -->
    <div class="heatmap-grid">
      {#each weeks as week}
        <div class="week-column">
          {#each week as day}
            <div
              class="day-cell"
              style="background-color: {getColor(day.count)}"
              title="{day.count} - {formatDate(day.date)}"
            ></div>
          {/each}
        </div>
      {/each}
    </div>

    <!-- Legend -->
    <div class="flex items-center justify-end gap-1 mt-2">
      <span class="text-[9px] text-[var(--cc-text-muted)]"
        >{i18n("activity_less")}</span
      >
      <div class="flex gap-0.5">
        <div
          class="legend-cell"
          style="background-color: var(--cc-bg-hover)"
        ></div>
        <div class="legend-cell" style="background-color: #0e4429"></div>
        <div class="legend-cell" style="background-color: #006d32"></div>
        <div class="legend-cell" style="background-color: #26a641"></div>
        <div class="legend-cell" style="background-color: #39d353"></div>
      </div>
      <span class="text-[9px] text-[var(--cc-text-muted)]"
        >{i18n("activity_more")}</span
      >
    </div>
  {/if}
</div>

<style>
  .mini-heatmap {
    padding: 0.75rem;
    background: var(--cc-bg-secondary);
    border: 1px solid var(--cc-border);
    border-radius: 0.75rem;
  }

  .heatmap-grid {
    display: flex;
    gap: 3px;
    justify-content: space-between;
  }

  .week-column {
    display: flex;
    flex-direction: column;
    gap: 3px;
    flex: 1;
  }

  .day-cell {
    aspect-ratio: 1;
    width: 100%;
    border-radius: 2px;
    cursor: default;
  }

  .day-cell:hover {
    outline: 1px solid var(--cc-text-muted);
  }

  .legend-cell {
    width: 10px;
    height: 10px;
    border-radius: 2px;
  }
</style>
