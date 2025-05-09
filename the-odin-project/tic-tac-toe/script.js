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
  const playerOne = createPlayer("Player One", "X");
  const playerTwo = createPlayer("Player Two", "O");
  let currentPlayer = playerOne;
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
      console.log("Game is over. Please start a new game.");
      return;
    }

    try {
      Gameboard.setMark(index, currentPlayer.mark);
      console.log(
        `${currentPlayer.name} placed ${currentPlayer.mark} at position ${index}`
      );
      console.log(Gameboard.getBoard());

      const winner = checkWin();
      if (winner) {
        gameOver = true;
        console.log(`Game Over! ${currentPlayer.name} wins!`);
        return;
      }

      if (checkDraw()) {
        gameOver = true;
        console.log("Game Over! It's a draw!");
        return;
      }

      switchTurn();
    } catch (error) {
      console.error(
        `${currentPlayer.name} placed ${currentPlayer.mark} at position ${index}: ${error.message}`
      );
    }
  }

  function getCurrentPlayer() {
    return currentPlayer;
  }

  function resetGame() {
    Gameboard.resetBoard();
    currentPlayer = playerOne;
    gameOver = false;
  }

  return {
    playTurn,
    getCurrentPlayer,
    resetGame,
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

  function updateDisplay() {
    const board = Gameboard.getBoard();
    cells.forEach((cell, index) => {
      cell.textContent = board[index] || "";
    });
  }

  function handleCellClick(e) {
    const index = cells.indexOf(e.target);
    if (index !== -1) {
      GameController.playTurn(index);
      updateDisplay();
    }
  }

  function initializeDisplay() {
    cells.forEach((cell) => {
      cell.addEventListener("click", handleCellClick);
    });
    updateDisplay();
  }

  return {
    initializeDisplay,
    updateDisplay,
  };
})();


Display.initializeDisplay();
