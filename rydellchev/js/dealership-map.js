(function () {
  const mapEl = document.getElementById("dealershipMap");
  const locations = window.RYDELL_DEALERSHIP_LOCATIONS || [];

  if (!mapEl || locations.length === 0 || typeof L === "undefined") return;

  const map = L.map(mapEl, {
    scrollWheelZoom: false
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  const markerIcon = L.icon({
    iconUrl: "assets/rydell-r-map-pin.png",
    iconSize: [36, 48],
    iconAnchor: [18, 15],
    popupAnchor: [0, -18]
  });

  const bounds = [];

  locations.forEach(function (loc) {
    const latLng = [loc.lat, loc.lng];
    bounds.push(latLng);

    const popup =
      "<strong>" + loc.name + "</strong><br>" +
      loc.address + "<br>" +
      loc.city + "<br>" +
      'Sales: <a href="tel:+1' + loc.phone.replace(/\D/g, "") + '">' + loc.phone + "</a><br>" +
      '<a href="' + loc.directions + '" target="_blank" rel="noopener">Driving Directions</a>';

    L.marker(latLng, { icon: markerIcon, title: loc.name })
      .addTo(map)
      .bindPopup(popup);
  });

  map.fitBounds(bounds, { padding: [36, 36] });

  window.addEventListener("resize", function () {
    map.invalidateSize();
  });
})();
