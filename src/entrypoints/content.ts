import "~/assets/tailwind.css";
import { mount, unmount } from "svelte";
import ContentMain from "@/lib/ContentMain.svelte";
import { waitFor } from "@/lib/utils/wait";
import type { ContentScriptContext } from "wxt/client";

export default defineContentScript({
  matches: ["*://www.youtube.com/*", "*://youtube.com/*"],
  runAt: "document_end",
  registration: "manifest",

  main(ctx: ContentScriptContext) {
    const ui = createIntegratedUi(ctx, {
      position: "inline",
      anchor: "body",

      onMount: (container: HTMLElement) => {
        // Function to attach container to #secondary
        const attachToSecondary = async () => {
          const sec = await waitFor<HTMLDivElement>(
            () => document.getElementById("secondary") as HTMLDivElement,
            0
          );
          if (sec && !sec.contains(container)) {
            sec.prepend(container);
          }
        };

        // Attach initially
        attachToSecondary();

        // Observe body for #secondary re-creation (SPA navigation)
        const observer = new MutationObserver(() => {
          attachToSecondary();
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });

        // Create the Svelte app inside the UI container
        const app = mount(ContentMain, {
          target: container,
        });

        return { app, observer };
      },
      onRemove: (mounted: { app: any; observer: MutationObserver }) => {
        mounted.observer.disconnect();
        // Destroy the app when the UI is removed
        unmount(mounted.app);
      },
    });

    // Call mount to add the UI to the DOM
    ui.mount();
  },
});
