import { Ship, Gameboard, Player } from "./battleship.js";

// DOM module for rendering and event management
const DOMController = (() => {
  const playerBoardDiv = document.getElementById("player-board");
  const computerBoardDiv = document.getElementById("computer-board");
  const messageDiv = document.getElementById("message");

  function renderBoard(board, boardDiv, isEnemy = false) {
    boardDiv.innerHTML = "";
    for (let y = 0; y < board.size; y++) {
      const row = document.createElement("div");
      row.classList.add("row");
      for (let x = 0; x < board.size; x++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        const value = board.grid[y][x];
        if (value === "miss") {
          cell.classList.add("miss");
          cell.textContent = "•";
        } else if (value === "hit") {
          cell.classList.add("hit");
          cell.textContent = "X";
        } else if (value instanceof Ship && !isEnemy) {
          cell.classList.add("ship");
        }
        if (isEnemy) {
          cell.addEventListener("click", () =>
            GameController.handlePlayerAttack(x, y)
          );
        }
        row.appendChild(cell);
      }
      boardDiv.appendChild(row);
    }
  }

  function showMessage(msg) {
    messageDiv.textContent = msg;
  }

  return { renderBoard, showMessage };
})();

// Game logic controller
const GameController = (() => {
  let player, computer, playerBoard, computerBoard;
  let playerTurn = true;

  function setupGame() {
    player = new Player("You");
    computer = new Player("Computer");
    playerBoard = player.createGameboard();
    computerBoard = computer.createGameboard();
    // Predetermined ship placements
    playerBoard.placeShip(0, 0, 3, "horizontal");
    playerBoard.placeShip(2, 2, 2, "vertical");
    computerBoard.placeShip(1, 1, 3, "vertical");
    computerBoard.placeShip(4, 0, 2, "horizontal");
    DOMController.renderBoard(
      playerBoard,
      document.getElementById("player-board")
    );
    DOMController.renderBoard(
      computerBoard,
      document.getElementById("computer-board"),
      true
    );
    DOMController.showMessage(
      "Your turn! Click a cell on the enemy board to attack."
    );
  }

  function handlePlayerAttack(x, y) {
    if (!playerTurn) return;
    const result = computerBoard.receiveAttack(x, y);
    if (result === "already attacked" || result === "already hit") return;
    DOMController.renderBoard(
      computerBoard,
      document.getElementById("computer-board"),
      true
    );
    if (result === "hit") {
      DOMController.showMessage("Hit! Go again.");
      if (computerBoard.allShipsSunk()) {
        DOMController.showMessage("You win!");
        return;
      }
      // Player can go again on hit
      return;
    } else if (result === "miss") {
      DOMController.showMessage("Miss! Computer's turn.");
      playerTurn = false;
      setTimeout(computerMove, 1000);
    }
  }

  function computerMove() {
    let x, y, result;
    do {
      x = Math.floor(Math.random() * playerBoard.size);
      y = Math.floor(Math.random() * playerBoard.size);
      result = playerBoard.receiveAttack(x, y);
    } while (result === "already attacked" || result === "already hit");
    DOMController.renderBoard(
      playerBoard,
      document.getElementById("player-board")
    );
    if (result === "hit") {
      DOMController.showMessage("Computer hit your ship! Computer goes again.");
      if (playerBoard.allShipsSunk()) {
        DOMController.showMessage("Computer wins!");
        return;
      }
      setTimeout(computerMove, 1000);
    } else if (result === "miss") {
      DOMController.showMessage("Computer missed! Your turn.");
      playerTurn = true;
    }
  }

  return { setupGame, handlePlayerAttack };
})();

// Initialize game on DOMContentLoaded
window.addEventListener("DOMContentLoaded", () => {
  GameController.setupGame();
});
