<script>
  let input = $state();
  let captionQuery = $state("");

  const scripts = document.getElementsByTagName("script");
  Array.from(scripts).forEach((s) => {
    console.log(s.innerText);
  });
</script>

<div class="h-full max-w-sm overflow-hidden rounded-r-xl bg-gray-800 p-4">
  <input
    type="text"
    tabindex={0}
    bind:this={input}
    class="search-box bg-black bg-opacity-90"
    placeholder="Search Caption..."
    onclick={(e) => e.stopPropagation()}
    onkeypress={(e) => e.stopPropagation()}
    bind:value={captionQuery}
  />
  <div class="transcript">
    {#each [] as { start, content }}
      <div
        role="button"
        class="entry"
        id={`entry-${start}`}
        tabindex="0"
        onclick={() => toTimeStamp(start)}
        onkeypress={(e) =>
          (e.key === "Enter" || e.key === " ") && toTimeStamp(start)}
      >
        <span class="timestamp">[{formatTimestamp(start)}]</span>
        <span class="text">{content}</span>
      </div>
    {/each}
  </div>
</div>
