<script>
  const { video, videoCurrentTime } = $props();

  const skipVideo = () => {
    video.currentTime = 999;
  };

  $effect(() => {
    const ad = document.querySelector(".ytp-ad-player-overlay-layout");
    if (ad === null) {
      return;
    }
    skipVideo();
  });
</script>
