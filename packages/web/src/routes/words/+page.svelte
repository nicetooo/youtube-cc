<script lang="ts">
  // TODO: Fetch words from Firebase
  let words = $state<Array<{ id: string; text: string; context: string; videoTitle: string }>>([])
</script>

<svelte:head>
  <title>My Words - CC Plus</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-6 py-8">
  <h1 class="text-3xl font-bold mb-8">My Words</h1>
  
  {#if words.length === 0}
    <div class="text-center py-16 text-white/50">
      <p class="text-xl mb-4">No words saved yet</p>
      <p>Start watching YouTube videos with CC Plus extension to save words.</p>
    </div>
  {:else}
    <div class="space-y-4">
      {#each words as word (word.id)}
        <div class="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition">
          <div class="font-semibold text-lg">{word.text}</div>
          <div class="text-white/60 text-sm mt-1">{word.context}</div>
          <div class="text-white/40 text-xs mt-2">{word.videoTitle}</div>
        </div>
      {/each}
    </div>
  {/if}
</div>
