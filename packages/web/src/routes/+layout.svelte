<script lang="ts">
  import "../app.css";
  import Nav from "$lib/components/Nav.svelte";
  import PWAReloadPrompt from "$lib/components/PWAReloadPrompt.svelte";
  import PWAInstallPrompt from "$lib/components/PWAInstallPrompt.svelte";
  import { page } from "$app/stores";
  import { authStore } from "$lib/stores/auth.svelte";
  import { wordsStore } from "$lib/stores/words.svelte";

  let { children } = $props();

  // Check if on landing page (show different layout)
  const isLanding = $derived($page.url.pathname === "/");

  // Sync words store with auth state
  // 未登录用户也能使用 IndexedDB 存储
  $effect(() => {
    const userId = authStore.user?.uid ?? null;
    const isAnonymous = authStore.isAnonymous; // 未登录或匿名用户都为 true
    wordsStore.setUser(userId, isAnonymous);
  });
</script>

<div class="min-h-screen" style="background-color: var(--bg-primary);">
  {#if !isLanding}
    <Nav />
  {/if}

  <main class={isLanding ? "" : "pb-20 sm:pb-0"}>
    {@render children()}
  </main>

  <PWAReloadPrompt />
  <PWAInstallPrompt />
</div>
