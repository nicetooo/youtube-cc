export async function waitFor<T extends Element>(
  getter: () => T | null | undefined,
  timeout: number = 0
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const element = getter();
    if (element) {
      resolve(element);
      return;
    }

    let timeoutHandle: NodeJS.Timeout;
    if (timeout > 0) {
      timeoutHandle = setTimeout(() => {
        observer.disconnect();
        reject(new Error("waitFor timeout"));
      }, timeout);
    }

    const observer = new MutationObserver(() => {
      const element = getter();
      if (element) {
        observer.disconnect();
        if (timeoutHandle) clearTimeout(timeoutHandle);
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}
