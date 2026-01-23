<script lang="ts">
  import { i18n } from "$lib/i18n/index.svelte";
  import type { Word } from "@aspect/shared/types";

  // Daily activity data structure
  interface DailyActivityData {
    date: string;
    selectionCount: number;
    wordsAdded: number;
  }

  // Activity data map by date (YYYY-MM-DD)
  type ActivityMap = Record<string, DailyActivityData>;

  interface Props {
    words: Word[];
    activity?: ActivityMap;
  }

  let { words, activity = {} }: Props = $props();

  // Convert locale format from underscore to hyphen (zh_CN -> zh-CN)
  const bcp47Locale = $derived(i18n.locale.replace("_", "-"));

  // Generate activity data for the past year (52 weeks + current week)
  const activityData = $derived(() => {
    const now = new Date();
    const oneYearAgo = new Date(now);
    oneYearAgo.setFullYear(now.getFullYear() - 1);

    // Count words added per day (from words list)
    const wordsAddedMap = new Map<string, number>();
    for (const word of words) {
      const date = new Date(word.createdAt).toISOString().split("T")[0];
      wordsAddedMap.set(date, (wordsAddedMap.get(date) || 0) + 1);
    }

    // Merge with activity data from extension (selection count)
    const dayCountMap = new Map<string, number>();

    // Add words added counts
    for (const [date, count] of wordsAddedMap) {
      dayCountMap.set(date, count);
    }

    // Add selection counts from activity data
    for (const [date, data] of Object.entries(activity)) {
      const existing = dayCountMap.get(date) || 0;
      // Use selectionCount as the primary activity indicator
      const activityData = data as { selectionCount?: number };
      dayCountMap.set(date, existing + (activityData.selectionCount || 0));
    }

    // Generate data for the last 52 weeks (364 days)
    const weeks: { date: string; count: number; dayOfWeek: number }[][] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Start from 52 weeks ago, aligned to Sunday
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 364 - today.getDay());

    let currentWeek: { date: string; count: number; dayOfWeek: number }[] = [];

    for (let i = 0; i <= 364 + today.getDay(); i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];
      const dayOfWeek = date.getDay();

      currentWeek.push({
        date: dateStr,
        count: dayCountMap.get(dateStr) || 0,
        dayOfWeek,
      });

      if (dayOfWeek === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Push remaining days
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  });

  // Find max count for color scaling
  const maxCount = $derived(() => {
    let max = 0;
    for (const week of activityData()) {
      for (const day of week) {
        if (day.count > max) max = day.count;
      }
    }
    return Math.max(max, 1);
  });

  // Get color based on activity level (0-4)
  function getColor(count: number): string {
    if (count === 0) return "var(--bg-tertiary)";
    const max = maxCount();
    const ratio = count / max;

    if (ratio <= 0.25) return "#0e4429";
    if (ratio <= 0.5) return "#006d32";
    if (ratio <= 0.75) return "#26a641";
    return "#39d353";
  }

  // Month labels
  const monthLabels = $derived(() => {
    const labels: { month: string; index: number }[] = [];
    let lastMonth = -1;

    for (let i = 0; i < activityData().length; i++) {
      const week = activityData()[i];
      if (week.length > 0) {
        const date = new Date(week[0].date);
        const month = date.getMonth();
        if (month !== lastMonth) {
          labels.push({
            month: date.toLocaleDateString(bcp47Locale, { month: "short" }),
            index: i,
          });
          lastMonth = month;
        }
      }
    }

    return labels;
  });

  // Day labels
  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

  // Calculate total contributions
  const totalContributions = $derived(() => {
    let total = 0;
    for (const week of activityData()) {
      for (const day of week) {
        total += day.count;
      }
    }
    return total;
  });

  // Format date for tooltip
  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString(bcp47Locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
</script>

<div class="activity-heatmap">
  <div class="heatmap-header">
    <span class="text-sm text-secondary">
      {i18n.t("stats_activity_total", { count: totalContributions() })}
    </span>
  </div>

  <div class="heatmap-container">
    <!-- Day labels -->
    <div class="day-labels">
      {#each dayLabels as label}
        <span class="text-xs text-tertiary">{label}</span>
      {/each}
    </div>

    <div class="heatmap-content">
      <!-- Month labels -->
      <div class="month-labels">
        {#each monthLabels() as { month, index }}
          <span class="text-xs text-tertiary" style="grid-column: {index + 1}">
            {month}
          </span>
        {/each}
      </div>

      <!-- Heatmap grid -->
      <div class="heatmap-grid">
        {#each activityData() as week, weekIndex}
          <div class="week-column">
            {#each week as day}
              <div
                class="day-cell"
                style="background-color: {getColor(day.count)}"
                title="{day.count} {i18n.t(
                  'stats_activity_words'
                )} - {formatDate(day.date)}"
              ></div>
            {/each}
          </div>
        {/each}
      </div>
    </div>
  </div>

  <!-- Legend -->
  <div class="heatmap-legend">
    <span class="text-xs text-tertiary">{i18n.t("stats_activity_less")}</span>
    <div class="legend-cells">
      <div
        class="legend-cell"
        style="background-color: var(--bg-tertiary)"
      ></div>
      <div class="legend-cell" style="background-color: #0e4429"></div>
      <div class="legend-cell" style="background-color: #006d32"></div>
      <div class="legend-cell" style="background-color: #26a641"></div>
      <div class="legend-cell" style="background-color: #39d353"></div>
    </div>
    <span class="text-xs text-tertiary">{i18n.t("stats_activity_more")}</span>
  </div>
</div>

<style>
  .activity-heatmap {
    padding: 1rem;
  }

  .heatmap-header {
    margin-bottom: 0.75rem;
  }

  .heatmap-container {
    display: flex;
    gap: 0.5rem;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .day-labels {
    display: flex;
    flex-direction: column;
    gap: 1px;
    padding-top: 20px;
  }

  .day-labels span {
    height: 11px;
    line-height: 11px;
    font-size: 9px;
  }

  .heatmap-content {
    flex: 1;
    min-width: 0;
  }

  .month-labels {
    display: grid;
    grid-template-columns: repeat(53, 11px);
    gap: 2px;
    height: 16px;
    margin-bottom: 4px;
  }

  .month-labels span {
    font-size: 9px;
    white-space: nowrap;
  }

  .heatmap-grid {
    display: flex;
    gap: 2px;
  }

  .week-column {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .day-cell {
    width: 11px;
    height: 11px;
    border-radius: 2px;
    cursor: pointer;
    transition: transform 0.1s ease;
  }

  .day-cell:hover {
    transform: scale(1.2);
    outline: 1px solid var(--text-secondary);
  }

  .heatmap-legend {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }

  .legend-cells {
    display: flex;
    gap: 2px;
  }

  .legend-cell {
    width: 11px;
    height: 11px;
    border-radius: 2px;
  }
</style>
