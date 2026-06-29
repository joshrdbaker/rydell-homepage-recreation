window.RYDELL_STAFF = [
  {
    id: "brandon",
    name: "Brandon",
    lastInitial: "M",
    oem: "Honda-Nissan",
    since: "2019",
    image: "assets/brandon-cutout.png"
  },
  {
    id: "colton",
    name: "Colton",
    lastInitial: "R",
    oem: "GM",
    since: "2021",
    image: "assets/colton-cutout.png"
  },
  {
    id: "doug",
    name: "Doug",
    lastInitial: "H",
    oem: "Toyota",
    since: "2016",
    image: "assets/doug-cutout.png"
  },
  {
    id: "jose",
    name: "Jose",
    lastInitial: "V",
    oem: "Toyota",
    since: "2018",
    image: "assets/jose-cutout.png"
  },
  {
    id: "kirby",
    name: "Kirby",
    lastInitial: "L",
    oem: "Toyota",
    since: "2017",
    image: "assets/kirby-cutout.png"
  },
  {
    id: "paul",
    name: "Paul",
    lastInitial: "",
    oem: "Honda-Nissan",
    since: "",
    image: "assets/paul-cutout.png"
  }
];

window.RYDELL_DEALERSHIP_TEAM = [
  {
    id: "brandon",
    background: "assets/dealerships-bg/shop-floor-1.png"
  },
  {
    id: "colton",
    background: "assets/dealerships-bg/shop-floor-2.png"
  },
  {
    id: "doug",
    background: "assets/dealerships-bg/shop-floor-3.png"
  },
  {
    id: "jose",
    background: "assets/dealerships-bg/shop-floor-1.png"
  },
  {
    id: "kirby",
    background: "assets/dealerships-bg/shop-floor-2.png"
  },
  {
    id: "paul",
    background: "assets/dealerships-bg/shop-floor-2.png"
  }
];

window.RYDELL_STAFF_OVERLAYS = {
  brandon: [
    {
      x: 76.6,
      y: 34.5,
      line1: "Brandon M.",
      line2: "Honda Nissan store",
      line3: "Certified Technician",
      line4: "Team Member Since 2019"
    }
  ],
  colton: [
    {
      x: 77.6,
      y: 59.5,
      line1: "Colton R",
      line2: "GM store",
      line3: "Certified Technician",
      line4: "Team Member Since 2021"
    }
  ],
  doug: [
    {
      x: 76.6,
      y: 34.5,
      line1: "Doug H.",
      line2: "Toyota store",
      line3: "Certified Technician",
      line4: "Team Member Since 2016"
    }
  ],
  jose: [
    {
      x: 78.4,
      y: 42.4,
      line1: "Jose V",
      line2: "Toyota store",
      line3: "Certified Technician",
      line4: "Team Member Since 2018"
    }
  ],
  kirby: [
    {
      x: 76.6,
      y: 34.5,
      line1: "Kirby L",
      line2: "Toyota store",
      line3: "Certified Technician",
      line4: "Team Member Since 2017"
    }
  ]
};

/** Brandon cutout aspect ratio — used as the reference display height for all staff. */
window.BRANDON_CUTOUT_ASPECT = 1295 / 1097;

window.staffStoreName = function staffStoreName(oem) {
  if (oem === "Honda-Nissan") return "Honda Nissan store";
  if (oem === "GM") return "GM store";
  if (oem === "Toyota") return "Toyota store";
  return oem + " store";
};

window.staffOverlayCopy = function staffOverlayCopy(person) {
  const dotted = person.lastInitial === "M" || person.lastInitial === "H";
  const line1 = person.lastInitial
    ? person.name + " " + person.lastInitial + (dotted ? "." : "")
    : person.name;
  const line4 = person.since ? "Team Member Since " + person.since : "Rydell Team Member";
  return {
    line1: line1,
    line2: window.staffStoreName(person.oem),
    line3: "Certified Technician",
    line4: line4
  };
};
