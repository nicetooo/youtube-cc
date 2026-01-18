<script lang="ts">
  import { goto } from "$app/navigation";
  import { authStore } from "$lib/stores/auth.svelte";
  import { i18n } from "$lib/i18n/index.svelte";

  interface Props {
    open: boolean;
    onClose: () => void;
  }

  let { open, onClose }: Props = $props();

  let mode = $state<"login" | "register" | "reset">("login");
  let email = $state("");
  let password = $state("");
  let displayName = $state("");
  let loading = $state(false);
  let error = $state<string | null>(null);

  async function handleGoogleLogin() {
    loading = true;
    error = null;
    try {
      await authStore.loginWithGoogle();
      onClose();
      goto("/words");
    } catch (e) {
      error = (e as Error).message;
    } finally {
      loading = false;
    }
  }

  async function handleEmailSubmit() {
    if (!email || !password) return;

    loading = true;
    error = null;
    try {
      if (mode === "login") {
        await authStore.loginWithEmail(email, password);
      } else if (mode === "register") {
        await authStore.registerWithEmail(
          email,
          password,
          displayName || undefined
        );
      }
      onClose();
      goto("/words");
    } catch (e) {
      error = (e as Error).message;
    } finally {
      loading = false;
    }
  }

  async function handlePasswordReset() {
    if (!email) return;

    loading = true;
    error = null;
    try {
      await authStore.sendPasswordReset(email);
      error = "Password reset email sent!";
    } catch (e) {
      error = (e as Error).message;
    } finally {
      loading = false;
    }
  }

  async function handleAnonymousLogin() {
    loading = true;
    error = null;
    try {
      await authStore.loginAnonymously();
      onClose();
      goto("/words");
    } catch (e) {
      error = (e as Error).message;
    } finally {
      loading = false;
    }
  }

  function handleBackdropClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  function resetForm() {
    email = "";
    password = "";
    displayName = "";
    error = null;
  }

  $effect(() => {
    if (!open) {
      resetForm();
      mode = "login";
    }
  });
</script>

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div class="modal-backdrop" onclick={handleBackdropClick}>
    <div class="modal">
      <button class="close-btn" onclick={onClose} aria-label="Close">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M18 6 6 18" /><path d="m6 6 12 12" />
        </svg>
      </button>

      <h2 class="title">
        {#if mode === "login"}
          Sign In
        {:else if mode === "register"}
          Create Account
        {:else}
          Reset Password
        {/if}
      </h2>

      {#if error}
        <div class="error">{error}</div>
      {/if}

      {#if mode !== "reset"}
        <!-- Google Login -->
        <button
          class="google-btn"
          onclick={handleGoogleLogin}
          disabled={loading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
          >
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </button>

        <div class="divider">
          <span>or</span>
        </div>

        <!-- Email Form -->
        <form
          onsubmit={(e) => {
            e.preventDefault();
            handleEmailSubmit();
          }}
        >
          {#if mode === "register"}
            <input
              type="text"
              class="input"
              placeholder="Display name (optional)"
              bind:value={displayName}
              disabled={loading}
            />
          {/if}

          <input
            type="email"
            class="input"
            placeholder="Email"
            bind:value={email}
            required
            disabled={loading}
          />

          <input
            type="password"
            class="input"
            placeholder="Password"
            bind:value={password}
            required
            minlength="6"
            disabled={loading}
          />

          <button
            type="submit"
            class="btn btn-primary w-full"
            disabled={loading}
          >
            {mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div class="links">
          {#if mode === "login"}
            <button class="link" onclick={() => (mode = "register")}>
              Create an account
            </button>
            <button class="link" onclick={() => (mode = "reset")}>
              Forgot password?
            </button>
          {:else}
            <button class="link" onclick={() => (mode = "login")}>
              Already have an account?
            </button>
          {/if}
        </div>

        <div class="divider">
          <span>or</span>
        </div>

        <!-- Anonymous Login -->
        <button
          class="anon-btn"
          onclick={handleAnonymousLogin}
          disabled={loading}
        >
          Try without account
        </button>
      {:else}
        <!-- Password Reset -->
        <form
          onsubmit={(e) => {
            e.preventDefault();
            handlePasswordReset();
          }}
        >
          <input
            type="email"
            class="input"
            placeholder="Email"
            bind:value={email}
            required
            disabled={loading}
          />

          <button
            type="submit"
            class="btn btn-primary w-full"
            disabled={loading}
          >
            Send Reset Email
          </button>
        </form>

        <div class="links">
          <button class="link" onclick={() => (mode = "login")}>
            Back to sign in
          </button>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal {
    position: relative;
    width: 100%;
    max-width: 400px;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 1rem;
    padding: 2rem;
  }

  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: transparent;
    border: none;
    color: var(--text-tertiary);
    cursor: pointer;
    padding: 0.25rem;
    border-radius: 0.25rem;
    transition: color 0.15s;
  }

  .close-btn:hover {
    color: var(--text-primary);
  }

  .title {
    font-size: 1.5rem;
    font-weight: 600;
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .error {
    background: var(--error);
    color: white;
    padding: 0.75rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    text-align: center;
  }

  .google-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: white;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #333;
    cursor: pointer;
    transition: background 0.15s;
  }

  .google-btn:hover:not(:disabled) {
    background: #f5f5f5;
  }

  .google-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .divider {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 1.5rem 0;
    color: var(--text-tertiary);
    font-size: 0.75rem;
  }

  .divider::before,
  .divider::after {
    content: "";
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .input {
    width: 100%;
    padding: 0.75rem;
    font-size: 0.875rem;
    background: var(--bg-primary);
    color: var(--text-primary);
    border: 1px solid var(--border);
    border-radius: 0.5rem;
  }

  .input:focus {
    outline: none;
    border-color: var(--accent);
  }

  .input:disabled {
    opacity: 0.6;
  }

  .w-full {
    width: 100%;
  }

  .links {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
  }

  .link {
    background: transparent;
    border: none;
    color: var(--accent);
    font-size: 0.875rem;
    cursor: pointer;
    padding: 0;
  }

  .link:hover {
    text-decoration: underline;
  }

  .anon-btn {
    width: 100%;
    padding: 0.75rem;
    background: transparent;
    border: 1px solid var(--border);
    border-radius: 0.5rem;
    color: var(--text-secondary);
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.15s;
  }

  .anon-btn:hover:not(:disabled) {
    background: var(--bg-tertiary);
    color: var(--text-primary);
  }

  .anon-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>
