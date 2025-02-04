import "~/assets/tailwind.css";
import { mount, unmount } from "svelte";
import ContentMain from "@/lib/ContentMain.svelte";
import { waitFor } from "@/lib/utils/wait";

export default defineContentScript({
  matches: ["*://www.youtube.com/*", "*://youtube.com/*"],
  runAt: "document_end",
  registration: "manifest",

  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: "inline",
      anchor: "body",

      onMount: (container) => {
        waitFor<HTMLDivElement>(
          () => document.getElementById("secondary"),
          0
        ).then((sec) => {
          sec?.prepend(container);
        });
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
