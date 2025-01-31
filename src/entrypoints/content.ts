import "~/assets/tailwind.css";
import { mount, unmount } from "svelte";
import "./popup/app.css";
import ContentMain from "@/lib/ContentMain.svelte";
import { waitFor } from "@/lib/utils/wait";

export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_end",
  registration: "manifest",

  main(ctx) {
    console.log({ ctx });
    const ui = createIntegratedUi(ctx, {
      position: "inline",
      anchor: "body",

      onMount: async (container) => {
        const sec = await waitFor<HTMLDivElement>(
          () => document.getElementById("secondary"),
          0
        );

        sec?.prepend(container);
        // Create the Svelte app inside the UI container
        mount(ContentMain, {
          target: container,
        });
      },
      onRemove: (app) => {
        // Destroy the app when the UI is removed
        unmount(app);
      },
    });

    // Call mount to add the UI to the DOM
    ui.mount();
  },
});
