const form = document.getElementById("form");
const button = document.getElementById("get-color-scheme");
const color = document.getElementById("color-seed");
const mode = document.getElementById("color-mode");

button.addEventListener("click", getColors);

function getColors(e) {
  e.preventDefault();
  const inputColor = color.value.replace("#", "");
  const inputMode = mode.value;

  fetch(
    `https://www.thecolorapi.com/scheme?hex=${inputColor}&mode=${inputMode}&count=5`
  )
    .then((response) => response.json())
    .then((data) => {
      const colorArray = data.colors.map((color) => color.hex.value);

      const divIds = ["one", "two", "three", "four", "five"];
      const pIds = ["p-one", "p-two", "p-three", "p-four", "p-five"];

      divIds.forEach((id, index) => {
        document.getElementById(id).style.backgroundColor = colorArray[index];
      });

      pIds.forEach((id, index) => {
        document.getElementById(id).textContent = colorArray[index];
      });
    });
}
