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

  // Get local date string in YYYY-MM-DD format (matches storage format)
  function toLocalDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Generate activity data for the current calendar year (Jan 1 - Dec 31)
  const activityData = $derived(() => {
    const now = new Date();
    const currentYear = now.getFullYear();

    // Count words added per day (from words list)
    const wordsAddedMap = new Map<string, number>();
    for (const word of words) {
      const date = toLocalDateString(new Date(word.createdAt));
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
      const actData = data as { selectionCount?: number };
      dayCountMap.set(date, existing + (actData.selectionCount || 0));
    }

    // Generate data for the current year (Jan 1 - Dec 31)
    const weeks: {
      date: string;
      count: number;
      dayOfWeek: number;
      hidden: boolean;
    }[][] = [];

    // Start from Jan 1 of current year
    const startDate = new Date(currentYear, 0, 1);
    // End at Dec 31 of current year
    const endDate = new Date(currentYear, 11, 31);

    // Align to previous Sunday if Jan 1 is not Sunday
    const alignedStart = new Date(startDate);
    if (alignedStart.getDay() !== 0) {
      alignedStart.setDate(alignedStart.getDate() - alignedStart.getDay());
    }

    let currentWeek: {
      date: string;
      count: number;
      dayOfWeek: number;
      hidden: boolean;
    }[] = [];
    const current = new Date(alignedStart);

    while (current <= endDate || currentWeek.length > 0) {
      const dateStr = toLocalDateString(current);
      const dayOfWeek = current.getDay();
      const isInYear = current.getFullYear() === currentYear;

      currentWeek.push({
        date: dateStr,
        count: isInYear ? dayCountMap.get(dateStr) || 0 : 0,
        dayOfWeek,
        hidden: !isInYear,
      });

      if (dayOfWeek === 6) {
        weeks.push(currentWeek);
        currentWeek = [];

        // Stop after completing the week that contains Dec 31
        if (current > endDate) break;
      }

      current.setDate(current.getDate() + 1);
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

  // Get color based on activity level - brighter colors for dark theme
  function getColor(count: number): string {
    if (count === 0) return "var(--bg-tertiary)";
    const max = maxCount();
    const ratio = count / max;

    // Use brighter greens for better visibility on dark backgrounds
    if (ratio <= 0.25) return "#196c35";
    if (ratio <= 0.5) return "#239a4d";
    if (ratio <= 0.75) return "#2fcb5f";
    return "#57e87a";
  }

  // Month labels - show year for January to distinguish between years
  const monthLabels = $derived(() => {
    const labels: { month: string; index: number }[] = [];
    let lastMonth = -1;
    let lastYear = -1;

    for (let i = 0; i < activityData().length; i++) {
      const week = activityData()[i];
      if (week.length > 0) {
        const date = new Date(week[0].date);
        const month = date.getMonth();
        const year = date.getFullYear();

        if (month !== lastMonth || year !== lastYear) {
          // Show year for January or first month to distinguish years
          const showYear = month === 0 || labels.length === 0;
          const monthStr = date.toLocaleDateString(bcp47Locale, {
            month: "short",
          });

          labels.push({
            month: showYear
              ? `${monthStr} '${String(year).slice(2)}`
              : monthStr,
            index: i,
          });
          lastMonth = month;
          lastYear = year;
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
      <!-- Month labels - simplified -->
      <div class="month-labels">
        {#each monthLabels() as { month }}
          <span class="text-xs text-tertiary">
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
                class:hidden={day.hidden}
                style="background-color: {day.hidden
                  ? 'transparent'
                  : getColor(day.count)}"
                title={day.hidden
                  ? ""
                  : `${day.count} ${i18n.t("stats_activity_words")} - ${formatDate(day.date)}`}
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
      <div class="legend-cell" style="background-color: #196c35"></div>
      <div class="legend-cell" style="background-color: #239a4d"></div>
      <div class="legend-cell" style="background-color: #2fcb5f"></div>
      <div class="legend-cell" style="background-color: #57e87a"></div>
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
  }

  .day-labels {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-top: 20px;
    flex-shrink: 0;
  }

  .day-labels span {
    height: 10px;
    line-height: 10px;
    font-size: 9px;
  }

  .heatmap-content {
    flex: 1;
    min-width: 0;
  }

  .month-labels {
    display: flex;
    justify-content: space-between;
    height: 16px;
    margin-bottom: 4px;
    padding-right: 2px;
  }

  .month-labels span {
    font-size: 9px;
    white-space: nowrap;
  }

  .heatmap-grid {
    display: flex;
    gap: 2px;
    justify-content: space-between;
  }

  .week-column {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
  }

  .day-cell {
    aspect-ratio: 1;
    width: 100%;
    border-radius: 2px;
    cursor: pointer;
    transition: transform 0.1s ease;
  }

  .day-cell:hover:not(.hidden) {
    transform: scale(1.2);
    outline: 1px solid var(--text-secondary);
  }

  .day-cell.hidden {
    visibility: hidden;
    cursor: default;
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
