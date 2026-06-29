(function () {
  const BASE = "https://www.rydellchev.com";

  const lineupData = {
    trucks: [
      { name: "Silverado EV", img: "https://www.rydellchev.com/assets/stock/ColorMatched_01/Transparent/320/cc_2026CHT92_01_320/cc_2026CHT922059832_01_320_GBA.png", href: "/searchnew.aspx?Make=Chevrolet&ModelAndTrim=Silverado%20EV" },
      { name: "Silverado 1500", img: "https://www.rydellchev.com/assets/stock/ColorMatched_01/Transparent/320/cc_2026CHT27_01_320/cc_2026CHT271994233_01_320_GXD.png", href: "/searchnew.aspx?Make=Chevrolet&ModelAndTrim=Silverado%201500" },
      { name: "Silverado 2500HD", img: "https://www.rydellchev.com/assets/stock/ColorMatched_01/Transparent/320/cc_2026CHT30_01_320/cc_2026CHT301988560_01_320_GXD.png", href: "/searchnew.aspx?Make=Chevrolet&ModelAndTrim=Silverado%202500%20HD" },
      { name: "Silverado 3500HD", img: "https://www.rydellchev.com/assets/stock/ColorMatched_01/Transparent/320/cc_2026CHT47_01_320/cc_2026CHT472027541_01_320_GXP.png", href: "/searchnew.aspx?Make=Chevrolet&ModelAndTrim=Silverado%203500%20HD" },
      { name: "Colorado", img: "https://www.rydellchev.com/assets/stock/ColorMatched_01/Transparent/320/cc_2026CHT35_01_320/cc_2026CHT351987828_01_320_GAE.png", href: "/searchnew.aspx?Make=Chevrolet&ModelAndTrim=Colorado" }
    ],
    electric: [
      { name: "Bolt EV", img: "https://www.rydellchev.com/static/brand-chevrolet/homepage/model-bar/2026/bolt.png", href: "/searchnew.aspx?Fueltype=Electric%20Fuel%20System&ModelAndTrim=Bolt" },
      { name: "Silverado EV", img: "https://www.rydellchev.com/assets/stock/ColorMatched_01/Transparent/320/cc_2026CHT92_01_320/cc_2026CHT922059832_01_320_GBA.png", href: "/searchnew.aspx?Make=Chevrolet&ModelAndTrim=Silverado%20EV" },
      { name: "Equinox EV", img: "https://www.rydellchev.com/static/brand-chevrolet/homepage/model-bar/2026/equinox-ev.png", href: "/searchnew.aspx?ModelAndTrim=Equinox%20EV" },
      { name: "Blazer EV", img: "https://www.rydellchev.com/static/brand-chevrolet/homepage/model-bar/2026/blazer-ev.png", href: "/searchnew.aspx?ModelAndTrim=Blazer%20EV" },
      { name: "BrightDrop", img: "https://www.rydellchev.com/static/brand-chevrolet/homepage/model-bar/2026/brightdrop.png", href: "/searchnew.aspx?ModelAndTrim=BrightDrop" }
    ],
    suvs: [
      { name: "Trax", img: "https://www.rydellchev.com/static/brand-chevrolet/homepage/model-bar/2026/trax.png", href: "/searchnew.aspx?ModelAndTrim=Trax" },
      { name: "Trailblazer", img: "https://www.rydellchev.com/static/brand-chevrolet/homepage/model-bar/2026/trailblazer.png", href: "/searchnew.aspx?ModelAndTrim=Trailblazer" },
      { name: "Equinox", img: "https://www.rydellchev.com/static/brand-chevrolet/homepage/model-bar/2026/equinox.png", href: "/searchnew.aspx?ModelAndTrim=Equinox" },
      { name: "Blazer", img: "https://www.rydellchev.com/static/brand-chevrolet/homepage/model-bar/2026/blazer.png", href: "/searchnew.aspx?ModelAndTrim=Blazer" },
      { name: "Tahoe", img: "https://www.rydellchev.com/static/brand-chevrolet/homepage/model-bar/2026/tahoe.png", href: "/searchnew.aspx?ModelAndTrim=Tahoe" }
    ],
    performance: [
      { name: "Corvette", img: "https://www.rydellchev.com/static/brand-chevrolet/homepage/model-bar/2026/corvette.png", href: "/searchnew.aspx?ModelAndTrim=Corvette" }
    ],
    commercial: [
      { name: "BrightDrop", img: "https://www.rydellchev.com/static/brand-chevrolet/homepage/model-bar/2026/brightdrop.png", href: "/searchnew.aspx?ModelAndTrim=BrightDrop" },
      { name: "Silverado 3500HD", img: "https://www.rydellchev.com/assets/stock/ColorMatched_01/Transparent/320/cc_2026CHT47_01_320/cc_2026CHT472027541_01_320_GXP.png", href: "/searchnew.aspx?Make=Chevrolet&ModelAndTrim=Silverado%203500%20HD" }
    ]
  };

  const makes = ["Chevrolet", "Buick", "GMC", "Cadillac", "Ford", "Ram", "Toyota", "Honda"];
  const modelsByMake = {
    Chevrolet: ["Silverado 1500", "Equinox", "Traverse", "Colorado", "Malibu", "Tahoe", "Trax", "Blazer"]
  };

  const makeSelect = document.getElementById("searchByFilterMakes");
  const modelSelect = document.getElementById("searchByFilterModels");

  makes.forEach((make) => {
    const opt = document.createElement("option");
    opt.value = make;
    opt.textContent = make;
    makeSelect.appendChild(opt);
  });

  function updateModels() {
    const make = makeSelect.value;
    modelSelect.innerHTML = '<option value="">Any Model</option>';
    (modelsByMake[make] || []).forEach((model) => {
      const opt = document.createElement("option");
      opt.value = model;
      opt.textContent = model;
      modelSelect.appendChild(opt);
    });
  }

  makeSelect.addEventListener("change", updateModels);

  document.getElementById("searchByFilterReset").addEventListener("click", () => {
    document.getElementById("searchByFilterType").value = "Type:A";
    makeSelect.value = "";
    updateModels();
  });

  document.getElementById("searchByFilterForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const type = document.getElementById("searchByFilterType").value;
    let url = `${BASE}/searchall.aspx`;
    if (type === "Type:N") url = `${BASE}/searchnew.aspx`;
    if (type === "Type:U" || type === "Cpo:true" || type === "CarBravo:true") url = `${BASE}/searchused.aspx`;
    const params = new URLSearchParams();
    if (makeSelect.value) params.set("Make", makeSelect.value);
    if (modelSelect.value) params.set("Model", modelSelect.value);
    if (type === "Cpo:true") params.set("Cpo", "true");
    if (type === "CarBravo:true") params.set("CarBravo", "true");
    const qs = params.toString();
    window.open(qs ? `${url}?${qs}` : url, "_blank");
  });

  document.querySelectorAll("[data-search-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.searchTab;
      document.querySelectorAll("[data-search-tab]").forEach((b) => b.parentElement.classList.remove("active"));
      btn.parentElement.classList.add("active");
      document.querySelectorAll("[data-search-panel]").forEach((panel) => {
        panel.classList.toggle("active", panel.dataset.searchPanel === tab);
      });
    });
  });

  const lineupContainer = document.getElementById("lineupGrids");

  function renderLineup(key) {
    lineupContainer.innerHTML = "";
    const grid = document.createElement("div");
    grid.className = "lineup-grid active";
    grid.dataset.lineup = key;
    (lineupData[key] || []).forEach((item) => {
      const link = document.createElement("a");
      link.href = `${BASE}${item.href}`;
      link.target = "_blank";
      link.innerHTML = `<img src="${item.img}" alt="${item.name}" width="320" height="240" loading="lazy" /><p>${item.name}</p>`;
      grid.appendChild(link);
    });
    lineupContainer.appendChild(grid);
  }

  document.querySelectorAll("[data-lineup-tab]").forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll("[data-lineup-tab]").forEach((t) => t.parentElement.classList.remove("active"));
      tab.parentElement.classList.add("active");
      renderLineup(tab.dataset.lineupTab);
    });
  });

  renderLineup("trucks");
})();
