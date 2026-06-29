(function () {
  const root = document.querySelector(".chevy-slide-app");
  if (!root) return;

  const BASE = "https://www.rydellcars.com";

  const slides = [
    {
      label: "RYDELL DELIVERS",
      text: "Free pickup and delivery, year-round. Simple service.",
      image: "assets/chevy-slide/rydell delivers.png",
      ctaText: "Learn About Delivery",
      ctaHref: BASE + "/rydell-delivers",
    },
    {
      label: "OIL SERVICE",
      text: "Every 5,000–8,000 km. Fresh oil and filters keep your engine protected.",
      image: "assets/chevy-slide/oil change.png",
      ctaText: "Schedule Oil Change",
      ctaHref: BASE + "/oil-change-quick-lube.html",
    },
    {
      label: "TIRE SERVICE",
      text: "Rotate every 8,000–10,000 km. Seasonal swaps for safety and longer tread life.",
      image: "assets/chevy-slide/tire service.png",
      ctaText: "Schedule Tire Service",
      ctaHref: BASE + "/schedule-service.html",
    },
    {
      label: "CAR WASH",
      text: "Monthly washes help—especially in winter—to clear salt and protect paint.",
      image: "assets/chevy-slide/car wash.png",
      ctaText: "Visit Car Wash",
      ctaHref: BASE + "/the-rydell-carwash.html",
    },
    {
      label: "BODY SHOP",
      text: "Dents to collision repair—restore safety, structure, and finish.",
      image: "assets/chevy-slide/body shop.png",
      ctaText: "Visit Body Shop",
      ctaHref: BASE + "/body-shop.html",
    },
    {
      label: "DETAILING",
      text: "Deep clean inside and out—refresh the look and protect surfaces.",
      image: "assets/chevy-slide/detail.png",
      ctaText: "Book Detailing",
      ctaHref: BASE + "/detail-center.html",
    },
    {
      label: "SERVICE",
      text: "Scheduled maintenance and inspections to keep you reliably on the road.",
      image: "assets/chevy-slide/service.png",
      ctaText: "Schedule Service",
      ctaHref: BASE + "/schedule-service.html",
    },
    {
      label: "TRADE-IN",
      text: "Clean it up and get it checked—arrive ready for a strong appraisal.",
      image: "assets/chevy-slide/trade-in.png",
      ctaText: "Get Your Offer",
      ctaHref: BASE + "/rydell-buys",
    },
    {
      label: "NEW VEHICLE",
      text: "New ride? A quick walk-through and baseline service get you road-ready.",
      image: "assets/chevy-slide/New Vehicle.png",
      ctaText: "Shop New Inventory",
      ctaHref: BASE + "/searchnew.aspx",
    },
  ];

  const label = root.querySelector("#chevySlideLabel");
  const desc = root.querySelector("#chevySlideDesc");
  const cta = root.querySelector("#chevySlideCta");
  const btnPrev = root.querySelector("#chevySlideBtnPrev");
  const btnNext = root.querySelector("#chevySlideBtnNext");
  const imgPrev = root.querySelector("#chevySlideImgPrev");
  const imgCenter = root.querySelector("#chevySlideImgCenter");
  const imgNext = root.querySelector("#chevySlideImgNext");
  const swipeHint = root.querySelector("#chevySlideSwipeHint");
  const carouselEl = root.querySelector(".chevy-slide-app__carousel");

  if (!label || !desc || !cta || !imgPrev || !imgCenter || !imgNext || !carouselEl) return;

  function updateSlideCopy(idx) {
    const slide = slides[idx];
    label.textContent = slide.label;
    desc.textContent = slide.text;
    cta.textContent = slide.ctaText;
    cta.href = slide.ctaHref;
    cta.setAttribute("aria-label", slide.ctaText + " — " + slide.label);
  }

  const cardPrev = imgPrev.parentElement;
  const cardCenter = imgCenter.parentElement;
  const cardNext = imgNext.parentElement;

  let currentIndex = 0;
  let sliding = false;

  const DURATION = 600;
  const SIDE_SCALE = 1.04;
  const SIDE_OPACITY = 0.5;
  const SIDE_BLUR = 1.5;
  const ARC_HEIGHT = 27;
  const PEEK_DURATION = 400;
  const PEEK_EARLY = 140;

  function wrap(i) {
    return ((i % slides.length) + slides.length) % slides.length;
  }

  function setImages(idx) {
    imgPrev.src = slides[wrap(idx - 1)].image;
    imgCenter.src = slides[idx].image;
    imgNext.src = slides[wrap(idx + 1)].image;
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function parabolicY(t) {
    return ARC_HEIGHT * 4 * t * (1 - t);
  }

  function resetCardStyles() {
    cardPrev.style.overflow = "";
    cardCenter.style.overflow = "";
    cardNext.style.overflow = "";

    cardPrev.style.transform = "scale(" + SIDE_SCALE + ")";
    cardPrev.style.opacity = SIDE_OPACITY;
    cardPrev.style.filter = "blur(" + SIDE_BLUR + "px)";

    cardCenter.style.transform = "scale(1) translateX(0) translateY(0)";
    cardCenter.style.opacity = 1;
    cardCenter.style.filter = "blur(0)";

    cardNext.style.transform = "scale(" + SIDE_SCALE + ")";
    cardNext.style.opacity = SIDE_OPACITY;
    cardNext.style.filter = "blur(" + SIDE_BLUR + "px)";
  }

  function isMobileCarousel() {
    return window.matchMedia("(max-width: 640px)").matches;
  }

  function animateSlideMobile(dir) {
    const cw = cardCenter.offsetWidth || 320;
    const travel = Math.max(cw * 0.38, 96);
    const exitSign = dir > 0 ? -1 : 1;
    const startTime = performance.now();

    function tickExit(now) {
      const rawT = Math.min((now - startTime) / DURATION, 1);
      const t = easeInOutCubic(rawT);
      const arcY = parabolicY(t);
      cardCenter.style.transform =
        "translateX(" + exitSign * travel * t + "px) translateY(" + arcY + "px) scale(" + lerp(1, 0.88, t) + ")";
      cardCenter.style.opacity = lerp(1, 0, t);
      cardCenter.style.filter = "blur(" + lerp(0, 3.2, t) + "px)";
      if (rawT < 1) {
        requestAnimationFrame(tickExit);
      } else {
        currentIndex = wrap(currentIndex + dir);
        setImages(currentIndex);
        updateSlideCopy(currentIndex);
        const enterSign = -exitSign;
        cardCenter.style.transform =
          "translateX(" + enterSign * travel + "px) translateY(0px) scale(0.88)";
        cardCenter.style.opacity = 0;
        cardCenter.style.filter = "blur(3.2px)";

        const t0 = performance.now();
        function tickEnter(now2) {
          const rawT2 = Math.min((now2 - t0) / DURATION, 1);
          const t2 = easeInOutCubic(rawT2);
          const arcY2 = parabolicY(t2);
          cardCenter.style.transform =
            "translateX(" + lerp(enterSign * travel, 0, t2) + "px) translateY(" + arcY2 + "px) scale(" + lerp(0.88, 1, t2) + ")";
          cardCenter.style.opacity = lerp(0, 1, t2);
          cardCenter.style.filter = "blur(" + lerp(3.2, 0, t2) + "px)";
          if (rawT2 < 1) {
            requestAnimationFrame(tickEnter);
          } else {
            resetCardStyles();
            sliding = false;
          }
        }
        requestAnimationFrame(tickEnter);
      }
    }

    requestAnimationFrame(tickExit);
  }

  function animateNewPeek(card, early) {
    const headstart = early || 0;
    const startTime = performance.now() - headstart;
    const initT = easeInOutCubic(Math.min(headstart / PEEK_DURATION, 1));
    card.style.opacity = lerp(0, SIDE_OPACITY, initT);

    function tick(now) {
      const rawT = Math.min((now - startTime) / PEEK_DURATION, 1);
      const t = easeInOutCubic(rawT);
      card.style.opacity = lerp(0, SIDE_OPACITY, t);
      if (rawT < 1) {
        requestAnimationFrame(tick);
      } else {
        card.style.opacity = SIDE_OPACITY;
      }
    }
    requestAnimationFrame(tick);
  }

  function animateSlide(dir) {
    if (sliding) return;
    sliding = true;

    if (isMobileCarousel()) {
      animateSlideMobile(dir);
      return;
    }

    const enterCard = dir > 0 ? cardNext : cardPrev;
    const farCard = dir > 0 ? cardPrev : cardNext;

    cardPrev.style.overflow = "visible";
    cardCenter.style.overflow = "visible";
    cardNext.style.overflow = "visible";

    const centerRect = cardCenter.getBoundingClientRect();
    const enterRect = enterCard.getBoundingClientRect();
    const farRect = farCard.getBoundingClientRect();
    const carouselRect = cardCenter.parentElement.parentElement.getBoundingClientRect();

    const enterMid = enterRect.left + enterRect.width / 2;
    const centerMid = centerRect.left + centerRect.width / 2;
    const enterTravelX = centerMid - enterMid;
    const leaveTravelX = enterTravelX;

    const farMid = farRect.left + farRect.width / 2;
    const farExitX =
      dir > 0
        ? carouselRect.left - farRect.width - farMid
        : carouselRect.right + farRect.width - farMid;

    const centerNaturalW = cardCenter.offsetWidth;
    const enterNaturalW = enterCard.offsetWidth;
    const sizeRatio = centerNaturalW / enterNaturalW;

    const enterStartScale = SIDE_SCALE;
    const enterEndScale = sizeRatio;
    const leaveEndScale = (enterNaturalW / centerNaturalW) * SIDE_SCALE;

    const startTime = performance.now();

    function tick(now) {
      const elapsed = now - startTime;
      const rawT = Math.min(elapsed / DURATION, 1);
      const t = easeInOutCubic(rawT);
      const arcY = parabolicY(t);

      const leaveX = leaveTravelX * t;
      const leaveScale = lerp(1, leaveEndScale, t);
      const leaveOpacity = lerp(1, SIDE_OPACITY, t);
      const leaveBlur = lerp(0, SIDE_BLUR, t);
      cardCenter.style.transform =
        "translateX(" + leaveX + "px) translateY(" + arcY + "px) scale(" + leaveScale + ")";
      cardCenter.style.opacity = leaveOpacity;
      cardCenter.style.filter = "blur(" + leaveBlur + "px)";

      const enterX = enterTravelX * t;
      const enterScale = lerp(enterStartScale, enterEndScale, t);
      const enterOpacity = lerp(SIDE_OPACITY, 1, t);
      const enterBlur = lerp(SIDE_BLUR, 0, t);
      enterCard.style.transform =
        "translateX(" + enterX + "px) translateY(" + arcY + "px) scale(" + enterScale + ")";
      enterCard.style.opacity = enterOpacity;
      enterCard.style.filter = "blur(" + enterBlur + "px)";

      const farOpacity = lerp(SIDE_OPACITY, 0, t);
      farCard.style.transform = "scale(" + SIDE_SCALE + ")";
      farCard.style.opacity = farOpacity;

      if (rawT < 1) {
        requestAnimationFrame(tick);
      } else {
        currentIndex = wrap(currentIndex + dir);
        setImages(currentIndex);
        updateSlideCopy(currentIndex);
        resetCardStyles();
        sliding = false;
        animateNewPeek(dir > 0 ? cardNext : cardPrev, PEEK_EARLY);
      }
    }

    requestAnimationFrame(tick);
  }

  function goNext() {
    animateSlide(1);
  }

  function goPrev() {
    animateSlide(-1);
  }

  slides.forEach(function (s) {
    const img = new Image();
    img.src = s.image;
  });

  if (btnPrev) btnPrev.addEventListener("click", goPrev);
  if (btnNext) btnNext.addEventListener("click", goNext);

  cardPrev.addEventListener("click", goPrev);
  cardNext.addEventListener("click", goNext);
  cardCenter.addEventListener("click", goNext);

  function cardKeydown(e, handler) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handler();
    }
  }

  cardPrev.addEventListener("keydown", function (e) {
    cardKeydown(e, goPrev);
  });
  cardNext.addEventListener("keydown", function (e) {
    cardKeydown(e, goNext);
  });
  cardCenter.addEventListener("keydown", function (e) {
    cardKeydown(e, goNext);
  });

  let touchStartX = 0;
  let touchStartY = 0;
  let trackingSwipe = false;

  carouselEl.addEventListener(
    "touchstart",
    function (e) {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      trackingSwipe = true;
    },
    { passive: true }
  );

  carouselEl.addEventListener(
    "touchmove",
    function (e) {
      if (!trackingSwipe) return;
      const dx = e.touches[0].clientX - touchStartX;
      const dy = e.touches[0].clientY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy)) {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  carouselEl.addEventListener(
    "touchend",
    function (e) {
      if (!trackingSwipe) return;
      trackingSwipe = false;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 48) {
        if (dx < 0) goNext();
        else goPrev();
        if (swipeHint) swipeHint.classList.add("hidden");
      }
    },
    { passive: true }
  );

  setImages(0);
  resetCardStyles();
  updateSlideCopy(0);
})();
