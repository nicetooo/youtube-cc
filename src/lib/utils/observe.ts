export function observeNodeAdd(callback: () => void) {
  let needCheck = true;
  let observer: MutationObserver;

  const observe = () => {
    console.log("observe");
    observer = new MutationObserver((mutationsList, observer) => {
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
    if (!needCheck) {
      requestAnimationFrame(checkElement);
      return;
    }
    callback();

    needCheck = false;
    requestAnimationFrame(checkElement);
  }

  observe();
  checkElement();

  return () => {
    console.log("observer disconnected");
    observer.disconnect();
    needCheck = false;
  };
}
