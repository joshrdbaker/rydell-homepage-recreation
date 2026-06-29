window.RYDELL_STAFF = [
  {
    id: "mike",
    name: "Mike",
    lastInitial: "",
    oem: "GM",
    since: "",
    image: "assets/mike-cutout.png"
  },
  {
    id: "jay",
    name: "Jay",
    lastInitial: "S",
    oem: "GM",
    since: "2020",
    image: "assets/jay-cutout.png"
  }
];

window.RYDELL_DEALERSHIP_TEAM = [
  { id: "mike", background: "assets/dealerships-bg/shop-floor-1.png" },
  { id: "jay", background: "assets/dealerships-bg/shop-floor-2.png" }
];

window.RYDELL_STAFF_OVERLAYS = {};

window.staffStoreName = function staffStoreName(oem) {
  if (oem === "GM") return "Chevrolet GMC store";
  return oem + " store";
};

window.staffOverlayCopy = function staffOverlayCopy(person) {
  const line1 = person.lastInitial
    ? person.name + " " + person.lastInitial
    : person.name;
  const line4 = person.since ? "Team Member Since " + person.since : "Rydell Team Member";
  return {
    line1: line1,
    line2: window.staffStoreName(person.oem),
    line3: "Certified Technician",
    line4: line4
  };
};
