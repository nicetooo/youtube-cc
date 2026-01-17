<script lang="ts">
  import "../app.css";

  let { children } = $props();
</script>

<div class="min-h-screen bg-[#0f0f0f] text-white">
  <header class="border-b border-white/10 px-6 py-4">
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      <a href="/" class="text-xl font-bold text-[#3ea6ff]"> CC Plus </a>
      <nav class="flex gap-6">
        <a href="/words" class="text-white/70 hover:text-white transition"
          >My Words</a
        >
        <a href="/review" class="text-white/70 hover:text-white transition"
          >Review</a
        >
      </nav>
    </div>
  </header>

  <main>
    {@render children()}
  </main>
</div>
