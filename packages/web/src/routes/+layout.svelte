<script lang="ts">
  import "../app.css";
  import Nav from "$lib/components/Nav.svelte";
  import { page } from "$app/stores";
  import { authStore } from "$lib/stores/auth.svelte";
  import { wordsStore } from "$lib/stores/words.svelte";

  let { children } = $props();

  // Check if on landing page (show different layout)
  const isLanding = $derived($page.url.pathname === "/");

  // Sync words store with auth state
  $effect(() => {
    const userId = authStore.user?.uid ?? null;
    wordsStore.setUser(userId);
  });
</script>

<div class="min-h-screen" style="background-color: var(--bg-primary);">
  {#if !isLanding}
    <Nav />
  {/if}

  <main class={isLanding ? "" : "pb-20 sm:pb-0"}>
    {@render children()}
  </main>
</div>
