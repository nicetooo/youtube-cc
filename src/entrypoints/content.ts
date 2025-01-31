// entrypoints/example-ui.content/index.ts
import App from "./popup/App.svelte";
import { mount, unmount } from "svelte";
import "./popup/app.css";
import CaptionList from "@/lib/CaptionList.svelte";

export default defineContentScript({
  matches: ["<all_urls>"],
  runAt: "document_end",
  registration: "manifest",

  main(ctx) {
    console.log({ ctx });
    const ui = createIntegratedUi(ctx, {
      position: "inline",
      anchor: "body",

      onMount: (container) => {
        document.body.prepend(container);

        // Create the Svelte app inside the UI container
        mount(CaptionList, {
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
