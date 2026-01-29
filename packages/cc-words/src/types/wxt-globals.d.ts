// Global type declarations for WXT framework functions
// These are auto-injected by WXT at build time

import type { BackgroundDefinition } from "wxt/sandbox";
import type { ContentScriptDefinition } from "wxt/sandbox";
import type { ContentScriptContext } from "wxt/client";

declare global {
  /**
   * Define a background script entrypoint.
   * @see https://wxt.dev/api/wxt/sandbox.html#definebackground
   */
  function defineBackground<T extends BackgroundDefinition>(
    definition: T | (() => T | Promise<T>)
  ): T;

  /**
   * Define a content script entrypoint.
   * @see https://wxt.dev/api/wxt/sandbox.html#definecontentscript
   */
  function defineContentScript<T extends ContentScriptDefinition>(
    definition: T
  ): T;

  /**
   * Create an integrated UI for content scripts.
   * @see https://wxt.dev/guide/essentials/content-script-ui.html
   */
  function createIntegratedUi(
    ctx: ContentScriptContext,
    options: {
      position: "inline" | "overlay" | "modal";
      anchor?: string;
      onMount?: (container: HTMLElement) => any;
      onRemove?: (mounted: any) => void;
    }
  ): {
    mount: () => void;
    remove: () => void;
  };
}

export {};
