<script lang="ts">
  import { i18n } from "$lib/i18n/index.svelte";
</script>

<svelte:head>
  <title>Terms of Service - CC Plus</title>
</svelte:head>

<div class="max-w-2xl mx-auto px-4 py-8">
  <h1 class="text-2xl font-bold mb-2">Terms of Service</h1>
  <p class="text-sm text-tertiary mb-8">Last updated: January 2025</p>

  <div class="space-y-8 text-secondary">
    <!-- Acceptance -->
    <section>
      <h2 class="text-lg font-semibold text-primary mb-3">
        1. Acceptance of Terms
      </h2>
      <p>
        By using CC Plus browser extension and website, you agree to these Terms
        of Service. If you do not agree, please do not use our services.
      </p>
    </section>

    <!-- Description -->
    <section>
      <h2 class="text-lg font-semibold text-primary mb-3">
        2. Description of Service
      </h2>
      <p>
        CC Plus is a language learning tool that helps you save vocabulary from
        YouTube videos, review words using spaced repetition, and sync your
        progress across devices.
      </p>
    </section>

    <!-- User Responsibilities -->
    <section>
      <h2 class="text-lg font-semibold text-primary mb-3">
        3. User Responsibilities
      </h2>
      <ul class="list-disc list-inside space-y-2">
        <li>
          You are responsible for maintaining the security of your account
        </li>
        <li>You agree not to misuse or abuse our services</li>
        <li>
          You agree not to attempt to reverse engineer the extension or website
        </li>
        <li>
          You must comply with YouTube's Terms of Service when using our
          extension
        </li>
      </ul>
    </section>

    <!-- Intellectual Property -->
    <section>
      <h2 class="text-lg font-semibold text-primary mb-3">
        4. Intellectual Property
      </h2>
      <p>
        The CC Plus extension, website, and associated content are protected by
        copyright. You may not copy, modify, or distribute our software without
        permission.
      </p>
    </section>

    <!-- Data Ownership -->
    <section>
      <h2 class="text-lg font-semibold text-primary mb-3">5. Your Data</h2>
      <p>
        You retain ownership of the vocabulary data you create. We only store
        and process your data to provide the service. See our
        <a href="/privacy" class="text-accent hover:underline">Privacy Policy</a
        >
        for details.
      </p>
    </section>

    <!-- Disclaimer -->
    <section>
      <h2 class="text-lg font-semibold text-primary mb-3">6. Disclaimer</h2>
      <p>
        CC Plus is provided "as is" without warranties of any kind. We do not
        guarantee uninterrupted access or that the service will be error-free.
        We are not affiliated with YouTube or Google.
      </p>
    </section>

    <!-- Limitation of Liability -->
    <section>
      <h2 class="text-lg font-semibold text-primary mb-3">
        7. Limitation of Liability
      </h2>
      <p>
        To the maximum extent permitted by law, CC Plus shall not be liable for
        any indirect, incidental, or consequential damages arising from your use
        of our services.
      </p>
    </section>

    <!-- Termination -->
    <section>
      <h2 class="text-lg font-semibold text-primary mb-3">8. Termination</h2>
      <p>
        We reserve the right to suspend or terminate access to our services at
        any time, for any reason, without notice. You may stop using our
        services at any time.
      </p>
    </section>

    <!-- Changes -->
    <section>
      <h2 class="text-lg font-semibold text-primary mb-3">
        9. Changes to Terms
      </h2>
      <p>
        We may update these Terms from time to time. Continued use of the
        service after changes constitutes acceptance of the new terms.
      </p>
    </section>

    <!-- Contact -->
    <section>
      <h2 class="text-lg font-semibold text-primary mb-3">10. Contact</h2>
      <p>
        Questions about these Terms? Contact us at
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
