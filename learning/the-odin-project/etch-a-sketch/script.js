const grid = document.querySelector(".grid");
const size = document.querySelector(".size");

size.addEventListener("click", () => {
  const input = prompt("Input your desired grid dimensions (e.g. 10x10):");
  if (input) {
    const [height, width] = input.split("x").map(Number);
    if (!isNaN(height) && !isNaN(width) && height <= 100 && width <= 100) {
      grid.innerHTML = ""; // clear previous grid
      generateGrid(height, width);
    } else if (height > 100 || width > 100) {
      alert("Invalid input. Grid dimensions must be 100x100 or smaller.");
    } else {
      alert("Invalid input. Use format like 10x10.");
    }
  }
});

function generateGrid(height, width) {
  for (let i = 0; i < height; i++) {
    const height = document.createElement("div");
    height.classList.add([i + 1], "height");
    grid.appendChild(height);

    for (let j = 0; j < width; j++) {
      const square = document.createElement("div");
      square.classList.add([j + 1], "square");
      square.addEventListener("mouseover", () => {
        square.style.backgroundColor = getRandomColor();
      });
      height.appendChild(square);
    }
  }
}

function getRandomColor() {
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);

  return `rgb(${r}, ${g}, ${b})`;
}
