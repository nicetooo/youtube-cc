export async function waitFor<T>(getter: () => any, timeout: number = 0) {
  let timeoutHandle: NodeJS.Timeout, intervalHandle: NodeJS.Timeout;

  return new Promise<T>((resolve, reject) => {
    if (timeout != 0) {
      timeoutHandle = setTimeout(() => {
        reject();
      }, timeout);
    }

    intervalHandle = setInterval(() => {
      const res = getter();
      if (res) {
        clearInterval(intervalHandle);
        clearTimeout(timeoutHandle);
        resolve(res);
      }
    }, 100);
  });
}
