<script lang="ts">
  let currentIndex = $state(0)
  let showAnswer = $state(false)
  
  // TODO: Fetch review words from Firebase
  let reviewWords = $state<Array<{ id: string; text: string; context: string; translation: string }>>([])
  
  function nextCard() {
    showAnswer = false
    currentIndex = (currentIndex + 1) % reviewWords.length
  }
  
  function markKnown() {
    // TODO: Update word status in Firebase
    nextCard()
  }
  
  function markUnknown() {
    // TODO: Update word status in Firebase
    nextCard()
  }
</script>

<svelte:head>
  <title>Review - CC Plus</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-6 py-8">
  <h1 class="text-3xl font-bold mb-8 text-center">Review</h1>
  
  {#if reviewWords.length === 0}
    <div class="text-center py-16 text-white/50">
      <p class="text-xl mb-4">No words to review</p>
      <p>Save some words first, then come back to review them.</p>
    </div>
  {:else}
    {@const word = reviewWords[currentIndex]}
    <div class="bg-white/5 rounded-2xl p-8 text-center">
      <div class="text-4xl font-bold mb-4">{word.text}</div>
      <div class="text-white/60 mb-8">{word.context}</div>
      
      {#if showAnswer}
        <div class="text-2xl text-[#3ea6ff] mb-8">{word.translation}</div>
        <div class="flex gap-4 justify-center">
          <button 
            onclick={markUnknown}
            class="px-6 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition"
          >
            Still Learning
          </button>
          <button 
            onclick={markKnown}
            class="px-6 py-3 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition"
          >
            Got It!
          </button>
        </div>
      {:else}
        <button 
          onclick={() => showAnswer = true}
          class="px-8 py-3 bg-[#3ea6ff] text-black rounded-lg font-medium hover:bg-[#65b8ff] transition"
        >
          Show Answer
        </button>
      {/if}
      
      <div class="mt-8 text-white/40 text-sm">
        {currentIndex + 1} / {reviewWords.length}
      </div>
    </div>
  {/if}
</div>
