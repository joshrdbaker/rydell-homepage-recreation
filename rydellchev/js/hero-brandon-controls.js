(function () {
  if (!window.location.search.includes("controls=1")) return;

  const staticHeadline = Boolean(document.querySelector(".brandon-hero--static"));
  const headlineOnly = Boolean(document.querySelector(".brandon-hero--headline-only"));
  const STORAGE_KEY = headlineOnly
    ? "hero-brandon-flip-layout-v4"
    : staticHeadline
      ? "hero-brandon-static-layout-v2"
      : "hero-brandon-layout-v4";
  const spotlight = document.querySelector(".brandon-hero__spotlight");

  if (!spotlight) return;

  const typographyDefaults = {
    headlineLetterSpacing: -0.04,
    headlineLineHeight: 0.84,
    headlineWordSpacing: 0
  };

  const flipTypographyDefaults = {
    headlineLetterSpacing: -0.04,
    headlineLineHeight: 0.88,
    headlineWordSpacing: 0
  };

  const staticTypographyDefaults = {
    headlineLetterSpacing: -0.04,
    headlineLineHeight: 0.98,
    headlineWordSpacing: 0
  };

  const wordDefaults = {
    wordRealX: -0.43,
    wordPeopleX: 0.63,
    wordSinceX: -0.43,
    wordYearX: 0.37
  };

  const nameTagDefaults = {
    nameTagLeft: 52,
    nameTagBottom: 18,
    nameTagPeek: 11
  };

  const defaults = headlineOnly
    ? Object.assign(
        {
          brandonX: 0,
          brandonY: 0,
          brandonScale: 1,
          headlineX: 111,
          headlineY: 0
        },
        flipTypographyDefaults
      )
    : staticHeadline
      ? Object.assign(
          {
            brandonX: -43,
            brandonY: 1,
            brandonScale: 1.17,
            headlineX: -78,
            headlineY: -127
          },
          staticTypographyDefaults,
          wordDefaults,
          nameTagDefaults
        )
      : Object.assign(
          {
            brandonX: -106,
            brandonY: 1,
            brandonScale: 1.17,
            headlineX: -83,
            headlineY: -114
          },
          typographyDefaults
        );

  const controls = [
    {
      id: "brandonX",
      label: "Move X",
      group: "brandon",
      min: -240,
      max: 240,
      step: 1,
      unit: "px",
      cssVar: "--brandon-x"
    },
    {
      id: "brandonY",
      label: "Move Y",
      group: "brandon",
      min: -240,
      max: 240,
      step: 1,
      unit: "px",
      cssVar: "--brandon-y"
    },
    {
      id: "brandonScale",
      label: "Scale",
      group: "brandon",
      min: 0.5,
      max: 1.8,
      step: 0.01,
      unit: "x",
      cssVar: "--brandon-scale"
    },
    {
      id: "headlineX",
      label: "Move X",
      group: "headline",
      min: -360,
      max: 180,
      step: 1,
      unit: "px",
      cssVar: "--headline-x"
    },
    {
      id: "headlineY",
      label: "Move Y",
      group: "headline",
      min: -240,
      max: 240,
      step: 1,
      unit: "px",
      cssVar: "--headline-y"
    },
    {
      id: "headlineLetterSpacing",
      label: "Kerning",
      group: "headline",
      min: -0.12,
      max: 0.08,
      step: 0.005,
      unit: "em",
      cssVar: "--headline-letter-spacing"
    },
    {
      id: "headlineLineHeight",
      label: "Line height",
      group: "headline",
      min: 0.6,
      max: 1.2,
      step: 0.01,
      unit: "lh",
      cssVar: "--headline-line-height"
    },
    {
      id: "headlineWordSpacing",
      label: "Word space",
      group: "headline",
      min: -0.2,
      max: 0.3,
      step: 0.005,
      unit: "em",
      cssVar: "--headline-word-spacing"
    },
    {
      id: "wordRealX",
      label: "Real",
      group: "words",
      min: -1.5,
      max: 1.5,
      step: 0.01,
      unit: "em",
      cssVar: "--headline-word-real-x",
      staticOnly: true
    },
    {
      id: "wordPeopleX",
      label: "People",
      group: "words",
      min: -1.5,
      max: 1.5,
      step: 0.01,
      unit: "em",
      cssVar: "--headline-word-people-x",
      staticOnly: true
    },
    {
      id: "wordSinceX",
      label: "Since",
      group: "words",
      min: -1.5,
      max: 1.5,
      step: 0.01,
      unit: "em",
      cssVar: "--headline-word-since-x",
      staticOnly: true
    },
    {
      id: "wordYearX",
      label: "1954.",
      group: "words",
      min: -1.5,
      max: 1.5,
      step: 0.01,
      unit: "em",
      cssVar: "--headline-word-year-x",
      staticOnly: true
    },
    {
      id: "nameTagLeft",
      label: "Left",
      group: "nametag",
      min: 0,
      max: 220,
      step: 1,
      unit: "px",
      cssVar: "--name-tag-left",
      staticOnly: true
    },
    {
      id: "nameTagBottom",
      label: "Bottom",
      group: "nametag",
      min: 0,
      max: 160,
      step: 1,
      unit: "px",
      cssVar: "--name-tag-bottom",
      staticOnly: true
    },
    {
      id: "nameTagPeek",
      label: "Peek down",
      group: "nametag",
      min: 0,
      max: 70,
      step: 1,
      unit: "%",
      cssVar: "--name-tag-peek",
      staticOnly: true
    }
  ];

  const state = loadState();

  const panel = document.createElement("aside");
  panel.className = "hero-layout-panel";
  panel.setAttribute("aria-label", "Hero layout controls");
  panel.innerHTML =
    '<div class="hero-layout-panel__toast" id="heroLayoutToast" role="status" aria-live="polite"></div>' +
    '<div class="hero-layout-panel__header">' +
    '<h2 class="hero-layout-panel__title">Layout Controls</h2>' +
    '<button type="button" class="hero-layout-panel__toggle" id="heroLayoutToggle" aria-expanded="true">Hide</button>' +
    "</div>" +
    '<div class="hero-layout-panel__body">' +
    (headlineOnly ? "" : buildGroup("Brandon Image", "brandon")) +
    buildGroup("Headline", "headline") +
    (staticHeadline ? buildGroup("Headline words", "words") : "") +
    (staticHeadline ? buildGroup("Name tag", "nametag") : "") +
    "</div>" +
    '<div class="hero-layout-panel__footer">' +
    '<button type="button" class="hero-layout-panel__btn" id="heroLayoutReset">Reset</button>' +
    '<button type="button" class="hero-layout-panel__btn hero-layout-panel__btn--primary" id="heroLayoutCopy">Copy CSS</button>' +
    "</div>";

  document.body.appendChild(panel);

  const toast = document.getElementById("heroLayoutToast");
  const toggle = document.getElementById("heroLayoutToggle");
  const resetBtn = document.getElementById("heroLayoutReset");
  const copyBtn = document.getElementById("heroLayoutCopy");
  const inputs = {};

  function isControlActive(control) {
    if (headlineOnly && control.group === "brandon") return false;
    if (control.staticOnly && !staticHeadline) return false;
    return true;
  }

  controls.forEach(function (control) {
    if (!isControlActive(control)) return;

    inputs[control.id] = document.getElementById("heroLayout-" + control.id);
    inputs[control.id].addEventListener("input", function () {
      state[control.id] = Number(inputs[control.id].value);
      applyState();
      saveState();
    });
  });

  toggle.addEventListener("click", function () {
    const collapsed = panel.classList.toggle("is-collapsed");
    toggle.textContent = collapsed ? "Show" : "Hide";
    toggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
  });

  resetBtn.addEventListener("click", function () {
    Object.assign(state, defaults);
    syncInputs();
    applyState();
    saveState();
    showToast("Layout reset to defaults.");
  });

  copyBtn.addEventListener("click", function () {
    const css = buildCssSnippet();
    copyText(css).then(function () {
      showToast("CSS copied to clipboard.");
    }).catch(function () {
      showToast("Copy failed. CSS printed to console.");
      console.log(css);
    });
  });

  syncInputs();
  applyState();

  function buildGroup(title, groupName) {
    const fields = controls
      .filter(function (control) {
        return control.group === groupName && isControlActive(control);
      })
      .map(function (control) {
        return (
          '<div class="hero-layout-panel__field">' +
          "<label for=\"heroLayout-" +
          control.id +
          '">' +
          control.label +
          "</label>" +
          '<input type="range" id="heroLayout-' +
          control.id +
          '" min="' +
          control.min +
          '" max="' +
          control.max +
          '" step="' +
          control.step +
          '" value="' +
          state[control.id] +
          '" />' +
          '<span class="hero-layout-panel__value" id="heroLayoutValue-' +
          control.id +
          '"></span>' +
          "</div>"
        );
      })
      .join("");

    return (
      '<section class="hero-layout-panel__group">' +
      '<h3 class="hero-layout-panel__group-title">' +
      title +
      "</h3>" +
      fields +
      "</section>"
    );
  }

  function formatValue(control, value) {
    if (control.unit === "x") {
      return value.toFixed(2) + control.unit;
    }

    if (control.unit === "em") {
      return value.toFixed(3) + control.unit;
    }

    if (control.unit === "lh") {
      return value.toFixed(2);
    }

    if (control.unit === "%") {
      return Math.round(value) + control.unit;
    }

    return Math.round(value) + control.unit;
  }

  function cssValue(control, value) {
    if (control.unit === "x") {
      return String(Number(value.toFixed(2)));
    }

    if (control.unit === "em") {
      return value.toFixed(3) + "em";
    }

    if (control.unit === "lh") {
      return String(Number(value.toFixed(2)));
    }

    if (control.unit === "%") {
      return Math.round(value) + "%";
    }

    return Math.round(value) + "px";
  }

  function applyState() {
    controls.forEach(function (control) {
      if (!isControlActive(control)) return;

      spotlight.style.setProperty(control.cssVar, cssValue(control, state[control.id]));
      document.getElementById("heroLayoutValue-" + control.id).textContent = formatValue(
        control,
        state[control.id]
      );
    });
    window.dispatchEvent(new CustomEvent("hero-brandon-layout-change"));
  }

  function syncInputs() {
    controls.forEach(function (control) {
      if (!isControlActive(control)) return;

      inputs[control.id].value = String(state[control.id]);
    });
    applyState();
  }

  function buildCssSnippet() {
    const selector = staticHeadline
      ? ".brandon-hero--static .brandon-hero__spotlight"
      : ".brandon-hero__spotlight";
    const lines = [selector + " {"];

    controls.forEach(function (control) {
      if (!isControlActive(control)) return;

      lines.push("  " + control.cssVar + ": " + cssValue(control, state[control.id]) + ";");
    });

    lines.push("}");
    return lines.join("\n");
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (!saved || typeof saved !== "object") return Object.assign({}, defaults);
      return Object.assign({}, defaults, saved);
    } catch (error) {
      return Object.assign({}, defaults);
    }
  }

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 1800);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();

      try {
        document.execCommand("copy");
        document.body.removeChild(textarea);
        resolve();
      } catch (error) {
        document.body.removeChild(textarea);
        reject(error);
      }
    });
  }
})();
