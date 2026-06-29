(function () {
  const BASE = "https://www.rydellcars.com";

  const makes = [
    "Audi", "Buick", "Cadillac", "Chevrolet", "Chrysler", "Dodge", "Ford", "GMC",
    "Honda", "Hyundai", "Jeep", "Kia", "Lincoln", "Mazda", "Mercedes-Benz", "Nissan",
    "Ram", "Subaru", "Toyota", "Volkswagen", "Volvo"
  ];

  const modelsByMake = {
    Chevrolet: ["1500", "Colorado", "Equinox", "Malibu", "Silverado 1500", "Tahoe", "Traverse"],
    GMC: ["Acadia", "Canyon", "Sierra 1500", "Terrain", "Yukon"],
    Honda: ["Accord", "CR-V", "Civic", "HR-V", "Pilot"],
    Toyota: ["4Runner", "Camry", "Corolla", "Highlander", "RAV4", "Tundra"],
    Nissan: ["Altima", "Frontier", "Murano", "Rogue", "Sentra"],
    Ford: ["Escape", "Explorer", "F-150", "Mustang", "Ranger"],
    Cadillac: ["CT4", "CT5", "Escalade", "XT4", "XT5", "XT6"]
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
    if (type === "Type:U" || type === "Cpo:true") url = `${BASE}/searchused.aspx`;
    const params = new URLSearchParams();
    if (makeSelect.value) params.set("Make", makeSelect.value);
    if (modelSelect.value) params.set("Model", modelSelect.value);
    if (type === "Cpo:true") params.set("Cpo", "true");
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

  const logos = document.querySelectorAll(".rotate-logos img");
  if (logos.length > 1) {
    let logoIndex = 0;
    logos.forEach((img, i) => {
      img.style.display = i === 0 ? "block" : "none";
    });
    setInterval(() => {
      logos[logoIndex].style.display = "none";
      logoIndex = (logoIndex + 1) % logos.length;
      logos[logoIndex].style.display = "block";
    }, 4000);
  }
})();
