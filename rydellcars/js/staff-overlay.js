(function () {
  const STAFF = window.RYDELL_STAFF || [];
  const OVERLAYS = window.RYDELL_STAFF_OVERLAYS || {};
  const BRANDON_ASPECT = window.BRANDON_CUTOUT_ASPECT || 1295 / 1097;
  const overlayCopy = window.staffOverlayCopy || function () {
    return { line1: "", line2: "", line3: "", line4: "" };
  };
  const INTERVAL_MS = 5000;
  const FADE_MS = 450;

  const canvas = document.getElementById("staffCanvas");
  const staffImage = document.getElementById("staffImage");
  const overlayLayer = document.getElementById("overlayLayer");

  if (!canvas || !staffImage || !overlayLayer || STAFF.length === 0) return;

  let index = 0;
  let timer = null;
  let fading = false;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function markerLines(marker, person) {
    const copy = overlayCopy(person);
    return {
      line1: marker.line1 || copy.line1,
      line2: marker.line2 || copy.line2,
      line3: marker.line3 || copy.line3,
      line4: marker.line4 || copy.line4
    };
  }

  function brandonCutoutHeight() {
    const style = getComputedStyle(canvas);
    const paddingX =
      parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    const paddingY =
      parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    const maxW = Math.max(0, canvas.clientWidth - paddingX);
    const maxH = Math.max(0, canvas.clientHeight - paddingY);

    let height = maxH;
    let width = height * BRANDON_ASPECT;
    if (width > maxW) {
      width = maxW;
      height = width / BRANDON_ASPECT;
    }

    return height;
  }

  function syncCutoutHeight() {
    const height = brandonCutoutHeight();
    if (height > 0) {
      canvas.style.setProperty("--staff-cutout-height", height + "px");
    }
  }

  function renderOverlay(person) {
    overlayLayer.innerHTML = "";
    const markers = OVERLAYS[person.id];
    if (!markers || markers.length === 0) return;

    markers.forEach((marker) => {
      const lines = markerLines(marker, person);
      const el = document.createElement("div");
      el.className = "overlay-marker";
      el.style.left = marker.x + "%";
      el.style.top = marker.y + "%";
      el.innerHTML =
        '<div class="overlay-marker-text">' +
        '<span class="overlay-line overlay-line--name">' +
        escapeHtml(lines.line1) +
        '</span><span class="overlay-line overlay-line--store">' +
        escapeHtml(lines.line2) +
        '</span><span class="overlay-line overlay-line--role">' +
        escapeHtml(lines.line3) +
        '</span><span class="overlay-line overlay-line--since">' +
        escapeHtml(lines.line4) +
        "</span></div>";
      overlayLayer.appendChild(el);
    });
  }

  function applyStaff(i) {
    const person = STAFF[i];
    if (!person) return;

    staffImage.src = person.image;
    staffImage.alt = person.name + " — Rydell team member";
    canvas.setAttribute("aria-label", "Team spotlight: " + person.name);
    renderOverlay(person);
  }

  function transitionTo(nextIndex) {
    if (fading || nextIndex === index) return;

    fading = true;
    canvas.classList.add("is-fading");

    window.setTimeout(() => {
      index = nextIndex;
      applyStaff(index);
      requestAnimationFrame(() => {
        canvas.classList.remove("is-fading");
        fading = false;
      });
    }, FADE_MS);
  }

  function advance() {
    transitionTo((index + 1) % STAFF.length);
  }

  function startRotation() {
    clearInterval(timer);
    timer = window.setInterval(advance, INTERVAL_MS);
  }

  applyStaff(index);
  syncCutoutHeight();
  startRotation();

  staffImage.addEventListener("load", syncCutoutHeight);
  window.addEventListener("resize", syncCutoutHeight);

  if (typeof ResizeObserver !== "undefined") {
    const ro = new ResizeObserver(syncCutoutHeight);
    ro.observe(canvas);
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      clearInterval(timer);
      timer = null;
    } else if (!timer) {
      startRotation();
    }
  });
})();
