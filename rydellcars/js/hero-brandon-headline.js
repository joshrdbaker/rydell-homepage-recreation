(function () {
  const WORDS = ["people", "relationships", "prices", "service"];
  const INTERVAL_MS = 3200;
  const ANIMATION_MS = 550;

  const flipRoot = document.querySelector("[data-word-flip]");
  if (!flipRoot) return;

  const stage = flipRoot.querySelector(".brandon-hero__word-flip-stage");
  const currentWord = flipRoot.querySelector(".brandon-hero__word-flip-word.is-current");
  if (!stage || !currentWord) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let index = 0;
  let isAnimating = false;

  function nextWord() {
    index = (index + 1) % WORDS.length;
    return WORDS[index];
  }

  function swapWord(word) {
    const outgoing = stage.querySelector(".brandon-hero__word-flip-word.is-current");
    if (!outgoing) return;

    const incoming = document.createElement("span");
    incoming.className = "brandon-hero__word-flip-word is-entering";
    incoming.textContent = word;
    stage.appendChild(incoming);

    if (prefersReducedMotion) {
      outgoing.remove();
      incoming.classList.remove("is-entering");
      incoming.classList.add("is-current");
      isAnimating = false;
      return;
    }

    outgoing.classList.remove("is-current");
    outgoing.classList.add("is-exiting");

    window.setTimeout(function () {
      outgoing.remove();
      incoming.classList.remove("is-entering");
      incoming.classList.add("is-current");
      isAnimating = false;
    }, ANIMATION_MS);
  }

  function tick() {
    if (isAnimating) return;
    isAnimating = true;
    swapWord(nextWord());
  }

  window.setInterval(tick, INTERVAL_MS);
})();
