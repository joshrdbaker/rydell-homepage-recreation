(function () {
  const STAFF = window.RYDELL_STAFF || [];
  const OVERLAYS = window.RYDELL_STAFF_OVERLAYS || {};
  const BRANDON_ASPECT = window.BRANDON_CUTOUT_ASPECT || 1295 / 1097;
  const MIN_CUTOUT_HEIGHT = 120;

  const canvas = document.getElementById("staffCanvas");
  const staffImage = document.getElementById("staffImage");
  const overlayLayer = document.getElementById("overlayLayer");

  if (!canvas || !staffImage || !overlayLayer) return;

  const person =
    STAFF.find(function (member) {
      return member.id === "brandon";
    }) || STAFF[0];

  if (!person) return;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function getBoundsElement() {
    return canvas.closest(".brandon-hero__spotlight") || canvas;
  }

  function getBrandonScale() {
    const spotlight = canvas.closest(".brandon-hero__spotlight");
    if (!spotlight) return 1;

    const scale = parseFloat(getComputedStyle(spotlight).getPropertyValue("--brandon-scale"));
    return Number.isFinite(scale) && scale > 0 ? scale : 1;
  }

  function brandonCutoutHeight() {
    const bounds = getBoundsElement();
    const canvasStyle = getComputedStyle(canvas);
    const paddingX =
      parseFloat(canvasStyle.paddingLeft) + parseFloat(canvasStyle.paddingRight);
    const paddingY =
      parseFloat(canvasStyle.paddingTop) + parseFloat(canvasStyle.paddingBottom);
    const maxW = Math.max(0, canvas.clientWidth - paddingX);
    const maxH = Math.max(0, bounds.clientHeight - paddingY);
    const scale = getBrandonScale();

    if (maxW <= 0 || maxH <= 0) return 0;

    const maxVisualHeight = Math.max(0, maxH - 12);
    let height = maxVisualHeight / scale;
    let width = height * BRANDON_ASPECT;

    if (width > maxW) {
      width = maxW;
      height = width / BRANDON_ASPECT;
    }

    return height;
  }

  function syncCutoutHeight() {
    const height = brandonCutoutHeight();
    if (height < MIN_CUTOUT_HEIGHT) return;

    canvas.style.setProperty("--staff-cutout-height", height + "px");
  }

  function renderOverlay() {
    if (document.querySelector(".brandon-hero__name-tag")) return;

    overlayLayer.innerHTML = "";
    const markers = OVERLAYS[person.id];
    if (!markers || markers.length === 0) return;

    markers.forEach(function (marker) {
      const el = document.createElement("div");
      el.className = "overlay-marker";
      el.style.left = marker.x + "%";
      el.style.top = marker.y + "%";
      el.innerHTML =
        '<div class="overlay-marker-text">' +
        '<span class="overlay-line overlay-line--name">' +
        escapeHtml(marker.line1) +
        '</span><span class="overlay-line overlay-line--store">' +
        escapeHtml(marker.line2) +
        '</span><span class="overlay-line overlay-line--role">' +
        escapeHtml(marker.line3) +
        '</span><span class="overlay-line overlay-line--since">' +
        escapeHtml(marker.line4) +
        "</span></div>";
      overlayLayer.appendChild(el);
    });
  }

  staffImage.src = person.image;
  staffImage.alt = person.name + " — Rydell team member";
  canvas.setAttribute("aria-label", "Team spotlight: " + person.name);
  renderOverlay();

  function scheduleSync() {
    window.requestAnimationFrame(syncCutoutHeight);
  }

  scheduleSync();
  staffImage.addEventListener("load", scheduleSync);
  window.addEventListener("resize", scheduleSync);
  window.addEventListener("hero-brandon-layout-change", scheduleSync);

  if (typeof ResizeObserver !== "undefined") {
    const bounds = getBoundsElement();
    const ro = new ResizeObserver(scheduleSync);
    ro.observe(bounds);
    ro.observe(canvas);
  }
})();
