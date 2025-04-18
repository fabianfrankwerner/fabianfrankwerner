const Gameboard = (() => {
  let board = Array(9).fill(null); // Initializes a 9-element array filled with 'null', representing an empty board.

  const getBoard = () => board; // Returns the current state of the board.

  const makeMove = (index, player) => {
    if (board[index] === null) {
      // Checks if the selected cell is empty.
      board[index] = player; // Places the player's marker ('X' or 'O') in the cell.
      return true;
    }
    return false; // If the cell is not empty, no move is made.
  };

  const reset = () => {
    board = Array(9).fill(null); // Resets the board to its initial empty state.
  };

  return { getBoard, makeMove, reset }; // Exposes the public methods for other modules to use.
})();

const Player = (name, marker) => {
  return { name, marker }; // Returns an object with the player's name and marker.
};

const GameController = (() => {
  let players = []; // Holds the two player objects.
  let currentPlayerIndex; // Tracks which player's turn it is.
  let gameOver; // Indicates if the game is over.

  const start = (player1Name, player2Name) => {
    players = [Player(player1Name, "X"), Player(player2Name, "O")]; // Creates the two players.
    currentPlayerIndex = 0; // Sets the first player to start.
    gameOver = false; // Resets the game over status.
    Gameboard.reset(); // Resets the game board.
  };

  const getCurrentPlayer = () => players[currentPlayerIndex]; // Returns the current player.

  const switchPlayer = () => {
    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0; // Switches between player 1 and player 2.
  };

  const makeMove = (index) => {
    if (!gameOver && Gameboard.makeMove(index, getCurrentPlayer().marker)) {
      // Attempts to make a move.
      if (checkWinner()) {
        // Checks if the move resulted in a win.
        gameOver = true;
        return `${getCurrentPlayer().name} wins!`;
      } else if (checkTie()) {
        // Checks if the game ended in a tie.
        gameOver = true;
        return "It's a tie!";
      } else {
        switchPlayer(); // Switches to the other player if the game is not over.
        return `${getCurrentPlayer().name}'s turn`;
      }
    }
    return null; // If the move is not valid, returns null.
  };

  const checkWinner = () => {
    const winPatterns = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    return winPatterns.some((pattern) => {
      const [a, b, c] = pattern;
      const board = Gameboard.getBoard();
      return board[a] && board[a] === board[b] && board[a] === board[c]; // Checks if all three cells in a pattern are the same.
    });
  };

  const checkTie = () => {
    return Gameboard.getBoard().every((cell) => cell !== null); // Checks if all cells are filled without a winner.
  };

  return { start, makeMove, getCurrentPlayer, checkWinner, checkTie }; // Exposes the public methods for other modules to use.
})();

const DisplayController = (() => {
  const boardElement = document.getElementById("game-board"); // Grabs the board element from the DOM.
  const messageElement = document.getElementById("message"); // Grabs the message element from the DOM.
  const player1Input = document.getElementById("player1-name"); // Grabs the player 1 input field.
  const player2Input = document.getElementById("player2-name"); // Grabs the player 2 input field.
  const startButton = document.getElementById("start-button"); // Grabs the start button.
  const restartButton = document.getElementById("restart-button"); // Grabs the restart button.

  const renderBoard = () => {
    const board = Gameboard.getBoard();
    boardElement.innerHTML = ""; // Clears the current board display.
    board.forEach((cell, index) => {
      const cellElement = document.createElement("div");
      cellElement.classList.add("cell"); // Adds a CSS class for styling.
      cellElement.textContent = cell || ""; // Fills the cell with the player's marker or leaves it blank.
      cellElement.addEventListener("click", () => handleCellClick(index)); // Adds an event listener to each cell.
      boardElement.appendChild(cellElement); // Adds the cell to the board display.
    });
  };

  const updateMessage = (message) => {
    messageElement.textContent = message; // Updates the message displayed to the players.
  };

  const handleCellClick = (index) => {
    const result = GameController.makeMove(index); // Makes a move when a cell is clicked.
    if (result) {
      updateMessage(result); // Updates the message with the result of the move.
      renderBoard(); // Rerenders the board with the updated state.
      if (result.includes("wins") || result.includes("tie")) {
        restartButton.style.display = "block"; // Shows the restart button if the game is over.
      }
    }
  };

  const initializeGame = () => {
    const player1Name = player1Input.value || "Player 1"; // Gets the player 1 name.
    const player2Name = player2Input.value || "Player 2"; // Gets the player 2 name.
    GameController.start(player1Name, player2Name); // Starts the game.
    renderBoard(); // Renders the initial board.
    updateMessage(`${GameController.getCurrentPlayer().name}'s turn`); // Displays the current player's turn.
    startButton.style.display = "none"; // Hides the start button.
    restartButton.style.display = "none"; // Hides the restart button.
    boardElement.style.display = "grid"; // Shows the board.
  };

  startButton.addEventListener("click", initializeGame); // Starts the game when the start button is clicked.
  restartButton.addEventListener("click", initializeGame); // Restarts the game when the restart button is clicked.

  return { renderBoard, updateMessage }; // Exposes the public methods for other modules to use.
})();

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("game-board").style.display = "none"; // Hides the game board until the game starts.
});
