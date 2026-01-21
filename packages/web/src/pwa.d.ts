/// <reference types="vite-plugin-pwa/client" />

declare module "virtual:pwa-register" {
  export interface RegisterSWOptions {
    immediate?: boolean;
    onNeedRefresh?: () => void;
    onOfflineReady?: () => void;
    onRegistered?: (
      registration: ServiceWorkerRegistration | undefined
    ) => void;
    onRegisteredSW?: (
      swUrl: string,
      registration: ServiceWorkerRegistration | undefined
    ) => void;
    onRegisterError?: (error: Error) => void;
  }

  export function useRegisterSW(options?: RegisterSWOptions): {
    needRefresh: { subscribe: (callback: (value: boolean) => void) => void };
    offlineReady: { subscribe: (callback: (value: boolean) => void) => void };
    updateServiceWorker: (reloadPage?: boolean) => Promise<void>;
  };
}
