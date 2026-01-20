<script lang="ts">
  import { i18n } from "$lib/i18n/index.svelte";
</script>

<svelte:head>
  <title>Privacy Policy - CC Plus</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 py-8">
  <h1 class="text-2xl font-bold mb-2">Privacy Policy</h1>
  <p class="text-sm text-tertiary mb-8">Last updated: January 2025</p>

  <div class="space-y-8 text-secondary">
    <!-- Introduction -->
    <section>
      <h2 class="text-lg font-semibold text-primary mb-3">Introduction</h2>
      <p>
        CC Plus ("we", "our", or "us") is committed to protecting your privacy.
        This Privacy Policy explains how we collect, use, and safeguard your
        information when you use our browser extension and website.
      </p>
    </section>

    <!-- Data Collection -->
    <section>
      <h2 class="text-lg font-semibold text-primary mb-3">Data We Collect</h2>
      <ul class="list-disc list-inside space-y-2">
        <li>
          <strong>Vocabulary Data:</strong> Words you save, including context sentences
          and video sources. Stored locally in your browser by default.
        </li>
        <li>
          <strong>Account Information:</strong> If you sign in with Google, we receive
          your email and profile name for authentication purposes only.
        </li>
        <li>
          <strong>Usage Analytics:</strong> We use Google Analytics to collect anonymous
          usage statistics (page views, session duration) to improve our service.
        </li>
      </ul>
    </section>

    <!-- Data Storage -->
    <section>
      <h2 class="text-lg font-semibold text-primary mb-3">Data Storage</h2>
      <ul class="list-disc list-inside space-y-2">
        <li>
          <strong>Local Storage:</strong> Your vocabulary is stored locally in your
          browser (IndexedDB) and works offline.
        </li>
        <li>
          <strong>Cloud Sync (Optional):</strong> If you sign in, your data is synced
          to Firebase (Google Cloud) for cross-device access.
        </li>
      </ul>
    </section>

    <!-- Data Sharing -->
    <section>
      <h2 class="text-lg font-semibold text-primary mb-3">Data Sharing</h2>
      <p>
        We do <strong>not</strong> sell, trade, or share your personal data with third
        parties, except for the following service providers:
      </p>
      <ul class="list-disc list-inside space-y-2 mt-2">
        <li>
          <strong>Firebase (Google):</strong> Authentication and cloud storage
        </li>
        <li><strong>Google Analytics:</strong> Anonymous usage statistics</li>
      </ul>
    </section>

    <!-- Your Rights -->
    <section>
      <h2 class="text-lg font-semibold text-primary mb-3">Your Rights</h2>
      <ul class="list-disc list-inside space-y-2">
        <li>Access and export your vocabulary data at any time</li>
        <li>Delete your account and all associated data</li>
        <li>Use the service without an account (local storage only)</li>
      </ul>
    </section>

    <!-- Cookies -->
    <section>
      <h2 class="text-lg font-semibold text-primary mb-3">Cookies</h2>
      <p>
        We use essential cookies for authentication and preferences (theme,
        language). Google Analytics uses cookies for anonymous usage tracking.
      </p>
    </section>

    <!-- Changes -->
    <section>
      <h2 class="text-lg font-semibold text-primary mb-3">
        Changes to This Policy
      </h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you
        of any changes by posting the new policy on this page.
      </p>
    </section>

    <!-- Contact -->
    <section>
      <h2 class="text-lg font-semibold text-primary mb-3">Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy, please contact us at
        <a
          href="mailto:support@youtubecc.com"
          class="text-accent hover:underline"
        >
          support@youtubecc.com
        </a>
      </p>
    </section>
  </div>

  <!-- Back link -->
  <div class="mt-12 pt-6 border-t border-default">
    <a href="/settings" class="text-accent hover:underline text-sm">
      &larr; Back to Settings
    </a>
  </div>
</div>
