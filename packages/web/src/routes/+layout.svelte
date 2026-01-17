<script lang="ts">
  import "../app.css";
  import Nav from "$lib/components/Nav.svelte";
  import { page } from "$app/stores";

  let { children } = $props();

  // Check if on landing page (show different layout)
  const isLanding = $derived($page.url.pathname === "/");
</script>

<div class="min-h-screen" style="background-color: var(--bg-primary);">
  {#if !isLanding}
    <Nav />
  {/if}

  <main class={isLanding ? "" : "pb-20 sm:pb-0"}>
    {@render children()}
  </main>
</div>
