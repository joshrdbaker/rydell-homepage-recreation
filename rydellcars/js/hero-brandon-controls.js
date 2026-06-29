(function () {
  const STORAGE_KEY = "hero-brandon-layout-v2";
  const spotlight = document.querySelector(".brandon-hero__spotlight");

  if (!spotlight) return;

  const defaults = {
    brandonX: -81,
    brandonY: 7,
    brandonScale: 1.1,
    headlineX: 33,
    headlineY: -50
  };

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
    buildGroup("Brandon Image", "brandon") +
    buildGroup("Headline", "headline") +
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

  controls.forEach(function (control) {
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
        return control.group === groupName;
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

    return Math.round(value) + control.unit;
  }

  function cssValue(control, value) {
    if (control.unit === "x") {
      return String(Number(value.toFixed(2)));
    }

    return Math.round(value) + "px";
  }

  function applyState() {
    controls.forEach(function (control) {
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
      inputs[control.id].value = String(state[control.id]);
    });
    applyState();
  }

  function buildCssSnippet() {
    return (
      ".brandon-hero__spotlight {\n" +
      "  --brandon-x: " +
      cssValue(controls[0], state.brandonX) +
      ";\n" +
      "  --brandon-y: " +
      cssValue(controls[1], state.brandonY) +
      ";\n" +
      "  --brandon-scale: " +
      cssValue(controls[2], state.brandonScale) +
      ";\n" +
      "  --headline-x: " +
      cssValue(controls[3], state.headlineX) +
      ";\n" +
      "  --headline-y: " +
      cssValue(controls[4], state.headlineY) +
      ";\n" +
      "}"
    );
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
