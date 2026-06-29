(function () {
  "use strict";

  const BASE = "https://www.rydellcars.com";
  const ASSETS = BASE + "/assets/logos/transparent";

  const makes = [
    { id: "chevrolet", label: "Chevrolet", href: BASE + "/searchnew.aspx?Make=Chevrolet" },
    { id: "gmc", label: "GMC", href: BASE + "/searchnew.aspx?Make=GMC" },
    {
      id: "cadillac",
      label: "Cadillac",
      href: "https://www.rydellcadillac.com/searchnew.aspx",
      external: true
    },
    { id: "honda", label: "Honda", href: BASE + "/searchnew.aspx?Make=Honda" },
    { id: "nissan", label: "Nissan", href: BASE + "/searchnew.aspx?Make=Nissan" },
    { id: "toyota", label: "Toyota", href: BASE + "/searchnew.aspx?Make=Toyota" }
  ];

  const track = document.getElementById("makeRacetrackTrack");
  if (!track) return;

  makes.forEach(function (make, index) {
    const item = document.createElement("div");
    item.className = "make-racetrack__item";

    const card = document.createElement("div");
    card.className = "card";

    const link = document.createElement("a");
    link.href = make.href;
    if (make.external) {
      link.target = "_blank";
      link.rel = "noopener";
    }
    link.setAttribute("aria-label", make.label);
    link.dataset.dotaggingLinkUrl = make.href;

    const logo = document.createElement("div");
    logo.className = "img-background img-contain logoOEM";
    logo.setAttribute("role", "img");
    logo.setAttribute("aria-label", make.label);
    logo.title = make.label;
    logo.style.backgroundImage = "url('" + ASSETS + "/" + make.id + ".png')";

    link.appendChild(logo);
    card.appendChild(link);
    item.appendChild(card);
    track.appendChild(item);
  });
})();
