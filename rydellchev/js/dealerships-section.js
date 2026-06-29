(function () {
  const teamConfig = window.RYDELL_DEALERSHIP_TEAM || [];
  const staffById = Object.fromEntries((window.RYDELL_STAFF || []).map(function (p) {
    return [p.id, p];
  }));

  const team = teamConfig
    .map(function (entry) {
      const person = staffById[entry.id];
      if (!person) return null;
      return {
        person: person,
        background: entry.background
      };
    })
    .filter(Boolean);

  if (team.length === 0) return;

  const bgEl = document.getElementById("dealershipBg");
  const faceEl = document.getElementById("dealershipStaffImg");
  const copyEl = document.getElementById("dealershipMemberText");
  const spotlightEl = document.getElementById("dealershipSpotlight");

  if (!bgEl || !faceEl || !copyEl || !spotlightEl) return;

  let index = 0;
  let fading = false;

  function renderCopy(copy) {
    copyEl.innerHTML =
      '<span class="overlay-line overlay-line--name">' +
      copy.line1 +
      "</span>" +
      '<span class="overlay-line overlay-line--store">' +
      copy.line2 +
      "</span>" +
      '<span class="overlay-line overlay-line--role">' +
      copy.line3 +
      "</span>" +
      '<span class="overlay-line overlay-line--since">' +
      copy.line4 +
      "</span>";
  }

  function showMember(i) {
    const entry = team[i];
    const copy = window.staffOverlayCopy(entry.person);
    bgEl.style.backgroundImage = 'url("' + entry.background + '")';
    faceEl.src = entry.person.image;
    faceEl.alt = entry.person.name + " — Rydell team member";
    renderCopy(copy);
  }

  function crossfade(nextIndex) {
    if (fading || team.length < 2) return;
    fading = true;
    spotlightEl.classList.add("is-fading");

    window.setTimeout(function () {
      index = nextIndex;
      showMember(index);
      spotlightEl.classList.remove("is-fading");
      fading = false;
    }, 450);
  }

  showMember(index);

  window.setInterval(function () {
    crossfade((index + 1) % team.length);
  }, 5500);

  team.forEach(function (entry) {
    const img = new Image();
    img.src = entry.person.image;
    const bg = new Image();
    bg.src = entry.background;
  });
})();
