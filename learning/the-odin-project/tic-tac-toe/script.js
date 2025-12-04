const Gameboard = (function () {
  let board = [null, null, null, null, null, null, null, null, null];

  function getBoard() {
    return board;
  }

  function setMark(index, mark) {
    if (board[index] === null) {
      board[index] = mark;
      return true;
    }
    throw new Error("Invalid placement - must be an empty spot.");
  }

  function resetBoard() {
    return (board = [null, null, null, null, null, null, null, null, null]);
  }

  return {
    getBoard,
    setMark,
    resetBoard,
  };
})();

function createPlayer(name, mark) {
  if (mark.toLowerCase() === "x" || mark.toLowerCase() === "o") {
    return { name, mark: mark.toLowerCase() };
  }
  throw new Error("Invalid mark - must be X or O");
}

const GameController = (function () {
  let playerOne;
  let playerTwo;
  let currentPlayer;
  let gameOver = false;

  const winConditions = [
    [0, 1, 2], // top row
    [3, 4, 5], // middle row
    [6, 7, 8], // bottom row
    [0, 3, 6], // left column
    [1, 4, 7], // middle column
    [2, 5, 8], // right column
    [0, 4, 8], // diagonal top-left to bottom-right
    [2, 4, 6], // diagonal top-right to bottom-left
  ];

  function initializePlayers(player1Name, player2Name) {
    playerOne = createPlayer(player1Name || "Player One", "X");
    playerTwo = createPlayer(player2Name || "Player Two", "O");
    currentPlayer = playerOne;
    gameOver = false;
    Gameboard.resetBoard();
  }

  function checkWin() {
    const board = Gameboard.getBoard();
    for (const condition of winConditions) {
      const [a, b, c] = condition;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }

  function checkDraw() {
    return !Gameboard.getBoard().includes(null);
  }

  function switchTurn() {
    currentPlayer = currentPlayer === playerOne ? playerTwo : playerOne;
  }

  function playTurn(index) {
    if (gameOver) {
      return;
    }

    try {
      Gameboard.setMark(index, currentPlayer.mark);
      const winner = checkWin();
      if (winner) {
        gameOver = true;
        return { type: "win", player: currentPlayer };
      }

      if (checkDraw()) {
        gameOver = true;
        return { type: "draw" };
      }

      switchTurn();
      return { type: "continue", player: currentPlayer };
    } catch (error) {
      return { type: "error", message: error.message };
    }
  }

  function getCurrentPlayer() {
    return currentPlayer;
  }

  return {
    initializePlayers,
    playTurn,
    getCurrentPlayer,
  };
})();

const Display = (function () {
  const one = document.querySelector(".one");
  const two = document.querySelector(".two");
  const three = document.querySelector(".three");
  const four = document.querySelector(".four");
  const five = document.querySelector(".five");
  const six = document.querySelector(".six");
  const seven = document.querySelector(".seven");
  const eight = document.querySelector(".eight");
  const nine = document.querySelector(".nine");

  const cells = [one, two, three, four, five, six, seven, eight, nine];
  const player1Input = document.getElementById("player1");
  const player2Input = document.getElementById("player2");
  const startButton = document.getElementById("startGame");
  const restartButton = document.getElementById("restartGame");
  const statusMessage = document.getElementById("statusMessage");

  function updateDisplay() {
    const board = Gameboard.getBoard();
    cells.forEach((cell, index) => {
      cell.textContent = board[index] || "";
    });
  }

  function updateStatus(message) {
    statusMessage.textContent = message;
  }

  function handleCellClick(e) {
    const index = cells.indexOf(e.target);
    if (index !== -1) {
      const result = GameController.playTurn(index);

      switch (result.type) {
        case "win":
          updateDisplay();
          updateStatus(`${result.player.name} wins!`);
          restartButton.style.display = "block";
          break;
        case "draw":
          updateDisplay();
          updateStatus("It's a draw!");
          restartButton.style.display = "block";
          break;
        case "continue":
          updateDisplay();
          updateStatus(`${result.player.name}'s turn`);
          break;
        case "error":
          updateStatus(result.message);
          break;
      }
    }
  }

  function startNewGame() {
    const player1Name = player1Input.value.trim();
    const player2Name = player2Input.value.trim();

    GameController.initializePlayers(player1Name, player2Name);
    updateDisplay();
    updateStatus(`${GameController.getCurrentPlayer().name}'s turn`);
    restartButton.style.display = "none";

    // Enable cell clicks
    cells.forEach((cell) => {
      cell.addEventListener("click", handleCellClick);
    });
  }

  function initializeDisplay() {
    // Initial setup
    updateDisplay();
    updateStatus("Enter player names and start the game!");

    // Event listeners
    startButton.addEventListener("click", startNewGame);
    restartButton.addEventListener("click", startNewGame);

    // Disable cell clicks until game starts
    cells.forEach((cell) => {
      cell.removeEventListener("click", handleCellClick);
    });
  }

  return {
    initializeDisplay,
    updateDisplay,
  };
})();

Display.initializeDisplay();
