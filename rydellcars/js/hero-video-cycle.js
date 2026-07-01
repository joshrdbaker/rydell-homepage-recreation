(function () {
  var stack = document.querySelector("[data-hero-video-cycle]");
  if (!stack) return;

  var NEW_VIDEO =
    "https://www.rydellcars.com/static/brand-chevrolet/homepage/videos/Latest/bgVideo.mp4";

  /*
    Timestamps in bgVideo.mp4:
    - silveradoA: first Silverado clip
    - silveradoB: second (different) Silverado clip
    - equinoxGroup: trio of Equinoxes
  */
  var BG_STARTS = {
    silveradoA: 2,
    silveradoB: 8,
    equinoxGroup: 14
  };

  /* Archive truck clips are 4:3 inside 16:9 with black pillarboxing — show full frame. */
  var ARCHIVE_CLIP_SRCS = {
    "assets/hero-videos/1950.mp4": true,
    "assets/hero-videos/1960.mp4": true
  };

  var playlist = [
    { type: "old", src: "assets/hero-videos/1950.mp4", durationMs: 2500 },
    { type: "new", src: NEW_VIDEO, startAt: BG_STARTS.silveradoA, durationMs: 2000 },
    { type: "old", src: "assets/hero-videos/1960.mp4", durationMs: 2000 },
    { type: "new", src: NEW_VIDEO, startAt: BG_STARTS.silveradoB, durationMs: 2000 },
    { type: "old", src: "assets/hero-videos/1990.mp4", durationMs: 2000 },
    { type: "new", src: NEW_VIDEO, startAt: BG_STARTS.equinoxGroup, durationMs: 2000 }
  ];

  var videos = stack.querySelectorAll("[data-hero-video]");
  if (videos.length < 2 || playlist.length === 0) return;

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var activeIndex = 0;
  var playlistIndex = 0;
  var transitioning = false;
  var cutTimer = null;
  function clearCutTimer() {
    if (cutTimer) {
      window.clearTimeout(cutTimer);
      cutTimer = null;
    }
  }

  function startTimeFor(entry) {
    return entry.type === "new" ? (entry.startAt || 0) : 0;
  }

  function durationFor(entry) {
    var ms = Number(entry && entry.durationMs);
    return Number.isFinite(ms) && ms > 0 ? ms : 2000;
  }

  function scheduleCut() {
    clearCutTimer();
    if (prefersReducedMotion) return;
    var currentEntry = playlist[playlistIndex];

    cutTimer = window.setTimeout(function () {
      if (transitioning) return;
      transitioning = true;
      cutTo((playlistIndex + 1) % playlist.length);
    }, durationFor(currentEntry));
  }

  function playVideo(video) {
    var playAttempt = video.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(function () {});
    }
  }

  function syncArchiveClipClass(video, entry) {
    video.classList.toggle("is-archive-clip", !!(entry && ARCHIVE_CLIP_SRCS[entry.src]));
  }

  function loadClip(video, entry, done) {
    syncArchiveClipClass(video, entry);
    video.src = entry.src;
    video.load();

    function begin() {
      var startAt = startTimeFor(entry);
      if (startAt > 0) {
        video.currentTime = startAt;
      }
      playVideo(video);
      done();
    }

    if (video.readyState >= 1) {
      begin();
      return;
    }

    video.addEventListener("loadedmetadata", begin, { once: true });
  }

  function cutTo(nextIndex) {
    var outgoing = videos[activeIndex];
    var incoming = videos[1 - activeIndex];
    var entry = playlist[nextIndex];

    loadClip(incoming, entry, function () {
      incoming.classList.add("is-active");
      outgoing.classList.remove("is-active");
      outgoing.pause();
      activeIndex = 1 - activeIndex;
      playlistIndex = nextIndex;
      transitioning = false;
      scheduleCut();
    });
  }

  videos.forEach(function (video) {
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "");
    video.removeAttribute("loop");
  });

  videos[0].classList.add("is-active");

  loadClip(videos[0], playlist[0], function () {
    if (!prefersReducedMotion) {
      scheduleCut();
    }
  });
})();
