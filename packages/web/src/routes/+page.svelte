<script lang="ts">
  // import { type Word } from '@aspect/shared/types'
</script>

<svelte:head>
  <title>CC Plus - YouTube Vocabulary Builder</title>
</svelte:head>

<div class="max-w-4xl mx-auto px-6 py-16">
  <section class="text-center mb-16">
    <h1 class="text-5xl font-bold mb-6">
      Learn Languages with
      <span class="text-[#3ea6ff]">YouTube</span>
    </h1>
    <p class="text-xl text-white/70 mb-8">
      Save words from videos, sync across devices, master vocabulary.
    </p>
    <div class="flex gap-4 justify-center">
      <a
        href="https://chrome.google.com/webstore"
        class="bg-[#3ea6ff] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#65b8ff] transition"
      >
        Install Extension
      </a>
      <button
        class="border border-white/20 px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition"
      >
        Sign in with Google
      </button>
    </div>
  </section>

  <section class="grid md:grid-cols-3 gap-8">
    <div class="bg-white/5 rounded-xl p-6">
      <div class="text-3xl mb-4">📝</div>
      <h3 class="text-lg font-semibold mb-2">Save Words</h3>
      <p class="text-white/60">
        Click any word in subtitles to save it with context and timestamp.
      </p>
    </div>
    <div class="bg-white/5 rounded-xl p-6">
      <div class="text-3xl mb-4">🔄</div>
      <h3 class="text-lg font-semibold mb-2">Sync Everywhere</h3>
      <p class="text-white/60">
        Access your vocabulary on any device. Real-time sync with Firebase.
      </p>
    </div>
    <div class="bg-white/5 rounded-xl p-6">
      <div class="text-3xl mb-4">🎯</div>
      <h3 class="text-lg font-semibold mb-2">Smart Review</h3>
      <p class="text-white/60">
        Spaced repetition flashcards to help you remember words forever.
      </p>
    </div>
  </section>
</div>
