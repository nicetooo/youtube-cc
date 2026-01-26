<script lang="ts">
  import { onMount } from "svelte";
  import { detectDarkMode, onDarkModeChange } from "./theme-detect";

  interface Props {
    position: { x: number; y: number };
    onClick: () => void;
  }

  let { position, onClick }: Props = $props();

  // Theme detection - supports system, YouTube, and common dark mode patterns
  let isDarkMode = $state(detectDarkMode());

  // Trigger element for positioning
  let triggerEl: HTMLButtonElement | undefined = $state();

  // Adjusted position to keep trigger in viewport
  let adjustedPosition = $state({ x: 0, y: 0 });

  // Initialize position from props
  $effect(() => {
    adjustedPosition = { x: position.x, y: position.y };
  });

  onMount(() => {
    return onDarkModeChange((dark) => {
      isDarkMode = dark;
    });
  });

  // Adjust position when trigger is rendered
  $effect(() => {
    if (triggerEl) {
      const rect = triggerEl.getBoundingClientRect();
      const padding = 10;

      let newX = position.x;
      let newY = position.y;

      if (newX + rect.width > window.innerWidth - padding) {
        newX = window.innerWidth - rect.width - padding;
      }
      if (newX < padding) newX = padding;

      if (newY + rect.height > window.innerHeight - padding) {
        newY = position.y - rect.height - 10;
      }
      if (newY < padding) newY = padding;

      adjustedPosition = { x: newX, y: newY };
    }
  });

  function handleClick(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    onClick();
  }
</script>

<button
  bind:this={triggerEl}
  class="cc-plus-selection-trigger"
  class:dark={isDarkMode}
  style="left: {adjustedPosition.x}px; top: {adjustedPosition.y}px;"
  onclick={handleClick}
  title="Translate"
  aria-label="Translate selection"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="trigger-icon"
  >
    <path d="m5 8 6 6" />
    <path d="m4 14 6-6 2-3" />
    <path d="M2 5h12" />
    <path d="M7 2h1" />
    <path d="m22 22-5-10-5 10" />
    <path d="M14 18h6" />
  </svg>
</button>
