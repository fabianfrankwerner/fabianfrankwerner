const container = document.getElementById("container");
const resetButton = document.getElementById("resetButton");

let gridSize = 16;

function createGrid(size) {
  container.innerHTML = "";
  const squareSize = 960 / size;

  for (let i = 0; i < size * size; i++) {
    const square = document.createElement("div");
    square.classList.add("grid-square");
    square.style.width = `${squareSize}px`;
    square.style.height = `${squareSize}px`;
    square.style.backgroundColor = "rgb(255, 255, 255)";
    square.dataset.opacity = "0";
    square.addEventListener("mouseover", changeColor);
    container.appendChild(square);
  }
}

function changeColor(e) {
  const randomR = Math.floor(Math.random() * 256);
  const randomG = Math.floor(Math.random() * 256);
  const randomB = Math.floor(Math.random() * 256);

  let opacity = parseFloat(e.target.dataset.opacity);
  opacity = Math.min(opacity + 0.1, 1);
  e.target.dataset.opacity = opacity.toString();

  e.target.style.backgroundColor = `rgba(${randomR}, ${randomG}, ${randomB}, ${opacity})`;
}

function resetGrid() {
  let newSize = prompt(
    "Enter the number of squares per side for the new grid (max 100):"
  );
  newSize = parseInt(newSize);

  if (isNaN(newSize) || newSize < 1 || newSize > 100) {
    alert("Please enter a valid number between 1 and 100.");
    return;
  }

  gridSize = newSize;
  createGrid(gridSize);
}

resetButton.addEventListener("click", resetGrid);

createGrid(gridSize);
