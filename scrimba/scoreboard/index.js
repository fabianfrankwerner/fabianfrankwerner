home = document.getElementById("home");
guest = document.getElementById("guest");

let homeCount = 0;
let guestCount = 0;

function addOneHome() {
  homeCount += 1;
  home.textContent = homeCount;
}

function addTwoHome() {
  homeCount += 2;
  home.textContent = homeCount;
}

function addThreeHome() {
  homeCount += 3;
  home.textContent = homeCount;
}

function addOneGuest() {
  guestCount += 1;
  guest.textContent = guestCount;
}

function addTwoGuest() {
  guestCount += 2;
  guest.textContent = guestCount;
}

function addThreeGuest() {
  guestCount += 3;
  guest.textContent = guestCount;
}
