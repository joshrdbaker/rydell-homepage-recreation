/**
 * Continuous horizontal "racetrack" carousel — duplicated track, auto-scroll, drag, arrows.
 */
(function () {
  "use strict";

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function initRacetrackCarousel(root) {
    const viewport = root.querySelector("[data-racetrack-viewport]");
    const track = root.querySelector("[data-racetrack-track]");
    const prevBtn = root.querySelector("[data-racetrack-prev]");
    const nextBtn = root.querySelector("[data-racetrack-next]");

    if (!viewport || !track || track.children.length === 0) return;

    const originals = Array.from(track.children);
    originals.forEach((node) => {
      track.appendChild(node.cloneNode(true));
    });

    let offset = 0;
    let loopWidth = 0;
    let rafId = null;
    let paused = false;
    let dragging = false;
    let dragStartX = 0;
    let dragStartOffset = 0;
    const speed = Number(root.dataset.racetrackSpeed || 0.45);

    function measure() {
      loopWidth = track.scrollWidth / 2;
      if (loopWidth > 0 && offset >= loopWidth) {
        offset = offset % loopWidth;
      }
      applyOffset();
    }

    function applyOffset() {
      track.style.transform = "translate3d(" + -offset + "px, 0, 0)";
    }

    function normalizeOffset() {
      if (loopWidth <= 0) return;
      while (offset >= loopWidth) offset -= loopWidth;
      while (offset < 0) offset += loopWidth;
      applyOffset();
    }

    function tick() {
      if (!paused && !dragging && loopWidth > 0 && !prefersReducedMotion()) {
        offset += speed;
        if (offset >= loopWidth) offset -= loopWidth;
        applyOffset();
      }
      rafId = window.requestAnimationFrame(tick);
    }

    function nudge(delta) {
      offset += delta;
      normalizeOffset();
    }

    function onPointerDown(e) {
      dragging = true;
      paused = true;
      dragStartX = e.clientX;
      dragStartOffset = offset;
      viewport.setPointerCapture(e.pointerId);
      root.classList.add("is-dragging");
    }

    function onPointerMove(e) {
      if (!dragging) return;
      offset = dragStartOffset - (e.clientX - dragStartX);
      normalizeOffset();
    }

    function endDrag(e) {
      if (!dragging) return;
      dragging = false;
      root.classList.remove("is-dragging");
      try {
        viewport.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      window.setTimeout(function () {
        paused = false;
      }, 1200);
    }

    prevBtn?.addEventListener("click", function () {
      paused = true;
      nudge(-viewport.clientWidth * 0.65);
      window.setTimeout(function () {
        paused = false;
      }, 1400);
    });

    nextBtn?.addEventListener("click", function () {
      paused = true;
      nudge(viewport.clientWidth * 0.65);
      window.setTimeout(function () {
        paused = false;
      }, 1400);
    });

    root.addEventListener("mouseenter", function () {
      paused = true;
    });
    root.addEventListener("mouseleave", function () {
      if (!dragging) paused = false;
    });
    root.addEventListener("focusin", function () {
      paused = true;
    });
    root.addEventListener("focusout", function () {
      if (!dragging) paused = false;
    });

    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);

    window.addEventListener("resize", measure);
    measure();
    tick();

    return function destroy() {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", measure);
    };
  }

  document.querySelectorAll("[data-racetrack]").forEach(initRacetrackCarousel);
})();
