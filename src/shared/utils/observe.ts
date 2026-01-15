export function observeNodeAdd(callback: () => void) {
  let needCheck = true;
  let isRunning = true;
  let rafId: number | null = null;
  let observer: MutationObserver;

  const observe = () => {
    observer = new MutationObserver((mutationsList, _observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          if (mutation.addedNodes.length) {
            needCheck = true;
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true, // 监听子元素的添加/删除
      subtree: true, // 监听整个 DOM 树的变化
    });
  };

  function checkElement() {
    // 如果已停止，不再调度下一帧
    if (!isRunning) {
      return;
    }

    if (needCheck) {
      callback();
      needCheck = false;
    }

    rafId = requestAnimationFrame(checkElement);
  }

  observe();
  checkElement();

  return () => {
    // 停止 RAF 循环
    isRunning = false;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    // 断开 MutationObserver
    observer.disconnect();
  };
}
